const fs = require("fs");
const path = require("path");

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function formatInline(markdown) {
  // Escape first, then add minimal formatting back.
  let html = escapeHtml(markdown);

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Bold: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  return html;
}

function markdownToHtml(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");

  const headings = [];
  const out = [];
  let inUl = false;
  let inOl = false;
  let inPara = false;

  const closeLists = () => {
    if (inUl) {
      out.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      out.push("</ol>");
      inOl = false;
    }
  };

  const closePara = () => {
    if (inPara) {
      out.push("</p>");
      inPara = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/g, "");

    // Horizontal rule
    if (/^---\s*$/.test(line)) {
      closePara();
      closeLists();
      out.push("<hr />");
      continue;
    }

    // Heading
    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = slugify(text);
      headings.push({ level, text, id });
      closePara();
      closeLists();
      out.push(`<h${level} id="${id}">${formatInline(text)}</h${level}>`);
      continue;
    }

    // Ordered list item: "1. item"
    const olMatch = /^\s*\d+\.\s+(.*)$/.exec(line);
    if (olMatch) {
      closePara();
      if (inUl) {
        out.push("</ul>");
        inUl = false;
      }
      if (!inOl) {
        out.push("<ol>");
        inOl = true;
      }
      out.push(`<li>${formatInline(olMatch[1])}</li>`);
      continue;
    }

    // Unordered list item: "- item"
    const ulMatch = /^\s*-\s+(.*)$/.exec(line);
    if (ulMatch) {
      closePara();
      if (inOl) {
        out.push("</ol>");
        inOl = false;
      }
      if (!inUl) {
        out.push("<ul>");
        inUl = true;
      }
      out.push(`<li>${formatInline(ulMatch[1])}</li>`);
      continue;
    }

    // Blank line
    if (line.trim() === "") {
      closePara();
      closeLists();
      continue;
    }

    // Paragraph text (allow multi-line paragraphs)
    closeLists();
    if (!inPara) {
      out.push("<p>");
      inPara = true;
    } else {
      out.push("<br />");
    }
    out.push(formatInline(line));
  }

  // Close tags
  if (inPara) out.push("</p>");
  if (inUl) out.push("</ul>");
  if (inOl) out.push("</ol>");

  return { bodyHtml: out.join("\n"), headings };
}

function buildToc(headings) {
  const tocItems = headings
    .filter((h) => h.level === 2 || h.level === 3)
    .map((h) => {
      const indent = h.level === 3 ? " class=\"toc-sub\"" : "";
      return `<li${indent}><a href="#${h.id}">${escapeHtml(h.text)}</a></li>`;
    })
    .join("\n");

  if (!tocItems) return "";
  return `<h2 id="table-of-contents">Table of Contents</h2>\n<ul class="toc">\n${tocItems}\n</ul>`;
}

function wrapHtml({ title, subtitle, tocHtml, contentHtml }) {
  const today = new Date();
  const dateText = today.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      @page { size: A4; margin: 22mm 18mm; }
      html, body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #111; }
      body { font-size: 11.5pt; line-height: 1.55; }
      h1, h2, h3 { color: #0D2477; margin: 18px 0 8px; }
      h1 { font-size: 22pt; margin-top: 0; }
      h2 { font-size: 14.5pt; border-bottom: 1px solid #e6e6e6; padding-bottom: 6px; }
      h3 { font-size: 12.5pt; }
      p { margin: 10px 0; }
      ul, ol { margin: 8px 0 10px 22px; }
      li { margin: 3px 0; }
      hr { border: 0; border-top: 1px solid #e6e6e6; margin: 18px 0; }
      code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; font-size: 10.5pt; background: #f6f7fb; padding: 1px 4px; border-radius: 4px; }

      .cover { page-break-after: always; margin-top: 40mm; }
      .cover-title { font-size: 28pt; font-weight: 800; color: #0D2477; margin: 0 0 10px; }
      .cover-subtitle { font-size: 13pt; color: #333; margin: 0 0 12px; }
      .cover-meta { font-size: 10.5pt; color: #666; }

      .toc { list-style: none; margin-left: 0; padding-left: 0; }
      .toc li { margin: 6px 0; }
      .toc a { color: #111; text-decoration: none; }
      .toc a:hover { text-decoration: underline; }
      .toc-sub { margin-left: 18px; color: #444; }

      .footer-note { color: #666; font-size: 10pt; margin-top: 18px; }
    </style>
  </head>
  <body>
    <section class="cover">
      <div class="cover-title">${escapeHtml(title)}</div>
      <div class="cover-subtitle">${escapeHtml(subtitle)}</div>
      <div class="cover-meta">Generated: ${escapeHtml(dateText)}</div>
      <div class="footer-note">Portal: biomedwaste.net</div>
    </section>

    ${tocHtml}
    ${contentHtml}
  </body>
</html>`;
}

function main() {
  const repoRoot = path.resolve(__dirname, "..");
  const mdPath = path.join(repoRoot, "userguide.md");
  const outHtmlPath = path.join(repoRoot, "userguide.html");

  if (!fs.existsSync(mdPath)) {
    console.error(`Missing: ${mdPath}`);
    process.exit(1);
  }

  const md = fs.readFileSync(mdPath, "utf8");
  const { bodyHtml, headings } = markdownToHtml(md);
  const tocHtml = buildToc(headings);

  const html = wrapHtml({
    title: "Biomed Invex Portal — User Guide",
    subtitle: "Customer Portal and Admin Panel usage",
    tocHtml,
    contentHtml: bodyHtml,
  });

  fs.writeFileSync(outHtmlPath, html, "utf8");
  console.log(`Wrote HTML: ${outHtmlPath}`);
}

main();

