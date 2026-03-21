import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Calendar, MapPin, ExternalLink, WifiOff } from "lucide-react";
import { HealthNewsApi, type HealthNewsItem } from "@/lib/healthNewsApi";

interface HealthNewsProps {
  userLocation?: string;
}

export function HealthNews({ userLocation = "Bhubaneswar, Odisha" }: HealthNewsProps) {
  const [news, setNews] = useState<HealthNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await HealthNewsApi.getHealthNews(userLocation);
      
      if (response.error) {
        setError(response.error);
      } else {
        setNews(response.news);
        setLastUpdated(response.lastUpdated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load health news");
    } finally {
      setLoading(false);
    }
  }, [userLocation]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "news": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
      case "outbreak": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      case "vaccination": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Health News & Updates for Bhubaneswar, Odisha</h2>
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-4/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={fetchNews}>
              Retry
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Health News & Updates for Bhubaneswar, Odisha</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {lastUpdated ? (
            <span>Updated {new Date(lastUpdated).toLocaleDateString()}</span>
          ) : (
            <span>Never updated</span>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchNews}
            className="gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      {news.length === 0 ? (
        <Card className="p-8">
          <div className="text-center">
            <WifiOff className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No Real-Time Health Updates</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Currently, no real-time health updates are available from government sources for Bhubaneswar, Odisha.
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              This system only displays verified real-time updates from official government health departments.
            </p>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open("https://health.odisha.gov.in/", "_blank")}
                className="gap-2"
              >
                Visit Official Health Department
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchNews}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Data
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {news.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category}
                      </Badge>
                      <Badge className={getPriorityColor(item.priority)} variant="secondary">
                        {item.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>{item.source}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                    </div>
                    {item.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{item.summary}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(item.url, "_blank")}
                    className="gap-2"
                  >
                    Read Full Article
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
      
      <div className="text-center pt-4">
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => window.open("https://health.gov/", "_blank")}
          className="gap-2"
        >
          Visit Official Health Department Website
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}