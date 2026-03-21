import { useState, useEffect } from "react";

interface UserLocation {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  region: string | null;
  country: string | null;
  error: string | null;
  loading: boolean;
}

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation>({
    latitude: null,
    longitude: null,
    city: null,
    region: null,
    country: null,
    error: null,
    loading: true
  });

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: "Geolocation is not supported by this browser",
        loading: false
      }));
      return;
    }

    // Get cached location from localStorage if available
    const cachedLocation = localStorage.getItem("userLocation");
    const locationTimestamp = localStorage.getItem("userLocationTimestamp");
    
    if (cachedLocation && locationTimestamp) {
      const timestamp = parseInt(locationTimestamp);
      const now = Date.now();
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
      
      // If cached location is less than 1 hour old, use it
      if (now - timestamp < oneHour) {
        try {
          const parsedLocation = JSON.parse(cachedLocation);
          setLocation({
            ...parsedLocation,
            loading: false,
            error: null
          });
          return;
        } catch (e) {
          // If parsing fails, continue to get fresh location
        }
      }
    }

    // Get fresh location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode to get location details
          // In a real application, you would use a proper geocoding service
          // For now, we'll use a mock implementation
          const locationData = await reverseGeocode(latitude, longitude);
          
          const newLocation = {
            latitude,
            longitude,
            city: locationData.city,
            region: locationData.region,
            country: locationData.country,
            error: null,
            loading: false
          };
          
          // Cache the location
          localStorage.setItem("userLocation", JSON.stringify(newLocation));
          localStorage.setItem("userLocationTimestamp", Date.now().toString());
          
          setLocation(newLocation);
        } catch (error) {
          setLocation({
            latitude,
            longitude,
            city: null,
            region: null,
            country: null,
            error: "Failed to get location details",
            loading: false
          });
        }
      },
      (error) => {
        setLocation({
          latitude: null,
          longitude: null,
          city: null,
          region: null,
          country: null,
          error: `Location access denied: ${error.message}`,
          loading: false
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  return location;
}

// Mock reverse geocoding function
// In a real application, you would use a service like Google Maps Geocoding API
async function reverseGeocode(latitude: number, longitude: number): Promise<{
  city: string | null;
  region: string | null;
  country: string | null;
}> {
  // This is a mock implementation
  // In a real app, you would make an API call to a geocoding service
  return {
    city: "Mumbai",
    region: "Maharashtra",
    country: "India"
  };
}