import { useState, useEffect, useRef, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Info, 
  TrendingUp, 
  Shield, 
  Bell,
  ChevronRight,
  X,
  MapPin,
  Play
} from "lucide-react";

interface HealthUpdate {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  category: "news" | "advisory" | "campaign" | "awareness";
  location: string;
  priority: "low" | "medium" | "high" | "critical";
  tags: string[];
}

// Hardcoded fallback health updates data
const FALLBACK_HEALTH_UPDATES: HealthUpdate[] = [
  {
    id: "fallback-1",
    title: "Covid-19 Monitoring and Alerts",
    summary: "Reports indicate ongoing Covid-19 cases with recent fatalities. A sub-variant strain JN.1 of Omicron has been detected in recent cases. Health authorities continue to urge adherence to Covid-19 protocols, increased testing, and vaccination to control transmission during public gatherings and seasonal events.",
    source: "National Health Department",
    publishedAt: new Date().toISOString().split('T')[0],
    url: "https://health.gov/",
    category: "advisory",
    location: "General",
    priority: "high",
    tags: ["covid-19", "JN.1", "vaccination", "testing"]
  },
  {
    id: "fallback-2",
    title: "Doctor Shortage in Government Facilities",
    summary: "A critical shortage of doctors persists in government hospitals, with thousands of medical officer positions vacant nationwide. This shortage could strain healthcare delivery, especially in peak illness seasons. Recruitment and incentives are under discussion.",
    source: "National Health Department",
    publishedAt: new Date().toISOString().split('T')[0],
    url: "https://health.gov/",
    category: "news",
    location: "General",
    priority: "high",
    tags: ["doctor shortage", "government hospitals", "recruitment"]
  },
  {
    id: "fallback-3",
    title: "Heavy Rainfall Alert and Preparedness",
    summary: "Many regions are under high alert for heavy rainfall and potential flooding. Health departments have issued warnings for vector-borne diseases like dengue and malaria, which tend to spike after rains, along with other communicable diseases.",
    source: "National Disaster Management Authority",
    publishedAt: new Date().toISOString().split('T')[0],
    url: "https://ndma.gov/",
    category: "advisory",
    location: "General",
    priority: "critical",
    tags: ["rainfall", "flooding", "dengue", "malaria", "vector-borne diseases"]
  },
  {
    id: "fallback-4",
    title: "Unified Health Insurance Rollout",
    summary: "A unified health insurance scheme has been launched offering cashless treatment for millions of families, promoting wider healthcare access. This initiative aims to improve financial protection against health emergencies for residents nationwide.",
    source: "National Health Department",
    publishedAt: new Date().toISOString().split('T')[0],
    url: "https://health.gov/",
    category: "news",
    location: "General",
    priority: "medium",
    tags: ["health insurance", "cashless treatment", "financial protection"]
  },
  {
    id: "fallback-5",
    title: "Focus on Traditional Medicine",
    summary: "With rising health challenges, there is a push to strengthen Ayurveda and AYUSH systems for preventive and holistic healthcare. Expanded traditional medicine services create additional care options amidst ongoing public health concerns.",
    source: "National AYUSH Department",
    publishedAt: new Date().toISOString().split('T')[0],
    url: "https://ayush.gov/",
    category: "awareness",
    location: "General",
    priority: "medium",
    tags: ["Ayurveda", "AYUSH", "preventive care", "holistic healthcare"]
  },
  {
    id: "fallback-6",
    title: "Preparations for Increased Healthcare Demands",
    summary: "Healthcare systems are being upgraded with increased bed capacity and facility improvements to better serve communities during seasonal health challenges and increased demand periods.",
    source: "National Health Department",
    publishedAt: new Date().toISOString().split('T')[0],
    url: "https://health.gov/",
    category: "news",
    location: "General",
    priority: "medium",
    tags: ["hospital upgrade", "healthcare infrastructure", "capacity expansion"]
  }
];

// New component for health update card
const HealthUpdateCard = forwardRef<HTMLDivElement, { 
  update: HealthUpdate; 
  isActive: boolean;
  index: number;
  total: number;
  onClick: () => void;
}>(({
  update, 
  isActive,
  index,
  total,
  onClick 
}, ref) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'from-red-600 to-red-800';
      case 'high':
        return 'from-orange-500 to-orange-700';
      case 'medium':
        return 'from-yellow-500 to-yellow-700';
      case 'low':
        return 'from-emerald-500 to-teal-700';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'advisory':
        return 'bg-orange-500';
      case 'emergency':
        return 'bg-red-500';
      case 'campaign':
        return 'bg-blue-500';
      case 'awareness':
        return 'bg-green-500';
      case 'news':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Generate gradient based on index for visual variety - using green theme like other cards
  const getCardGradient = (index: number) => {
    const gradients = [
      'from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30',
      'from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30',
      'from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30',
      'from-emerald-100/30 to-teal-100/30 dark:from-emerald-900/20 dark:to-teal-900/20',
      'from-green-100/30 to-emerald-100/30 dark:from-green-900/20 dark:to-emerald-900/20',
      'from-teal-100/30 to-cyan-100/30 dark:from-teal-900/20 dark:to-cyan-900/20'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div
      ref={ref}
      className={`flex-shrink-0 w-80 mr-4 rounded-2xl overflow-hidden shadow-xl border cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
        isActive ? 'ring-4 ring-emerald-500 scale-105' : ''
      } bg-gradient-to-br ${getCardGradient(index)}`}
      onClick={onClick}
    >
      <motion.div
        initial={{ 
          opacity: 0, 
          x: 100,
          rotateY: -15
        }}
        animate={{ 
          opacity: 1, 
          x: 0,
          rotateY: 0
        }}
        exit={{ 
          opacity: 0, 
          x: -100,
          rotateY: 15
        }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        whileHover={{ 
          y: -10,
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Card Header with Gradient */}
        <div className={`h-2 bg-gradient-to-r ${getPriorityColor(update.priority)}`}></div>
        
        {/* Card Content */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-foreground line-clamp-2 leading-tight">
              {update.title}
            </h3>
            <div className={`w-3 h-3 rounded-full ${getCategoryColor(update.category)}`}></div>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {update.location}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(update.publishedAt).toLocaleDateString()}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {update.summary}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {update.tags.slice(0, 3).map((tag, tagIndex) => (
              <Badge key={tagIndex} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <Badge variant="default" className="text-xs">
              {update.category.charAt(0).toUpperCase() + update.category.slice(1)}
            </Badge>
            <div className="flex items-center">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Play className="w-4 h-4" />
              </Button>
              <a 
                href={update.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline ml-2"
                onClick={(e) => e.stopPropagation()}
              >
                Details
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

HealthUpdateCard.displayName = 'HealthUpdateCard';

interface HealthUpdatesTickerProps {
  className?: string;
  onViewAll?: () => void;
}

export function HealthUpdatesTicker({ className, onViewAll }: HealthUpdatesTickerProps) {
  const [updates] = useState<HealthUpdate[]>(FALLBACK_HEALTH_UPDATES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!isPaused && isVisible && updates.length > 0) {
      // Changed to 4 seconds per card for better viewing
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % updates.length);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, isVisible, updates]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'from-red-600 to-red-800';
      case 'high':
        return 'from-orange-500 to-orange-700';
      case 'medium':
        return 'from-yellow-500 to-yellow-700';
      case 'low':
        return 'from-emerald-500 to-teal-700';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };

  // Don't render the ticker if it's hidden
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative rounded-3xl bg-gradient-to-r from-emerald-50/80 to-teal-50/50 dark:from-emerald-900/30 dark:to-teal-900/20 backdrop-blur-sm p-6 shadow-xl border border-emerald-200/50 dark:border-emerald-800/50 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <motion.h2 
          className="text-2xl font-bold text-foreground flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mr-3">
            <Bell className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            <motion.span 
              className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          Health Updates
        </motion.h2>
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-4 text-sm rounded-full border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
            onClick={onViewAll}
          >
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
            onClick={() => setIsVisible(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>

      {/* Netflix-style Carousel */}
      <div className="relative">
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto pb-6 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          <AnimatePresence mode="popLayout">
            {updates.map((update, index) => (
              <HealthUpdateCard 
                key={update.id}
                update={update}
                isActive={index === currentIndex}
                index={index}
                total={updates.length}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </AnimatePresence>
        </div>
        
        {/* Progress Indicator */}
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            {updates.map((_, index) => (
              <motion.div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index === currentIndex 
                    ? 'bg-emerald-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                animate={{
                  scale: index === currentIndex ? 1.3 : 1,
                  backgroundColor: index === currentIndex ? '#10b981' : '#d1d5db'
                }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.5 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Auto-progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-b-3xl"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ 
          duration: isPaused ? 0 : 4,
          ease: "linear"
        }}
      />
    </motion.div>
  );
}