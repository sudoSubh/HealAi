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
    loading: true,
  });

  useEffect(() => {
    // Try IP-based location first (no permissions needed)
    const fetchIPLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data && data.city) {
          const loc = {
            latitude: data.latitude ?? null,
            longitude: data.longitude ?? null,
            city: data.city ?? null,
            region: data.region ?? null,
            country: data.country_name ?? null,
            error: null,
            loading: false,
          };
          localStorage.setItem("userLocation", JSON.stringify(loc));
          localStorage.setItem("userLocationTimestamp", Date.now().toString());
          setLocation(loc);
          return;
        }
      } catch {
        // fall through to geolocation
      }

      // Fallback: browser geolocation + reverse geocode
      if (!navigator.geolocation) {
        setLocation((prev) => ({
          ...prev,
          error: "Geolocation not supported",
          loading: false,
        }));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();
            const loc = {
              latitude,
              longitude,
              city:
                data.address?.city ||
                data.address?.town ||
                data.address?.village ||
                null,
              region: data.address?.state ?? null,
              country: data.address?.country ?? null,
              error: null,
              loading: false,
            };
            localStorage.setItem("userLocation", JSON.stringify(loc));
            localStorage.setItem("userLocationTimestamp", Date.now().toString());
            setLocation(loc);
          } catch {
            setLocation({
              latitude,
              longitude,
              city: null,
              region: null,
              country: null,
              error: null,
              loading: false,
            });
          }
        },
        () => {
          setLocation({
            latitude: null,
            longitude: null,
            city: null,
            region: null,
            country: null,
            error: "Location access denied",
            loading: false,
          });
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 3600000 }
      );
    };

    // Check cache first
    const cachedLocation = localStorage.getItem("userLocation");
    const locationTimestamp = localStorage.getItem("userLocationTimestamp");
    if (cachedLocation && locationTimestamp) {
      const timestamp = parseInt(locationTimestamp);
      const oneHour = 60 * 60 * 1000;
      if (Date.now() - timestamp < oneHour) {
        try {
          const parsed = JSON.parse(cachedLocation);
          setLocation({ ...parsed, loading: false, error: null });
          return;
        } catch {
          // ignore
        }
      }
    }

    fetchIPLocation();
  }, []);

  return location;
}
