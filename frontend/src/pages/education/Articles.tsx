import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Brain, Heart, Apple, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const articles = [
  {
    title: "Mental Health",
    description: "Understanding mental wellness and self-care practices",
    path: "/education/articles/mental-health",
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    topics: ["Stress Management", "Anxiety", "Depression", "Mindfulness"],
    readTime: "10 min"
  },
  {
    title: "Nutrition",
    description: "Learn about balanced diet and healthy eating habits",
    path: "/education/articles/nutrition",
    icon: Apple,
    color: "text-green-500",
    bgColor: "bg-green-50",
    topics: ["Diet Planning", "Vitamins", "Meal Prep", "Superfoods"],
    readTime: "8 min"
  },
  {
    title: "Heart Health",
    description: "Maintaining cardiovascular health and prevention",
    path: "/education/articles/heart-health",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-50",
    topics: ["Blood Pressure", "Exercise", "Diet", "Risk Factors"],
    readTime: "12 min"
  },
  {
    title: "Fitness & Exercise",
    description: "Guide to physical activity and workout routines",
    path: "/education/articles/fitness",
    icon: Activity,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    topics: ["Workouts", "Strength Training", "Cardio", "Flexibility"],
    readTime: "15 min"
  }
];

export default function Articles() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/education">
                <Button variant="ghost" size="icon">
                  <BookOpen className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Health Articles</h1>
                <p className="text-gray-600">Evidence-based articles by healthcare professionals</p>
              </div>
            </div>
          </div>
        </div>
      </header>
        
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search articles..." 
              className="pl-10"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Card 
              key={article.title} 
              className="hover:shadow-lg transition-all"
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${article.bgColor}`}>
                    {article.icon && <article.icon className={`h-6 w-6 ${article.color}`} />}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="flex items-center justify-between">
                      {article.title}
                      <Badge variant="secondary">{article.readTime}</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      {article.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {article.topics.map((topic) => (
                      <Badge 
                        key={topic} 
                        variant="outline"
                        className="text-xs"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild className="w-full">
                    <Link to={article.path}>Read Article</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}