import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Youtube, GraduationCap, PlayCircle, Building,
  RefreshCcw, AlertCircle, Search,
  Heart, Pill, Brain, Apple, Stethoscope, Baby,
  Leaf, Trophy, Users, BookOpen, ArrowLeft, TrendingUp,
  ExternalLink, Shield, Star, Sparkles, Dumbbell, Microscope,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { VideoCard } from "@/components/health-hub/video-card";
import { CuratedVideoCard } from "@/components/health-hub/curated-video-card";
import { fetchHealthVideos, fetchVideosFromSpecificChannels } from "@/lib/youtubeApi";
import { NearbyHospitals } from "@/components/health-hub/nearby-hospitals";
import { CURATED_VIDEOS, VIDEOS_BY_CATEGORY } from "@/data/curatedVideos";
import { CuratedVideo } from "@/data/curatedVideos";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

// Quick action topics — redesigned with gradients
const QUICK_ACTIONS = [
  { id: "Govt. Schemes", title: "Govt. Schemes", icon: Trophy, gradient: "from-blue-500 to-indigo-600", lightBg: "bg-blue-50 dark:bg-blue-900/20" },
  { id: "Yoga/AYUSH", title: "Yoga & AYUSH", icon: Leaf, gradient: "from-emerald-500 to-green-600", lightBg: "bg-emerald-50 dark:bg-emerald-900/20" },
  { id: "Disease Control", title: "Disease Control", icon: Stethoscope, gradient: "from-red-500 to-rose-600", lightBg: "bg-red-50 dark:bg-red-900/20" },
  { id: "Public Awareness", title: "Public Awareness", icon: Users, gradient: "from-purple-500 to-violet-600", lightBg: "bg-purple-50 dark:bg-purple-900/20" },
  { id: "Trusted Health", title: "Trusted Health", icon: Heart, gradient: "from-pink-500 to-rose-600", lightBg: "bg-pink-50 dark:bg-pink-900/20" },
  { id: "General Health", title: "General Health", icon: Apple, gradient: "from-amber-500 to-orange-600", lightBg: "bg-amber-50 dark:bg-amber-900/20" },
];

// Tab config with matching colors
const TABS = [
  { value: "all", label: "All Videos", icon: PlayCircle, shortLabel: "All" },
  { value: "curated", label: "Curated", icon: GraduationCap, shortLabel: "Curated" },
  { value: "youtube", label: "YouTube", icon: Youtube, shortLabel: "YT" },
  { value: "government", label: "Government", icon: Building, shortLabel: "Gov" },
  { value: "doctors", label: "Doctors", icon: Stethoscope, shortLabel: "Docs" },
  { value: "heart", label: "Heart Health", icon: Heart, shortLabel: "Heart" },
  { value: "medication", label: "Medication", icon: Pill, shortLabel: "Meds" },
];

// Video interface (matching existing)
interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  viewCount?: string;
  category?: string;
}

const SAMPLE_VIDEOS: Video[] = [
  { id: "1", title: "Understanding Heart Health", description: "Learn about maintaining a healthy heart through diet and exercise", thumbnailUrl: "/demoPlaceholder.webp", channelTitle: "Health Ministry", publishedAt: "2024-01-15", viewCount: "15000", category: "heart" },
  { id: "2", title: "Nutrition for Daily Wellness", description: "Essential nutrients for maintaining good health", thumbnailUrl: "/nutrition.jpg", channelTitle: "Nutrition Experts", publishedAt: "2024-02-20", viewCount: "12000", category: "nutrition" },
  { id: "3", title: "Mental Wellness Tips", description: "Simple practices to improve mental health", thumbnailUrl: "/mindfulness.jpg", channelTitle: "Mental Health Institute", publishedAt: "2024-03-10", viewCount: "18000", category: "mental" },
  { id: "4", title: "Medication Safety Guide", description: "How to safely take and store medications", thumbnailUrl: "/demoPlaceholder.webp", channelTitle: "Pharmacy Network", publishedAt: "2024-01-25", viewCount: "9500", category: "medication" },
  { id: "5", title: "Government Health Initiatives", description: "Latest updates on national health programs", thumbnailUrl: "/heroImage.webp", channelTitle: "Ministry of Health", publishedAt: "2024-03-05", viewCount: "22000", category: "government" },
  { id: "6", title: "Exercise for All Ages", description: "Fitness routines suitable for different age groups", thumbnailUrl: "/fitness.jpg", channelTitle: "Fitness Experts", publishedAt: "2024-02-15", viewCount: "14500", category: "fitness" },
];

const HEALTH_CHANNELS = [
  'UCsyPEi8BS07G8ZPXmpzIZrg', 'UCT0-V_Z5-MuwN5fpbO-25Ag',
  'UCMO8AoVI1HtqbxKVOevaBSw', 'UC0InVdvqNyNzKBl1-TL348A',
  'UCV7Vc3q7MdfsX3vJ2wJr3wQ', 'UCzQUP1qoWDoEbmsQ4_Yi7pA',
  'UCJ014fTUtYV9TAZsFH7CI9A', 'UCQzd3SL6D0AX1l9AhlS8apw',
  'UCzUPzt5iM3jD48bvu8YAUVw',
];

// Category icon mapping
const getCategoryIcon = (category: string) => {
  const map: Record<string, JSX.Element> = {
    "Govt. Schemes": <Trophy className="h-4 w-4" />,
    "Yoga/AYUSH": <Leaf className="h-4 w-4" />,
    "Trusted Health": <Heart className="h-4 w-4" />,
    "Disease Control": <Stethoscope className="h-4 w-4" />,
    "General Health": <Users className="h-4 w-4" />,
    "Govt. Policy": <BookOpen className="h-4 w-4" />,
    "General Policy": <BookOpen className="h-4 w-4" />,
    "Public Awareness": <Users className="h-4 w-4" />,
    "Medicine/Myths": <BookOpen className="h-4 w-4" />,
    "Yoga/Heart": <Heart className="h-4 w-4" />,
  };
  return map[category] || <PlayCircle className="h-4 w-4" />;
};

const determineCategory = (title: string, description: string): string => {
  const text = (title + " " + description).toLowerCase();
  if (text.includes("government") || text.includes("ministry") || text.includes("scheme") || text.includes("ayushman")) return "Govt. Schemes";
  if (text.includes("heart") || text.includes("cardio")) return "Heart Health";
  if (text.includes("medicine") || text.includes("drug") || text.includes("medication")) return "Medication";
  if (text.includes("mental") || text.includes("mind") || text.includes("stress")) return "Mental Health";
  if (text.includes("nutrition") || text.includes("diet") || text.includes("food")) return "Nutrition";
  if (text.includes("exercise") || text.includes("fitness")) return "Fitness";
  if (text.includes("baby") || text.includes("child") || text.includes("pregnancy")) return "Maternal Health";
  if (text.includes("yoga") || text.includes("ayush") || text.includes("ayurveda")) return "Yoga/AYUSH";
  if (text.includes("disease") || text.includes("virus") || text.includes("infection")) return "Disease Control";
  return "General Health";
};

// ── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, value, label, gradient }: { icon: React.ElementType; value: string; label: string; gradient: string }) => (
  <div className="relative group overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 hover:shadow-lg transition-all">
    <div className={cn("absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 bg-gradient-to-br", gradient)} />
    <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 shadow-sm", gradient)}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <p className="text-2xl font-extrabold text-slate-800 dark:text-white">{value}</p>
    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
  </div>
);

// ── Skeleton ─────────────────────────────────────────────────────────────
const VideoSkeleton = () => (
  <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden animate-pulse">
    <div className="aspect-video bg-slate-200 dark:bg-slate-800" />
    <div className="p-4 space-y-2.5">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
    </div>
  </div>
);

// ─── Main Component ─────────────────────────────────────────────────────────
export default function HealthHub() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<Video[]>(SAMPLE_VIDEOS);
  const [sortBy, setSortBy] = useState<"date" | "views">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { document.title = "Health Hub - HealAI"; }, []);

  const convertCuratedToVideo = useCallback((curatedVideos: CuratedVideo[]): Video[] => {
    return curatedVideos.map(video => ({
      id: video.id, title: video.title,
      description: `Curated health video in category: ${video.category}`,
      thumbnailUrl: `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`,
      channelTitle: "Curated Health Content", publishedAt: new Date().toISOString(),
      category: video.category, viewCount: "0"
    }));
  }, []);

  const validateCuratedVideos = useCallback(async (curatedVideos: CuratedVideo[]): Promise<CuratedVideo[]> => {
    return curatedVideos.filter(video => video.id && video.id.trim() !== "");
  }, []);

  const videosByCategory = useMemo(() => {
    const categories: Record<string, typeof CURATED_VIDEOS> = {
      "Govt. Schemes": [], "Yoga/AYUSH": [], "Trusted Health": [],
      "Disease Control": [], "General Health": [], "Govt. Policy": [],
      "General Policy": [], "Public Awareness": [], "Medicine/Myths": [], "Yoga/Heart": [],
    };
    CURATED_VIDEOS.forEach(video => {
      if (categories[video.category]) categories[video.category].push(video);
      else categories["General Health"].push(video);
    });
    return categories;
  }, []);

  const featuredVideos = useMemo(() => {
    const featured: typeof CURATED_VIDEOS = [];
    ["Govt. Schemes", "Yoga/AYUSH", "Trusted Health", "Disease Control"].forEach(cat => {
      if (videosByCategory[cat]?.length > 0) featured.push(videosByCategory[cat][0]);
    });
    let index = 0;
    while (featured.length < 8 && index < CURATED_VIDEOS.length) {
      if (!featured.includes(CURATED_VIDEOS[index])) featured.push(CURATED_VIDEOS[index]);
      index++;
    }
    return featured;
  }, [videosByCategory]);

  const filteredVideos = useMemo(() => {
    let vids = CURATED_VIDEOS;
    if (activeTab !== "all" && activeTab !== "youtube" && activeTab !== "curated") {
      vids = VIDEOS_BY_CATEGORY[activeTab] || [];
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      vids = vids.filter(v => v.title.toLowerCase().includes(q) || v.category.toLowerCase().includes(q));
    }
    return vids;
  }, [searchQuery, activeTab]);

  // Fetch videos
  const fetchYouTubeVideos = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const response = await fetchVideosFromSpecificChannels(HEALTH_CHANNELS, undefined, 50);
      if (response.videos.length > 0) {
        const youtubeVideos: Video[] = response.videos.map(video => ({
          id: video.id, title: video.title, description: video.description,
          thumbnailUrl: video.thumbnailUrl, channelTitle: video.channelTitle,
          publishedAt: video.publishedAt, viewCount: video.viewCount,
          category: determineCategory(video.title, video.description)
        })).filter(v => !v.title.toLowerCase().includes("#shorts") && !v.title.toLowerCase().includes("shorts"));
        const validCurated = await validateCuratedVideos(CURATED_VIDEOS);
        const all = [...youtubeVideos, ...SAMPLE_VIDEOS, ...convertCuratedToVideo(validCurated)];
        setVideos(all.filter((v, i, self) => i === self.findIndex(x => x.id === v.id)));
        toast.success(`Loaded ${youtubeVideos.length} government health videos`);
      } else {
        const validCurated = await validateCuratedVideos(CURATED_VIDEOS);
        setVideos([...convertCuratedToVideo(validCurated), ...SAMPLE_VIDEOS]);
        toast.info("Showing curated health videos");
      }
    } catch (err) {
      console.error('Error fetching YouTube videos:', err);
      setError('Failed to load health videos. Showing fallback content.');
      setVideos([...convertCuratedToVideo(CURATED_VIDEOS), ...SAMPLE_VIDEOS]);
    } finally { setLoading(false); }
  }, [convertCuratedToVideo, validateCuratedVideos]);

  useEffect(() => { fetchYouTubeVideos(); }, [fetchYouTubeVideos]);

  const sortVideos = (vids: Video[]) => [...vids].sort((a, b) => {
    if (sortBy === "views") {
      const va = parseInt(a.viewCount || "0", 10), vb = parseInt(b.viewCount || "0", 10);
      return sortOrder === "asc" ? va - vb : vb - va;
    }
    const da = new Date(a.publishedAt).getTime(), db = new Date(b.publishedAt).getTime();
    return sortOrder === "asc" ? da - db : db - da;
  });

  const getFilteredVideos = () => {
    let filtered = videos;
    if (activeTab !== "all" && activeTab !== "youtube" && activeTab !== "curated")
      filtered = filtered.filter(v => v.category === activeTab);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(v => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q) || v.channelTitle.toLowerCase().includes(q));
    }
    return sortVideos(filtered);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-700" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-40 h-40 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-teal-300/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-emerald-200/20 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 pb-20 pt-8">
          {/* Back + Title */}
          <div className="flex items-center gap-3 mb-8">
            <Link to="/" className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Health Hub</h1>
              <p className="text-sm text-white/60 mt-0.5">Trusted videos from government channels & medical institutions</p>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={e => { e.preventDefault(); toast.success("Search applied"); }} className="max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search health topics, conditions, treatments…"
                className="w-full pl-11 pr-24 py-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-2xl shadow-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 border-0 focus:outline-none focus:ring-2 focus:ring-white/40"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors">
                Search
              </button>
            </div>
          </form>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            <StatCard icon={PlayCircle} value={`${CURATED_VIDEOS.length}+`} label="Curated Videos" gradient="from-teal-500 to-emerald-600" />
            <StatCard icon={Building} value="10+" label="Gov. Sources" gradient="from-blue-500 to-indigo-600" />
            <StatCard icon={Shield} value="100%" label="Verified Content" gradient="from-emerald-500 to-green-600" />
            <StatCard icon={TrendingUp} value="50K+" label="Monthly Views" gradient="from-purple-500 to-violet-600" />
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-20 pb-12">

        {/* Quick Actions — pill row */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_ACTIONS.map(action => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setActiveTab(action.id); setSearchQuery(""); }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-2xl border shadow-sm transition-all flex-shrink-0",
                    activeTab === action.id
                      ? `bg-gradient-to-r ${action.gradient} text-white border-transparent shadow-md`
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md"
                  )}
                >
                  <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
                    activeTab === action.id ? "bg-white/20" : `${action.lightBg}`)}>
                    <Icon className={cn("w-4 h-4", activeTab === action.id ? "text-white" : "text-slate-600 dark:text-slate-300")} />
                  </div>
                  <span className={cn("text-xs font-semibold whitespace-nowrap",
                    activeTab === action.id ? "text-white" : "text-slate-700 dark:text-slate-200")}>{action.title}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="mb-6 rounded-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
            {Array.from({ length: 8 }).map((_, i) => <VideoSkeleton key={i} />)}
          </div>
        )}

        {/* Tab bar */}
        {!loading && (
          <div className="mb-6">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-1.5 shadow-sm overflow-x-auto scrollbar-none">
              {TABS.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0",
                      activeTab === tab.value
                        ? "bg-teal-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                  </button>
                );
              })}
              <div className="ml-auto flex items-center gap-2 flex-shrink-0 px-2">
                <Badge className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800 text-[10px] rounded-full">
                  {activeTab === "curated" ? CURATED_VIDEOS.length : getFilteredVideos().length} videos
                </Badge>
                <Button variant="outline" size="sm" onClick={() => fetchYouTubeVideos()} disabled={loading} className="rounded-xl text-xs h-8 gap-1.5">
                  <RefreshCcw className={cn("h-3 w-3", loading && "animate-spin")} /> Refresh
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab Content ── */}
        {!loading && (
          <AnimatePresence mode="wait">
            {/* All Videos */}
            {activeTab === "all" && (
              <motion.div key="all" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                  {searchQuery ? `Results: "${searchQuery}"` : "All Curated Health Videos"}
                </h2>
                {getFilteredVideos().length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {getFilteredVideos().map(video => <VideoCard key={video.id} video={video} />)}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-3">🔍</div>
                    <p className="font-bold text-slate-700 dark:text-slate-200">No videos found</p>
                    <p className="text-sm text-slate-400 mt-1">Try a different search term</p>
                    <Button onClick={() => fetchYouTubeVideos()} className="mt-4 rounded-xl">Refresh Content</Button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Curated Tab — Netflix-style */}
            {activeTab === "curated" && (
              <motion.div key="curated" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
                {/* Featured carousel */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" /> Featured
                    </h2>
                  </div>
                  <Carousel opts={{ align: "start", slidesToScroll: "auto" }} className="w-full">
                    <CarouselContent>
                      {featuredVideos.map(video => (
                        <CarouselItem key={video.id} className="basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-4">
                          <CuratedVideoCard video={video} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="bg-white/90 dark:bg-slate-800/90 shadow-lg rounded-full w-9 h-9" />
                    <CarouselNext className="bg-white/90 dark:bg-slate-800/90 shadow-lg rounded-full w-9 h-9" />
                  </Carousel>
                </div>

                {/* Category rows */}
                {Object.entries(videosByCategory).map(([category, vids]) => {
                  if (vids.length === 0) return null;
                  return (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                          {getCategoryIcon(category)}
                        </div>
                        <h2 className="text-base font-bold text-slate-800 dark:text-white">{category}</h2>
                        <Badge variant="outline" className="ml-auto text-[10px] rounded-full">{vids.length}</Badge>
                      </div>
                      <Carousel opts={{ align: "start", slidesToScroll: "auto" }} className="w-full">
                        <CarouselContent>
                          {vids.map(video => (
                            <CarouselItem key={video.id} className="basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-4">
                              <CuratedVideoCard video={video} />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="bg-white/90 dark:bg-slate-800/90 shadow-lg rounded-full w-9 h-9" />
                        <CarouselNext className="bg-white/90 dark:bg-slate-800/90 shadow-lg rounded-full w-9 h-9" />
                      </Carousel>
                    </div>
                  );
                })}

                {/* Search results overlay */}
                {searchQuery && (
                  <div className="mt-8">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Search Results</h2>
                    {filteredVideos.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredVideos.map(video => <CuratedVideoCard key={video.id} video={video} />)}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 text-center py-8">No videos match "{searchQuery}"</p>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* YouTube / Government / Doctors / Heart / Medication tabs */}
            {["youtube", "government", "doctors", "heart", "medication"].includes(activeTab) && (
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 capitalize">
                  {activeTab === "youtube" ? "YouTube Health Videos" : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Videos`}
                </h2>
                {getFilteredVideos().length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {getFilteredVideos().map(video => <VideoCard key={video.id} video={video} />)}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="font-semibold text-slate-600 dark:text-slate-300">No videos in this category</p>
                    <Button onClick={() => fetchYouTubeVideos()} className="mt-4 rounded-xl" size="sm">Refresh</Button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Quick action category tabs */}
            {!["all", "curated", "youtube", "government", "doctors", "heart", "medication"].includes(activeTab) && (
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{activeTab}</h2>
                {(VIDEOS_BY_CATEGORY[activeTab] || []).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {(VIDEOS_BY_CATEGORY[activeTab] || []).map(video => <CuratedVideoCard key={video.id} video={video} />)}
                  </div>
                ) : (
                  <p className="text-center text-slate-400 py-12">No videos available for this category</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* ── Nearby Hospitals ── */}
        <div className="mt-16">
          <NearbyHospitals />
        </div>

        {/* ── Trust footer ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-3xl overflow-hidden"
        >
          <div className="relative bg-gradient-to-br from-teal-600 to-emerald-700 p-8 md:p-12 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-5 right-10 w-32 h-32 rounded-full bg-white/30 blur-3xl" />
              <div className="absolute bottom-5 left-10 w-40 h-40 rounded-full bg-emerald-200/30 blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-xl md:text-2xl font-extrabold text-white mb-3">Trusted Health Content</h2>
              <p className="text-sm text-white/70 max-w-lg mx-auto mb-6">
                All videos sourced from verified government health departments and renowned medical institutions.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { icon: Building, label: "Government Verified" },
                  { icon: Stethoscope, label: "Medical Experts" },
                  { icon: RefreshCcw, label: "Real-time Updates" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white text-xs font-semibold">
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
