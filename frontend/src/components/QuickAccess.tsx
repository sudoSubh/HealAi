import { Heart, MapPin, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";

const quickLinks = [
  {
    title: "Symptom Checker",
    description: "Check your symptoms",
    icon: Heart,
    url: "/symptoms",
    color: "text-red-500",
  },
  {
    title: "Find Resources",
    description: "Locate health services",
    icon: MapPin,
    url: "/resources",
    color: "text-green-500",
  },
  {
    title: "Learn",
    description: "Health education",
    icon: BookOpen,
    url: "/education",
    color: "text-purple-500",
  }
];

export function QuickAccess() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quickLinks.map((link) => (
        <Card key={link.title} className="group hover:shadow-lg transition-shadow">
          <a
            href={link.url}
            className="block p-6 hover:no-underline"
          >
            <div className="flex items-start space-x-4">
              <div className={`${link.color} p-3 rounded-lg bg-gray-50 group-hover:scale-110 transition-transform`}>
                <link.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{link.title}</h3>
                <p className="text-sm text-gray-500">{link.description}</p>
              </div>
            </div>
          </a>
        </Card>
      ))}
    </div>
  );
}