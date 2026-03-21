import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GlowingCard } from "./floating-elements";
import { ChevronRight, LucideIcon } from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  urgent?: boolean;
  stats?: string;
  category?: string;
}

interface EnhancedQuickActionsProps {
  actions: QuickAction[];
  title?: string;
  className?: string;
}

export function EnhancedQuickActions({ 
  actions, 
  title = "Quick Actions",
  className = "" 
}: EnhancedQuickActionsProps) {
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
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {title}
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Access powerful health tools designed to support your wellness journey
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full"
          >
            <Link to={action.href} className="block h-full">
              <GlowingCard className="h-full group">
                <Card className="h-full relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-800/70 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl">
                  {/* Gradient Top Border */}
                  <div className={`h-2 bg-gradient-to-r ${action.color}`} />
                  
                  {/* Floating Background Elements */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-pink-400/10 to-red-500/10 rounded-full blur-lg group-hover:scale-110 transition-transform duration-500" />
                  
                  <CardContent className="p-8 relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${action.color.replace('to-', 'to-').replace('from-', 'from-')} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        {action.urgent && (
                          <Badge className="bg-red-500 text-white animate-pulse border-0">
                            Urgent
                          </Badge>
                        )}
                        {action.category && (
                          <Badge variant="outline" className="text-xs">
                            {action.category}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-blue-600 transition-colors duration-300">
                        {action.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {action.description}
                      </p>
                      
                      {action.stats && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-green-600 font-medium">{action.stats}</span>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                      <span className="text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                        Get Started
                      </span>
                      <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-2 group-hover:text-blue-700 transition-all duration-300" />
                    </div>
                  </CardContent>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              </GlowingCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}