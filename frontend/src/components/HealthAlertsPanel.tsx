import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Shield,
  MapPin,
  Bell,
  Info,
  RefreshCw,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyC1FbrqKHMkS18alFf0JvSXImNdDWkyGMs";

interface GeminiAlert {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  type: "advisory" | "update" | "emergency" | "awareness";
  location: string;
  actionRequired: string;
  preventionTips: string[];
  dateIssued: string;
  source: string;
}

interface DiseaseInfo {
  name: string;
  cases: string;
  symptoms: string[];
  prevention: string[];
}

interface GeminiAlertsResponse {
  alerts: GeminiAlert[];
  diseases: DiseaseInfo[];
}

async function generateAlertsWithGemini(locationStr: string): Promise<GeminiAlertsResponse> {
  const client = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const month = new Date().toLocaleString("en-US", { month: "long" });

  const prompt = `Today is ${today}. Generate health alerts and disease awareness data for ${locationStr}.

Return ONLY a raw JSON object (no markdown, no code blocks) with this exact structure:
{
  "alerts": [
    {
      "id": "alert-1",
      "title": "...",
      "description": "2 sentence description mentioning ${locationStr}",
      "severity": "high",
      "type": "advisory",
      "location": "${locationStr}",
      "actionRequired": "short action step",
      "preventionTips": ["tip 1", "tip 2"],
      "dateIssued": "${new Date().toISOString().split("T")[0]}",
      "source": "local health authority name"
    }
  ],
  "diseases": [
    {
      "name": "Disease name",
      "cases": "e.g. 120 reported this month",
      "symptoms": ["symptom1", "symptom2", "symptom3"],
      "prevention": ["tip1", "tip2"]
    }
  ]
}

Rules:
- Generate 3 alerts and 3 disease entries
- Make everything specific to ${locationStr} and ${month} season
- severity must be one of: low, medium, high, critical
- type must be one of: advisory, update, emergency, awareness
- Start with { and end with }. No other text.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}") + 1;
  if (jsonStart === -1 || jsonEnd === 0) throw new Error("No JSON in response");
  return JSON.parse(text.substring(jsonStart, jsonEnd));
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical": return "border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800";
    case "high": return "border-orange-300 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800";
    case "medium": return "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800";
    default: return "border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800";
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "critical": return <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />;
    case "high": return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    case "medium": return <Info className="w-4 h-4 text-yellow-500" />;
    default: return <Bell className="w-4 h-4 text-blue-500" />;
  }
};

const getSeverityBadgeClass = (severity: string) => {
  switch (severity) {
    case "critical": return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
    case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300";
    case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
    default: return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
  }
};

interface HealthAlertsPanelProps {
  className?: string;
  location?: { city?: string | null; region?: string | null; country?: string | null };
}

export function HealthAlertsPanel({ className, location }: HealthAlertsPanelProps) {
  const [data, setData] = useState<GeminiAlertsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locationStr = [location?.city, location?.region, location?.country].filter(Boolean).join(", ");
  const cacheKey = `healthAlerts_${locationStr.toLowerCase().replace(/\s+/g, "_")}`;

  const load = async (force = false) => {
    if (!locationStr) return;
    if (!force) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const { data: cachedData, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
            setData(cachedData);
            return;
          }
        } catch { /* ignore */ }
      }
    }
    setLoading(true);
    setError(null);
    try {
      const result = await generateAlertsWithGemini(locationStr);
      localStorage.setItem(cacheKey, JSON.stringify({ data: result, timestamp: Date.now() }));
      setData(result);
    } catch {
      setError("Failed to generate health alerts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationStr]);

  if (loading) {
    return (
      <div className={className}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[0, 1].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-5 bg-muted rounded w-1/2 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <Loader2 className="w-7 h-7 text-teal-500 animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    Generating {i === 0 ? "health alerts" : "disease awareness"} for {locationStr}…
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 gap-3">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-red-500">{error}</p>
            <Button variant="outline" size="sm" onClick={() => load(true)}>
              <RefreshCw className="w-3 h-3 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={className}>
      {/* Critical alerts banner */}
      {data.alerts.some((a) => a.severity === "critical") && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200 text-sm">
                  Critical Health Alert for {locationStr}
                </h3>
                <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">
                  {data.alerts.find((a) => a.severity === "critical")?.title}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Alerts */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="w-4 h-4 text-blue-500" />
                Health Alerts
                <Badge variant="secondary" className="ml-auto">{data.alerts.length} Active</Badge>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => load(true)}>
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.alerts.map((alert, i) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`p-4 rounded-xl border ${getSeverityColor(alert.severity)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(alert.severity)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-sm leading-tight">{alert.title}</h4>
                          <Badge className={`text-xs flex-shrink-0 ${getSeverityBadgeClass(alert.severity)}`} variant="secondary">
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{alert.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <MapPin className="w-3 h-3" />
                          <span>{alert.location}</span>
                          <span className="mx-1">·</span>
                          <span>{alert.source}</span>
                        </div>
                        {alert.actionRequired && (
                          <div className="text-xs font-medium text-teal-700 dark:text-teal-300 flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            {alert.actionRequired}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Disease Awareness */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="w-4 h-4 text-green-500" />
                Disease Awareness
                <Badge variant="secondary" className="ml-auto">{data.diseases.length} Topics</Badge>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => load(true)}>
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.diseases.map((disease, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="p-4 rounded-xl border bg-card hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{disease.name}</h4>
                      {disease.cases && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {disease.cases}
                        </span>
                      )}
                    </div>
                    <div className="mb-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Symptoms</p>
                      <div className="flex flex-wrap gap-1">
                        {disease.symptoms.slice(0, 3).map((s, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs py-0">{s}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Prevention</p>
                      <ul className="space-y-0.5">
                        {disease.prevention.slice(0, 2).map((tip, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
