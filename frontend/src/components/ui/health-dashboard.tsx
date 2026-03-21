import { motion } from "framer-motion";
import { HealthMetricCard } from "./health-metrics-card";
import { Activity, Heart, Brain, Apple, Dumbbell, Moon, Droplets, Target, LucideIcon } from "lucide-react";

interface HealthMetric {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: "up" | "down" | "stable";
  color?: string;
  progress?: number;
  maxProgress?: number;
}

interface HealthDashboardProps {
  metrics?: HealthMetric[];
  className?: string;
}

const defaultMetrics: HealthMetric[] = [
  {
    title: "Heart Rate",
    value: "72 BPM",
    icon: Heart,
    trend: "+2%",
    trendDirection: "up",
    color: "text-red-500",
    progress: 72,
    maxProgress: 100,
  },
  {
    title: "Daily Steps",
    value: 8432,
    icon: Activity,
    trend: "+15%",
    trendDirection: "up",
    color: "text-blue-500",
    progress: 84,
    maxProgress: 100,
  },
  {
    title: "Sleep Score",
    value: "85/100",
    icon: Moon,
    trend: "+5%",
    trendDirection: "up",
    color: "text-purple-500",
    progress: 85,
    maxProgress: 100,
  },
  {
    title: "Hydration",
    value: "6/8 cups",
    icon: Droplets,
    trend: "75%",
    trendDirection: "stable",
    color: "text-cyan-500",
    progress: 75,
    maxProgress: 100,
  },
  {
    title: "Calories Burned",
    value: 2150,
    icon: Dumbbell,
    trend: "+8%",
    trendDirection: "up",
    color: "text-orange-500",
    progress: 86,
    maxProgress: 100,
  },
  {
    title: "Mindfulness",
    value: "12 min",
    icon: Brain,
    trend: "+20%",
    trendDirection: "up",
    color: "text-green-500",
    progress: 60,
    maxProgress: 100,
  },
  {
    title: "Nutrition Score",
    value: "92/100",
    icon: Apple,
    trend: "+3%",
    trendDirection: "up",
    color: "text-emerald-500",
    progress: 92,
    maxProgress: 100,
  },
  {
    title: "Weekly Goal",
    value: "87%",
    icon: Target,
    trend: "+12%",
    trendDirection: "up",
    color: "text-indigo-500",
    progress: 87,
    maxProgress: 100,
  },
];

export function HealthDashboard({ 
  metrics = defaultMetrics, 
  className = "" 
}: HealthDashboardProps) {
  return (
    <section className={`py-12 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Health Dashboard
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Track your wellness journey with real-time insights and personalized metrics
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
          >
            <HealthMetricCard
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              trend={metric.trend}
              trendDirection={metric.trendDirection}
              color={metric.color}
              progress={metric.progress}
              maxProgress={metric.maxProgress}
              className="h-full"
            />
          </motion.div>
        ))}
      </div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-12"
      >
        <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Overall Health Score
          </h3>
          <div className="text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              87
            </span>
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>
          <p className="text-lg text-muted-foreground mb-6">
            Excellent! You're maintaining great health habits. Keep up the amazing work!
          </p>
          <div className="flex justify-center gap-4">
            <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
              🎯 Goals on track
            </div>
            <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
              📈 Improving trends
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}