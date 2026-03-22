import { useState, useEffect, useRef } from "react";
import { Link, useLocation as useRouterLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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
  Clock,
  Users,
  ArrowRight,
  Menu,
  X,
  User,
  MessageCircle,
  Send,
  Minimize2,
  LogOut,
  Settings,
  Newspaper,
  Star,
  Video,
  Home,
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
import { GoogleTranslate } from "@/components/GoogleTranslate";
import { DailyInsightCard } from "@/components/DailyInsightCard";
import { HealthUpdatesTicker } from "@/components/HealthUpdatesTicker";
import { HealthAlertsPanel } from "@/components/HealthAlertsPanel";
import { LocationBasedHealthNews } from "@/components/LocationBasedHealthNews";
import { useUserLocation } from "@/hooks/useUserLocation";

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

// Floating Stat Card
const FloatingStatCard = ({ 
  stat, label, icon: Icon, delay, position 
}: { 
  stat: string; label: string; icon: React.ElementType; delay: number; position: string;
}) => (
  <motion.div
    className={cn(
      "absolute hidden lg:flex items-center gap-3 px-5 py-3.5 rounded-2xl",
      "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md",
      "border border-slate-200/60 dark:border-slate-700/40",
      "shadow-sm",
      position
    )}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: [0, -6, 0] }}
    transition={{ 
      opacity: { delay, duration: 0.8 },
      y: { delay: delay + 0.6, duration: 4, repeat: Infinity, ease: "easeInOut" },
    }}
  >
    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center">
      <Icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
    </div>
    <div>
      <p className="text-lg font-semibold text-slate-800 dark:text-white leading-none">{stat}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
    </div>
  </motion.div>
);

// AI Chat Bubble Component
const AIChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{role: "user" | "assistant", content: string}[]>([
    { role: "assistant", content: "Hello! I'm your AI health assistant. How can I help you today?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: message }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Thank you for your question. For detailed medical advice, please use our AI Symptom Checker or Medical Chatbot. Would you like me to direct you there?" 
      }]);
    }, 1000);
    setMessage("");
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full",
          "bg-teal-600 hover:bg-teal-700",
          "shadow-lg shadow-teal-600/20",
          "flex items-center justify-center",
          "transition-colors duration-200"
        )}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Chat"
      >
        {isOpen ? (
          <Minimize2 className="w-5 h-5 text-white" />
        ) : (
          <MessageCircle className="w-5 h-5 text-white" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed bottom-24 right-6 z-50 w-80 sm:w-[360px]",
              "bg-white dark:bg-slate-900 rounded-2xl",
              "border border-slate-200 dark:border-slate-700",
              "shadow-xl overflow-hidden"
            )}
          >
            <div className="bg-teal-600 p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">AI Health Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                    <p className="text-xs text-white/70">Online</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-60 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed",
                    msg.role === "user" 
                      ? "ml-auto bg-teal-600 text-white rounded-br-md"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-md"
                  )}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-slate-200 dark:border-slate-700">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 rounded-full text-sm h-9"
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button onClick={handleSend} size="icon" className="rounded-full bg-teal-600 hover:bg-teal-700 h-9 w-9">
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
              <Link to="/medical-bot" className="block mt-2" onClick={() => setIsOpen(false)}>
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

// Feature Card
const FeatureCard = ({ 
  icon: Icon, title, description, href, delay 
}: { 
  icon: React.ElementType; title: string; description: string; href: string; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <Link to={href}>
      <div className={cn(
        "group relative p-6 rounded-2xl h-full",
        "bg-white dark:bg-slate-800/60",
        "border border-slate-200/80 dark:border-slate-700/50",
        "shadow-sm hover:shadow-md",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1"
      )}>
        <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          {title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
          {description}
        </p>
        <div className="flex items-center text-teal-600 dark:text-teal-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Learn more
          <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  </motion.div>
);

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const userLocation = useUserLocation();
  const routerLocation = useRouterLocation();

  // Nav items with icons
  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Symptoms", path: "/symptoms", icon: Stethoscope },
    { name: "AI Chat", path: "/medical-bot", icon: Bot },
    { name: "Health Hub", path: "/health-hub", icon: Video },
    { name: "Education", path: "/education", icon: BookOpen },
    { name: "Resources", path: "/resources", icon: MapPin },
  ];

  const typewriterText = useTypewriter([
    "Symptoms Checker",
    "24/7 Medical Chatbot", 
    "Nearby Clinics",
    "Health Education",
    "Health Hub"
  ], 80, 40, 2000);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    { icon: Stethoscope, title: "Symptoms", description: "Advanced AI analysis to understand your symptoms with personalized health insights.", href: "/symptoms" },
    { icon: Bot, title: "Medical Chatbot", description: "24/7 AI health assistant for evidence-based medical guidance anytime you need it.", href: "/medical-bot" },
    { icon: BookOpen, title: "Health Education", description: "Curated articles, videos, and resources for informed health decisions.", href: "/education" },
    { icon: MapPin, title: "Find Clinics", description: "Locate nearby healthcare facilities, specialists, and emergency services.", href: "/resources" },
    { icon: Play, title: "Health Hub", description: "Curated health videos and wellness content from trusted medical professionals.", href: "/health-hub" },
    { icon: Shield, title: "Trusted Resources", description: "Verified health information from government and medical institutions.", href: "/resources" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#0C1210]">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav className={cn(
          "mx-3 sm:mx-4 mt-3 px-4 sm:px-6 py-2.5 rounded-2xl",
          "backdrop-blur-xl transition-all duration-300",
          scrolled
            ? "bg-white/90 dark:bg-slate-900/90 shadow-md border border-slate-200/60 dark:border-slate-700/40"
            : "bg-white/60 dark:bg-slate-900/40 border border-transparent"
        )}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:shadow-teal-600/40 transition-all duration-300">
                <Heart className="w-4.5 h-4.5 text-white" fill="currentColor" />
                <motion.div
                  className="absolute inset-0 rounded-xl bg-white/20"
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-black text-slate-800 dark:text-white tracking-tight">
                  Heal<span className="text-teal-600">AI</span>
                </span>
                <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500 tracking-widest uppercase">Health Intelligence</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => {
                const isActive = routerLocation.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30"
                        : "text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50/70 dark:hover:bg-teal-900/20"
                    )}
                  >
                    <item.icon className={cn("w-3.5 h-3.5", isActive ? "text-teal-600 dark:text-teal-400" : "")} />
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-xl bg-teal-100/60 dark:bg-teal-900/30 -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1.5">
              {/* Location indicator */}
              {userLocation.city && (
                <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800/40">
                  <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">{userLocation.city}</span>
                </div>
              )}

              <div className="hidden sm:block">
                <GoogleTranslate />
              </div>

              <ModeToggle />

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                      <Avatar className="w-7 h-7">
                        <AvatarImage src="/avatar.png" alt="User" />
                        <AvatarFallback className="bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 text-xs">
                          <User className="w-3.5 h-3.5" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuLabel className="text-xs">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-sm">
                      <User className="w-3.5 h-3.5 mr-2" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-sm">
                      <Settings className="w-3.5 h-3.5 mr-2" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-sm">
                      <Heart className="w-3.5 h-3.5 mr-2" /> Health Records
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsLoggedIn(false)} className="text-sm text-red-600 dark:text-red-400">
                      <LogOut className="w-3.5 h-3.5 mr-2" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setIsLoggedIn(true)}
                  size="sm"
                  className="rounded-full px-4 text-xs font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-sm shadow-teal-600/20"
                >
                  Sign In
                </Button>
              )}

              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className={cn(
                "mx-3 mt-2 p-3 rounded-xl md:hidden",
                "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl",
                "border border-slate-200/60 dark:border-slate-700/40",
                "shadow-xl"
              )}
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = routerLocation.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                        isActive
                          ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className={cn("w-4 h-4", isActive ? "text-teal-600 dark:text-teal-400" : "text-slate-400")} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
              {userLocation.city && (
                <div className="mt-2 px-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                  <MapPin className="w-3 h-3" />
                  {[userLocation.city, userLocation.region].filter(Boolean).join(", ")}
                </div>
              )}
              <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/40 px-3">
                <GoogleTranslate />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20">
        {/* Organic background - mesh gradient with soft shapes */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#FAFAF7] dark:bg-[#0C1210]" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-teal-100/40 dark:bg-teal-900/10 blur-[120px] -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-emerald-100/30 dark:bg-emerald-900/10 blur-[100px] translate-y-1/4 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-teal-50/50 dark:bg-teal-900/5 blur-[80px] -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Subtle grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px'
        }} />

        <motion.div style={{ opacity: heroOpacity }} className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/20 border border-teal-200/60 dark:border-teal-800/40 mb-8"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                Trusted by healthcare professionals
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-slate-800 dark:text-white mb-6 tracking-tight leading-[1.08]"
            >
              Your Health,{" "}
              <span className="relative">
                <span className="text-teal-600 dark:text-teal-400">Intelligently</span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5.5C40 2 80 2 100 4C120 6 160 3 199 5" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                </svg>
              </span>{" "}
              Understood
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="h-9 mb-8"
            >
              <span className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-light">
                {typewriterText}
                <span className="text-teal-500 animate-pulse">|</span>
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed"
            >
              Get instant symptom analysis, 24/7 medical guidance, 
              and connect with healthcare resources near you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link to="/symptoms">
                <Button 
                  size="lg"
                  className="rounded-full px-8 py-6 text-base font-medium bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/15 transition-all duration-200"
                >
                  Check Symptoms Now
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/health-hub">
                <Button 
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 py-6 text-base font-medium border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                >
                  Explore Health Hub
                </Button>
              </Link>
            </motion.div>

            {/* Subtle trust line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-12 flex items-center justify-center gap-6 text-slate-400 dark:text-slate-500"
            >
              <div className="flex items-center gap-1.5 text-xs">
                <Shield className="w-3.5 h-3.5" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="w-px h-3 bg-slate-300 dark:bg-slate-700" />
              <div className="flex items-center gap-1.5 text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>24/7 Available</span>
              </div>
              <div className="w-px h-3 bg-slate-300 dark:bg-slate-700" />
              <div className="flex items-center gap-1.5 text-xs">
                <Users className="w-3.5 h-3.5" />
                <span>10M+ Users</span>
              </div>
            </motion.div>
          </div>

          {/* Floating Stats */}
          <FloatingStatCard stat="10M+" label="Consultations" icon={Activity} delay={0.9} position="top-20 left-[5%]" />
          <FloatingStatCard stat="150+" label="Conditions" icon={Brain} delay={1.1} position="top-40 right-[6%]" />
          <FloatingStatCard stat="24/7" label="Available" icon={Clock} delay={1.3} position="bottom-28 left-[8%]" />
        </motion.div>
      </section>

      {/* Daily Insights & Health Updates Section */}
      <section className="py-12 border-t border-slate-200/60 dark:border-slate-800/40">
        <div className="container mx-auto px-4">
          {/* Location banner */}
          {userLocation.city && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/40 w-fit mx-auto"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                Showing personalized insights for {[userLocation.city, userLocation.region, userLocation.country].filter(Boolean).join(", ")}
              </span>
            </motion.div>
          )}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Daily Insight */}
            <div className="lg:col-span-2">
              {!userLocation.loading && (
                <DailyInsightCard location={{ city: userLocation.city, region: userLocation.region, country: userLocation.country }} />
              )}
            </div>
            {/* Health Updates Ticker */}
            <div className="lg:col-span-3">
              {!userLocation.loading && (
                <HealthUpdatesTicker location={{ city: userLocation.city, region: userLocation.region, country: userLocation.country }} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 bg-white dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "10M+", label: "Health Consultations", icon: Activity },
              { value: "150+", label: "Conditions Covered", icon: Stethoscope },
              { value: "24/7", label: "Always Available", icon: Clock },
              { value: "98%", label: "User Satisfaction", icon: Star }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/20 mb-2">
                  <stat.icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-0.5">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1 text-xs bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border-0">
              Features
            </Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              Everything You Need for Better Health
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Comprehensive tools designed to empower your health journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} delay={index * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* Health Alerts & Location News Section */}
      <section className="py-12 md:py-16 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-0">
              <Newspaper className="w-3 h-3 mr-1 inline" />
              Live Updates
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-3">
              Health Alerts & Local News
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Stay informed with real-time health alerts and location-specific updates.
            </p>
          </motion.div>

          <HealthAlertsPanel className="mb-8" />
          <LocationBasedHealthNews className="rounded-2xl" />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-0">
              How It Works
            </Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">
              Three Simple Steps
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Describe Symptoms", description: "Tell our AI about your symptoms using natural language or the interactive body map.", icon: Activity },
              { step: "02", title: "Get AI Analysis", description: "Receive instant, personalized health insights powered by advanced medical AI.", icon: Brain },
              { step: "03", title: "Take Action", description: "Connect with healthcare providers or access resources for your health needs.", icon: Zap }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.12 }}
                className="text-center"
              >
                <div className="relative inline-flex mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
                    <item.icon className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center bg-teal-600 dark:bg-teal-700"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to Take Control of Your Health?
              </h2>
              <p className="text-base text-white/75 max-w-lg mx-auto mb-8">
                Join millions who trust HealAI. Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/symptoms">
                  <Button size="lg" className="rounded-full px-8 py-6 text-base font-medium bg-white text-teal-700 hover:bg-white/90 shadow-md">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
                <Link to="/health-hub">
                  <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-base font-medium border-white/30 text-white hover:bg-white/10">
                    Explore Health Hub
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-200/60 dark:border-slate-800/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-teal-600 flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-base font-bold text-slate-800 dark:text-white">
                Heal<span className="text-teal-600">AI</span>
              </span>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-slate-500 dark:text-slate-400">
              {[
                { name: "Health Hub", path: "/health-hub" },
                { name: "Symptoms", path: "/symptoms" },
                { name: "Education", path: "/education" },
                { name: "Resources", path: "/resources" },
              ].map((link) => (
                <Link key={link.name} to={link.path} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  {link.name}
                </Link>
              ))}
              <span className="cursor-default">Privacy</span>
              <span className="cursor-default">Terms</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
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
