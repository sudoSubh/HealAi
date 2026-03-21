import { motion } from "framer-motion";
import { GradientButton } from "./gradient-button";
import { FloatingElement, PulsingOrb } from "./floating-elements";
import { ChevronRight, Star, Heart, Shield, Zap } from "lucide-react";

interface HeroSectionProps {
  onGetStarted?: () => void;
  onLearnMore?: () => void;
}

export function HeroSection({ onGetStarted, onLearnMore }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <FloatingElement delay={0} className="absolute top-20 left-10">
          <PulsingOrb size={80} color="bg-gradient-to-r from-blue-400 to-cyan-400" />
        </FloatingElement>
        
        <FloatingElement delay={2} className="absolute top-40 right-20">
          <PulsingOrb size={60} color="bg-gradient-to-r from-purple-400 to-pink-400" />
        </FloatingElement>
        
        <FloatingElement delay={4} className="absolute bottom-40 left-20">
          <PulsingOrb size={100} color="bg-gradient-to-r from-green-400 to-emerald-400" />
        </FloatingElement>
        
        <FloatingElement delay={1} className="absolute bottom-20 right-10">
          <PulsingOrb size={70} color="bg-gradient-to-r from-yellow-400 to-orange-400" />
        </FloatingElement>

        {/* Floating Icons */}
        <FloatingElement delay={3} className="absolute top-60 left-1/4">
          <div className="p-4 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-full">
            <Heart className="w-8 h-8 text-red-400" />
          </div>
        </FloatingElement>
        
        <FloatingElement delay={5} className="absolute top-32 right-1/3">
          <div className="p-4 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-full">
            <Shield className="w-8 h-8 text-green-400" />
          </div>
        </FloatingElement>
        
        <FloatingElement delay={1.5} className="absolute bottom-60 right-1/4">
          <div className="p-4 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-full">
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
        </FloatingElement>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 rounded-full mb-8"
          >
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              #1 Trusted Health Platform
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Transform Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Health Journey
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Experience the future of healthcare with AI-powered insights, 
            personalized recommendations, and expert guidance for your wellness.
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {[
              "AI Health Assistant",
              "Real-time Monitoring",
              "Expert Guidance"
            ].map((feature, index) => (
              <div
                key={feature}
                className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {feature}
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <GradientButton
              variant="primary"
              size="lg"
              onClick={onGetStarted}
              className="group"
            >
              <span className="flex items-center gap-2">
                Get Started Free
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </GradientButton>
            
            <GradientButton
              variant="secondary"
              size="lg"
              onClick={onLearnMore}
              className="group"
            >
              <span className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Learn More
              </span>
            </GradientButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
          >
            {[
              { number: "50K+", label: "Happy Users" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
    </section>
  );
}