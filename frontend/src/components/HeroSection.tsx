import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { GlareCard } from "@/components/aceternity/glare-card";
import TextHoverEffect from "@/components/aceternity/text-hover-effect";
import { Spotlight } from "@/components/aceternity/spotlight";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-background dark:from-emerald-950/30 dark:via-background dark:to-background py-20 md:py-28">
      {/* Aceternity Spotlight */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="rgba(16, 185, 129, 0.2)"
      />
      
      {/* Background Beams */}
      <BackgroundBeams className="opacity-30" />
      
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Healthcare Platform
            </motion.div>
            
            <TextHoverEffect 
              text="Empower Your Health Journey" 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground"
              preset="blur"
            />
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Your trusted partner for symptom analysis, local resources, and more—all in one app. Experience healthcare reimagined with cutting-edge AI.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button 
                size="lg" 
                className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
              >
                <a href="/symptoms" className="flex items-center">
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 border-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300"
              >
                <a href="/education" className="flex items-center">
                  Learn More
                  <PlayCircle className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </motion.div>
            
            {/* Trust indicators */}
            <motion.div
              className="mt-10 pt-8 border-t border-border/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p className="text-sm text-muted-foreground mb-4">Trusted by thousands of users worldwide</p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">50K+</span>
                  <span className="text-sm">Active Users</span>
                </div>
                <div className="w-px h-8 bg-border hidden sm:block" />
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">95%</span>
                  <span className="text-sm">Accuracy Rate</span>
                </div>
                <div className="w-px h-8 bg-border hidden sm:block" />
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">24/7</span>
                  <span className="text-sm">Support</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <GlareCard className="rounded-2xl overflow-hidden">
              <div className="relative">
                <img
                  src="/heroImage.webp"
                  alt="HealerAi App Preview"
                  className="w-full h-auto rounded-xl shadow-2xl"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 to-transparent rounded-xl" />
              </div>
            </GlareCard>
            
            {/* Floating feature cards */}
            <motion.div
              className="absolute -left-4 top-1/4 bg-card/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border hidden lg:block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">AI Analysis</p>
                  <p className="text-xs text-muted-foreground">Real-time insights</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="absolute -right-4 bottom-1/4 bg-card/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <PlayCircle className="w-5 h-5 text-teal-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Health Videos</p>
                  <p className="text-xs text-muted-foreground">1000+ resources</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
