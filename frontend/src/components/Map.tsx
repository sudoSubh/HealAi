import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { Hospital, Building, MapPin } from "lucide-react";
import { HealthcareFacility } from "@/types/healthcare";

interface Coordinates {
  lat: number;
  lng: number;
}

interface MapProps {
  apiKey: string;
  facilities: HealthcareFacility[];
  center: Coordinates;
  onMarkerClick: (facility: HealthcareFacility) => void;
  selectedFacility: HealthcareFacility | null;
  onInfoWindowClose: () => void;
  userLocation?: Coordinates | null;
}

export default function Map({ 
  apiKey, 
  facilities, 
  center, 
  onMarkerClick, 
  selectedFacility, 
  onInfoWindowClose,
  userLocation
}: MapProps) {
  // Function to get marker color based on facility ownership
  const getMarkerColor = (facility: HealthcareFacility) => {
    if (facility.ownership === "public") {
      return '#3b82f6'; // Blue for public/government hospitals
    } else if (facility.ownership === "private") {
      return '#10b981'; // Green for private hospitals
    } else {
      return '#8b5cf6'; // Purple for unknown/other
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={center}
      zoom={13}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false
      }}
    >
      {!apiKey && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="rounded-xl bg-white/90 backdrop-blur border p-4 text-center shadow">
            <p className="font-medium">Missing Google Maps API key</p>
            <p className="text-sm text-gray-600">Set VITE_GOOGLE_MAPS_API_KEY and reload.</p>
          </div>
        </div>
      )}
      {facilities.map((facility) => (
        <Marker
          key={facility.name}
          position={facility.coordinates}
          onClick={() => onMarkerClick(facility)}
          icon={{
            path: "M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z",
            scale: 0.8,
            fillColor: getMarkerColor(facility),
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff',
          }}
        />
      ))}
      {userLocation && (
        <Marker
          position={userLocation}
          title="You are here"
          icon={{
            path: "M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z",
            scale: 0.6,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "white",
          }}
        />
      )}
      
      {selectedFacility && (
        <InfoWindow
          position={selectedFacility.coordinates}
          onCloseClick={onInfoWindowClose}
        >
          <div className="p-2">
            <h3 className="font-semibold">{selectedFacility.name}</h3>
            <p className="text-sm">{selectedFacility.address}</p>
            <p className="text-sm text-primary">{selectedFacility.phone}</p>
            {selectedFacility.ownership && (
              <p className="text-xs mt-1">
                <span className="font-medium">Type:</span>{" "}
                {selectedFacility.ownership === "public" 
                  ? "Government Hospital" 
                  : selectedFacility.ownership === "private" 
                  ? "Private Hospital" 
                  : "Healthcare Facility"}
              </p>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}