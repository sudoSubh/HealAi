export interface HealthcareFacility {
  name: string;
  type: string;
  ownership: "public" | "private" | "unknown";
  address: string;
  distance: string;
  rating: number;
  phone: string;
  hours: string;
  services: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  description?: string;
  emergency?: boolean;
  insurance?: string[];
  website?: string;
  reviews?: number;
  place_id?: string;
}