import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Info,
  TrendingUp,
  Shield,
  MapPin,
  Loader2,
} from "lucide-react";
import { callGemini } from "@/services/gemini";

interface HealthNewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  category: "news" | "advisory" | "campaign" | "awareness";
  location: string;
  priority: "low" | "medium" | "high" | "critical";
  tags: string[];
}

async function generateNewsWithGemini(location: string): Promise<HealthNewsItem[]> {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const prompt = `Today is ${today}. Generate 5 realistic, current health news items specifically for ${location}.
Return ONLY a raw JSON array (no markdown, no code blocks, no explanation) of 5 objects with these exact keys:
- id: unique string like "news-1"
- title: short headline specific to ${location}
- summary: 2–3 sentence summary mentioning ${location} and current date context
- source: realistic local health authority or news source name
- publishedAt: "${new Date().toISOString().split("T")[0]}"
- url: "https://health.gov/"
- category: one of: news, advisory, campaign, awareness
- location: "${location}"
- priority: one of: low, medium, high, critical
- tags: array of 3 relevant strings

Make content highly specific to ${location}'s current season (${new Date().toLocaleString("en-US", { month: "long" })}), climate, common diseases, and local health infrastructure.
Start with [ and end with ]. No other text.`;

  const text = await callGemini(prompt);
  const jsonStart = text.indexOf("[");
  const jsonEnd = text.lastIndexOf("]") + 1;
  if (jsonStart === -1 || jsonEnd === 0) throw new Error("No JSON array in response");
  return JSON.parse(text.substring(jsonStart, jsonEnd));
}

interface LocationBasedHealthNewsProps {
  className?: string;
  location?: { city?: string | null; region?: string | null; country?: string | null };
}

export function LocationBasedHealthNews({ className, location }: LocationBasedHealthNewsProps) {
  const [news, setNews] = useState<HealthNewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locationStr = [location?.city, location?.region, location?.country].filter(Boolean).join(", ");
  const cacheKey = `locationNews_${locationStr.toLowerCase().replace(/\s+/g, "_")}`;

  const load = async (force = false) => {
    if (!locationStr) return;
    if (!force) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
            setNews(data);
            return;
          }
        } catch { /* ignore */ }
      }
    }
    setLoading(true);
    setError(null);
    try {
      const data = await generateNewsWithGemini(locationStr);
      localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
      setNews(data);
    } catch {
      setError("Failed to generate health news. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationStr]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "advisory": return <AlertTriangle className="w-3 h-3" />;
      case "campaign": return <TrendingUp className="w-3 h-3" />;
      case "awareness": return <Shield className="w-3 h-3" />;
      default: return <Info className="w-3 h-3" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "advisory": return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300";
      case "campaign": return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      case "awareness": return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      default: return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      default: return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {locationStr ? `${locationStr} Health News` : "Local Health News"}
            {locationStr && (
              <Badge variant="outline" className="ml-1 text-xs flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />
                AI Generated
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => load(true)}
            disabled={loading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
            <p className="text-sm text-muted-foreground">
              Generating health news for {locationStr}…
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <Button variant="outline" size="sm" onClick={() => load(true)}>
              <RefreshCw className="w-3 h-3 mr-1" /> Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-4 rounded-lg border bg-card hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Badge className={getCategoryColor(item.category)} variant="secondary">
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(item.category)}
                        <span className="capitalize">{item.category}</span>
                      </div>
                    </Badge>
                    <Badge className={getPriorityColor(item.priority)} variant="secondary">
                      {item.priority}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{item.source}</span>
                    <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => window.open(item.url, "_blank")}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Read
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
