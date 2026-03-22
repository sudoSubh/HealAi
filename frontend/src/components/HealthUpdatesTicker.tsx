import { useState, useEffect, useRef, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  ChevronRight,
  X,
  MapPin,
  Play,
  RefreshCw,
} from "lucide-react";
import { callGemini } from "@/services/gemini";

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

async function fetchGeminiHealthUpdates(
  location?: { city?: string | null; region?: string | null; country?: string | null }
): Promise<HealthUpdate[]> {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const locationStr =
    location?.city || location?.region || location?.country
      ? `${[location.city, location.region, location.country].filter(Boolean).join(", ")}`
      : "General";

  const prompt = `Today is ${today}. Generate 6 current, realistic health updates for ${locationStr}.
Return ONLY a JSON array (no markdown, no code blocks) of 6 objects with these exact keys:
id (string), title (string), summary (string 1-2 sentences), source (string), publishedAt ("${new Date().toISOString().split("T")[0]}"), url ("https://health.gov/"), category (one of: news, advisory, campaign, awareness), location ("${locationStr}"), priority (one of: low, medium, high, critical), tags (array of 3 strings).
Make the updates relevant to today's date, current season, and the location if given. Include a mix of local disease alerts, wellness campaigns, and health advisories.
Return ONLY the raw JSON array starting with [ and ending with ].`;

  const text = await callGemini(prompt);
  const jsonStart = text.indexOf("[");
  const jsonEnd = text.lastIndexOf("]") + 1;
  const jsonString = text.substring(jsonStart, jsonEnd);
  return JSON.parse(jsonString) as HealthUpdate[];
}

const FALLBACK_HEALTH_UPDATES: HealthUpdate[] = [
  {
    id: "fallback-1",
    title: "Covid-19 Sub-variant JN.1 Monitoring",
    summary: "Health authorities continue to urge adherence to Covid-19 protocols and vaccination to control transmission.",
    source: "National Health Department",
    publishedAt: new Date().toISOString().split("T")[0],
    url: "https://health.gov/",
    category: "advisory",
    location: "General",
    priority: "high",
    tags: ["covid-19", "JN.1", "vaccination"],
  },
  {
    id: "fallback-2",
    title: "Seasonal Flu Vaccination Drive",
    summary: "Annual flu vaccination campaigns are underway nationwide. Eligible groups are encouraged to get vaccinated early.",
    source: "CDC",
    publishedAt: new Date().toISOString().split("T")[0],
    url: "https://cdc.gov/",
    category: "campaign",
    location: "General",
    priority: "medium",
    tags: ["flu", "vaccination", "prevention"],
  },
  {
    id: "fallback-3",
    title: "Mental Health Awareness Week",
    summary: "This week focuses on reducing stigma around mental health and promoting access to counseling services.",
    source: "WHO",
    publishedAt: new Date().toISOString().split("T")[0],
    url: "https://who.int/",
    category: "awareness",
    location: "Global",
    priority: "medium",
    tags: ["mental health", "awareness", "counseling"],
  },
  {
    id: "fallback-4",
    title: "Dengue Alert: High Mosquito Activity",
    summary: "Health departments warn of increased dengue risk due to recent rainfall. Use repellent and eliminate standing water.",
    source: "Local Health Authority",
    publishedAt: new Date().toISOString().split("T")[0],
    url: "https://health.gov/",
    category: "advisory",
    location: "General",
    priority: "critical",
    tags: ["dengue", "mosquito", "prevention"],
  },
  {
    id: "fallback-5",
    title: "Free Health Screening Camps",
    summary: "Community health screening camps offer free blood pressure, diabetes, and vision checks this month.",
    source: "Community Health Board",
    publishedAt: new Date().toISOString().split("T")[0],
    url: "https://health.gov/",
    category: "campaign",
    location: "General",
    priority: "low",
    tags: ["screening", "free", "community"],
  },
  {
    id: "fallback-6",
    title: "Air Quality Advisory",
    summary: "Elevated pollution levels forecast for this week. Sensitive groups should limit outdoor activity during peak hours.",
    source: "Environment Agency",
    publishedAt: new Date().toISOString().split("T")[0],
    url: "https://health.gov/",
    category: "advisory",
    location: "General",
    priority: "high",
    tags: ["air quality", "pollution", "respiratory"],
  },
];

const HealthUpdateCard = forwardRef<
  HTMLDivElement,
  {
    update: HealthUpdate;
    isActive: boolean;
    index: number;
    onClick: () => void;
  }
>(({ update, isActive, index, onClick }, ref) => {
  const getPriorityGradient = (priority: string) => {
    switch (priority) {
      case "critical": return "from-red-600 to-red-800";
      case "high": return "from-orange-500 to-orange-700";
      case "medium": return "from-yellow-500 to-yellow-700";
      case "low": return "from-emerald-500 to-teal-700";
      default: return "from-gray-500 to-gray-700";
    }
  };

  const getCategoryDot = (category: string) => {
    switch (category) {
      case "advisory": return "bg-orange-500";
      case "campaign": return "bg-blue-500";
      case "awareness": return "bg-green-500";
      case "news": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const gradients = [
    "from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30",
    "from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30",
    "from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30",
    "from-emerald-100/30 to-teal-100/30 dark:from-emerald-900/20 dark:to-teal-900/20",
    "from-green-100/30 to-emerald-100/30 dark:from-green-900/20 dark:to-emerald-900/20",
    "from-teal-100/30 to-cyan-100/30 dark:from-teal-900/20 dark:to-cyan-900/20",
  ];

  return (
    <div
      ref={ref}
      className={`flex-shrink-0 w-80 mr-4 rounded-2xl overflow-hidden shadow-xl border cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${gradients[index % gradients.length]} ${isActive ? "ring-4 ring-emerald-500 scale-105" : ""}`}
      onClick={onClick}
    >
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={`h-2 bg-gradient-to-r ${getPriorityGradient(update.priority)}`} />
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-foreground line-clamp-2 leading-tight pr-2">
              {update.title}
            </h3>
            <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${getCategoryDot(update.category)}`} />
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
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{update.summary}</p>
          <div className="flex flex-wrap gap-1 mb-4">
            {update.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
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
HealthUpdateCard.displayName = "HealthUpdateCard";

interface HealthUpdatesTickerProps {
  className?: string;
  onViewAll?: () => void;
  location?: { city?: string | null; region?: string | null; country?: string | null };
}

export function HealthUpdatesTicker({ className, onViewAll, location }: HealthUpdatesTickerProps) {
  const [updates, setUpdates] = useState<HealthUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const locationKey = [location?.city, location?.region, location?.country].filter(Boolean).join("-") || "";

  const loadUpdates = async (force = false) => {
    setLoading(true);
    // Use the resolved location key for caching; fall back to "general" only if truly no location
    const resolvedKey = locationKey || "general";
    const cacheKey = `healthUpdates_${resolvedKey}`;
    if (!force) {
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw) {
        try {
          const { data, timestamp } = JSON.parse(cachedRaw);
          const oneDay = 24 * 60 * 60 * 1000;
          if (Date.now() - timestamp < oneDay) {
            setUpdates(data);
            setLoading(false);
            return;
          }
        } catch {
          // ignore
        }
      }
    }
    try {
      const data = await fetchGeminiHealthUpdates(location);
      const resolvedCacheKey = `healthUpdates_${resolvedKey}`;
      localStorage.setItem(resolvedCacheKey, JSON.stringify({ data, timestamp: Date.now() }));
      setUpdates(data);
    } catch {
      setUpdates(FALLBACK_HEALTH_UPDATES);
    } finally {
      setLoading(false);
    }
  };

  // Only run when locationKey has a real value (city/region/country resolved)
  // If locationKey is empty it means location hasn't loaded yet — wait for it
  useEffect(() => {
    loadUpdates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationKey]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isPaused && isVisible && updates.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % updates.length);
      }, 4500);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, isVisible, updates]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-3xl bg-gradient-to-r from-emerald-50/80 to-teal-50/50 dark:from-emerald-900/30 dark:to-teal-900/20 backdrop-blur-sm p-6 shadow-xl border border-emerald-200/50 dark:border-emerald-800/50 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.h2
          className="text-2xl font-bold text-foreground flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
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
          {location?.city && (
            <span className="ml-2 text-sm font-normal text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {location.city}
            </span>
          )}
        </motion.h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
            onClick={() => loadUpdates(true)}
            title="Refresh updates"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
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
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-40 gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="w-6 h-6 text-emerald-500" />
          </motion.div>
          <p className="text-sm text-muted-foreground">
            {location?.city ? `Fetching health updates for ${location.city}…` : "Generating health updates…"}
          </p>
        </div>
      ) : (
        <>
          <div
            className="flex overflow-x-auto pb-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}`}</style>
            <AnimatePresence mode="popLayout">
              {updates.map((update, index) => (
                <HealthUpdateCard
                  key={update.id}
                  update={update}
                  isActive={index === currentIndex}
                  index={index}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center mt-4 gap-2">
            {updates.map((_, i) => (
              <motion.div
                key={i}
                className={`h-2.5 rounded-full cursor-pointer transition-all duration-300 ${i === currentIndex ? "w-6 bg-emerald-500" : "w-2.5 bg-gray-300 dark:bg-gray-600"}`}
                onClick={() => setCurrentIndex(i)}
                animate={{ scale: i === currentIndex ? 1.2 : 1 }}
              />
            ))}
          </div>
        </>
      )}

      {/* Auto-progress bar */}
      {!loading && (
        <motion.div
          key={currentIndex}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-b-3xl"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: isPaused ? 0 : 4.5, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}
