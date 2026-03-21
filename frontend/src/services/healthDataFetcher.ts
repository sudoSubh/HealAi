// Service to fetch real health data from our backend
// This service runs in the browser and fetches data from our Node.js backend
// Commented out backend service calls to make app independent

export interface HealthUpdate {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  category: "news" | "advisory" | "campaign" | "awareness";
  location: string;
  priority: "low" | "medium" | "high" | "critical";
  tags: string[];
}

export interface DiseaseAwareness {
  diseaseName: string;
  casesReported: number;
  preventionTips: string[];
  symptoms: string[];
  lastUpdated: string;
}

export interface BhubaneswarHealthData {
  updates: HealthUpdate[];
  diseaseAwareness: DiseaseAwareness[];
  lastUpdated: string;
}

/**
 * Service to fetch real health data from our backend service
 * The backend service scrapes government health websites for real-time information
 * Commented out backend service calls to make app independent
 */
export class HealthDataFetcher {
  // Base URL for our backend service
  private static BASE_URL = "http://localhost:3001";
  
  static async fetchBhubaneswarHealthData(): Promise<BhubaneswarHealthData> {
    // Commented out backend service calls to make app independent
    // Returning empty data instead
    return {
      updates: [],
      diseaseAwareness: [],
      lastUpdated: new Date().toISOString()
    };
  }
  
  static async fetchOdishaHealthData(): Promise<BhubaneswarHealthData> {
    // Commented out backend service calls to make app independent
    // Returning empty data instead
    return {
      updates: [],
      diseaseAwareness: [],
      lastUpdated: new Date().toISOString()
    };
  }
}