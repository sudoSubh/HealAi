import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Youtube, 
  GraduationCap, 
  PlayCircle, 
  Building,
  RefreshCcw,
  AlertCircle,
  Search,
  Filter,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Heart,
  Pill,
  Brain,
  Apple,
  Stethoscope,
  Baby,
  Dumbbell,
  Microscope,
  Leaf,
  Trophy,
  Users,
  BookOpen
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Define quick action topics
const QUICK_ACTIONS = [
  { id: "Govt. Schemes", title: "Govt. Schemes", icon: Trophy, color: "bg-blue-500" },
  { id: "Yoga/AYUSH", title: "Yoga/AYUSH", icon: Leaf, color: "bg-green-500" },
  { id: "Disease Control", title: "Disease Control", icon: Stethoscope, color: "bg-red-500" },
  { id: "Public Awareness", title: "Public Awareness", icon: Users, color: "bg-purple-500" },
];

// Define sample video data
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
  {
    id: "1",
    title: "Understanding Heart Health",
    description: "Learn about maintaining a healthy heart through diet and exercise",
    thumbnailUrl: "/demoPlaceholder.webp",
    channelTitle: "Health Ministry",
    publishedAt: "2024-01-15",
    viewCount: "15000",
    category: "heart"
  },
  {
    id: "2",
    title: "Nutrition for Daily Wellness",
    description: "Essential nutrients for maintaining good health",
    thumbnailUrl: "/nutrition.jpg",
    channelTitle: "Nutrition Experts",
    publishedAt: "2024-02-20",
    viewCount: "12000",
    category: "nutrition"
  },
  {
    id: "3",
    title: "Mental Wellness Tips",
    description: "Simple practices to improve mental health",
    thumbnailUrl: "/mindfulness.jpg",
    channelTitle: "Mental Health Institute",
    publishedAt: "2024-03-10",
    viewCount: "18000",
    category: "mental"
  },
  {
    id: "4",
    title: "Medication Safety Guide",
    description: "How to safely take and store medications",
    thumbnailUrl: "/demoPlaceholder.webp",
    channelTitle: "Pharmacy Network",
    publishedAt: "2024-01-25",
    viewCount: "9500",
    category: "medication"
  },
  {
    id: "5",
    title: "Government Health Initiatives",
    description: "Latest updates on national health programs",
    thumbnailUrl: "/heroImage.webp",
    channelTitle: "Ministry of Health",
    publishedAt: "2024-03-05",
    viewCount: "22000",
    category: "government"
  },
  {
    id: "6",
    title: "Exercise for All Ages",
    description: "Fitness routines suitable for different age groups",
    thumbnailUrl: "/fitness.jpg",
    channelTitle: "Fitness Experts",
    publishedAt: "2024-02-15",
    viewCount: "14500",
    category: "fitness"
  }
];

// Official government and reputable health channels
const HEALTH_CHANNELS = [
  // Indian central government health channels
  'UCsyPEi8BS07G8ZPXmpzIZrg', // Ministry of Health and Family Welfare, India
  'UCT0-V_Z5-MuwN5fpbO-25Ag', // AIIMS, New Delhi
  'UCMO8AoVI1HtqbxKVOevaBSw', // ICMR Organisation
  'UC0InVdvqNyNzKBl1-TL348A', // Apollo Hospitals
  
  // State government health channels
  'UCV7Vc3q7MdfsX3vJ2wJr3wQ', // Kerala Health Department
  'UCN06Qz5uN2d4ZQ5Z8Y7Z5wA', // Tamil Nadu Health Department
  'UCF5h75h8pAaHw6v6Z8Y7Z5w', // Maharashtra Health Department
  
  // International health organizations
  'UCzQUP1qoWDoEbmsQ4_Yi7pA', // WHO
  'UCJ014fTUtYV9TAZsFH7CI9A', // CDC
  'UCQzd3SL6D0AX1l9AhlS8apw', // NIH
  
  // Additional reputable health organizations
  'UCzUPzt5iM3jD48bvu8YAUVw', // Mayo Clinic
  'UCZ5XnGb-3t7jCkXdawN2tkA', // WebMD
];

export default function HealthHub() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<Video[]>(SAMPLE_VIDEOS);
  const [sortBy, setSortBy] = useState<"date" | "views">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set page title
  useEffect(() => {
    document.title = "Health Hub - HealNav";
  }, []);

  // Convert curated videos to Video interface
  const convertCuratedToVideo = useCallback((curatedVideos: CuratedVideo[]): Video[] => {
    return curatedVideos.map(video => ({
      id: video.id,
      title: video.title,
      description: `Curated health video in category: ${video.category}`,
      thumbnailUrl: `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`,
      channelTitle: "Curated Health Content",
      publishedAt: new Date().toISOString(),
      category: video.category,
      viewCount: "0" // View count not available for curated videos
    }));
  }, []);

  // Validate YouTube video IDs
  const validateCuratedVideos = useCallback(async (curatedVideos: CuratedVideo[]): Promise<CuratedVideo[]> => {
    // Simple validation - check if video IDs are not empty
    const validVideos = curatedVideos.filter(video => video.id && video.id.trim() !== "");
    
    // In a production environment, you might want to check if the videos actually exist
    // For now, we'll just return the videos with valid IDs
    console.log(`Validated ${validVideos.length} out of ${curatedVideos.length} curated videos`);
    return validVideos;
  }, []);

  // Group videos by category for Netflix-style rows
  const videosByCategory = useMemo(() => {
    const categories: Record<string, typeof CURATED_VIDEOS> = {
      "Govt. Schemes": [],
      "Yoga/AYUSH": [],
      "Trusted Health": [],
      "Disease Control": [],
      "General Health": [],
      "Govt. Policy": [],
      "General Policy": [],
      "Public Awareness": [],
      "Medicine/Myths": [],
      "Yoga/Heart": [],
    };

    CURATED_VIDEOS.forEach(video => {
      if (categories[video.category as keyof typeof categories]) {
        categories[video.category as keyof typeof categories].push(video);
      } else {
        // For any new categories not explicitly defined
        categories["General Health"].push(video);
      }
    });

    return categories;
  }, []);

  // Get featured videos (most relevant or popular)
  const featuredVideos = useMemo(() => {
    // Select videos from different categories to feature
    const featured: typeof CURATED_VIDEOS = [];
    
    // Add some videos from key categories
    if (videosByCategory["Govt. Schemes"].length > 0) {
      featured.push(videosByCategory["Govt. Schemes"][0]);
    }
    if (videosByCategory["Yoga/AYUSH"].length > 0) {
      featured.push(videosByCategory["Yoga/AYUSH"][0]);
    }
    if (videosByCategory["Trusted Health"].length > 0) {
      featured.push(videosByCategory["Trusted Health"][0]);
    }
    if (videosByCategory["Disease Control"].length > 0) {
      featured.push(videosByCategory["Disease Control"][0]);
    }
    
    // Fill with more if needed
    const allVideos: typeof CURATED_VIDEOS = CURATED_VIDEOS;
    let index: number = 0;
    while (featured.length < 8 && index < allVideos.length) {
      const nextVideo = allVideos[index];
      if (!featured.includes(nextVideo)) {
        featured.push(nextVideo);
      }
      index++;
    }
    
    return featured;
  }, [videosByCategory]);

  // Filter videos based on search query and category
  const filteredVideos = useMemo(() => {
    let videos = CURATED_VIDEOS;
    
    // Filter by category
    if (activeTab !== "all" && activeTab !== "youtube" && activeTab !== "curated") {
      videos = VIDEOS_BY_CATEGORY[activeTab] || [];
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      videos = videos.filter(video => 
        video.title.toLowerCase().includes(query) || 
        video.category.toLowerCase().includes(query)
      );
    }
    
    return videos;
  }, [searchQuery, activeTab]);

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Govt. Schemes": return <Trophy className="h-5 w-5" />;
      case "Yoga/AYUSH": return <Leaf className="h-5 w-5" />;
      case "Trusted Health": return <Heart className="h-5 w-5" />;
      case "Disease Control": return <Stethoscope className="h-5 w-5" />;
      case "General Health": return <Users className="h-5 w-5" />;
      case "Govt. Policy": return <BookOpen className="h-5 w-5" />;
      case "General Policy": return <BookOpen className="h-5 w-5" />;
      case "Public Awareness": return <Users className="h-5 w-5" />;
      case "Medicine/Myths": return <BookOpen className="h-5 w-5" />;
      case "Yoga/Heart": return <Heart className="h-5 w-5" />;
      default: return <PlayCircle className="h-5 w-5" />;
    }
  };

  // Determine category based on title and description
  const determineCategory = (title: string, description: string): string => {
    const text = (title + " " + description).toLowerCase();
    
    // Government-specific categories
    if (text.includes("government") || text.includes("ministry") || text.includes("policy") || 
        text.includes("scheme") || text.includes("program") || text.includes("initiative") ||
        text.includes("/ayushman") || text.includes("nrhm") || text.includes("nha")) return "Govt. Schemes";
    
    if (text.includes("heart") || text.includes("cardio")) return "Heart Health";
    if (text.includes("medicine") || text.includes("drug") || text.includes("medication")) return "Medication";
    if (text.includes("mental") || text.includes("mind") || text.includes("stress")) return "Mental Health";
    if (text.includes("nutrition") || text.includes("diet") || text.includes("food")) return "Nutrition";
    if (text.includes("exercise") || text.includes("fitness") || text.includes("workout")) return "Fitness";
    if (text.includes("baby") || text.includes("child") || text.includes("pregnancy")) return "Maternal Health";
    if (text.includes("lab") || text.includes("test") || text.includes("research")) return "Research";
    if (text.includes("yoga") || text.includes("ayush") || text.includes("ayurveda")) return "Yoga/AYUSH";
    if (text.includes("disease") || text.includes("virus") || text.includes("infection")) return "Disease Control";
    
    return "General Health";
  };

  // Fetch videos from YouTube API
  const fetchYouTubeVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching YouTube videos from specific government channels...");
      // Fetch videos from specific health channels
      const response = await fetchVideosFromSpecificChannels(HEALTH_CHANNELS, undefined, 50);
      console.log("Channel fetch response:", response);
      
      if (response.videos.length > 0) {
        console.log(`Found ${response.videos.length} videos from government channels`);
        // Transform YouTube videos to match our Video interface
        const youtubeVideos: Video[] = response.videos.map(video => ({
          id: video.id,
          title: video.title,
          description: video.description,
          thumbnailUrl: video.thumbnailUrl,
          channelTitle: video.channelTitle,
          publishedAt: video.publishedAt,
          viewCount: video.viewCount,
          category: determineCategory(video.title, video.description)
        }));
        
        // Filter out shorts and non-health content
        const filteredVideos = youtubeVideos.filter(video => {
          const title = video.title.toLowerCase();
          // Remove shorts and very short videos
          if (title.includes("#shorts") || title.includes("shorts") || 
              title.includes("short") || title.includes("#short")) {
            return false;
          }
          // Keep only health-related content
          return determineCategory(video.title, video.description) !== "General Health" || 
                 title.includes("health") || title.includes("medical") || 
                 title.includes("doctor") || title.includes("hospital");
        });
        
        // Validate and convert curated videos
        const validCuratedVideos = await validateCuratedVideos(CURATED_VIDEOS);
        console.log(`Using ${validCuratedVideos.length} curated videos after validation`);
        
        // Combine with sample videos, curated videos and remove duplicates
        const allVideos = [...filteredVideos, ...SAMPLE_VIDEOS, ...convertCuratedToVideo(validCuratedVideos)];
        const uniqueVideos = allVideos.filter((video, index, self) => 
          index === self.findIndex(v => v.id === video.id)
        );
        
        console.log("Setting videos state with", uniqueVideos.length, "videos");
        setVideos(uniqueVideos);
        toast.success(`Loaded ${filteredVideos.length} government health videos from trusted sources`);
      } else {
        console.log("No videos from channels, trying search-based fetching with government terms...");
        // Fallback to search-based fetching with government health terms
        const searchTerms = [
          "Ministry of Health India",
          "AIIMS health",
          "ICMR health",
          "Government health scheme India",
          "Ayushman Bharat",
          "NRHM India",
          "Public health India"
        ];
        
        let allSearchVideos: Video[] = [];
        for (const term of searchTerms) {
          try {
            const searchResponse = await fetchHealthVideos(term, 10);
            console.log(`Search fetch response for "${term}":`, searchResponse);
            
            if (searchResponse.videos.length > 0) {
              const searchVideos: Video[] = searchResponse.videos.map(video => ({
                id: video.id,
                title: video.title,
                description: video.description,
                thumbnailUrl: video.thumbnailUrl,
                channelTitle: video.channelTitle,
                publishedAt: video.publishedAt,
                viewCount: video.viewCount,
                category: determineCategory(video.title, video.description)
              }));
              
              // Filter out shorts
              const filteredVideos = searchVideos.filter(video => {
                const title = video.title.toLowerCase();
                return !title.includes("#shorts") && !title.includes("shorts") && 
                       !title.includes("short") && !title.includes("#short");
              });
              
              allSearchVideos = [...allSearchVideos, ...filteredVideos];
            }
          } catch (err) {
            console.warn(`Failed to fetch videos for term "${term}":`, err);
          }
        }
        
        if (allSearchVideos.length > 0) {
          console.log(`Found ${allSearchVideos.length} videos from government health searches`);
          
          // Validate and convert curated videos
          const validCuratedVideos = await validateCuratedVideos(CURATED_VIDEOS);
          console.log(`Using ${validCuratedVideos.length} curated videos after validation`);
          
          // Combine with sample videos, curated videos and remove duplicates
          const allVideos = [...allSearchVideos, ...SAMPLE_VIDEOS, ...convertCuratedToVideo(validCuratedVideos)];
          const uniqueVideos = allVideos.filter((video, index, self) => 
            index === self.findIndex(v => v.id === video.id)
          );
          
          console.log("Setting videos state with", uniqueVideos.length, "videos");
          setVideos(uniqueVideos);
          toast.success(`Loaded ${allSearchVideos.length} government health videos from search`);
        } else {
          console.log("No videos found from either channels or search, using fallback content...");
          // Validate and use curated videos and sample videos as fallback
          const validCuratedVideos = await validateCuratedVideos(CURATED_VIDEOS);
          console.log(`Using ${validCuratedVideos.length} curated videos as fallback`);
          const fallbackVideos = [...convertCuratedToVideo(validCuratedVideos), ...SAMPLE_VIDEOS];
          setVideos(fallbackVideos);
          toast.info("Showing curated health videos from our library");
        }
      }
    } catch (err) {
      console.error('Error fetching YouTube videos:', err);
      setError('Failed to load health videos. Showing fallback content.');
      // Validate and use curated videos and sample videos as fallback
      const validCuratedVideos = CURATED_VIDEOS; // Use all videos as fallback if validation fails
      console.log(`Using all ${validCuratedVideos.length} curated videos as fallback due to error`);
      const fallbackVideos = [...convertCuratedToVideo(validCuratedVideos), ...SAMPLE_VIDEOS];
      setVideos(fallbackVideos);
      toast.error('Failed to load health videos. Showing curated content.');
    } finally {
      setLoading(false);
    }
  }, [convertCuratedToVideo, validateCuratedVideos]);

  // Fetch videos from YouTube API on component mount
  useEffect(() => {
    fetchYouTubeVideos();
  }, [fetchYouTubeVideos]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Search completed");
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchYouTubeVideos();
  };

  // Sort videos
  const sortVideos = (videos: Video[]) => {
    return [...videos].sort((a, b) => {
      if (sortBy === "views") {
        const viewCountA = parseInt(a.viewCount || "0", 10);
        const viewCountB = parseInt(b.viewCount || "0", 10);
        return sortOrder === "asc" ? viewCountA - viewCountB : viewCountB - viewCountA;
      } else {
        const dateA = new Date(a.publishedAt).getTime();
        const dateB = new Date(b.publishedAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
    });
  };

  // Filter videos based on tab and search
  const getFilteredVideos = () => {
    let filtered = videos;
    
    // Filter by tab
    if (activeTab !== "all" && activeTab !== "youtube" && activeTab !== "curated") {
      filtered = filtered.filter(video => video.category === activeTab);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(video => 
        video.title.toLowerCase().includes(query) || 
        video.description.toLowerCase().includes(query) ||
        video.channelTitle.toLowerCase().includes(query) ||
        (video.category && video.category.toLowerCase().includes(query))
      );
    }
    
    return sortVideos(filtered);
  };

  // Render video grid
  const renderVideoGrid = () => {
    const currentVideos = getFilteredVideos();
    
    if (currentVideos.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery 
              ? `No videos found for "${searchQuery}". Try a different search term.` 
              : "No videos available. Try refreshing or searching for specific content."}
          </p>
          <Button onClick={handleRefresh} className="mt-4">Refresh Content</Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Health Hub</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-6">
              Trusted health videos from government channels and renowned medical institutions
            </p>
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 -mt-16 relative z-20">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for health topics, conditions, or treatments..."
                className="pl-10 pr-20 py-6 text-base rounded-full shadow-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
                size="sm"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Quick Access to Health Topics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => {
                    setActiveTab(action.id);
                    setSearchQuery("");
                  }}
                >
                  <div className={`${action.color} p-2 rounded-full mb-2`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium">{action.title}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg">Loading health videos from trusted sources...</span>
          </div>
        )}

        {/* Content Tabs */}
        {!loading && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-card p-4 rounded-lg shadow">
              <TabsList className="grid grid-cols-4 md:grid-cols-7">
                <TabsTrigger value="all" className="gap-2">
                  <PlayCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">All Videos</span>
                  <span className="sm:hidden">All</span>
                </TabsTrigger>
                <TabsTrigger value="curated" className="gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span className="hidden sm:inline">Curated</span>
                  <span className="sm:hidden">Curated</span>
                </TabsTrigger>
                <TabsTrigger value="youtube" className="gap-2">
                  <Youtube className="h-4 w-4" />
                  <span className="hidden sm:inline">YouTube</span>
                  <span className="sm:hidden">YT</span>
                </TabsTrigger>
                <TabsTrigger value="government" className="gap-2">
                  <Building className="h-4 w-4" />
                  <span className="hidden sm:inline">Government</span>
                  <span className="sm:hidden">Gov</span>
                </TabsTrigger>
                <TabsTrigger value="doctors" className="gap-2">
                  <Stethoscope className="h-4 w-4" />
                  <span className="hidden sm:inline">Doctors</span>
                  <span className="sm:hidden">Docs</span>
                </TabsTrigger>
                <TabsTrigger value="heart" className="gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Heart</span>
                </TabsTrigger>
                <TabsTrigger value="medication" className="gap-2">
                  <Pill className="h-4 w-4" />
                  <span className="hidden sm:inline">Medication</span>
                  <span className="sm:hidden">Meds</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">
                  {activeTab === "curated" ? CURATED_VIDEOS.length : activeTab === "youtube" ? getFilteredVideos().length : getFilteredVideos().length} videos
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
            
            {/* Sorting Controls - Only for YouTube videos */}
            {activeTab !== "curated" && (
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSortBy("date")}
                  className={sortBy === "date" ? "bg-muted" : ""}
                >
                  Date
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSortBy("views")}
                  className={sortBy === "views" ? "bg-muted" : ""}
                >
                  Views
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  {sortOrder === "asc" ? <ArrowUpWideNarrow className="h-4 w-4" /> : <ArrowDownWideNarrow className="h-4 w-4" />}
                </Button>
              </div>
            )}
            
            <TabsContent value="all" className="mt-0">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">
                  {searchQuery ? `Search Results for "${searchQuery}"` : "All Curated Health Videos"}
                </h2>
                {renderVideoGrid()}
              </div>
            </TabsContent>
            
            <TabsContent value="curated" className="mt-0">
              <div className="space-y-12">
                {/* Featured Videos Row */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-primary">Featured Health Content</h2>
                    <Button variant="ghost" size="sm" className="text-primary">
                      See All
                    </Button>
                  </div>
                  <div className="relative">
                    <Carousel
                      opts={{
                        align: "start",
                        slidesToScroll: "auto",
                      }}
                      className="w-full"
                    >
                      <CarouselContent>
                        {featuredVideos.map((video) => (
                          <CarouselItem 
                            key={video.id} 
                            className="basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5 pl-4"
                          >
                            <div className="h-full">
                              <CuratedVideoCard video={video} />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2">
                        <CarouselPrevious className="bg-white/80 hover:bg-white shadow-lg rounded-full w-8 h-8" />
                      </div>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2">
                        <CarouselNext className="bg-white/80 hover:bg-white shadow-lg rounded-full w-8 h-8" />
                      </div>
                    </Carousel>
                  </div>
                </div>

                {/* Category-based Rows */}
                {Object.entries(videosByCategory).map(([category, videos]) => {
                  // Skip empty categories
                  if (videos.length === 0) return null;
                  
                  return (
                    <div key={category} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-primary">
                          {getCategoryIcon(category)}
                          {category}
                        </h2>
                        <Button variant="ghost" size="sm" className="text-primary">
                          See All
                        </Button>
                      </div>
                      <div className="relative">
                        <Carousel
                          opts={{
                            align: "start",
                            slidesToScroll: "auto",
                          }}
                          className="w-full"
                        >
                          <CarouselContent>
                            {videos.map((video) => (
                              <CarouselItem 
                                key={video.id} 
                                className="basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5 pl-4"
                              >
                                <div className="h-full">
                                  <CuratedVideoCard video={video} />
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2">
                            <CarouselPrevious className="bg-white/80 hover:bg-white shadow-lg rounded-full w-8 h-8" />
                          </div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2">
                            <CarouselNext className="bg-white/80 hover:bg-white shadow-lg rounded-full w-8 h-8" />
                          </div>
                        </Carousel>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Traditional Grid View (for search/filter) */}
              {(searchQuery) ? (
                <div className="mt-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-primary">
                      Search Results
                    </h2>
                    <Badge variant="outline">
                      {filteredVideos.length} {filteredVideos.length === 1 ? "Video" : "Videos"}
                    </Badge>
                  </div>

                  {filteredVideos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredVideos.map((video) => (
                        <CuratedVideoCard key={video.id} video={video} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        {searchQuery 
                          ? `No videos found for "${searchQuery}". Try a different search term.` 
                          : "No videos available."}
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </TabsContent>
            
            <TabsContent value="youtube" className="mt-0">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">
                  {searchQuery ? `YouTube Videos for "${searchQuery}"` : "YouTube Health Videos"}
                </h2>
                {renderVideoGrid()}
              </div>
            </TabsContent>
            
            <TabsContent value="government" className="mt-0">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">
                  {searchQuery ? `Government Videos for "${searchQuery}"` : "Government Health Videos"}
                </h2>
                {renderVideoGrid()}
              </div>
            </TabsContent>
            
            <TabsContent value="doctors" className="mt-0">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">
                  {searchQuery ? `Doctor Videos for "${searchQuery}"` : "Videos from Renowned Doctors"}
                </h2>
                {renderVideoGrid()}
              </div>
            </TabsContent>
            
            <TabsContent value="heart" className="mt-0">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">
                  {searchQuery ? `Heart Health Videos for "${searchQuery}"` : "Heart Health Videos"}
                </h2>
                {renderVideoGrid()}
              </div>
            </TabsContent>
            
            <TabsContent value="medication" className="mt-0">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">
                  {searchQuery ? `Medication Videos for "${searchQuery}"` : "Medication Guidance Videos"}
                </h2>
                {renderVideoGrid()}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Nearby Hospitals Section */}
        <div className="mt-16">
          <NearbyHospitals />
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-50 to-teal-50 shadow-lg rounded-xl p-8 text-center border"
        >
          <h2 className="text-2xl font-bold mb-3 text-primary">Trusted Health Content</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            All videos are sourced directly from verified government health departments and renowned medical institutions 
            to ensure you receive accurate and up-to-date health information.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Badge variant="outline" className="px-4 py-2 text-sm bg-white">
              <Building className="h-4 w-4 mr-2" />
              Government Verified
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm bg-white">
              <Stethoscope className="h-4 w-4 mr-2" />
              Medical Experts
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm bg-white">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Real-time Updates
            </Badge>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
