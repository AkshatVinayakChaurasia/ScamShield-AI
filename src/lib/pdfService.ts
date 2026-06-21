import { createRequire } from "module";

export async function extractTextFromPdf(pdfBuffer: Buffer): Promise<string> {
  const require = createRequire(import.meta.url);
  try {
    const pdfParse = require("pdf-parse");
    const data = await pdfParse(pdfBuffer);
    return data.text.trim();
  } catch (err: any) {
    throw new Error("Failed to extract text from PDF: " + err.message);
  }
}
