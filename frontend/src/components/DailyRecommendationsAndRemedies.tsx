import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Pill, Activity, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface Recommendation {
  title: string;
  description: string;
  icon: React.ElementType;
  category: "morning" | "afternoon" | "evening" | "all-day";
  priority: "high" | "medium" | "low";
}

interface Remedy {
  name: string;
  condition: string;
  description: string;
  dosage?: string;
  frequency?: string;
  sideEffects?: string[];
  notes: string;
}

export function DailyRecommendationsAndRemedies({ reportAnalysis }: { reportAnalysis?: any }) {
  const [recommendations] = useState<Recommendation[]>([
    {
      title: "Morning Meditation",
      description: "Start your day with 10 minutes of meditation to reduce stress and improve focus",
      icon: Activity,
      category: "morning",
      priority: "high",
    },
    {
      title: "Drink Water",
      description: "Drink a glass of warm water with lemon to aid digestion",
      icon: Lightbulb,
      category: "morning",
      priority: "high",
    },
    {
      title: "Evening Walk",
      description: "Take a 30-minute walk after dinner to aid digestion and maintain healthy weight",
      icon: Activity,
      category: "evening",
      priority: "medium",
    },
    {
      title: "Sleep Early",
      description: "Maintain a consistent sleep schedule with at least 7-8 hours of sleep",
      icon: Clock,
      category: "evening",
      priority: "high",
    },
  ]);

  const [remedies] = useState<Remedy[]>([
    {
      name: "Turmeric + Ginger Tea",
      condition: "Inflammation & Joint Pain",
      description: "Natural anti-inflammatory remedy to reduce joint pain and improve mobility",
      frequency: "2 times daily",
      sideEffects: ["Mild stomach upset (rare)"],
      notes: "Drink warm, best in morning and evening",
    },
    {
      name: "Cinnamon Water",
      condition: "Blood Sugar Control",
      description: "Helps regulate blood sugar levels naturally",
      frequency: "Once daily in the morning",
      sideEffects: [],
      notes: "Take on empty stomach for best results",
    },
    {
      name: "Fenugreek Seeds",
      condition: "Diabetes Management",
      description: "Soaked overnight fenugreek seeds help control blood glucose levels",
      frequency: "Once daily in the morning",
      sideEffects: ["Possible maple syrup smell in urine"],
      notes: "Soak 1 teaspoon overnight and consume with water",
    },
  ]);

  const priorityColors = {
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
    low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
  };

  const categoryIcons = {
    morning: "🌅",
    afternoon: "☀️",
    evening: "🌙",
    "all-day": "⏰",
  };

  return (
    <div className="space-y-6">
      {/* Daily Recommendations */}
      <Card className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-900/20 dark:to-orange-900/10 border-amber-200/50 dark:border-amber-800/30 shadow-lg rounded-2xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-600" />
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Lightbulb className="w-5 h-5 mr-2 text-amber-600 dark:text-amber-400" />
            Daily Recommendations
          </CardTitle>
          <CardDescription>
            Personalized daily activities and habits to improve your health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all-day" className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-lg">
              <TabsTrigger value="morning" className="rounded-md">Morning</TabsTrigger>
              <TabsTrigger value="afternoon" className="rounded-md">Afternoon</TabsTrigger>
              <TabsTrigger value="evening" className="rounded-md">Evening</TabsTrigger>
              <TabsTrigger value="all-day" className="rounded-md">All Day</TabsTrigger>
            </TabsList>

            {["morning", "afternoon", "evening", "all-day"].map((time) => (
              <TabsContent key={time} value={time} className="space-y-3 mt-4">
                {recommendations
                  .filter((rec) => rec.category === time)
                  .map((rec, index) => {
                    const Icon = rec.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg bg-white/50 dark:bg-slate-800/30 border border-amber-200/30 dark:border-amber-800/20"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <Icon className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-foreground">{rec.title}</p>
                              <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                            </div>
                          </div>
                          <Badge className={priorityColors[rec.priority]}>
                            {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                          </Badge>
                        </div>
                      </motion.div>
                    );
                  })}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Home Remedies */}
      <Card className="bg-gradient-to-br from-red-50/50 to-rose-50/30 dark:from-red-900/20 dark:to-rose-900/10 border-red-200/50 dark:border-red-800/30 shadow-lg rounded-2xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-red-500 to-rose-600" />
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Pill className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
            Natural Home Remedies
          </CardTitle>
          <CardDescription>
            Proven natural remedies to manage your health conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {remedies.map((remedy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-white/50 dark:bg-slate-800/30 border border-red-200/30 dark:border-red-800/20 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground">{remedy.name}</p>
                  <Badge variant="outline" className="mt-1 text-xs">{remedy.condition}</Badge>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{remedy.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {remedy.frequency && (
                  <div className="p-2 rounded bg-amber-50/50 dark:bg-amber-900/20">
                    <p className="text-muted-foreground font-medium">Frequency</p>
                    <p className="text-foreground">{remedy.frequency}</p>
                  </div>
                )}
                {remedy.dosage && (
                  <div className="p-2 rounded bg-blue-50/50 dark:bg-blue-900/20">
                    <p className="text-muted-foreground font-medium">Dosage</p>
                    <p className="text-foreground">{remedy.dosage}</p>
                  </div>
                )}
              </div>

              {remedy.sideEffects && remedy.sideEffects.length > 0 && (
                <div className="p-2 rounded bg-red-50/50 dark:bg-red-900/20 border border-red-200/30 dark:border-red-800/20">
                  <p className="text-xs font-medium text-red-900 dark:text-red-200">Possible Side Effects:</p>
                  <ul className="text-xs text-red-800 dark:text-red-300 mt-1 space-y-1">
                    {remedy.sideEffects.map((effect, i) => (
                      <li key={i}>• {effect}</li>
                    ))}
                  </ul>
                </div>
              )}

              {remedy.notes && (
                <p className="text-xs text-muted-foreground italic">💡 {remedy.notes}</p>
              )}
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <div className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/30 dark:border-blue-800/20">
        <p className="text-xs text-blue-900 dark:text-blue-200">
          ⚠️ <strong>Disclaimer:</strong> These recommendations and remedies are suggestions based on your medical reports. Always consult with your healthcare provider before starting any new treatment or remedy.
        </p>
      </div>
    </div>
  );
}
