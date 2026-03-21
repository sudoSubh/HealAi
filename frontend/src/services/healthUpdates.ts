// Health Updates Service for General Health Information
// Commented out backend service calls to make app independent
// import { HealthDataFetcher, type BhubaneswarHealthData as FetchedBhubaneswarHealthData } from "./healthDataFetcher";

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

export interface GeneralHealthData {
  updates: HealthUpdate[];
  diseaseAwareness: {
    diseaseName: string;
    casesReported: number;
    preventionTips: string[];
    symptoms: string[];
    lastUpdated: string;
  }[];
  lastUpdated: string;
  error?: string;
}

export class HealthUpdatesService {
  /**
   * Fetches general health updates and disease awareness information
   * from government health departments and official sources
   */
  static async getBhubaneswarHealthData(): Promise<GeneralHealthData> {
    // Commented out backend service calls to make app independent
    // Returning hardcoded fallback data instead
    return {
      updates: [
        {
          id: "fallback-1",
          title: "Covid-19 Monitoring and Alerts",
          summary: "Reports indicate ongoing Covid-19 cases with recent fatalities. A sub-variant strain JN.1 of Omicron has been detected in recent cases. Health authorities continue to urge adherence to Covid-19 protocols, increased testing, and vaccination to control transmission during public gatherings and seasonal events.",
          source: "National Health Department",
          publishedAt: new Date().toISOString().split('T')[0],
          url: "https://health.gov/",
          category: "advisory",
          location: "General",
          priority: "high",
          tags: ["covid-19", "JN.1", "vaccination", "testing"]
        },
        {
          id: "fallback-2",
          title: "Doctor Shortage in Government Facilities",
          summary: "A critical shortage of doctors persists in government hospitals, with thousands of medical officer positions vacant nationwide. This shortage could strain healthcare delivery, especially in peak illness seasons. Recruitment and incentives are under discussion.",
          source: "National Health Department",
          publishedAt: new Date().toISOString().split('T')[0],
          url: "https://health.gov/",
          category: "news",
          location: "General",
          priority: "high",
          tags: ["doctor shortage", "government hospitals", "recruitment"]
        },
        {
          id: "fallback-3",
          title: "Heavy Rainfall Alert and Preparedness",
          summary: "Many regions are under high alert for heavy rainfall and potential flooding. Health departments have issued warnings for vector-borne diseases like dengue and malaria, which tend to spike after rains, along with other communicable diseases.",
          source: "National Disaster Management Authority",
          publishedAt: new Date().toISOString().split('T')[0],
          url: "https://ndma.gov/",
          category: "advisory",
          location: "General",
          priority: "critical",
          tags: ["rainfall", "flooding", "dengue", "malaria", "vector-borne diseases"]
        },
        {
          id: "fallback-4",
          title: "Unified Health Insurance Rollout",
          summary: "A unified health insurance scheme has been launched offering cashless treatment for millions of families, promoting wider healthcare access. This initiative aims to improve financial protection against health emergencies for residents nationwide.",
          source: "National Health Department",
          publishedAt: new Date().toISOString().split('T')[0],
          url: "https://health.gov/",
          category: "news",
          location: "General",
          priority: "medium",
          tags: ["health insurance", "cashless treatment", "financial protection"]
        },
        {
          id: "fallback-5",
          title: "Focus on Traditional Medicine",
          summary: "With rising health challenges, there is a push to strengthen Ayurveda and AYUSH systems for preventive and holistic healthcare. Expanded traditional medicine services create additional care options amidst ongoing public health concerns.",
          source: "National AYUSH Department",
          publishedAt: new Date().toISOString().split('T')[0],
          url: "https://ayush.gov/",
          category: "awareness",
          location: "General",
          priority: "medium",
          tags: ["Ayurveda", "AYUSH", "preventive care", "holistic healthcare"]
        },
        {
          id: "fallback-6",
          title: "Preparations for Increased Healthcare Demands",
          summary: "Healthcare systems are being upgraded with increased bed capacity and facility improvements to better serve communities during seasonal health challenges and increased demand periods.",
          source: "National Health Department",
          publishedAt: new Date().toISOString().split('T')[0],
          url: "https://health.gov/",
          category: "news",
          location: "General",
          priority: "medium",
          tags: ["hospital upgrade", "healthcare infrastructure", "capacity expansion"]
        }
      ],
      diseaseAwareness: [],
      lastUpdated: new Date().toISOString()
    };
  }

  // Method to get empty data (when no real-time data is available)
  static getEmptyData(): GeneralHealthData {
    return {
      updates: [],
      diseaseAwareness: [],
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Forces a refresh of health updates by clearing the cache and fetching fresh data
   */
  static async refreshHealthUpdates(): Promise<GeneralHealthData> {
    // Commented out backend service calls to make app independent
    // Returning hardcoded fallback data instead
    return this.getBhubaneswarHealthData();
  }
}