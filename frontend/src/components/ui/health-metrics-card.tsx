import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter, AnimatedProgress } from "./animated-counter";
import { GlowingCard } from "./floating-elements";
import { LucideIcon } from "lucide-react";

interface HealthMetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: "up" | "down" | "stable";
  color?: string;
  progress?: number;
  maxProgress?: number;
  className?: string;
}

const trendColors = {
  up: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
  down: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400",
  stable: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
};

export function HealthMetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = "stable",
  color = "text-blue-500",
  progress,
  maxProgress = 100,
  className = "",
}: HealthMetricCardProps) {
  return (
    <GlowingCard className={className}>
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-800/40 backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            {trend && (
              <Badge className={`${trendColors[trendDirection]} border-0`}>
                {trend}
              </Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <div className="text-2xl font-bold text-foreground">
              {typeof value === "number" ? (
                <AnimatedCounter value={value} />
              ) : (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {value}
                </motion.span>
              )}
            </div>
            
            {progress !== undefined && (
              <div className="mt-4">
                <AnimatedProgress
                  value={progress}
                  max={maxProgress}
                  color="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
                  showValue={false}
                />
              </div>
            )}
          </div>
        </CardContent>
        
        {/* Animated background elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse-slow" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-red-500/20 rounded-full blur-lg animate-bounce-slow" />
      </Card>
    </GlowingCard>
  );
}