import { callGemini } from "./gemini";

// Initialize available Gemini API keys from environment variables
// (kept as shim — actual API calls now go through the backend proxy)
const getAvailableKeys = () => ["proxy"];
// Function to get a random GenerativeAI client to load balance requests
const getRandomGeminiClient = () => ({});

// Function to generate content using OpenRouter (fallback)
export async function generateWithOpenRouter(_prompt: string, _systemContext?: string): Promise<string> {
  try {
    // Attempting to generate content with OpenRouter
    
    // This is a placeholder implementation
    // In a real implementation, you would integrate with the OpenRouter API
    throw new Error("OpenRouter integration not implemented");
  } catch (error) {
    // OpenRouter failed
    throw error;
  }
}

// Function to generate content using Gemini (primary)
export async function generateWithGemini(prompt: string, systemContext?: string): Promise<string> {
  try {
    // Generating content with model
    
    // Combine system context and prompt for Gemini
    let fullPrompt = prompt;
    if (systemContext) {
      fullPrompt = `${systemContext}\n\nUser question: ${prompt}`;
    }
    
    // Route through the backend proxy
    const client = getRandomGeminiClient();
    void client; // shim only

    const content = await callGemini(fullPrompt, undefined, undefined, "medical-bot");

    if (content) {
      // Successfully generated content
      return content;
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    // Model failed
    throw error;
  }
}

// Function to generate content with image using Gemini
export async function generateWithGeminiWithImage(imageData: string, prompt: string, systemContext?: string): Promise<string> {
  try {
    // Generating content with model and image
    
    // Route image + text call through the backend proxy
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    const fullPrompt = systemContext
      ? `${systemContext}\n\n[Image attached as base64]\n\nUser question: ${prompt}`
      : prompt;

    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: fullPrompt, imageBase64: base64Data }),
    });
    if (!res.ok) throw new Error(`Gemini proxy error ${res.status}`);
    const data = await res.json();
    const text: string = data.text ?? "";

    if (text) {
      // Successfully generated content
      return text;
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    // Model with image failed
    throw error;
  }
}

// Main function that uses Gemini as the primary provider
export async function generateMedicalResponse(prompt: string, systemContext?: string): Promise<string> {
  try {
    // Try OpenRouter first (fallback mechanism)
    try {
      return await generateWithOpenRouter(prompt, systemContext);
    } catch (openRouterError) {
      // OpenRouter failed, falling back to model
      // If OpenRouter fails, fall back to Gemini
      return await generateWithGemini(prompt, systemContext);
    }
  } catch (error) {
    // All providers failed
    throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Main function that uses Gemini with image as the primary provider
export async function generateMedicalResponseWithImage(imageData: string, prompt: string, systemContext?: string): Promise<string> {
  try {
    // Use Gemini with image as the primary provider
    return await generateWithGeminiWithImage(imageData, prompt, systemContext);
  } catch (error) {
    // Model with image failed
    throw new Error(`Failed to generate response with model and image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
