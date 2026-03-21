import { Card } from "@/components/ui/card";

const STATIC_FACILITIES = [
  {
    name: "Loading nearby facilities...",
    type: "Hospital",
    distance: "Calculating...",
    services: ["Emergency Care", "General Medicine"],
    emergency: true
  },
  {
    name: "Searching medical centers...",
    type: "Medical Center",
    distance: "Calculating...",
    services: ["Primary Care"],
    emergency: false
  }
];

export function LoadingFallback() {
  return (
    <div className="space-y-4 animate-pulse">
      {STATIC_FACILITIES.map((facility, index) => (
        <Card key={index} className="p-6 bg-gray-50">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 