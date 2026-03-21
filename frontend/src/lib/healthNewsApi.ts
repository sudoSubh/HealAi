import OpenAI from "openai";

// Initialize OpenAI client with OpenRouter endpoint
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true, // Required for client-side usage
});

export interface HealthNewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  category: "news" | "outbreak" | "vaccination";
  location?: string;
  priority: "low" | "medium" | "high";
}

export interface HealthNewsResponse {
  news: HealthNewsItem[];
  lastUpdated: string;
  error?: string;
}

export class HealthNewsApi {
  static async getHealthNews(
    location: string = "global",
    category: string = "all"
  ): Promise<HealthNewsResponse> {
    // Define cache key once
    const cacheKey = `healthNews_${location}_${category}`;
    
    try {
      // Check if we have cached data that's less than 6 hours old
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const lastUpdated = new Date(parsedData.lastUpdated);
        const now = new Date();
        const hoursDifference = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
        
        // If data is less than 6 hours old, return it
        if (hoursDifference < 6) {
          return parsedData;
        }
      }

      // Return hardcoded fallback data
      const fallbackData: HealthNewsResponse = {
        news: [
          {
            id: "fallback-1",
            title: "Covid-19 Monitoring and Alerts",
            summary: "Odisha reports low but ongoing Covid-19 cases, with a recent new death in Bhubaneswar marking the state's first Covid-19 fatality of 2025. A sub-variant strain JN.1 of Omicron has been detected in recent cases. The government continues to urge adherence to Covid-19 protocols, increased testing, and vaccination to control transmission during festivals and public gatherings like Rath Yatra.",
            source: "Odisha Health Department",
            publishedAt: new Date().toISOString().split('T')[0],
            url: "https://health.odisha.gov.in/",
            category: "outbreak",
            location: "Bhubaneswar",
            priority: "high"
          },
          {
            id: "fallback-2",
            title: "Doctor Shortage in Government Facilities",
            summary: "A critical shortage of doctors persists in Odisha's government hospitals, with nearly 4,880 medical officer positions vacant statewide, including in Bhubaneswar. This shortage could strain healthcare delivery, especially in peak illness seasons. Recruitment and incentives are under discussion.",
            source: "Odisha Health Department",
            publishedAt: new Date().toISOString().split('T')[0],
            url: "https://dphodisha.nic.in/",
            category: "news",
            location: "Bhubaneswar",
            priority: "high"
          },
          {
            id: "fallback-3",
            title: "Heavy Rainfall Alert and Preparedness",
            summary: "Odisha, including Bhubaneswar, is under high alert for heavy rainfall and potential flooding. The health department has issued warnings for vector-borne diseases like dengue and malaria, which tend to spike after rains, along with other communicable diseases.",
            source: "Odisha State Disaster Management Authority",
            publishedAt: new Date().toISOString().split('T')[0],
            url: "https://osdma.org/",
            category: "outbreak",
            location: "Bhubaneswar",
            priority: "high"
          },
          {
            id: "fallback-4",
            title: "Unified Health Insurance Rollout",
            summary: "The state has launched a unified health insurance scheme offering cashless treatment for millions of families, promoting wider healthcare access. This initiative aims to improve financial protection against health emergencies for Bhubaneswar residents.",
            source: "Odisha Health Department",
            publishedAt: new Date().toISOString().split('T')[0],
            url: "https://health.odisha.gov.in/",
            category: "news",
            location: "Bhubaneswar",
            priority: "medium"
          },
          {
            id: "fallback-5",
            title: "Focus on Traditional Medicine",
            summary: "With rising urban health challenges, there is a push to strengthen Ayurveda and AYUSH systems for preventive and holistic healthcare. Expanded Ayurvedic services create additional care options amidst ongoing public health concerns.",
            source: "Odisha AYUSH Department",
            publishedAt: new Date().toISOString().split('T')[0],
            url: "https://ayushodisha.nic.in/",
            category: "news",
            location: "Bhubaneswar",
            priority: "low"
          },
          {
            id: "fallback-6",
            title: "Preparations for Increased Healthcare Demands",
            summary: "With major redevelopment plans in hospitals, including Capital Hospital's upgrade and increased bed capacity, the health system is gearing up for better service delivery during upcoming seasonal and festival demand surges.",
            source: "Odisha Health Department",
            publishedAt: new Date().toISOString().split('T')[0],
            url: "https://health.odisha.gov.in/",
            category: "news",
            location: "Bhubaneswar",
            priority: "medium"
          }
        ],
        lastUpdated: new Date().toISOString()
      };

      // Cache the fallback data
      localStorage.setItem(cacheKey, JSON.stringify(fallbackData));
      
      return fallbackData;
    } catch (error) {
      console.error("Error fetching health news:", error);
      
      // Return cached data if available, even if it's older
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      
      // Return empty response as fallback
      return {
        news: [],
        lastUpdated: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  static async refreshHealthNews(
    location: string = "global",
    category: string = "all"
  ): Promise<HealthNewsResponse> {
    try {
      // Use the cacheKey defined in getHealthNews method
      const cacheKey = `healthNews_${location}_${category}`;
      
      // Clear cache
      localStorage.removeItem(cacheKey);
      
      // Fetch fresh data (will return fallback data)
      return await this.getHealthNews(location, category);
    } catch (error) {
      console.error("Error refreshing health news:", error);
      return {
        news: [],
        lastUpdated: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
}