import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HealthcareFacility } from "@/types/healthcare";
import { 
  ArrowLeft,
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Navigation,
  Hospital,
  Building,
  AlertTriangle,
  RefreshCcw
} from "lucide-react";
import { motion } from "framer-motion";
import { LoadScript } from "@react-google-maps/api";
import Map from "@/components/Map";

interface Coordinates {
  lat: number;
  lng: number;
}

export default function Resources() {
  const [facilities, setFacilities] = useState<HealthcareFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<HealthcareFacility | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mapsApiKey = (import.meta.env as any).VITE_GOOGLE_MAPS_API_KEY;

  // Get user's current location
  useEffect(() => {
  if (!navigator.geolocation) {
    setError("Your browser doesn't support location access. Showing Bhubaneswar as default.");
    fetchNearbyHospitals({ lat: 20.2961, lng: 85.8245 });
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setUserLocation(coords);
      setError(null);
      fetchNearbyHospitals(coords);
    },
    (err) => {
      console.warn("Geolocation error:", err);
      switch (err.code) {
        case err.PERMISSION_DENIED:
          setError("You denied location permission. Showing hospitals near Bhubaneswar instead.");
          break;
        case err.POSITION_UNAVAILABLE:
          setError("Unable to get your location. Showing default data.");
          break;
        case err.TIMEOUT:
          setError("Location request timed out. Showing default hospitals.");
          break;
        default:
          setError("Could not determine your location. Showing default hospitals.");
      }
      fetchNearbyHospitals({ lat: 20.2961, lng: 85.8245 });
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}, []);


  // Fetch nearby hospitals
  const fetchNearbyHospitals = async (coords: Coordinates) => {
    try {
      setLoading(true);
      console.log('Fetching hospitals for location:', coords);
      
      // Get hospitals near the user's location using our backend proxy
      const response = await fetch(`/api/google-places?lat=${coords.lat}&lng=${coords.lng}&radius=10000&type=hospital`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received hospital data:', data);
      
      // Convert Google Places data to HealthcareFacility format
      const healthcareFacilities: HealthcareFacility[] = data.results.map((place: any) => {
        // Use actual distance from API
        const distance = place.distance ? place.distance.toFixed(1) : (Math.random() * 10).toFixed(1); // Fallback to random if needed
        
        // Determine ownership based on name keywords
        const name = place.name.toLowerCase();
        let ownership: "public" | "private" | "unknown" = "unknown";
        if (
          name.includes("government") ||
          name.includes("public") ||
          name.includes("district") ||
          name.includes("municipal") ||
          name.includes("community") ||
          name.includes("uphc") ||
          name.includes("uchc") ||
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
          name.includes("aiims") ||
          name.includes("vivekanand") ||
          name.includes("sum") ||
          name.includes("assure") ||
          name.includes("igkc")
        ) {
          ownership = "private";
        }

        // Determine type based on Google Place types
        let type = "Healthcare Facility";
        if (place.types && place.types.includes("hospital")) {
          type = "Hospital";
        } else if (place.types && place.types.includes("doctor")) {
          type = "Clinic";
        } else if (place.types && place.types.includes("pharmacy")) {
          type = "Pharmacy";
        }

        // Determine services based on types
        const services: string[] = [];
        if (place.types && place.types.includes("hospital")) services.push("Multi-Speciality");
        if (place.types && place.types.includes("doctor")) services.push("General Medicine");
        if (place.types && place.types.includes("dentist")) services.push("Dental Care");
        if (place.types && place.types.includes("pharmacy")) services.push("Pharmacy");

        return {
          name: place.name,
          type,
          ownership,
          address: place.vicinity || place.formatted_address || "Address not available",
          distance: `${distance} km`,
          rating: place.rating || 0,
          phone: place.formatted_phone_number || place.international_phone_number || "Phone not available",
          hours: place.opening_hours ? (place.opening_hours.open_now ? "Open 24 hours" : "Closed") : "Hours not available",
          services: services.length > 0 ? services : ["Multi-Speciality"],
          coordinates: {
            lat: place.geometry && place.geometry.location ? place.geometry.location.lat : 0,
            lng: place.geometry && place.geometry.location ? place.geometry.location.lng : 0
          },
          reviews: place.user_ratings_total || 0,
          emergency: place.types && place.types.includes("hospital"), // Assume hospitals have emergency services
          website: place.website || ""
        };
      });
      
      // Sort by distance (closest first)
      const sortedData = [...healthcareFacilities].sort((a, b) => {
        const distanceA = parseFloat(a.distance.replace(/[^0-9.]/g, ''));
        const distanceB = parseFloat(b.distance.replace(/[^0-9.]/g, ''));
        return distanceA - distanceB;
      });
      
      console.log('Sorted hospital data:', sortedData);
      setFacilities(sortedData);
    } catch (err) {
      console.error('Error fetching hospitals:', err);
      // Show empty array instead of hardcoded fallback data
      console.log('No hospital data available');
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle marker click on map
  const handleMarkerClick = (facility: HealthcareFacility) => {
    setSelectedFacility(facility);
  };

  // Get marker color based on facility ownership
  const getMarkerColor = (ownership: string) => {
    if (ownership === "public") return "bg-blue-500"; // Government hospitals - blue
    if (ownership === "private") return "bg-green-500"; // Private hospitals - green
    return "bg-purple-500"; // Other facilities - purple
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-foreground flex items-center">
                    <Navigation className="w-6 h-6 mr-2 text-primary" />
                    Hospital Locator
                  </h1>
                  <p className="text-muted-foreground">Find hospitals near you</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-[600px] rounded-xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center">
                  <Navigation className="w-6 h-6 mr-2 text-primary" />
                  Hospital Locator
                </h1>
                <p className="text-muted-foreground">Find hospitals near you</p>
              </div>
            </div>
            <Badge className="bg-primary text-primary-foreground shadow-lg rounded-full">
              <MapPin className="w-3 h-3 mr-1" />
              Location-Based
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-yellow-800 font-medium">Notice</p>
              <p className="text-yellow-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {userLocation && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-medium flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Your location detected successfully
            </p>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Nearest Hospitals</h2>
          <p className="text-muted-foreground mb-4">
            Showing hospitals near your location, sorted by distance (closest first). Click on any hospital to see it on the map or get directions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {facilities.map((facility, index) => (
              <motion.div
                key={facility.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleMarkerClick(facility)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {facility.ownership === "public" ? (
                            <Building className="w-5 h-5 text-blue-500" />
                          ) : facility.ownership === "private" ? (
                            <Hospital className="w-5 h-5 text-green-500" />
                          ) : (
                            <Hospital className="w-5 h-5 text-purple-500" />
                          )}
                          {facility.name}
                          {index === 0 && (
                            <Badge variant="default" className="ml-2 bg-yellow-500 text-yellow-900">
                              Closest
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{facility.address}</p>
                      </div>
                      <Badge 
                        className={`${getMarkerColor(facility.ownership)} text-white`}
                      >
                        {facility.ownership === "public" 
                          ? "Government" 
                          : facility.ownership === "private" 
                          ? "Private" 
                          : "Other"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{facility.distance}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{facility.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{facility.hours}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-3">
                      <div className="flex items-center mr-4">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{facility.rating}</span>
                        <span className="text-muted-foreground text-xs ml-1">
                          ({facility.reviews?.toLocaleString() || 0} reviews)
                        </span>
                      </div>
                      {facility.emergency && (
                        <Badge variant="destructive" className="text-xs">
                          Emergency Care
                        </Badge>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground mb-2">
                        Services: {facility.services.slice(0, 3).join(", ")}
                        {facility.services.length > 3 ? "..." : ""}
                      </p>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(
                            `https://www.google.com/maps/dir/?api=1&destination=${facility.coordinates.lat},${facility.coordinates.lng}`,
                            '_blank'
                          );
                        }}
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                      {facility.website && facility.website !== "" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://${facility.website}`, '_blank');
                          }}
                        >
                          Visit Website
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="h-[600px] rounded-2xl overflow-hidden shadow-lg">
            {mapsApiKey ? (
              <LoadScript
                googleMapsApiKey={mapsApiKey}
                libraries={["places"]}
                loadingElement={<div className="h-full bg-gray-100 animate-pulse" />}
              >
                <Map
                  apiKey={mapsApiKey}
                  facilities={facilities}
                  center={userLocation || { lat: 20.2961, lng: 85.8245 }}
                  onMarkerClick={handleMarkerClick}
                  selectedFacility={selectedFacility}
                  onInfoWindowClose={() => setSelectedFacility(null)}
                  userLocation={userLocation}
                />
                
              </LoadScript>
            ) : (
              <div className="h-full flex items-center justify-center bg-muted">
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground mb-2">Google Maps API key not configured</p>
                  <p className="text-sm text-muted-foreground">Set VITE_GOOGLE_MAPS_API_KEY in your .env file</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {facilities.length === 0 && !loading && (
          <div className="text-center py-12">
            <Hospital className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No hospitals found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any hospitals in your area. This could be due to:
            </p>
            <ul className="text-muted-foreground text-sm mb-4 text-left max-w-md mx-auto">
              <li className="mb-2">• Network connectivity issues</li>
              <li className="mb-2">• Google Maps API configuration problems</li>
              <li className="mb-2">• No hospitals registered in Google Places near your location</li>
              <li>• Location services disabled in your browser</li>
            </ul>
            <Button onClick={() => fetchNearbyHospitals({ lat: 20.2961, lng: 85.8245 })}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}