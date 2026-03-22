import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Bot, 
  BookOpen, 
  Heart, 
  Brain, 
  ChevronRight,
  Stethoscope,
  Shield,
  Zap,
  MapPin,
  Play,
  Sparkles,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  Sun,
  Moon,
  Menu,
  X,
  Globe,
  User,
  MessageCircle,
  Send,
  Minimize2,
  LogOut,
  Settings,
  ChevronDown
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

// Typewriter effect hook
const useTypewriter = (words: string[], typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < word.length) {
          setCurrentText(word.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return currentText;
};

// Floating Stat Card Component
const FloatingStatCard = ({ 
  stat, 
  label, 
  delay, 
  position 
}: { 
  stat: string; 
  label: string; 
  delay: number; 
  position: string;
}) => (
  <motion.div
    className={cn(
      "absolute hidden lg:flex items-center gap-3 px-5 py-3 rounded-2xl",
      "bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl",
      "border border-white/20 dark:border-slate-700/50",
      "shadow-[0_8px_32px_rgba(0,0,0,0.08)]",
      position
    )}
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ 
      opacity: 1, 
      y: [0, -8, 0], 
      scale: 1,
    }}
    transition={{ 
      opacity: { delay, duration: 0.6 },
      y: { delay: delay + 0.5, duration: 3, repeat: Infinity, ease: "easeInOut" },
      scale: { delay, duration: 0.6 }
    }}
  >
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
      <CheckCircle2 className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-lg font-bold text-slate-800 dark:text-white">{stat}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  </motion.div>
);

// Particle Background Component
const ParticleBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full bg-teal-500/[0.08]"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, Math.random() * 20 - 10, 0],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{
          duration: 4 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// Gradient Mesh Background
const GradientMeshBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-teal-400/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-emerald-400/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-teal-300/10 to-emerald-300/10 rounded-full blur-3xl" />
  </div>
);

// Feature Card Component
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  href, 
  gradient,
  delay 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  href: string;
  gradient: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <Link to={href}>
      <div className={cn(
        "group relative p-6 rounded-2xl h-full",
        "bg-white dark:bg-slate-800/50",
        "border border-slate-200/50 dark:border-slate-700/50",
        "shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)]",
        "hover:shadow-[0_1px_3px_rgba(0,0,0,0.06),0_16px_48px_rgba(0,0,0,0.12)]",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-2"
      )}>
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center mb-5",
          "bg-gradient-to-br", gradient
        )}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
          {description}
        </p>
        <div className="flex items-center text-teal-600 dark:text-teal-400 text-sm font-medium">
          Explore
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  </motion.div>
);

// Languages data
const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "pt", name: "Portuguese", flag: "🇧🇷" },
];

// AI Chat Bubble Component
const AIChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{role: "user" | "assistant", content: string}[]>([
    { role: "assistant", content: "Hello! I'm your AI health assistant. How can I help you today?" }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: message }]);
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Thank you for your question. For detailed medical advice, please use our AI Symptom Checker or Medical Chatbot features. Would you like me to direct you there?" 
      }]);
    }, 1000);
    setMessage("");
  };

  return (
    <>
      {/* Chat Bubble Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full",
          "bg-gradient-to-r from-teal-500 to-emerald-500",
          "shadow-lg shadow-teal-500/30",
          "flex items-center justify-center",
          "hover:scale-110 transition-transform duration-200"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <Minimize2 className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              "fixed bottom-24 right-6 z-50 w-80 sm:w-96",
              "bg-white dark:bg-slate-900 rounded-2xl",
              "border border-slate-200 dark:border-slate-700",
              "shadow-2xl overflow-hidden"
            )}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Health Assistant</h3>
                  <p className="text-xs text-white/80">Online - Ready to help</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm",
                    msg.role === "user" 
                      ? "ml-auto bg-teal-500 text-white rounded-br-md"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-md"
                  )}
                >
                  {msg.content}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 rounded-full"
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="rounded-full bg-teal-500 hover:bg-teal-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <Link to="/medical-bot" className="block mt-2">
                <p className="text-xs text-center text-teal-600 dark:text-teal-400 hover:underline">
                  Open full AI Medical Chat
                </p>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(LANGUAGES[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const typewriterText = useTypewriter([
    "AI Symptom Checker",
    "24/7 Medical Chatbot", 
    "Nearby Clinics",
    "Health Education"
  ], 80, 40, 2000);

  const features = [
    {
      icon: Stethoscope,
      title: "AI Symptom Checker",
      description: "Advanced AI-powered analysis to understand your symptoms and get personalized health insights.",
      href: "/symptoms",
      gradient: "from-teal-500 to-emerald-500"
    },
    {
      icon: Bot,
      title: "Medical Chatbot",
      description: "24/7 AI health assistant ready to answer your medical questions with evidence-based responses.",
      href: "/medical-bot",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: BookOpen,
      title: "Health Education",
      description: "Curated articles, videos, and resources to help you make informed health decisions.",
      href: "/education",
      gradient: "from-teal-600 to-cyan-500"
    },
    {
      icon: MapPin,
      title: "Find Clinics",
      description: "Locate nearby healthcare facilities, specialists, and emergency services in your area.",
      href: "/resources",
      gradient: "from-cyan-500 to-teal-500"
    },
    {
      icon: Play,
      title: "Health Hub",
      description: "Watch curated health videos and wellness courses from trusted medical professionals.",
      href: "/health-hub",
      gradient: "from-emerald-600 to-green-500"
    },
    {
      icon: Shield,
      title: "Trusted Resources",
      description: "Access verified health information from government and medical institutions.",
      href: "/resources",
      gradient: "from-teal-500 to-emerald-600"
    }
  ];

  const stats = [
    { value: "10M+", label: "Health Consultations" },
    { value: "150+", label: "Conditions Covered" },
    { value: "24/7", label: "Always Available" },
    { value: "98%", label: "User Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#0A0F0E]">
      {/* Glassmorphism Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav className={cn(
          "mx-4 mt-4 px-6 py-3 rounded-full",
          "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl",
          "border border-white/20 dark:border-slate-800/50",
          "shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)]"
        )}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800 dark:text-white">
                Heal<span className="text-teal-600 dark:text-teal-400">AI</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/symptoms" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Symptoms
              </Link>
              <Link to="/medical-bot" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                AI Chat
              </Link>
              <Link to="/health-hub" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Health Hub
              </Link>
              <Link to="/education" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Education
              </Link>
              <Link to="/resources" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Resources
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1.5 px-2">
                    <Globe className="w-4 h-4" />
                    <span className="text-xs">{currentLanguage.flag}</span>
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel>Language</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {LANGUAGES.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setCurrentLanguage(lang)}
                      className={cn(
                        "cursor-pointer",
                        currentLanguage.code === lang.code && "bg-teal-50 dark:bg-teal-900/30"
                      )}
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <ModeToggle />

              {/* Profile / Auth */}
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/avatar.png" alt="User" />
                        <AvatarFallback className="bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Heart className="w-4 h-4 mr-2" />
                      Health Records
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsLoggedIn(false)} className="text-red-600 dark:text-red-400">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={() => setIsLoggedIn(true)}
                  className={cn(
                    "rounded-full px-5 font-semibold text-sm",
                    "bg-gradient-to-r from-teal-500 to-emerald-500",
                    "hover:from-teal-600 hover:to-emerald-600",
                    "text-white shadow-lg shadow-teal-500/25",
                    "transition-all duration-300"
                  )}
                >
                  Sign In
                </Button>
              )}

              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "mx-4 mt-2 p-4 rounded-2xl md:hidden",
                "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl",
                "border border-white/20 dark:border-slate-800/50",
                "shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
              )}
            >
              <div className="flex flex-col gap-2">
                {[
                  { name: "Symptoms", path: "/symptoms" },
                  { name: "AI Chat", path: "/medical-bot" },
                  { name: "Health Hub", path: "/health-hub" },
                  { name: "Education", path: "/education" },
                  { name: "Resources", path: "/resources" }
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {/* Mobile Language Selector */}
                <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 mt-2">
                  <p className="text-xs text-slate-500 mb-2">Language</p>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.slice(0, 4).map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setCurrentLanguage(lang)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm flex items-center gap-1",
                          currentLanguage.code === lang.code 
                            ? "bg-teal-500 text-white" 
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        )}
                      >
                        {lang.flag} {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20">
        <GradientMeshBackground />
        <ParticleBackground />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 mb-8"
            >
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                AI-Powered Healthcare Platform
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 dark:text-white mb-6 tracking-tight leading-[1.1]"
            >
              Your Health,{" "}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                Intelligently
              </span>{" "}
              Understood
            </motion.h1>

            {/* Typewriter Subheading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-10 mb-8"
            >
              <span className="text-xl md:text-2xl text-slate-600 dark:text-slate-400">
                {typewriterText}
                <span className="animate-pulse">|</span>
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Experience healthcare reimagined with cutting-edge AI. Get instant symptom analysis, 
              24/7 medical guidance, and connect with healthcare resources near you.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/symptoms">
                <Button 
                  size="lg"
                  className={cn(
                    "rounded-full px-8 py-6 text-lg font-semibold",
                    "bg-gradient-to-r from-teal-500 to-emerald-500",
                    "hover:from-teal-600 hover:to-emerald-600",
                    "text-white shadow-xl shadow-teal-500/30",
                    "transition-all duration-300",
                    "animate-pulse hover:animate-none"
                  )}
                >
                  Check Symptoms Now
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/education">
                <Button 
                  variant="outline"
                  size="lg"
                  className={cn(
                    "rounded-full px-8 py-6 text-lg font-semibold",
                    "border-2 border-slate-300 dark:border-slate-700",
                    "text-slate-700 dark:text-slate-300",
                    "hover:bg-slate-100 dark:hover:bg-slate-800",
                    "transition-all duration-300"
                  )}
                >
                  Explore Features
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Floating Stat Cards */}
          <FloatingStatCard 
            stat="10M+" 
            label="Consultations" 
            delay={0.8} 
            position="top-32 left-[5%]"
          />
          <FloatingStatCard 
            stat="150+" 
            label="Conditions Covered" 
            delay={1.0} 
            position="top-48 right-[8%]"
          />
          <FloatingStatCard 
            stat="24/7" 
            label="Available" 
            delay={1.2} 
            position="bottom-32 left-[10%]"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-6">
              Everything You Need for{" "}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                Better Health
              </span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Comprehensive health tools designed to empower you with knowledge and connect you with care.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-teal-50/50 to-transparent dark:from-teal-900/10 dark:to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-6">
              Simple Steps to{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Better Health
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Describe Symptoms", description: "Tell our AI about your symptoms using natural language or our interactive body map.", icon: Activity },
              { step: "02", title: "Get AI Analysis", description: "Receive instant, personalized health insights powered by advanced medical AI.", icon: Brain },
              { step: "03", title: "Take Action", description: "Connect with healthcare providers, access resources, or learn more about your health.", icon: Zap }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="relative inline-flex mb-6">
                    <div className={cn(
                      "w-20 h-20 rounded-3xl flex items-center justify-center",
                      "bg-gradient-to-br from-teal-500 to-emerald-500"
                    )}>
                      <item.icon className="w-10 h-10 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-800 dark:bg-white text-white dark:text-slate-800 text-sm font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={cn(
              "relative overflow-hidden rounded-3xl p-12 md:p-16 text-center",
              "bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700"
            )}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Health Journey?
              </h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
                Join millions of users who trust HealAI for their health needs. Start your journey to better health today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/symptoms">
                  <Button 
                    size="lg"
                    className={cn(
                      "rounded-full px-10 py-6 text-lg font-semibold",
                      "bg-white text-teal-600",
                      "hover:bg-white/90",
                      "shadow-xl",
                      "transition-all duration-300"
                    )}
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/education">
                  <Button 
                    variant="outline"
                    size="lg"
                    className={cn(
                      "rounded-full px-10 py-6 text-lg font-semibold",
                      "border-2 border-white/30 text-white",
                      "hover:bg-white/10",
                      "transition-all duration-300"
                    )}
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-800 dark:text-white">
                Heal<span className="text-teal-600 dark:text-teal-400">AI</span>
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
              <Link to="/health-hub" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Health Hub
              </Link>
              <Link to="/education" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Education
              </Link>
              <Link to="/resources" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Resources
              </Link>
              <span>Privacy</span>
              <span>Terms</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              2024 HealAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* AI Chat Bubble */}
      <AIChatBubble />
    </div>
  );
};

export default Index;
