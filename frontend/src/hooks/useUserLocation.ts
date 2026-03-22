import { useState, useEffect } from "react";

export interface UserLocation {
  city: string | null;
  region: string | null;
  country: string | null;
  loading: boolean;
  confirmed: boolean; // true once user has confirmed their location
}

const STORAGE_KEY = "healai_user_location_v2";

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation>({
    city: null,
    region: null,
    country: null,
    loading: true,
    confirmed: false,
  });

  useEffect(() => {
    // Clear any old location caches from previous versions
    const oldKeys = ["userLocation", "userLocationTimestamp", "healai_user_location_v1"];
    oldKeys.forEach((k) => localStorage.removeItem(k));

    // Check if user has already confirmed their location in this session
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.city) {
          setLocation({ ...parsed, loading: false, confirmed: true });
          return;
        }
      } catch {
        // ignore
      }
    }
    // No confirmed location — signal that we need to ask the user
    setLocation({ city: null, region: null, country: null, loading: false, confirmed: false });
  }, []);

  const confirmLocation = (city: string, region?: string, country?: string) => {
    const loc: UserLocation = {
      city: city.trim(),
      region: region?.trim() || null,
      country: country?.trim() || null,
      loading: false,
      confirmed: true,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    setLocation(loc);
  };

  const resetLocation = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setLocation({ city: null, region: null, country: null, loading: false, confirmed: false });
  };

  return { ...location, confirmLocation, resetLocation };
}
