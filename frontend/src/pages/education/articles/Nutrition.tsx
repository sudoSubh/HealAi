import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContentSection {
  title: string;
  content: string;
  keyPoints?: string[];
  tips?: string[];
  guidelines?: string[];
}

const nutritionContent: Record<string, ContentSection[]> = {
  basics: [
    {
      title: "Understanding Macronutrients",
      content: `Macronutrients are the building blocks of nutrition that your body needs in large amounts. These include:
      
      1. Proteins: Essential for muscle building and repair
      - Found in meat, fish, eggs, and legumes
      - Recommended daily intake: 0.8g per kg of body weight
      
      2. Carbohydrates: Your body's main energy source
      - Choose complex carbs over simple sugars
      - Found in whole grains, vegetables, and fruits
      
      3. Fats: Important for brain function and hormone production
      - Focus on healthy fats from nuts, avocados, and olive oil
      - Limit saturated and trans fats`,
      keyPoints: [
        "Proteins are essential for muscle building and repair",
        "Carbohydrates provide energy for daily activities",
        "Healthy fats support brain function and hormone production"
      ]
    },
    {
      title: "Micronutrients: Vitamins and Minerals",
      content: `Micronutrients are essential nutrients that your body needs in smaller amounts:
      
      1. Vitamins
      - Vitamin A: Important for vision and immune function
      - B Vitamins: Energy metabolism and brain function
      - Vitamin C: Immune support and skin health
      - Vitamin D: Bone health and immunity
      
      2. Minerals
      - Iron: Oxygen transport in blood
      - Calcium: Bone and teeth health
      - Magnesium: Muscle and nerve function`,
      keyPoints: [
        "Vitamins are essential for various bodily functions",
        "Minerals support structural and functional needs",
        "A varied diet ensures adequate micronutrient intake"
      ]
    }
  ],
  mealPlanning: [
    {
      title: "Creating Balanced Meals",
      content: `A well-balanced meal should include:
      
      1. Portion Control
      - Use smaller plates
      - Fill half your plate with vegetables
      - Quarter with lean protein
      - Quarter with whole grains
      
      2. Meal Timing
      - Eat regular meals
      - Plan for healthy snacks
      - Don't skip breakfast`,
      tips: [
        "Include protein in every meal",
        "Fill half your plate with vegetables",
        "Choose whole grains over refined"
      ]
    }
  ],
  recommendations: [
    {
      title: "Daily Nutritional Guidelines",
      content: `General recommendations for adults:
      
      1. Caloric Intake
      - Women: 1,600-2,400 calories
      - Men: 2,000-3,000 calories
      
      2. Daily Servings
      - 5-9 servings of fruits and vegetables
      - 6-8 servings of grains
      - 2-3 servings of lean protein
      - 2-3 servings of dairy`,
      guidelines: [
        "2000-2500 calories for adults",
        "5 servings of vegetables",
        "2-3 servings of fruits"
      ]
    }
  ]
};

export default function Nutrition() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
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
                <h1 className="text-2xl font-bold text-gray-900">Nutrition & Healthy Eating</h1>
                <p className="text-gray-600">Guidelines for balanced nutrition and better food choices</p>
              </div>
            </div>
          </div>
        </div>
      </header>
        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="basics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basics">Nutrition Basics</TabsTrigger>
              <TabsTrigger value="mealPlanning">Meal Planning</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            {Object.entries(nutritionContent).map(([key, sections]) => (
              <TabsContent key={key} value={key}>
                <ScrollArea className="h-[600px] rounded-md border">
                  <Card>
                    <CardContent className="p-6 space-y-8">
                      {sections.map((section, index) => (
                        <div key={index} className="prose prose-slate max-w-none">
                          <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                          <div className="whitespace-pre-line">{section.content}</div>
                          {section.keyPoints && (
                            <div className="mt-4">
                              <h3 className="font-medium mb-2">Key Points:</h3>
                              <ul className="list-disc pl-5 space-y-1">
                                {section.keyPoints.map((point, i) => (
                                  <li key={i}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {section.tips && (
                            <div className="mt-4">
                              <h3 className="font-medium mb-2">Tips:</h3>
                              <ul className="list-disc pl-5 space-y-1">
                                {section.tips.map((tip, i) => (
                                  <li key={i}>{tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {section.guidelines && (
                            <div className="mt-4">
                              <h3 className="font-medium mb-2">Guidelines:</h3>
                              <ul className="list-disc pl-5 space-y-1">
                                {section.guidelines.map((guideline, i) => (
                                  <li key={i}>{guideline}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </main>
    </div>
  );
} 