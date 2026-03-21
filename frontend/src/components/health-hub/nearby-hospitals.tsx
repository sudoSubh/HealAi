import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Navigation,
  Hospital,
  Building,
  AlertTriangle
} from "lucide-react";
import { HealthcareFacility } from "@/types/healthcare";

interface NearbyHospitalsProps {
  className?: string;
}

export function NearbyHospitals({ className }: NearbyHospitalsProps) {
  const [hospitals, setHospitals] = useState<HealthcareFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Get user's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Your browser doesn't support location access.");
      loadFallbackHospitals();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);
        fetchNearbyHospitals(coords);
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setError("Unable to get your location. Please enable location services to find nearby hospitals.");
        loadFallbackHospitals();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // Load empty array when location is not available
  const loadFallbackHospitals = () => {
    setHospitals([]);
    setLoading(false);
  };

  // Fetch nearby hospitals using Google Places API
  const fetchNearbyHospitals = async (coords: { lat: number; lng: number }) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching hospitals near:", coords);
      
      // Google Maps API key from environment variables
      const API_KEY = (import.meta.env as any).VITE_GOOGLE_MAPS_API_KEY;
      
      // Make API call to our backend handler which proxies the Google Places API
      // In Vercel deployment, frontend and API are on the same domain
      // In local development, Vite proxy handles the routing
      const response = await fetch(`/api/google-places?lat=${coords.lat}&lng=${coords.lng}&radius=10000&type=hospital`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log("Received hospital data:", data.results.slice(0, 3)); // Log first 3 results
      
      // Transform Google Places data to HealthcareFacility format
      const healthcareFacilities: HealthcareFacility[] = data.results.map((place: any) => {
        // Use the distance calculated in the backend
        const distance = place.distance ? place.distance.toFixed(1) + " km" : "Distance unknown";
        
        console.log(`Hospital: ${place.name}, Distance: ${distance}`); // Log each hospital and its distance
        
        // Determine ownership based on name keywords
        const name = place.name.toLowerCase();
        let ownership: "public" | "private" | "unknown" = "unknown";
        if (
          name.includes("government") ||
          name.includes("public") ||
          name.includes("district") ||
          name.includes("municipal") ||
          name.includes("community") ||
          name.includes("aiims") ||
          name.includes("pgimer")
        ) {
          ownership = "public";
        } else if (
          name.includes("apollo") ||
          name.includes("fortis") ||
          name.includes("max") ||
          name.includes("manipal") ||
          name.includes("columbia") ||
          name.includes("narayana") ||
          name.includes("sum") ||
          name.includes("assure") ||
          name.includes("igkc")
        ) {
          ownership = "private";
        }

        // Determine services based on types
        const services: string[] = [];
        if (place.types && place.types.includes("hospital")) services.push("Multi-Speciality");
        if (place.types && place.types.includes("doctor")) services.push("General Medicine");
        if (place.types && place.types.includes("dentist")) services.push("Dental Care");
        if (place.types && place.types.includes("pharmacy")) services.push("Pharmacy");

        // Get phone number from detailed data or use a default
        const phone = place.formatted_phone_number || place.international_phone_number || "Phone not available";

        // Get opening hours
        let hours = "Hours not available";
        if (place.opening_hours) {
          hours = place.opening_hours.open_now ? "Open now" : "Closed";
        }

        return {
          name: place.name,
          type: place.types && place.types.includes("hospital") ? "Hospital" : "Healthcare Facility",
          ownership,
          address: place.formatted_address || place.vicinity || "Address not available",
          distance: distance,
          rating: place.rating || 0,
          phone: place.formatted_phone_number || place.international_phone_number || "Phone not available",
          hours: place.opening_hours ? (place.opening_hours.open_now ? "Open now" : "Closed") : "Hours not available",
          services: services.length > 0 ? services : ["Multi-Speciality"],
          coordinates: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng
          },
          reviews: place.user_ratings_total || 0,
          emergency: place.types && place.types.includes("hospital"), // Assume hospitals have emergency services
          website: place.website || "", // Add website if available
          place_id: place.place_id || "" // Add place_id for directions
        };
      });
      
      // Since we can't make multiple API calls in the frontend due to CORS restrictions,
      // we'll use the basic information from the nearby search
      console.log("Processed hospitals:", healthcareFacilities.slice(0, 3)); // Log first 3 processed hospitals
      
      setHospitals(healthcareFacilities);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching nearby hospitals:", err);
      setError("Failed to load nearby hospitals. Please check your network connection and try again.");
      loadFallbackHospitals();
    }
  };

  // Get marker color based on facility ownership
  const getMarkerColor = (ownership: string) => {
    if (ownership === "public") return "bg-blue-500"; // Government hospitals - blue
    if (ownership === "private") return "bg-green-500"; // Private hospitals - green
    return "bg-purple-500"; // Other facilities - purple
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Nearby Hospitals</h2>
          <Badge variant="outline">Loading...</Badge>
        </div>
        
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="flex gap-2 mt-4">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Nearby Hospitals</h2>
        {userLocation ? (
          <Badge variant="outline" className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Location Detected
          </Badge>
        ) : (
          <Badge variant="outline" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Sample Data
          </Badge>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {hospitals.map((hospital, index) => (
          <Card 
            key={hospital.name} 
            className="hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {hospital.ownership === "public" ? (
                      <Building className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Hospital className="w-5 h-5 text-green-500" />
                    )}
                    {hospital.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{hospital.address}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${getMarkerColor(hospital.ownership)}`}></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {hospital.distance}
                  </Badge>
                  {hospital.rating > 0 && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      {hospital.rating}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {hospital.hours}
                  </Badge>
                  {hospital.reviews && hospital.reviews > 0 && (
                    <Badge variant="secondary">
                      {hospital.reviews} reviews
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {hospital.services.slice(0, 3).map((service, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                  {hospital.services.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{hospital.services.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Open Google Maps with directions
                      if (hospital.place_id) {
                        // Use place_id for the most accurate directions
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination_place_id=${hospital.place_id}`,
                          '_blank'
                        );
                      } else if (hospital.coordinates) {
                        // Fallback to coordinates with hospital name
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hospital.name)}&destination_lat=${hospital.coordinates.lat}&destination_lng=${hospital.coordinates.lng}`,
                          '_blank'
                        );
                      } else {
                        // Last resort: just search for the hospital name
                        window.open(
                          `https://www.google.com/maps/search/${encodeURIComponent(hospital.name)}`,
                          '_blank'
                        );
                      }
                    }}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                  {hospital.phone && hospital.phone !== "Phone not available" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`tel:${hospital.phone}`, '_blank');
                      }}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  )}
                  {hospital.website && hospital.website !== "" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(hospital.website, '_blank');
                      }}
                    >
                      Website
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}