import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { 
  Activity, 
  Bot, 
  BookOpen, 
  Search, 
  Heart, 
  Brain, 
  Apple, 
  Dumbbell,
  Calendar,
  TrendingUp,
  MessageCircle,
  FileText,
  Settings,
  Menu,
  X,
  ChevronRight,
  Stethoscope,
  Shield,
  Zap,
  Bell,
  Award,
  Star,
  MapPin,
  Play,
  Sparkles,
  ChevronLeft,
  Droplets,
  Moon,
  Target
} from "lucide-react";
import { LottieAnimation } from "@/components/LottieAnimation";
import { ModeToggle } from "@/components/mode-toggle";
import { HeartAnimation } from "@/components/HeartAnimation";
import { DailyInsightCard } from "@/components/DailyInsightCard";
import { HealthUpdatesTicker } from "@/components/HealthUpdatesTicker";
// Removed LocationBasedHealthNews import since we're simplifying the UI
import { GoogleTranslate } from "@/components/GoogleTranslate";
import aiHealthAnimation from "../../public/animations/ai-health-animation.json";
// Import new components
import { GradientButton } from "@/components/ui/gradient-button";
import { FloatingElement, PulsingOrb } from "@/components/ui/floating-elements";
import { HeroSection } from "@/components/HeroSection";
import { HealthMetricCard } from "@/components/ui/health-metrics-card";
// Aceternity UI Components
import { Spotlight, SpotlightCard } from "@/components/aceternity/spotlight";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { HoverEffect } from "@/components/aceternity/hover-effect";
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect";
import { InfiniteMovingCards } from "@/components/aceternity/infinite-moving-cards";
import { MovingBorderButton } from "@/components/aceternity/moving-border";

const Index = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  console.log("DEBUG_LOTTIE:", typeof aiHealthAnimation, aiHealthAnimation);

  // Add type annotation for the map functions
  const quickActions: Array<{
    title: string;
    description: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    href: string;
    color: string;
    urgent?: boolean;
  }> = [
    {
      title: "Symptom Checker",
      description: "AI-powered symptom analysis",
      icon: Stethoscope,
      href: "/symptoms",
      color: "from-green-500 to-emerald-600",
      urgent: true
    },
    {
      title: "Medical Bot",
      description: "Chat with AI health assistant",
      icon: Bot,
      href: "/medical-bot",
      color: "from-green-600 to-teal-700"
    },
    {
      title: "Health Hub",
      description: "Watch health videos and courses",
      icon: Play,
      href: "/health-hub",
      color: "from-emerald-500 to-green-600"
    },
    {
      title: "Education Hub",
      description: "Learn about health topics",
      icon: BookOpen,
      href: "/education",
      color: "from-emerald-500 to-green-600"
    },
    {
      title: "Recent Health Updates",
      description: "View latest health news and alerts",
      icon: Sparkles,
      href: "/test-health-news",
      color: "from-emerald-500 to-teal-600"
    },

  ];

  // Testimonials data for infinite moving cards
  const testimonials = [
    {
      quote: "HealerAi helped me understand my symptoms before my doctor's appointment. The AI analysis was incredibly accurate and gave me peace of mind.",
      name: "Sarah Johnson",
      title: "Healthcare Professional"
    },
    {
      quote: "The medical chatbot is like having a knowledgeable friend available 24/7. It's been invaluable for quick health questions.",
      name: "Michael Chen",
      title: "Software Engineer"
    },
    {
      quote: "I love the health education videos. They've helped me make better lifestyle choices for my family's wellbeing.",
      name: "Emily Rodriguez",
      title: "Mother of Two"
    },
    {
      quote: "Finding nearby healthcare resources used to be a hassle. Now with HealerAi, I can locate specialists in seconds.",
      name: "David Thompson",
      title: "Retired Teacher"
    },
    {
      quote: "The personalized health insights have transformed how I approach my wellness routine. Highly recommend!",
      name: "Lisa Park",
      title: "Fitness Instructor"
    }
  ];

  // Add health metrics for the Why Choose HealerAi section
  const healthMetrics = [
    {
      title: "Personalized Insights",
      value: "AI-Powered",
      icon: Brain,
      trend: "95% Accuracy",
      trendDirection: "up" as const,
      color: "text-blue-500",
      description: "Get tailored health recommendations based on your unique profile"
    },
    {
      title: "24/7 Support",
      value: "Always Available",
      icon: Bot,
      trend: "100% Uptime",
      trendDirection: "up" as const,
      color: "text-green-500",
      description: "Access to AI health assistant anytime, anywhere"
    },
    {
      title: "Smart Notifications",
      value: "Personalized Alerts",
      icon: Bell,
      trend: "Opt-in",
      trendDirection: "stable" as const,
      color: "text-yellow-500",
      description: "Stay on top of your health with tailored reminders and alerts"
    },
    {
      title: "Resource Locator",
      value: "5000+ Centers",
      icon: MapPin,
      trend: "Nationwide",
      trendDirection: "stable" as const,
      color: "text-teal-500",
      description: "Find nearby healthcare services and specialists"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <div className="flex items-center">
              <HeartAnimation className="mr-3" size={32} />
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                HealerAi
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <GoogleTranslate />
            <ModeToggle />
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/40 backdrop-blur-sm border-r shadow-xl rounded-r-2xl transform transition-all duration-300 ease-in-out z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Collapse/Expand Button */}
        <div className="flex justify-end p-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        
        <nav className="px-2 space-y-2" aria-label="Main navigation">
          <div className="px-3 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Overview
          </div>
          <Link 
            to="/symptoms" 
            className={`relative flex items-center p-3 rounded-xl transition-all group ${
              currentPath === '/symptoms'
                ? 'bg-emerald-600/10 ring-1 ring-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : 'hover:bg-emerald-600/10 text-emerald-700 dark:text-emerald-300'
            }`}
            aria-label="Symptom Checker"
            title={sidebarCollapsed ? 'Symptom Checker' : undefined}
          >
            <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full transition-opacity ${currentPath === '/symptoms' ? 'bg-emerald-500 opacity-100' : 'opacity-0 group-hover:opacity-60 bg-emerald-400'}`}></span>
            <div className={`${sidebarCollapsed ? '' : 'mr-3'} p-2 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 group-hover:from-emerald-500/20 group-hover:to-teal-500/20 ${currentPath === '/symptoms' ? 'ring-1 ring-emerald-400/30' : ''}`}>
              <Stethoscope className="w-5 h-5" />
            </div>
            {!sidebarCollapsed && (
              <>
                <span className="font-medium">Symptom Checker</span>
                <Badge className="ml-auto bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Urgent</Badge>
                <ChevronRight className="ml-2 w-4 h-4 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-emerald-500" />
              </>
            )}
          </Link>
          
          <Link 
            to="/medical-bot" 
            className={`relative flex items-center p-3 rounded-xl transition-all group ${
              currentPath === '/medical-bot'
                ? 'bg-emerald-600/10 ring-1 ring-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : 'hover:bg-emerald-600/10 text-emerald-700 dark:text-emerald-300'
            }`}
            aria-label="Medical Bot"
            title={sidebarCollapsed ? 'Medical Bot' : undefined}
          >
            <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full transition-opacity ${currentPath === '/medical-bot' ? 'bg-emerald-500 opacity-100' : 'opacity-0 group-hover:opacity-60 bg-emerald-400'}`}></span>
            <div className={`${sidebarCollapsed ? '' : 'mr-3'} p-2 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 group-hover:from-emerald-500/20 group-hover:to-teal-500/20 ${currentPath === '/medical-bot' ? 'ring-1 ring-emerald-400/30' : ''}`}>
              <Bot className="w-5 h-5" />
            </div>
            {!sidebarCollapsed && (
              <>
                <span className="font-medium">Medical Bot</span>
                <ChevronRight className="ml-auto w-4 h-4 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-emerald-500" />
              </>
            )}
          </Link>
          
          <Link 
            to="/education" 
            className={`relative flex items-center p-3 rounded-xl transition-all group ${
              currentPath === '/education'
                ? 'bg-emerald-600/10 ring-1 ring-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : 'hover:bg-emerald-600/10 text-emerald-700 dark:text-emerald-300'
            }`}
            aria-label="Education"
            title={sidebarCollapsed ? 'Education' : undefined}
          >
            <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full transition-opacity ${currentPath === '/education' ? 'bg-emerald-500 opacity-100' : 'opacity-0 group-hover:opacity-60 bg-emerald-400'}`}></span>
            <div className={`${sidebarCollapsed ? '' : 'mr-3'} p-2 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 group-hover:from-emerald-500/20 group-hover:to-teal-500/20 ${currentPath === '/education' ? 'ring-1 ring-emerald-400/30' : ''}`}>
              <BookOpen className="w-5 h-5" />
            </div>
            {!sidebarCollapsed && (
              <>
                <span className="font-medium">Education</span>
                <ChevronRight className="ml-auto w-4 h-4 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-emerald-500" />
              </>
            )}
          </Link>
          
          <div className="mx-2 my-2 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
          <div className="px-3 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Explore
          </div>
          <Link 
            to="/health-hub" 
            className={`relative flex items-center p-3 rounded-xl transition-all group ${
              currentPath === '/health-hub'
                ? 'bg-emerald-600/10 ring-1 ring-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : 'hover:bg-emerald-600/10 text-emerald-700 dark:text-emerald-300'
            }`}
            aria-label="Health Hub"
            title={sidebarCollapsed ? 'Health Hub' : undefined}
          >
            <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full transition-opacity ${currentPath === '/health-hub' ? 'bg-emerald-500 opacity-100' : 'opacity-0 group-hover:opacity-60 bg-emerald-400'}`}></span>
            <div className={`${sidebarCollapsed ? '' : 'mr-3'} p-2 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 group-hover:from-emerald-500/20 group-hover:to-teal-500/20 ${currentPath === '/health-hub' ? 'ring-1 ring-emerald-400/30' : ''}`}>
              <Play className="w-5 h-5" />
            </div>
            {!sidebarCollapsed && (
              <>
                <span className="font-medium">Health Hub</span>
                <ChevronRight className="ml-auto w-4 h-4 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-emerald-500" />
              </>
            )}
          </Link>
          
          <Link 
            to="/resources" 
            className={`relative flex items-center p-3 rounded-xl transition-all group ${
              currentPath === '/resources'
                ? 'bg-emerald-600/10 ring-1 ring-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : 'hover:bg-emerald-600/10 text-emerald-700 dark:text-emerald-300'
            }`}
            aria-label="Resources"
            title={sidebarCollapsed ? 'Resources' : undefined}
          >
            <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full transition-opacity ${currentPath === '/resources' ? 'bg-emerald-500 opacity-100' : 'opacity-0 group-hover:opacity-60 bg-emerald-400'}`}></span>
            <div className={`${sidebarCollapsed ? '' : 'mr-3'} p-2 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 group-hover:from-emerald-500/20 group-hover:to-teal-500/20 ${currentPath === '/resources' ? 'ring-1 ring-emerald-400/30' : ''}`}>
              <FileText className="w-5 h-5" />
            </div>
            {!sidebarCollapsed && (
              <>
                <span className="font-medium">Resources</span>
                <ChevronRight className="ml-auto w-4 h-4 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-emerald-500" />
              </>
            )}
          </Link>
        </nav>
      </div>

      {/* Main Content - Full screen when sidebar is collapsed */}
      <div className={`${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} pt-4 transition-all duration-300`}>
        {/* Hero Section with Animation */}
        <section className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-700 to-teal-800 py-16 md:py-24 dark:from-green-900 dark:via-emerald-900 dark:to-teal-900">
          {/* Aceternity Spotlight Effect */}
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="rgba(16, 185, 129, 0.3)"
          />
          {/* Background Beams for modern effect */}
          <BackgroundBeams className="opacity-40" />
          
          {/* Floating elements for enhanced visual appeal */}
          <FloatingElement delay={0} className="absolute top-1/4 left-1/4">
            <PulsingOrb size={120} color="bg-green-400/30" />
          </FloatingElement>
          <FloatingElement delay={1} className="absolute top-1/3 right-1/4">
            <PulsingOrb size={100} color="bg-emerald-400/30" />
          </FloatingElement>
          <FloatingElement delay={2} className="absolute bottom-1/4 left-1/2">
            <PulsingOrb size={80} color="bg-teal-400/30" />
          </FloatingElement>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <motion.div 
                className="flex-1 text-center lg:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Empower Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-lime-300">Health Journey</span>
                </motion.h1>
                <motion.p 
                  className="text-xl text-green-100 mb-8 max-w-2xl dark:text-green-200"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Your all-in-one platform for symptom analysis, health education, and personalized wellness resources.
                </motion.p>
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <GradientButton 
                    size="lg" 
                    variant="primary"
                    className="gap-2 text-lg px-8 py-6 rounded-full shadow-xl"
                    aria-label="Get Started with Symptom Checker"
                  >
                    <a href="/symptoms" className="flex items-center">
                      Get Started Today
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </a>
                  </GradientButton>
                  <GradientButton 
                    size="lg" 
                    variant="secondary"
                    className="gap-2 text-lg px-8 py-6 rounded-full"
                    aria-label="Learn more about HealerAi"
                  >
                    Learn More
                    <Star className="w-5 h-5 ml-2" />
                  </GradientButton>
                </motion.div>
              </motion.div>
              <motion.div 
                className="flex-1 relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="relative">
                  <div className="absolute -top-6 -right-6 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:opacity-20"></div>
                  <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:opacity-20"></div>
                  <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl dark:bg-black/20 dark:border-white/10">
                    <LottieAnimation 
                      animationData={aiHealthAnimation}
                      className="w-64 h-64 mx-auto"
                      loop={true}
                      autoplay={true}
                      aria-label="Health animation"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Dashboard Content */}
        <main className="p-6 space-y-12">
          {/* Health Updates Ticker - Made more prominent */}
          <section aria-labelledby="health-updates-heading">
            <HealthUpdatesTicker />
          </section>

          {/* Quick Actions with Aceternity HoverEffect */}
          <section aria-labelledby="quick-actions-heading">
            <motion.h3 
              id="quick-actions-heading"
              className="text-2xl font-bold mb-2 flex items-center text-foreground"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Zap className="w-6 h-6 mr-2 text-yellow-500" />
              Quick Actions
            </motion.h3>
            <HoverEffect
              items={quickActions.map((action) => ({
                title: action.title,
                description: action.description,
                icon: <action.icon className="w-6 h-6" />,
                link: action.href,
                onClick: () => window.location.href = action.href,
              }))}
              className="gap-4"
            />
          </section>

          {/* Daily Health Insight */}
          <section aria-labelledby="daily-insight-heading">
            <DailyInsightCard />
          </section>

          {/* Features Section - Enhanced with health metrics */}
          <section className="py-12" aria-labelledby="features-heading">
            <div className="text-center mb-12">
              <motion.h2 
                id="features-heading"
                className="text-3xl md:text-4xl font-bold text-foreground mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Why Choose HealerAi?
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Comprehensive health management tools designed for your wellness journey
              </motion.p>
            </div>
            
            {/* Health Metrics Cards with SpotlightCard effect */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {healthMetrics.map((metric, index) => (
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
                  <SpotlightCard className="h-full" spotlightColor="rgba(16, 185, 129, 0.15)">
                    <HealthMetricCard
                      title={metric.title}
                      value={metric.value}
                      icon={metric.icon}
                      trend={metric.trend}
                      trendDirection={metric.trendDirection}
                      color={metric.color}
                      className="border-0 shadow-none bg-transparent"
                    />
                    <p className="text-center text-muted-foreground mt-3 text-sm">
                      {metric.description}
                    </p>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Testimonials Section with Infinite Moving Cards */}
          <section className="py-12" aria-labelledby="testimonials-heading">
            <div className="text-center mb-8">
              <motion.h2 
                id="testimonials-heading"
                className="text-3xl md:text-4xl font-bold text-foreground mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <TextGenerateEffect words="What Our Users Say" className="text-3xl md:text-4xl" />
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Join thousands of satisfied users who trust HealerAi for their health journey
              </motion.p>
            </div>
            <InfiniteMovingCards
              items={testimonials}
              direction="right"
              speed="slow"
              pauseOnHover={true}
              className="py-4"
            />
          </section>

          {/* CTA Section with Moving Border Button */}
          <section className="py-16 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Ready to Transform Your Health Journey?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Start using HealerAi today and take control of your wellness with AI-powered insights and personalized recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/symptoms">
                  <MovingBorderButton
                    duration={3000}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold px-8 py-4"
                  >
                    Get Started Free
                  </MovingBorderButton>
                </Link>
                <Link to="/education">
                  <Button variant="outline" size="lg" className="rounded-full px-8">
                    Learn More
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
