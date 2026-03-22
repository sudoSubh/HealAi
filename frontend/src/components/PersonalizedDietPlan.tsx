import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils, CheckCircle2, AlertCircle, Leaf } from "lucide-react";
import { motion } from "framer-motion";

interface MealPlan {
  day: string;
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snacks: string[];
  notes: string;
}

export function PersonalizedDietPlan({ reportAnalysis }: { reportAnalysis?: any }) {
  const [mealPlan, setMealPlan] = useState<MealPlan[]>([
    {
      day: "Monday",
      breakfast: ["Oatmeal with berries", "Low-fat yogurt", "Green tea"],
      lunch: ["Grilled chicken salad", "Brown rice", "Olive oil dressing"],
      dinner: ["Baked salmon", "Steamed vegetables", "Sweet potato"],
      snacks: ["Apple", "Almonds"],
      notes: "Focus on fiber-rich foods to control blood sugar",
    },
  ]);

  return (
    <Card className="bg-gradient-to-br from-green-50/50 to-lime-50/30 dark:from-green-900/20 dark:to-lime-900/10 border-green-200/50 dark:border-green-800/30 shadow-lg rounded-2xl overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-green-500 to-lime-600" />
      <CardHeader>
        <CardTitle className="flex items-center text-foreground">
          <Utensils className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
          Personalized Diet Plan
        </CardTitle>
        <CardDescription>
          AI-generated meal plan based on your medical conditions and health goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {mealPlan.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-3 p-4 rounded-lg bg-white/50 dark:bg-slate-800/30 border border-green-200/30 dark:border-green-800/20"
          >
            <h3 className="font-semibold text-foreground flex items-center">
              <Leaf className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
              {day.day}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Breakfast</p>
                <div className="space-y-1">
                  {day.breakfast.map((item, i) => (
                    <p key={i} className="text-sm text-foreground flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-2 text-green-600 dark:text-green-400 flex-shrink-0" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Lunch</p>
                <div className="space-y-1">
                  {day.lunch.map((item, i) => (
                    <p key={i} className="text-sm text-foreground flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-2 text-green-600 dark:text-green-400 flex-shrink-0" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Dinner</p>
                <div className="space-y-1">
                  {day.dinner.map((item, i) => (
                    <p key={i} className="text-sm text-foreground flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-2 text-green-600 dark:text-green-400 flex-shrink-0" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Snacks</p>
                <div className="space-y-1">
                  {day.snacks.map((item, i) => (
                    <p key={i} className="text-sm text-foreground flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-2 text-green-600 dark:text-green-400 flex-shrink-0" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {day.notes && (
              <div className="p-3 rounded-lg bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200/30 dark:border-amber-800/20">
                <p className="flex items-start text-xs text-amber-800 dark:text-amber-200">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{day.notes}</span>
                </p>
              </div>
            )}
          </motion.div>
        ))}

        <div className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/30 dark:border-blue-800/20 space-y-2">
          <p className="text-xs font-medium text-blue-900 dark:text-blue-200">Diet Plan Guidelines:</p>
          <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Drink at least 8 glasses of water daily</li>
            <li>• Avoid fried and processed foods</li>
            <li>• Eat meals at regular times</li>
            <li>• Consult with a nutritionist for personalized advice</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
