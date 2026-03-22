import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, RefreshCw, Heart, MapPin } from "lucide-react";
import { generateDailyInsight, type DailyInsight } from "@/services/dailyInsights-openai";
import { HeartAnimation } from "@/components/HeartAnimation";

interface DailyInsightCardProps {
  location?: { city?: string | null; region?: string | null; country?: string | null };
}

export function DailyInsightCard({ location }: DailyInsightCardProps) {
  const [insight, setInsight] = useState<DailyInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stable string key so the effect only re-fires when location actually changes
  const locationKey = [location?.city, location?.region, location?.country]
    .filter(Boolean)
    .join(",") || "";

  const fetchInsight = async (forceNew = false) => {
    setLoading(true);
    setError(null);
    try {
      const newInsight = await generateDailyInsight(forceNew, location);
      setInsight(newInsight);
    } catch (error: any) {
      console.error("[HealAI] Insight error:", error);
      const isQuotaError = error?.message?.includes("429") || error?.status === 429 || error?.message?.toLowerCase().includes("quota");
      setError(isQuotaError ? "API Quota Exceeded (429): Daily limit reached for this task." : "Failed to load daily insight. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever the resolved location key changes (empty → city name)
  useEffect(() => {
    fetchInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationKey]);

  const categoryColors: Record<string, string> = {
    Nutrition: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
    Exercise: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
    "Mental Health": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200",
    Sleep: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200",
    Prevention: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
    "General Health": "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200",
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-teal-50/50 to-emerald-50/30 dark:from-teal-900/20 dark:to-emerald-900/10 border-teal-200/50 dark:border-teal-800/30 shadow-lg rounded-2xl overflow-hidden h-full">
        <div className="h-2 bg-gradient-to-r from-teal-500 to-emerald-600" />
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Lightbulb className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
            Daily Health Insight
          </CardTitle>
          <CardDescription>
            {location?.city
              ? `Generating today's insight for ${location.city}…`
              : "Generating your personalized health tip…"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <HeartAnimation size={32} className="text-teal-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-br from-teal-50/50 to-emerald-50/30 dark:from-teal-900/20 dark:to-emerald-900/10 border-teal-200/50 dark:border-teal-800/30 shadow-lg rounded-2xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-teal-500 to-emerald-600" />
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Lightbulb className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
            Daily Health Insight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => fetchInsight(true)} variant="outline" className="rounded-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!insight) return null;

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <Card className="bg-gradient-to-br from-teal-50/50 to-emerald-50/30 dark:from-teal-900/20 dark:to-emerald-900/10 border-teal-200/50 dark:border-teal-800/30 shadow-lg rounded-2xl overflow-hidden h-full">
      <div className="h-2 bg-gradient-to-r from-teal-500 to-emerald-600" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-foreground">
            <Lightbulb className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
            Daily Health Insight
          </CardTitle>
          <Button
            onClick={() => fetchInsight(true)}
            variant="ghost"
            size="sm"
            className="rounded-full hover:bg-teal-100 dark:hover:bg-teal-900/30"
            title="Refresh insight"
          >
            <RefreshCw className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </Button>
        </div>
        <CardDescription className="flex flex-col gap-1">
          <span>{today}</span>
          {location?.city && (
            <span className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400">
              <MapPin className="w-3 h-3" />
              {[location.city, location.region, location.country].filter(Boolean).join(", ")}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Badge className={`${categoryColors[insight.category] || "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200"} rounded-full`}>
            {insight.category}
          </Badge>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">{insight.title}</h3>
        <p className="text-muted-foreground mb-4 leading-relaxed">{insight.content}</p>

        <div className="space-y-2 mb-4">
          <h4 className="font-medium text-foreground text-sm">Actionable Tips:</h4>
          <ul className="space-y-1.5">
            {insight.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-teal-600 dark:text-teal-400 font-bold mt-0.5">•</span>
                <span className="text-muted-foreground text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/20 rounded-lg border border-teal-200/50 dark:border-teal-800/30">
          <p className="text-teal-700 dark:text-teal-300 font-medium flex items-center text-sm">
            <Heart className="w-4 h-4 mr-2 flex-shrink-0 text-teal-600 dark:text-teal-400" />
            {insight.motivation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
