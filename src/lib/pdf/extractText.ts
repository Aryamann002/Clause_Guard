import pdf from "pdf-parse";

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer);
  const text = data.text?.trim();
  if (!text || text.length < 50) {
    throw new Error(
      "Could not extract readable text from this PDF. Please ensure the PDF is not scanned/image-only."
    );
  }
  return text;
}
