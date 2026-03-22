import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Search, ArrowLeft, Clock, ExternalLink, Play, Bookmark, BookmarkCheck,
  Shield, TrendingUp, Heart, Brain, Apple, Sun, Baby, Building2,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────
type Category = "All" | "Prevention" | "Nutrition" | "Mental Health" | "Maternal" | "Seasonal" | "Govt Schemes";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: Category;
  readTime: number;
  author: string;
  image: string;
  url: string;
  verified: boolean;
  featured?: boolean;
}

interface Video {
  id: string;
  title: string;
  duration: string;
  source: string;
  thumbnail: string;
  url: string;
}

// ── Real Data with Unsplash images & external URLs ────────────────────────
const ARTICLES: Article[] = [
  {
    id: "1",
    title: "10 Daily Habits That Prevent Lifestyle Diseases",
    excerpt: "Small changes in your daily routine can dramatically reduce your risk of diabetes, hypertension, and heart disease. Learn the science-backed habits Indian doctors recommend.",
    category: "Prevention",
    readTime: 7,
    author: "WHO India",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    url: "https://www.who.int/news-room/fact-sheets/detail/noncommunicable-diseases",
    verified: true,
    featured: true,
  },
  {
    id: "2",
    title: "Complete Indian Diet Guide for Type 2 Diabetes",
    excerpt: "A culturally relevant guide covering dal, roti, rice and how to eat balanced Indian meals while managing blood sugar effectively.",
    category: "Nutrition",
    readTime: 12,
    author: "ICMR",
    image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&q=80",
    url: "https://www.icmr.nic.in/content/dietary-guidelines-indians",
    verified: true,
  },
  {
    id: "3",
    title: "Managing Anxiety With Pranayama & Meditation",
    excerpt: "Combine ancient Indian breathing techniques with modern mindfulness for lasting mental wellness and stress reduction.",
    category: "Mental Health",
    readTime: 8,
    author: "NIMHANS",
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80",
    url: "https://nimhans.ac.in/mental-health/",
    verified: true,
  },
  {
    id: "4",
    title: "Safe Pregnancy: A Trimester-by-Trimester Guide",
    excerpt: "Essential guidance for expectant mothers in India — covering nutrition, safe exercises, warning signs and postnatal care.",
    category: "Maternal",
    readTime: 15,
    author: "Ministry of Health",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80",
    url: "https://nhm.gov.in/index1.php?lang=1&level=2&sublinkid=819&lid=221",
    verified: true,
  },
  {
    id: "5",
    title: "Monsoon Health: Preventing Dengue & Malaria",
    excerpt: "Essential preventive measures every Indian household should know during monsoon season to stay safe from vector-borne diseases.",
    category: "Seasonal",
    readTime: 6,
    author: "NVBDCP India",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
    url: "https://nvbdcp.gov.in/index4.php?lang=1&level=0&linkid=431&lid=3782",
    verified: true,
  },
  {
    id: "6",
    title: "Ayushman Bharat PM-JAY: Your Complete Guide",
    excerpt: "How to enrol, check eligibility and use India's flagship health insurance scheme that covers 50 crore citizens.",
    category: "Govt Schemes",
    readTime: 9,
    author: "NHA India",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    url: "https://pmjay.gov.in/",
    verified: true,
  },
  {
    id: "7",
    title: "Vitamin D Deficiency: The Silent Indian Epidemic",
    excerpt: "Despite abundant sunshine, over 70% of Indians are vitamin D deficient. Here's why it matters and how to fix it naturally.",
    category: "Prevention",
    readTime: 5,
    author: "AIIMS Delhi",
    image: "https://images.unsplash.com/photo-1470116945706-e6bf5d5a53ca?w=800&q=80",
    url: "https://www.aiims.edu/en/departments/medicine.html",
    verified: true,
  },
  {
    id: "8",
    title: "Heart-Healthy Superfoods Found in Indian Kitchens",
    excerpt: "Turmeric, amla, flaxseeds and more — discover how everyday Indian ingredients can protect your cardiovascular health.",
    category: "Nutrition",
    readTime: 6,
    author: "Cardiology Society of India",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
    url: "https://www.csi.org.in/",
    verified: false,
  },
  {
    id: "9",
    title: "Childhood Vaccinations: India's Immunisation Schedule",
    excerpt: "Everything parents need to know about the Universal Immunisation Programme — vaccines, timing, and where to get them free.",
    category: "Maternal",
    readTime: 10,
    author: "MoHFW India",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
    url: "https://main.mohfw.gov.in/",
    verified: true,
  },
];

const VIDEOS: Video[] = [
  {
    id: "v1",
    title: "How to Read Your Blood Test Report",
    duration: "14:32",
    source: "AIIMS Delhi",
    thumbnail: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80",
    url: "https://www.youtube.com/results?search_query=blood+test+report+explained+India",
  },
  {
    id: "v2",
    title: "Yoga for Beginners — Full Body Session",
    duration: "22:15",
    source: "Ministry of Ayush",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
    url: "https://yoga.ayush.gov.in/",
  },
  {
    id: "v3",
    title: "Dengue Prevention — Government Campaign",
    duration: "8:44",
    source: "NVBDCP",
    thumbnail: "https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=600&q=80",
    url: "https://www.youtube.com/results?search_query=dengue+prevention+India+government",
  },
  {
    id: "v4",
    title: "Mental Health Awareness for Youth",
    duration: "18:20",
    source: "NIMHANS",
    thumbnail: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=600&q=80",
    url: "https://nimhans.ac.in/",
  },
  {
    id: "v5",
    title: "Safe Medicine Usage at Home",
    duration: "11:05",
    source: "CDSCO",
    thumbnail: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&q=80",
    url: "https://cdsco.gov.in/",
  },
];

const CATEGORIES: { label: Category; icon: React.ReactNode; color: string }[] = [
  { label: "All", icon: <TrendingUp className="w-3.5 h-3.5" />, color: "bg-slate-800 text-white border-slate-800" },
  { label: "Prevention", icon: <Shield className="w-3.5 h-3.5" />, color: "bg-teal-600 text-white border-teal-600" },
  { label: "Nutrition", icon: <Apple className="w-3.5 h-3.5" />, color: "bg-orange-500 text-white border-orange-500" },
  { label: "Mental Health", icon: <Brain className="w-3.5 h-3.5" />, color: "bg-purple-600 text-white border-purple-600" },
  { label: "Maternal", icon: <Heart className="w-3.5 h-3.5" />, color: "bg-pink-500 text-white border-pink-500" },
  { label: "Seasonal", icon: <Sun className="w-3.5 h-3.5" />, color: "bg-blue-500 text-white border-blue-500" },
  { label: "Govt Schemes", icon: <Building2 className="w-3.5 h-3.5" />, color: "bg-indigo-600 text-white border-indigo-600" },
];

const CAT_BADGE: Record<string, string> = {
  Prevention: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  Nutrition: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  "Mental Health": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Maternal: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  Seasonal: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Govt Schemes": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
};

// ── Main Component ─────────────────────────────────────────────────────────
export default function EducationHub() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarks(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const filtered = ARTICLES.filter(a =>
    (category === "All" || a.category === category) &&
    (!search || a.title.toLowerCase().includes(search.toLowerCase()))
  );

  const featured = filtered.find(a => a.featured) || filtered[0];
  const rest = filtered.filter(a => a.id !== featured?.id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="p-2 rounded-xl text-slate-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-extrabold text-slate-800 dark:text-white leading-none">Health Education</h1>
            <p className="text-[11px] text-slate-400 mt-0.5">Verified articles, guides & videos</p>
          </div>

          {/* Search */}
          <div className="ml-auto relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Category Pill Bar */}
        <div className="max-w-6xl mx-auto px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat.label}
                onClick={() => setCategory(cat.label)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap flex-shrink-0 transition-all",
                  category === cat.label
                    ? cat.color + " shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-700"
                )}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">

        {/* ── Featured Article ── */}
        {featured && (
          <motion.a
            href={featured.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative block rounded-3xl overflow-hidden h-80 shadow-xl cursor-pointer"
          >
            <img
              src={featured.image}
              alt={featured.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            {featured.verified && (
              <div className="absolute top-5 left-5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold shadow-md">
                <Shield className="w-3 h-3" /> Gov. Verified ✓
              </div>
            )}
            <button
              onClick={e => toggleBookmark(featured.id, e)}
              className="absolute top-5 right-5 p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white transition-colors"
            >
              {bookmarks.has(featured.id)
                ? <BookmarkCheck className="w-4 h-4 fill-amber-400 text-amber-400" />
                : <Bookmark className="w-4 h-4" />}
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-bold", CAT_BADGE[featured.category] || "bg-white/20 text-white")}>
                  {featured.category}
                </span>
                <span className="flex items-center gap-1 text-white/70 text-xs">
                  <Clock className="w-3 h-3" /> {featured.readTime} min read
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white leading-snug">{featured.title}</h2>
              <p className="text-white/75 text-sm mt-1 line-clamp-2">{featured.excerpt}</p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-bold text-white border border-white/30">
                  {featured.author.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-white/80 text-xs">{featured.author}</span>
                <div className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-white text-slate-800 rounded-full text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-all">
                  Read Article <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </div>
          </motion.a>
        )}

        {/* ── Article Grid ── */}
        {rest.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4">
              {category === "All" ? "All Articles" : category} ({rest.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((article, i) => (
                <motion.a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -5 }}
                  className="group block bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {article.verified && (
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold shadow-sm">
                        <Shield className="w-2.5 h-2.5" /> Verified
                      </div>
                    )}
                    <button
                      onClick={e => toggleBookmark(article.id, e)}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/20 hover:bg-black/50 text-white backdrop-blur-sm transition-colors"
                    >
                      {bookmarks.has(article.id)
                        ? <BookmarkCheck className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        : <Bookmark className="w-3.5 h-3.5" />}
                    </button>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="flex items-center gap-2 px-4 py-2 bg-white text-slate-800 rounded-full text-xs font-bold shadow-xl">
                        Read Article <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", CAT_BADGE[article.category])}>
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 ml-auto flex-shrink-0">
                        <Clock className="w-3 h-3" /> {article.readTime} min
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white leading-snug line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-[8px] font-bold text-teal-700 dark:text-teal-300 flex-shrink-0">
                        {article.author.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{article.author}</span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        )}

        {/* ── No Results ── */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="text-5xl">🔍</div>
            <p className="font-bold text-slate-700 dark:text-slate-200">No articles found</p>
            <p className="text-sm text-slate-400">Try a different category or search term</p>
            <button onClick={() => { setSearch(""); setCategory("All"); }} className="px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors">
              Clear Filters
            </button>
          </div>
        )}

        {/* ── Video Section ── */}
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Play className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            </span>
            Health Videos
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none">
            {VIDEOS.map((v, i) => (
              <motion.a
                key={v.id}
                href={v.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className="group flex-shrink-0 w-64 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer block"
              >
                <div className="relative h-36 overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-white/20 border-2 border-white/60 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/40 group-hover:scale-110 transition-all duration-200">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-bold">
                    {v.duration}
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold">
                    {v.source}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white line-clamp-2 leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {v.title}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <ExternalLink className="w-2.5 h-2.5" /> Opens on YouTube / Source
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* ── Simple disclaimer ── */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/40 flex items-start gap-3">
          <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
            <span className="font-bold">Disclaimer:</span> Articles and videos on this page redirect to official government and health authority websites. Always consult a qualified doctor for medical advice.
          </p>
        </div>

      </div>
    </div>
  );
}
