const fs = require("fs");
const path = require("path");

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;

const MARGIN_X = 54;
const MARGIN_Y = 60;

function normalizeText(input) {
  return (input || "")
    .replace(/\r\n/g, "\n")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/•/g, "-")
    .replace(/\u00a0/g, " ");
}

function pdfEscapeText(text) {
  // PDF literal string escaping.
  return normalizeText(text).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapText(text, maxChars) {
  const words = normalizeText(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  for (const word of words) {
    if (!current) {
      current = word;
      continue;
    }

    const candidate = `${current} ${word}`;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function maxCharsForFont(fontSize) {
  // Heuristic for Helvetica-like fonts.
  const usableWidth = A4_WIDTH - MARGIN_X * 2;
  return Math.max(20, Math.floor(usableWidth / (fontSize * 0.56)));
}

function parseMarkdownToBlocks(md) {
  const lines = normalizeText(md).split("\n");
  const blocks = [];

  let paragraph = [];
  let list = null; // { ordered: boolean, items: string[] }

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ type: "p", text: paragraph.join(" ").trim() });
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    blocks.push({ type: "list", ordered: list.ordered, items: list.items.slice() });
    list = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (/^---\s*$/.test(line.trim())) {
      flushParagraph();
      flushList();
      blocks.push({ type: "hr" });
      continue;
    }

    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line);
    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push({
        type: "h",
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
      });
      continue;
    }

    const olMatch = /^\s*\d+\.\s+(.*)$/.exec(line);
    if (olMatch) {
      flushParagraph();
      if (!list || !list.ordered) {
        flushList();
        list = { ordered: true, items: [] };
      }
      list.items.push(olMatch[1].trim());
      continue;
    }

    const ulMatch = /^\s*-\s+(.*)$/.exec(line);
    if (ulMatch) {
      flushParagraph();
      if (!list || list.ordered) {
        flushList();
        list = { ordered: false, items: [] };
      }
      list.items.push(ulMatch[1].trim());
      continue;
    }

    if (line.trim() === "") {
      flushParagraph();
      flushList();
      continue;
    }

    flushList();
    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();

  return blocks;
}

function buildTocFromBlocks(blocks) {
  return blocks
    .filter((b) => b.type === "h" && (b.level === 2 || b.level === 3))
    .map((b) => ({ level: b.level, text: b.text }));
}

function layoutToPages({ blocks }) {
  const pages = [];
  let current = [];

  const startNewPage = () => {
    if (current.length) pages.push(current);
    current = [];
    cursor.y = A4_HEIGHT - MARGIN_Y;
  };

  const cursor = { y: A4_HEIGHT - MARGIN_Y };
  const minY = MARGIN_Y;

  const pushLine = (line) => {
    if (cursor.y < minY + line.leading) startNewPage();
    current.push(line);
    cursor.y -= line.leading;
  };

  const spacer = (height) => {
    if (cursor.y - height < minY) startNewPage();
    cursor.y -= height;
  };

  startNewPage(); // initializes

  for (const block of blocks) {
    if (block.type === "h") {
      const fontSize =
        block.level === 1 ? 20 : block.level === 2 ? 14.5 : block.level === 3 ? 12.5 : 11.5;
      const leading = fontSize * 1.35;
      spacer(leading * 0.35);
      const lines = wrapText(block.text, maxCharsForFont(fontSize));
      for (const l of lines) {
        pushLine({ text: l, fontSize, leading, bold: block.level <= 2 });
      }
      spacer(leading * 0.2);
      continue;
    }

    if (block.type === "hr") {
      spacer(10);
      pushLine({ rule: true, leading: 14 });
      spacer(6);
      continue;
    }

    if (block.type === "p") {
      const fontSize = 10.75;
      const leading = fontSize * 1.45;
      const lines = wrapText(block.text, maxCharsForFont(fontSize));
      for (const l of lines) {
        pushLine({ text: l, fontSize, leading });
      }
      spacer(leading * 0.45);
      continue;
    }

    if (block.type === "list") {
      const fontSize = 10.75;
      const leading = fontSize * 1.45;
      let i = 1;
      for (const item of block.items) {
        const prefix = block.ordered ? `${i}. ` : "- ";
        const wrapped = wrapText(prefix + item, maxCharsForFont(fontSize));
        wrapped.forEach((l, idx) => {
          const text = idx === 0 ? l : "  " + l;
          pushLine({ text, fontSize, leading });
        });
        i += 1;
      }
      spacer(leading * 0.35);
      continue;
    }
  }

  if (current.length) pages.push(current);
  return pages;
}

function buildPdf({ pages, title }) {
  const objects = [];
  const offsets = [];

  const pushObject = (content) => {
    objects.push(content);
    return objects.length; // 1-based id
  };

  const fontObjId = pushObject(
    `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`
  );

  // Placeholder for Pages object (we fill kids later)
  const pagesObjId = pushObject(`<< /Type /Pages /Kids [] /Count 0 >>`);

  const pageObjIds = [];
  const contentObjIds = [];

  for (const pageLines of pages) {
    const content = renderPageContent(pageLines);
    const stream = `<< /Length ${Buffer.byteLength(content, "utf8")} >>\nstream\n${content}\nendstream`;
    const contentId = pushObject(stream);
    contentObjIds.push(contentId);

    const pageId = pushObject(
      `<< /Type /Page /Parent ${pagesObjId} 0 R /MediaBox [0 0 ${A4_WIDTH} ${A4_HEIGHT}] ` +
        `/Resources << /Font << /F1 ${fontObjId} 0 R >> >> ` +
        `/Contents ${contentId} 0 R >>`
    );
    pageObjIds.push(pageId);
  }

  // Update Pages object
  objects[pagesObjId - 1] =
    `<< /Type /Pages /Kids [${pageObjIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjIds.length} >>`;

  const catalogObjId = pushObject(`<< /Type /Catalog /Pages ${pagesObjId} 0 R >>`);

  // Build PDF
  let pdf = "%PDF-1.4\n";
  offsets.push(0); // object 0 free

  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefStart = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += `0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i++) {
    const off = offsets[i].toString().padStart(10, "0");
    pdf += `${off} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogObjId} 0 R /Info ${pushObject(
    `<< /Title (${pdfEscapeText(title)}) >>`
  )} 0 R >>\n`;

  // We added Info object after trailer references; need to rebuild trailer properly.
  // Simpler: rebuild without separate Info object:
  // (To keep PDF valid, we’ll do a second pass: omit Info and keep minimal trailer.)
  // So override the above and generate a minimal trailer.
  //
  // Start over from xref (keep objects as-is, but don’t add the Info object).
  // Implementation: remove the last pushObject effect by popping it.
  objects.pop();
  offsets.pop();

  // Rebuild with minimal trailer:
  pdf = "%PDF-1.4\n";
  offsets.length = 0;
  offsets.push(0);
  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xrefStart2 = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += `0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i++) {
    const off = offsets[i].toString().padStart(10, "0");
    pdf += `${off} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogObjId} 0 R >>\n`;
  pdf += `startxref\n${xrefStart2}\n%%EOF\n`;

  return Buffer.from(pdf, "utf8");
}

function renderPageContent(lines) {
  const parts = [];
  const startY = A4_HEIGHT - MARGIN_Y;
  const startX = MARGIN_X;

  let y = startY;

  for (const line of lines) {
    if (line.rule) {
      // draw a light horizontal line
      const x1 = startX;
      const x2 = A4_WIDTH - MARGIN_X;
      const yLine = y - 6;
      parts.push("0.9 w");
      parts.push("0.85 0.85 0.85 RG");
      parts.push(`${x1} ${yLine} m ${x2} ${yLine} l S`);
      continue;
    }

    const fontSize = line.fontSize || 10.75;
    const leading = line.leading || fontSize * 1.45;
    const text = pdfEscapeText(line.text || "");

    // Basic emphasis: headings slightly darker; no bold font object to keep minimal.
    const fill = line.bold ? "0 0.14 0.46 rg" : "0 0 0 rg";

    parts.push("BT");
    parts.push(`/F1 ${fontSize.toFixed(2)} Tf`);
    parts.push(fill);
    parts.push(`${startX} ${y.toFixed(2)} Td`);
    parts.push(`(${text}) Tj`);
    parts.push("ET");

    y -= leading;
  }

  return parts.join("\n");
}

function buildCoverAndTocBlocks(blocks) {
  const title = "Biomed Invex Portal - User Guide";
  const subtitle = "Customer Portal and Admin Panel usage";
  const generated = new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const toc = buildTocFromBlocks(blocks);
  const tocBlocks = [];

  tocBlocks.push({ type: "h", level: 1, text: "Table of Contents" });
  toc.forEach((t) => {
    const prefix = t.level === 3 ? "  - " : "- ";
    tocBlocks.push({ type: "p", text: `${prefix}${t.text}` });
  });

  const coverBlocks = [
    { type: "h", level: 1, text: title },
    { type: "p", text: subtitle },
    { type: "p", text: `Generated: ${generated}` },
    { type: "hr" },
  ];

  return { coverBlocks, tocBlocks };
}

function main() {
  const repoRoot = path.resolve(__dirname, "..");
  const mdPath = path.join(repoRoot, "userguide.md");
  const outPdfPath = path.join(repoRoot, "userguide.pdf");

  if (!fs.existsSync(mdPath)) {
    console.error(`Missing: ${mdPath}`);
    process.exit(1);
  }

  const md = fs.readFileSync(mdPath, "utf8");
  const blocks = parseMarkdownToBlocks(md);
  const { coverBlocks, tocBlocks } = buildCoverAndTocBlocks(blocks);

  // Layout: cover page, toc page, then content pages
  const coverPages = layoutToPages({ blocks: coverBlocks });
  const tocPages = layoutToPages({ blocks: tocBlocks });
  const contentPages = layoutToPages({ blocks });

  const allPages = [...coverPages, ...tocPages, ...contentPages];
  const pdfBytes = buildPdf({ pages: allPages, title: "Biomed Invex Portal - User Guide" });

  fs.writeFileSync(outPdfPath, pdfBytes);
  console.log(`Wrote PDF: ${outPdfPath}`);
}

main();

