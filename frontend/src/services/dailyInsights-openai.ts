import { GoogleGenerativeAI } from "@google/generative-ai";

export interface DailyInsight {
  title: string;
  content: string;
  category: string;
  tips: string[];
  motivation: string;
}

// Function to get a random GenerativeAI client to load balance requests
const getRandomGeminiClient = () => {
  const keys = [
    (import.meta.env as any).VITE_GEMINI_API_KEY,
    (import.meta.env as any).VITE_GEMINI_API_KEY_2,
    (import.meta.env as any).VITE_SYMPTOM_CHECKER_API_KEY
  ].filter(Boolean);
  const activeKeys = keys.length > 0 ? Array.from(new Set(keys)) : ["dummy_key"];
  const randomKey = activeKeys[Math.floor(Math.random() * activeKeys.length)];
  return new GoogleGenerativeAI(randomKey);
};

export async function generateDailyInsight(forceNew: boolean = false): Promise<DailyInsight> {
  // Check if we have a cached insight that's less than 24 hours old
  const cachedData = localStorage.getItem('dailyHealthInsight');
  if (cachedData && !forceNew) {
    try {
      const { insight, timestamp } = JSON.parse(cachedData);
      const now = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      // If the cached insight is less than 24 hours old, return it
      if (now - timestamp < oneDay) {
        return insight;
      }
    } catch (error) {
      // Error parsing cached daily insight
    }
  }

  try {
    // Generate insight using Gemini API
    const insight = await generateInsightWithGemini();
    
    // Cache the insight with current timestamp
    const cacheData = {
      insight,
      timestamp: new Date().getTime()
    };
    localStorage.setItem('dailyHealthInsight', JSON.stringify(cacheData));
    
    return insight;
  } catch (error) {
    // Error generating daily insight
    // Return a fallback insight
    return getDefaultInsight();
  }
}

async function generateInsightWithGemini(): Promise<DailyInsight> {
  try {
    // Get the Gemini 2.0 Flash model
    const client = getRandomGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-3-flash-preview" });
    
    // Create a prompt for generating health insights
    const prompt = `Generate a daily health insight with the following structure:
    1. A title (string)
    2. Content (string) - detailed health information
    3. Category (string) - one of: Nutrition, Exercise, Mental Health, Sleep, Prevention, General Health
    4. Tips (array of 2 strings) - practical health tips
    5. Motivation (string) - motivational message
    
    Return ONLY a JSON object with these exact keys: title, content, category, tips, motivation.
    Do not include any other text or formatting.
    
    Example format:
    {
      "title": "Balanced Nutrition",
      "content": "Eating a balanced diet is essential for maintaining good health...",
      "category": "Nutrition",
      "tips": ["Include a variety of colorful fruits and vegetables", "Stay hydrated throughout the day"],
      "motivation": "Small healthy choices lead to significant improvements in your well-being!"
    }`;
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (text) {
      // Extract JSON from the response
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonString = text.substring(jsonStart, jsonEnd);
      
      // Parse the JSON
      const insightData = JSON.parse(jsonString);
      
      // Validate the structure
      if (insightData.title && insightData.content && insightData.category && 
          Array.isArray(insightData.tips) && insightData.tips.length >= 2 && 
          insightData.motivation) {
        return {
          title: insightData.title,
          content: insightData.content,
          category: insightData.category,
          tips: insightData.tips.slice(0, 2), // Ensure only 2 tips
          motivation: insightData.motivation
        };
      } else {
        throw new Error("Invalid insight structure from Gemini");
      }
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    // Error in generateInsightWithGemini
    throw error;
  }
}

function getDefaultInsight(): DailyInsight {
  const categories = ["Nutrition", "Exercise", "Mental Health", "Sleep", "Prevention"];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  
  return {
    title: generateTitleFromCategory(randomCategory),
    content: "Based on the latest health education content, focusing on daily wellness practices is essential for overall well-being.",
    category: randomCategory,
    tips: generateTipsFromCategory(randomCategory),
    motivation: "Small healthy habits lead to significant improvements in your quality of life!"
  };
}

function generateTitleFromCategory(category: string): string {
  const titles: Record<string, string[]> = {
    "Nutrition": [
      "Fuel Your Body Right",
      "Nutrition for Optimal Health",
      "Healthy Eating Habits",
      "Balanced Diet Benefits"
    ],
    "Exercise": [
      "Stay Active Daily",
      "Fitness for Life",
      "Movement is Medicine",
      "Strength Through Activity"
    ],
    "Mental Health": [
      "Mindful Wellness",
      "Mental Well-being Matters",
      "Stress Management Tips",
      "Emotional Health Balance"
    ],
    "Sleep": [
      "Quality Sleep Essentials",
      "Rest for Restoration",
      "Sleep Hygiene Tips",
      "Nighttime Recovery"
    ],
    "Prevention": [
      "Prevention is Better",
      "Health Protection Strategies",
      "Disease Prevention Tips",
      "Proactive Health Care"
    ],
    "General Health": [
      "Holistic Health Approach",
      "Wellness Fundamentals",
      "Healthy Living Basics",
      "Total Wellness Guide"
    ]
  };
  
  const categoryTitles = titles[category] || titles["General Health"];
  return categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
}

function generateTipsFromCategory(category: string): string[] {
  const tips: Record<string, string[][]> = {
    "Nutrition": [
      ["Eat a variety of colorful fruits and vegetables daily", "Choose whole grains over refined grains"],
      ["Stay hydrated by drinking plenty of water", "Limit processed and sugary foods"],
      ["Practice portion control", "Include lean proteins in every meal"]
    ],
    "Exercise": [
      ["Take a 10-minute walk after each meal", "Use stairs instead of elevators"],
      ["Do stretching exercises during TV commercial breaks", "Try a new physical activity each week"],
      ["Set realistic fitness goals", "Exercise with a friend for motivation"]
    ],
    "Mental Health": [
      ["Practice deep breathing exercises daily", "Maintain social connections with loved ones"],
      ["Limit screen time before bed", "Engage in activities you enjoy"],
      ["Seek professional help when needed", "Practice gratitude daily"]
    ],
    "Sleep": [
      ["Maintain a consistent sleep schedule", "Create a relaxing bedtime routine"],
      ["Keep your bedroom cool and dark", "Avoid caffeine late in the day"],
      ["Limit screen time before bed", "Get natural light exposure in the morning"]
    ],
    "Prevention": [
      ["Stay up to date with vaccinations", "Practice good hand hygiene"],
      ["Regular health checkups are essential", "Know your family health history"],
      ["Protect yourself from excessive sun exposure", "Avoid risky behaviors"]
    ],
    "General Health": [
      ["Stay hydrated throughout the day", "Get regular health screenings"],
      ["Maintain a healthy work-life balance", "Build healthy relationships"],
      ["Limit alcohol consumption", "Avoid smoking and tobacco products"]
    ]
  };
  
  const categoryTips = tips[category] || tips["General Health"];
  return categoryTips[Math.floor(Math.random() * categoryTips.length)];
}