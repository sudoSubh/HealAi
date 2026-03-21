import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, RefreshCw, Heart } from "lucide-react";
import { generateDailyInsight, type DailyInsight } from "@/services/dailyInsights-openai";
import { HeartAnimation } from "@/components/HeartAnimation";

export function DailyInsightCard() {
  const [insight, setInsight] = useState<DailyInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsight = async (forceNew: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const newInsight = await generateDailyInsight(forceNew);
      setInsight(newInsight);
    } catch (err) {
      setError("Failed to load daily insight. Please try again later.");
      console.error("Error fetching daily insight:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchInsight(true); // Force new insight generation
  };

  const handleRefresh = () => {
    fetchInsight(true); // Force new insight generation
  };

  useEffect(() => {
    fetchInsight();
  }, []);

  if (loading) {
    return (
      <Card className="bg-card border shadow-lg rounded-2xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-emerald-500"></div>
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Lightbulb className="w-5 h-5 mr-2 text-primary" />
            Daily Health Insight
          </CardTitle>
          <CardDescription>Loading your personalized health tip...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <HeartAnimation size={32} className="text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card border shadow-lg rounded-2xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-emerald-500"></div>
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Lightbulb className="w-5 h-5 mr-2 text-primary" />
            Daily Health Insight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={handleRetry} variant="outline" className="rounded-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!insight) {
    return null;
  }

  const categoryColors: Record<string, string> = {
    Nutrition: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
    Exercise: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
    "Mental Health": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200",
    Sleep: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200",
    Prevention: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
  };

  return (
    <Card className="bg-card border shadow-lg rounded-2xl overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-primary to-emerald-500"></div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-foreground">
            <Lightbulb className="w-5 h-5 mr-2 text-primary" />
            Daily Health Insight
          </CardTitle>
          <Button 
            onClick={handleRefresh} 
            variant="ghost" 
            size="sm" 
            className="rounded-full hover:bg-muted"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription>
          Personalized tip to improve your wellness journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Badge className={`${categoryColors[insight.category] || "bg-muted"} rounded-full`}>
            {insight.category}
          </Badge>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">{insight.title}</h3>
        <p className="text-muted-foreground mb-4">{insight.content}</p>
        
        <div className="space-y-2 mb-4">
          <h4 className="font-medium text-foreground">Actionable Tips:</h4>
          <ul className="space-y-1">
            {insight.tips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-muted-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-primary font-medium flex items-center">
            <Heart className="w-4 h-4 mr-2" />
            {insight.motivation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}