import PDFDocument from "pdfkit";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pdfDoc = new PDFDocument();

  // Set headers for PDF download
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="report.pdf"');

  // Pipe PDF to the response
  pdfDoc.pipe(res);

  // Example content
  pdfDoc.fontSize(24).text("Report Title", { underline: true });
  pdfDoc.fontSize(12).text("Generated report content goes here...");

  pdfDoc.end();
}
