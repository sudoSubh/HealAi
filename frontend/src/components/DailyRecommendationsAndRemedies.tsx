import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Pill, Activity, Clock, Sun, Moon, Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { callGemini } from "@/services/gemini";
import { UserProfile } from "./UserProfileComponent";

interface Recommendation {
  time: "morning" | "afternoon" | "evening";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface Remedy {
  name: string;
  condition: string;
  description: string;
  howTo: string;
  frequency: string;
  warnings: string;
}

interface AdviceData {
  recommendations: Recommendation[];
  remedies: Remedy[];
  disclaimer: string;
}

interface DailyRecommendationsAndRemediesProps {
  profile?: UserProfile;
  reportSummary?: string;
}

const PRIORITY_COLORS = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
  low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
};

const TIME_ICONS = {
  morning: Sun,
  afternoon: Activity,
  evening: Moon,
};

function loadSaved(): AdviceData | null {
  try { return JSON.parse(localStorage.getItem("dailyAdvice") || "null"); } catch { return null; }
}

export function DailyRecommendationsAndRemedies({ profile, reportSummary }: DailyRecommendationsAndRemediesProps) {
  const [data, setData] = useState<AdviceData | null>(loadSaved);
  const [loading, setLoading] = useState(false);
  const [activeTime, setActiveTime] = useState<"morning" | "afternoon" | "evening">("morning");

  useEffect(() => {
    if (data) localStorage.setItem("dailyAdvice", JSON.stringify(data));
  }, [data]);

  const generate = async () => {
    setLoading(true);
    const profileStr = profile
      ? `Patient: ${profile.name || "Unknown"}, Age ${profile.age || "?"}, ${profile.gender}.
Conditions: ${profile.medicalConditions.join(", ") || "None"}.
Allergies: ${profile.allergies.join(", ") || "None"}.
Medications: ${profile.medications.join(", ") || "None"}.`
      : "General healthy adult.";

    const reportStr = reportSummary
      ? `Report findings: ${reportSummary.slice(0, 600)}`
      : "";

    const prompt = `You are a doctor and wellness expert. Based on the patient profile below, generate:
1. Daily lifestyle recommendations (morning, afternoon, evening)
2. Natural home remedies for their specific conditions

${profileStr}
${reportStr}

Return ONLY valid JSON (no markdown, no extra text):
{
  "recommendations": [
    {"time": "morning", "title": "...", "description": "...", "priority": "high|medium|low"},
    {"time": "morning", "title": "...", "description": "...", "priority": "high|medium|low"},
    {"time": "afternoon", "title": "...", "description": "...", "priority": "high|medium|low"},
    {"time": "afternoon", "title": "...", "description": "...", "priority": "medium|low"},
    {"time": "evening", "title": "...", "description": "...", "priority": "high|medium|low"},
    {"time": "evening", "title": "...", "description": "...", "priority": "medium"}
  ],
  "remedies": [
    {
      "name": "remedy name",
      "condition": "which condition this treats",
      "description": "what it does",
      "howTo": "exactly how to prepare and use",
      "frequency": "how often",
      "warnings": "any contraindications or side effects"
    }
  ],
  "disclaimer": "one sentence medical disclaimer"
}
Generate at least 2 recommendations per time slot and 3 remedies. Be specific to the conditions.`;

    try {
      const raw = await callGemini(prompt);
      const clean = raw.replace(/```json\n?/g, "").replace(/```/g, "").trim();
      const parsed: AdviceData = JSON.parse(clean);
      setData(parsed);
    } catch {
      // If JSON parse fails, try to use raw text as disclaimer
      setData({
        recommendations: [],
        remedies: [],
        disclaimer: "Could not parse AI response. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const recsFor = (time: "morning" | "afternoon" | "evening") =>
    data?.recommendations.filter((r) => r.time === time) ?? [];

  return (
    <div className="space-y-6">
      {/* Daily Recommendations Card */}
      <Card className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-900/20 dark:to-orange-900/10 border-amber-200/50 dark:border-amber-800/30 shadow-lg rounded-2xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-foreground">
                <Lightbulb className="w-5 h-5 mr-2 text-amber-600 dark:text-amber-400" />
                Daily Recommendations
              </CardTitle>
              <CardDescription>Personalized activities to improve your health day by day</CardDescription>
            </div>
            <Button
              onClick={generate}
              disabled={loading}
              size="sm"
              className="rounded-full bg-amber-500 hover:bg-amber-600 text-white gap-1"
            >
              {loading ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
              ) : data ? (
                <><RefreshCw className="w-3.5 h-3.5" /> Refresh</>
              ) : (
                <><Lightbulb className="w-3.5 h-3.5" /> Generate</>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {!data && !loading && (
            <div className="text-center py-8">
              <Clock className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                Click <strong>Generate</strong> to get personalized daily recommendations based on your profile.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-10 gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
              <p className="text-sm text-muted-foreground">Generating your recommendations…</p>
            </div>
          )}

          {data && !loading && (
            <Tabs value={activeTime} onValueChange={(v) => setActiveTime(v as typeof activeTime)}>
              <TabsList className="grid w-full grid-cols-3 rounded-xl">
                <TabsTrigger value="morning" className="rounded-lg gap-1.5">
                  <Sun className="w-3.5 h-3.5" /> Morning
                </TabsTrigger>
                <TabsTrigger value="afternoon" className="rounded-lg gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Afternoon
                </TabsTrigger>
                <TabsTrigger value="evening" className="rounded-lg gap-1.5">
                  <Moon className="w-3.5 h-3.5" /> Evening
                </TabsTrigger>
              </TabsList>

              {(["morning", "afternoon", "evening"] as const).map((time) => (
                <TabsContent key={time} value={time} className="space-y-3 mt-4">
                  <AnimatePresence mode="wait">
                    {recsFor(time).length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No recommendations for this time slot.</p>
                    ) : (
                      recsFor(time).map((rec, i) => {
                        const Icon = TIME_ICONS[time];
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="p-4 rounded-xl bg-white/60 dark:bg-slate-800/40 border border-amber-200/30 dark:border-amber-800/20"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                  <Icon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-foreground">{rec.title}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{rec.description}</p>
                                </div>
                              </div>
                              <Badge className={`${PRIORITY_COLORS[rec.priority]} flex-shrink-0 text-xs`}>
                                {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                              </Badge>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </AnimatePresence>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Home Remedies Card */}
      <Card className="bg-gradient-to-br from-rose-50/50 to-red-50/30 dark:from-rose-900/20 dark:to-red-900/10 border-rose-200/50 dark:border-rose-800/30 shadow-lg rounded-2xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-rose-500 to-red-500" />
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Pill className="w-5 h-5 mr-2 text-rose-600 dark:text-rose-400" />
            Natural Home Remedies
          </CardTitle>
          <CardDescription>Proven natural remedies tailored to your health conditions</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!data && !loading && (
            <div className="text-center py-8">
              <Pill className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Generate recommendations above to see personalized remedies.</p>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-8 gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-rose-600" />
              <p className="text-sm text-muted-foreground">Preparing remedies…</p>
            </div>
          )}

          {data && !loading && (
            <AnimatePresence>
              {data.remedies.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No remedies generated yet.</p>
              ) : (
                data.remedies.map((remedy, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-white/60 dark:bg-slate-800/40 border border-rose-200/30 dark:border-rose-800/20 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{remedy.name}</p>
                        <Badge variant="outline" className="mt-1 text-xs">{remedy.condition}</Badge>
                      </div>
                      <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200 flex-shrink-0 text-xs">
                        {remedy.frequency}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground">{remedy.description}</p>

                    <div className="p-2.5 rounded-lg bg-green-50/60 dark:bg-green-900/20 border border-green-200/30">
                      <p className="text-xs font-medium text-green-900 dark:text-green-200 mb-1">How to Prepare:</p>
                      <p className="text-xs text-green-800 dark:text-green-300 leading-relaxed">{remedy.howTo}</p>
                    </div>

                    {remedy.warnings && (
                      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50/60 dark:bg-red-900/20 border border-red-200/30">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-red-800 dark:text-red-300">{remedy.warnings}</p>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          )}

          {data?.disclaimer && (
            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200/50">
              <p className="text-xs text-muted-foreground">
                <strong>Disclaimer:</strong> {data.disclaimer}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
