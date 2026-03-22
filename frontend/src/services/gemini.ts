import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY_1 = import.meta.env.VITE_GEMINI_API_KEY; // Medical Bot
const API_KEY_2 = import.meta.env.VITE_GEMINI_API_KEY_2; // Symptom Checker
const API_KEY_3 = import.meta.env.VITE_GEMINI_API_KEY_3; // Report Analyzer
const API_KEY_4 = import.meta.env.VITE_GEMINI_API_KEY_4; // Daily Insight & others

export type GeminiTask = "medical-bot" | "symptom-checker" | "report-analyzer" | "daily-insight";

function getKeyForTask(task: GeminiTask): string {
  switch (task) {
    case "medical-bot": return API_KEY_1 || "";
    case "symptom-checker": return API_KEY_2 || "";
    case "report-analyzer": return API_KEY_3 || "";
    case "daily-insight": return API_KEY_4 || "";
    default: return API_KEY_4 || "";
  }
}

/**
 * Public API: Strictly uses assigned key for assigned task.
 * NO rotation. NO fallback.
 */
export async function callGemini(
  prompt: string,
  imageBase64?: string,
  mimeType = "image/jpeg",
  task: GeminiTask = "daily-insight"
): Promise<string> {
  const key = getKeyForTask(task);
  
  // Use strictly gemini-3-flash-preview as requested
  const modelName = "gemini-3-flash-preview";

  if (!key) {
    throw new Error(`[HealAI] No API key provided for task: ${task}`);
  }

  const client = new GoogleGenerativeAI(key);

  try {
    const model = client.getGenerativeModel({ model: modelName });

    const parts: any[] = [];
    if (imageBase64 && typeof imageBase64 === "string") {
      parts.push({ inlineData: { data: imageBase64, mimeType } });
    }
    parts.push({ text: prompt });

    const result = await model.generateContent({ contents: [{ parts, role: "user" }] });
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error(`[HealAI] Empty response from ${modelName}`);
    }

    return text;
  } catch (err: any) {
    console.error(`[HealAI] Gemini call failed for task ${task}:`, err);
    throw err; // Fail immediately with the Google error
  }
}
