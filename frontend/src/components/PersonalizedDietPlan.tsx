import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Utensils, Loader2, RefreshCw, Sun, Coffee, Moon, Apple } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { callGemini } from "@/services/gemini";
import { UserProfile } from "./UserProfileComponent";

interface MealSection {
  label: string;
  icon: React.ElementType;
  color: string;
  items: string[];
}

interface DayPlan {
  day: string;
  meals: MealSection[];
  guidelines: string;
  calorieTarget: string;
}

interface PersonalizedDietPlanProps {
  profile?: UserProfile;
  reportSummary?: string;
}

const MEAL_ICONS: Record<string, React.ElementType> = {
  Breakfast: Coffee,
  Lunch: Sun,
  Dinner: Moon,
  Snacks: Apple,
};
const MEAL_COLORS: Record<string, string> = {
  Breakfast: "text-amber-600 dark:text-amber-400",
  Lunch: "text-green-600 dark:text-green-400",
  Dinner: "text-blue-600 dark:text-blue-400",
  Snacks: "text-rose-600 dark:text-rose-400",
};

function parseDietPlan(raw: string): DayPlan[] {
  // Try to extract JSON or fall back to a basic single-day format
  try {
    const jsonMatch = raw.match(/```json\n?([\s\S]*?)```/);
    if (jsonMatch) return JSON.parse(jsonMatch[1]);
    const plain = raw.match(/\[[\s\S]*\]/);
    if (plain) return JSON.parse(plain[0]);
  } catch {}

  // Plain text fallback — return raw as a single day note
  return [
    {
      day: "Today",
      meals: [
        { label: "Breakfast", icon: Coffee, color: MEAL_COLORS.Breakfast, items: [] },
        { label: "Lunch", icon: Sun, color: MEAL_COLORS.Lunch, items: [] },
        { label: "Dinner", icon: Moon, color: MEAL_COLORS.Dinner, items: [] },
        { label: "Snacks", icon: Apple, color: MEAL_COLORS.Snacks, items: [] },
      ],
      guidelines: raw,
      calorieTarget: "",
    },
  ];
}

export function PersonalizedDietPlan({ profile, reportSummary }: PersonalizedDietPlanProps) {
  const [plan, setPlan] = useState<DayPlan[] | null>(() => {
    try { return JSON.parse(localStorage.getItem("dietPlan") || "null"); } catch { return null; }
  });
  const [rawText, setRawText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    if (plan) localStorage.setItem("dietPlan", JSON.stringify(plan));
  }, [plan]);

  const generate = async () => {
    setLoading(true);
    const profileStr = profile
      ? `Patient: ${profile.name || "Unknown"}, Age ${profile.age || "?"}, ${profile.gender}, Height ${profile.height}cm, Weight ${profile.weight}kg, Blood Group ${profile.bloodGroup}.
Conditions: ${profile.medicalConditions.join(", ") || "None"}.
Allergies: ${profile.allergies.join(", ") || "None"}.
Medications: ${profile.medications.join(", ") || "None"}.`
      : "No profile provided.";

    const reportStr = reportSummary
      ? `Recent report findings: ${reportSummary.slice(0, 800)}`
      : "";

    const prompt = `You are a certified nutritionist and doctor. Create a 3-day personalized meal plan.

${profileStr}
${reportStr}

Return ONLY a valid JSON array (no markdown, no extra text) in this exact format:
[
  {
    "day": "Day 1",
    "meals": [
      {"label": "Breakfast", "items": ["item 1", "item 2", "item 3"]},
      {"label": "Lunch", "items": ["item 1", "item 2", "item 3"]},
      {"label": "Dinner", "items": ["item 1", "item 2", "item 3"]},
      {"label": "Snacks", "items": ["item 1", "item 2"]}
    ],
    "guidelines": "One sentence specific dietary note for this day based on the conditions.",
    "calorieTarget": "1800-2000 kcal"
  }
]
Tailor specifically to the conditions and avoid allergens. Be specific with Indian / global food items.`;

    try {
      const raw = await callGemini(prompt, undefined, undefined, "daily-insight");
      setRawText(raw);
      // Strip possible markdown fences
      const clean = raw.replace(/```json\n?/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(clean);
      // Attach icon refs (can't serialize functions)
      setPlan(parsed);
    } catch (err) {
      // Fallback: show raw text as guidelines
      setPlan([{
        day: "Today",
        meals: [
          { label: "Breakfast", icon: Coffee, color: "", items: [] },
          { label: "Lunch", icon: Sun, color: "", items: [] },
          { label: "Dinner", icon: Moon, color: "", items: [] },
          { label: "Snacks", icon: Apple, color: "", items: [] },
        ],
        guidelines: rawText || "Could not parse plan. See raw output below.",
        calorieTarget: "",
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-900/20 dark:to-emerald-900/10 border-green-200/50 dark:border-green-800/30 shadow-lg rounded-2xl overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-600" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-foreground">
              <Utensils className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
              Personalized Diet Plan
            </CardTitle>
            <CardDescription>
              AI-generated meal plan based on your profile and medical reports
            </CardDescription>
          </div>
          <Button
            onClick={generate}
            disabled={loading}
            size="sm"
            className="rounded-full bg-green-600 hover:bg-green-700 text-white gap-1"
          >
            {loading ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
            ) : plan ? (
              <><RefreshCw className="w-3.5 h-3.5" /> Regenerate</>
            ) : (
              <><Utensils className="w-3.5 h-3.5" /> Generate Plan</>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {!plan && !loading && (
          <div className="text-center py-10">
            <Utensils className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              Click <strong>Generate Plan</strong> to create your personalized meal plan based on your profile and reports.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            <p className="text-sm text-muted-foreground">Creating your personalized plan…</p>
          </div>
        )}

        {plan && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Day selector */}
            {plan.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {plan.map((d, i) => (
                  <Button
                    key={i}
                    variant={activeDay === i ? "default" : "outline"}
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => setActiveDay(i)}
                  >
                    {d.day}
                  </Button>
                ))}
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Meals grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(plan[activeDay]?.meals || []).map((meal) => {
                    const Icon = MEAL_ICONS[meal.label] || Utensils;
                    const color = MEAL_COLORS[meal.label] || "text-green-600";
                    return (
                      <div
                        key={meal.label}
                        className="p-4 rounded-xl bg-white/60 dark:bg-slate-800/40 border border-green-200/30 dark:border-green-800/20 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${color}`} />
                          <p className="text-sm font-semibold text-foreground">{meal.label}</p>
                        </div>
                        <ul className="space-y-1">
                          {(meal.items || []).map((item, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <span className="text-green-500 mt-0.5">•</span>
                              {item}
                            </li>
                          ))}
                          {(!meal.items || meal.items.length === 0) && (
                            <li className="text-xs text-muted-foreground italic">See guidelines below</li>
                          )}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                {/* Calorie target */}
                {plan[activeDay]?.calorieTarget && (
                  <Badge className="rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Target: {plan[activeDay].calorieTarget}
                  </Badge>
                )}

                {/* Guidelines */}
                {plan[activeDay]?.guidelines && (
                  <div className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-900/20 border border-amber-200/40 dark:border-amber-800/20">
                    <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                      {plan[activeDay].guidelines}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-900/20 border border-blue-200/30 space-y-1">
              <p className="text-xs font-medium text-blue-900 dark:text-blue-200">General Guidelines</p>
              <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-0.5">
                <li>• Drink 8+ glasses of water daily</li>
                <li>• Eat at regular intervals — avoid skipping meals</li>
                <li>• Avoid ultra-processed and high-sodium foods</li>
                <li>• Consult your doctor before making major diet changes</li>
              </ul>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
