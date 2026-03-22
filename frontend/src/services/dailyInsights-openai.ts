import { GoogleGenerativeAI } from "@google/generative-ai";

export interface DailyInsight {
  title: string;
  content: string;
  category: string;
  tips: string[];
  motivation: string;
}

const GEMINI_API_KEY = "AIzaSyC1FbrqKHMkS18alFf0JvSXImNdDWkyGMs";

const getGeminiClient = () => {
  return new GoogleGenerativeAI(GEMINI_API_KEY);
};

export async function generateDailyInsight(
  forceNew: boolean = false,
  location?: { city?: string | null; region?: string | null; country?: string | null }
): Promise<DailyInsight> {
  // Build a location-specific cache key so each location gets its own cached insight
  const locationKey = [location?.city, location?.region, location?.country]
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .replace(/\s+/g, "_") || "general";
  const cacheKey = `dailyHealthInsight_${locationKey}`;

  if (!forceNew) {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const { insight, timestamp } = JSON.parse(cachedData);
        const oneDay = 24 * 60 * 60 * 1000;
        if (Date.now() - timestamp < oneDay) {
          return insight;
        }
      } catch {
        // ignore parse error
      }
    }
  }

  try {
    const insight = await generateInsightWithGemini(location);
    localStorage.setItem(cacheKey, JSON.stringify({ insight, timestamp: Date.now() }));
    return insight;
  } catch {
    return getDefaultInsight();
  }
}

async function generateInsightWithGemini(
  location?: { city?: string | null; region?: string | null; country?: string | null }
): Promise<DailyInsight> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const locationStr =
    location?.city || location?.region || location?.country
      ? `The user is located in ${[location.city, location.region, location.country].filter(Boolean).join(", ")}.`
      : "";

  const prompt = `Today is ${today}. ${locationStr}
Generate a fresh, unique daily health insight personalized for today's date and the user's location if provided.
Return ONLY a JSON object with these exact keys: title, content, category, tips (array of 2 strings), motivation.
Make it specific to today — mention the day, season, or local health concerns if relevant.
Category must be one of: Nutrition, Exercise, Mental Health, Sleep, Prevention, General Health.
Do not include any markdown, code blocks, or extra text.

Example:
{"title":"...","content":"...","category":"Nutrition","tips":["...","..."],"motivation":"..."}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}") + 1;
  const jsonString = text.substring(jsonStart, jsonEnd);
  const insightData = JSON.parse(jsonString);

  if (
    insightData.title &&
    insightData.content &&
    insightData.category &&
    Array.isArray(insightData.tips) &&
    insightData.tips.length >= 2 &&
    insightData.motivation
  ) {
    return {
      title: insightData.title,
      content: insightData.content,
      category: insightData.category,
      tips: insightData.tips.slice(0, 2),
      motivation: insightData.motivation,
    };
  }
  throw new Error("Invalid insight structure from Gemini");
}

function getDefaultInsight(): DailyInsight {
  return {
    title: "Stay Hydrated Today",
    content: "Drinking enough water daily is essential for every cell in your body. Proper hydration supports digestion, cognitive function, and energy levels throughout the day.",
    category: "General Health",
    tips: [
      "Aim for 8 glasses of water throughout the day",
      "Start your morning with a glass of warm water",
    ],
    motivation: "Small healthy habits today lead to a stronger, healthier you tomorrow!",
  };
}
