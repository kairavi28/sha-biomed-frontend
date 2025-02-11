import { useEffect, useRef } from 'react';
import pdfjsLib from 'pdfjs-dist';

const PreviewInvoice = ({ filePath }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadPdf = async () => {
      const pdf = await pdfjsLib.getDocument(filePath).promise;
      const page = await pdf.getPage(1);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      page.render({ canvasContext: context, viewport });
    };

    loadPdf();
  }, [filePath]);

  return <canvas ref={canvasRef} />;
};

export default PreviewInvoice;
