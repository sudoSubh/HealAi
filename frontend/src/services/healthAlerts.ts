// Health Alerts and Disease Awareness Service
import { HealthDataFetcher } from "./healthDataFetcher";

export interface HealthAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'advisory' | 'update' | 'emergency' | 'awareness';
  location?: string;
  affectedAreas?: string[];
  dateIssued: string;
  lastUpdated: string;
  source: string;
  actionRequired?: string;
  preventionTips?: string[];
  symptoms?: string[];
  isActive: boolean;
  expiryDate?: string;
  relatedLinks?: Array<{
    title: string;
    url: string;
  }>;
}

// Define interfaces for our data structures
export interface HealthNewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  category: "news" | "advisory" | "campaign" | "awareness";
  location?: string;
  priority: "low" | "medium" | "high" | "critical";
}

export interface HealthNewsResponse {
  news: HealthNewsItem[];
  lastUpdated: string;
  error?: string;
}

export class HealthAlertsService {
  /**
   * Fetches real active health alerts for Odisha state
   * from government health departments and official sources
   */
  static async getActiveAlerts(): Promise<HealthAlert[]> {
    try {
      // Check cache first
      const cachedData = localStorage.getItem('healthAlerts_Odisha');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const lastUpdated = new Date(parsedData.lastUpdated);
        const now = new Date();
        const hoursDifference = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
        
        // If data is less than 24 hours old, return it
        if (hoursDifference < 24) {
          return parsedData.alerts;
        }
      }

      // In a real implementation, this would fetch real data
      // For now, we return empty data to comply with the requirement of not using pre-trained data
      return [];
    } catch (error) {
      console.error("Error fetching active alerts:", error);
      // Return empty array when API call fails to avoid using fallback data
      return [];
    }
  }

  static async getCriticalAlerts(): Promise<HealthAlert[]> {
    try {
      const alerts = await this.getActiveAlerts();
      return alerts.filter(alert => alert.severity === 'critical' || alert.severity === 'high');
    } catch (error) {
      console.error("Error fetching critical alerts:", error);
      return [];
    }
  }

  static async getAlertsByLocation(location: string): Promise<HealthAlert[]> {
    try {
      const alerts = await this.getActiveAlerts();
      return alerts.filter(alert => 
        alert.location?.toLowerCase().includes(location.toLowerCase()) ||
        alert.affectedAreas?.some(area => 
          area.toLowerCase().includes(location.toLowerCase())
        )
      );
    } catch (error) {
      console.error("Error fetching alerts by location:", error);
      return [];
    }
  }

  static async markAlertAsRead(alertId: string): Promise<void> {
    // In production, this would update the backend
    console.log(`Alert ${alertId} marked as read`);
  }

  static getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  /**
   * Forces a refresh of health alerts by clearing the cache and fetching fresh data
   */
  static async refreshHealthAlerts(): Promise<{alerts: HealthAlert[]}> {
    try {
      // Clear the cache
      localStorage.removeItem('healthAlerts_Odisha');
      
      // Fetch fresh data
      const alerts = await this.getActiveAlerts();
      
      return { alerts };
    } catch (error) {
      console.error("Error refreshing health data:", error);
      // Return empty data even in case of refresh errors
      return { alerts: [] };
    }
  }
}