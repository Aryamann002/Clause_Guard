import { GoogleGenerativeAI } from "@google/generative-ai";

function getModel() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

export async function translateToHindi(englishText: string): Promise<string> {
  const model = getModel();
  
  const prompt = `You are a legal translator. Translate the following English legal explanation into simple, clear Hindi that a non-lawyer can understand. Keep it concise.
  
  TEXT TO TRANSLATE:
  ${englishText}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text() || englishText;
}
