import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const heartHealthContent = {
  introduction: `
    Heart health is crucial for overall well-being. Understanding cardiovascular health
    and taking preventive measures can significantly reduce the risk of heart disease.
  `,
  sections: [
    {
      title: "Understanding Blood Pressure",
      content: `Blood pressure is a vital sign that measures the force of blood pushing against 
      the walls of your arteries. High blood pressure (hypertension) can lead to serious 
      health problems if left untreated.`,
      externalLink: "https://www.heart.org/en/health-topics/high-blood-pressure",
      linkText: "Learn more about blood pressure at American Heart Association"
    },
    {
      title: "Heart-Healthy Diet",
      content: `A heart-healthy diet emphasizes fruits, vegetables, whole grains, and lean 
      protein sources while limiting saturated fats, trans fats, and excess sodium.`,
      externalLink: "https://www.mayoclinic.org/diseases-conditions/heart-disease/in-depth/heart-healthy-diet/art-20047702",
      linkText: "Mayo Clinic's guide to heart-healthy diet"
    }
  ]
};

export default function HeartHealth() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/education/articles">
                <Button variant="ghost" size="icon">
                  <ExternalLink className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Heart Health</h1>
                <p className="text-gray-600">Understanding and maintaining cardiovascular health</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
          <main className="container mx-auto px-4 py-8 space-y-8">
            <Card>
              <CardContent className="p-6 prose prose-slate max-w-none">
                <p className="text-lg text-muted-foreground">
                  {heartHealthContent.introduction}
                </p>
                
                {heartHealthContent.sections.map((section, index) => (
                  <div key={index} className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                    <p className="mb-4">{section.content}</p>
                    <Button variant="outline" asChild>
                      <a 
                        href={section.externalLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        {section.linkText}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </main>
      </main>
    </div>
  );
} 