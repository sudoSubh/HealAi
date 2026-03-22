import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

if (!GEMINI_API_KEY) {
  console.warn("[v0] VITE_GEMINI_API_KEY environment variable is not set");
}

const client = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function callGemini(
  prompt: string,
  imageBase64?: string,
  mimeType = "image/jpeg"
): Promise<string> {
  try {
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

    const parts: any[] = [];
    if (imageBase64 && typeof imageBase64 === "string") {
      parts.push({ inlineData: { data: imageBase64, mimeType } });
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
