/**
 * Utility function to verify OpenAI API key configuration
 */
export function verifyOpenAIConfig(): { isValid: boolean; message: string } {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return {
      isValid: false,
      message: 'OpenRouter API key is not set. Please add VITE_OPENROUTER_API_KEY to your .env file.'
    };
  }
  

  if (apiKey === 'your_openrouter_api_key' || apiKey === 'YOUR_OPENROUTER_API_KEY') {
    return {
      isValid: false,
      message: 'OpenRouter API key is set to example value. Please replace it with your actual API key.'
    };
  }
  
  // Basic format check for sk-or-v1- format
  if (!apiKey.startsWith('sk-or-v1-')) {
    return {
      isValid: false,
      message: 'OpenRouter API key format is incorrect. It should start with "sk-or-v1-".'
    };
  }
  
  return {
    isValid: true,
    message: 'OpenRouter API key is properly configured.'
  };
}

import OpenAI from "openai";

export async function verifyOpenRouterKey() {
  // Use the OpenRouter API key from environment variables
  const apiKey = (import.meta.env as any).VITE_OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return {
      valid: false,
      message: 'OpenRouter API key is not set. Please add VITE_OPENROUTER_API_KEY to your .env file.'
    };
  }

  const client = new OpenAI({
    apiKey,
  });

  try {
    await client.models.list();
    return {
      valid: true,
      message: 'OpenRouter API key is properly configured.'
    };
  } catch (error) {
    return {
      valid: false,
      message: 'OpenRouter API key is invalid. Please check your API key.'
    };
  }
}
