import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyC1FbrqKHMkS18alFf0JvSXImNdDWkyGMs";
const client = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function callGemini(prompt: string, imageBase64?: string): Promise<string> {
  try {
    const model = client.getGenerativeModel({ model: "gemini-3.0-preview" });
    
    const parts: any[] = [];
    if (imageBase64 && typeof imageBase64 === "string") {
      parts.push({ inlineData: { data: imageBase64, mimeType: "image/jpeg" } });
    }
    parts.push({ text: prompt });

    const result = await model.generateContent({ contents: [{ parts, role: "user" }] });
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (err) {
    console.error("[v0] Gemini error:", err);
    throw err;
  }
}
