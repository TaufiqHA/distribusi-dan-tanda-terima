const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

async function generatePDF(distribusi) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();

  const drawText = (text, y) => {
    page.drawText(text, {
      x: 50,
      y,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
  };

  let y = height - 50;
  drawText("TANDA TERIMA DOKUMEN", y);
  y -= 30;
  drawText(`Kode Distribusi: ${distribusi.kode}`, y);
  y -= 20;
  drawText(`Penerima: ${distribusi.penerima}`, y);
  y -= 20;
  drawText(`Tipe Pengiriman: ${distribusi.tipe}`, y);
  y -= 20;
  drawText(`Link Dokumen: ${distribusi.link}`, y);
  y -= 20;
  drawText(`Isi Dokumen:`, y);
  y -= 20;

  const isiLines = distribusi.isi.split("\n");
  isiLines.forEach((line) => {
    drawText(line, y);
    y -= 15;
  });

  y -= 20;
  drawText(
    `Diterima pada: ${new Date(distribusi.tanggal_terima).toLocaleString()}`,
    y
  );

  const pdfBytes = await pdfDoc.save();

  const outputPath = path.join(__dirname, "..", "pdfs");
  if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath);

  const filePath = path.join(
    outputPath,
    `tanda-terima-${distribusi.token}.pdf`
  );
  fs.writeFileSync(filePath, pdfBytes);

  return filePath;
}

module.exports = generatePDF;
