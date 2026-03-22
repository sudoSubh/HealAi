import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  MapPin, Star, Phone, CheckCircle,
  Search, ArrowLeft, SlidersHorizontal, Ambulance, Building,
  Cross, Pill, TestTube, ChevronRight, Info, Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import healthcareData from "@/data/healthcare_data.json";

type FacilityType = "All" | "Hospital" | "Pharmacy" | "Clinic";
type SortBy = "Distance" | "Rating" | "Name";

interface Facility {
  id: string; 
  name: string; 
  type: Exclude<FacilityType, "All">;
  distance: number; 
  rating: number; 
  reviewCount: number;
  address: string; 
  phone: string; 
  isOpen: boolean; 
  openUntil: string; 
  verified: boolean;
  coordinates: { lat: number; lng: number };
  place_id: string;
}

const TYPE_STYLES: Record<string, string> = {
  Hospital: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border-red-100 dark:border-red-800",
  Pharmacy: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800",
  Clinic: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-100 dark:border-blue-800",
};

const TypeIcon = ({ type }: { type: string }) => {
  if (type === "Hospital") return <Cross className="w-4 h-4" />;
  if (type === "Pharmacy") return <Pill className="w-4 h-4" />;
  return <Building className="w-4 h-4" />;
};

export default function Resources() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<FacilityType>("All");
  const [minRating, setMinRating] = useState(0);
  const [openNow, setOpenNow] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("Rating");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setFacilities(healthcareData as any[]);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = facilities
    .filter(f => (type === "All" || f.type === type) && (minRating === 0 || f.rating >= minRating) && (!openNow || f.isOpen) && (!search || f.name.toLowerCase().includes(search.toLowerCase()) || f.address.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => sortBy === "Distance" ? a.distance - b.distance : sortBy === "Rating" ? b.rating - a.rating : a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 rounded-xl text-slate-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all">
                <ArrowLeft className="w-5 h-5"/>
              </Link>
              <div className="hidden xs:flex flex-col">
                <h1 className="text-xl font-black tracking-tight leading-none bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">HealthHub Directory</h1>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Medical Resources</p>
              </div>
            </div>

            <div className="flex-1 max-w-lg relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-500 transition-colors"/>
              <input 
                value={search} 
                onChange={e=>setSearch(e.target.value)} 
                placeholder="Find hospitals, clinics and pharmacies..." 
                className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>

            <button 
              onClick={()=>setShowFilters(!showFilters)} 
              className={cn(
                "hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-black transition-all",
                showFilters ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900" : "bg-white dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
              )}
            >
              <SlidersHorizontal className="w-4 h-4"/>
              FILTERS
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden border-t border-slate-100 dark:border-slate-800">
              <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap gap-8 items-start">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Facility Type</label>
                  <div className="flex gap-2 flex-wrap">
                    {["All","Hospital","Pharmacy","Clinic"].map(t=>(
                      <button key={t} onClick={()=>{setType(t as any);}} className={cn("px-4 py-2 rounded-xl text-xs font-bold border transition-all",type===t?"bg-teal-600 text-white border-teal-600 shadow-md":"bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-teal-400")}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Minimum Rating</label>
                  <div className="flex gap-1.5">{[0,3,4,4.5].map(r=><button key={r} onClick={()=>setMinRating(r)} className={cn("px-4 py-2 rounded-xl border text-[11px] font-black transition-all", minRating===r?"bg-amber-500 text-white border-amber-500 shadow-sm":"bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700")}>{r===0?"ANY":`${r}★+`}</button>)}</div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Current Status</label>
                  <button onClick={()=>setOpenNow(!openNow)} className={cn("flex items-center gap-2.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all", openNow?"bg-emerald-500 text-white border-emerald-500 shadow-sm":"bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700")}>
                    <div className={cn("w-2 h-2 rounded-full", openNow?"bg-white animate-pulse":"bg-slate-300")}/>
                    OPEN NOW
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Facilities Directory</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{loading ? "Updating results..." : `${filtered.length} trusted facilities in Bhubaneswar`}</span>
              <Badge variant="outline" className="h-5 text-[9px] bg-teal-50 text-teal-600 border-teal-100 font-black">EXCEL DATA</Badge>
            </div>
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 w-fit self-end sm:self-auto">
            {(["Distance","Rating"] as SortBy[]).map(s=><button key={s} onClick={()=>setSortBy(s)} className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black transition-all",sortBy===s?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md":"text-slate-400 hover:text-slate-600")}>{s.toUpperCase()}</button>)}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i=>(
              <div key={i} className="h-64 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse p-6">
                <div className="flex gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800"/>
                  <div className="space-y-3 flex-1 pt-2">
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4"/>
                    <div className="h-3 bg-slate-50 dark:bg-slate-800/50 rounded w-1/2"/>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-slate-50 dark:bg-slate-800/50 rounded w-full"/>
                  <div className="h-3 bg-slate-50 dark:bg-slate-800/50 rounded w-2/3"/>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900/50 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6"><Search className="w-10 h-10 text-slate-300"/></div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white">No matches found</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-xs text-center">We couldn't find any facilities matching your current filters. Try resetting them.</p>
            <Button variant="outline" className="mt-8 rounded-2xl font-black text-xs h-12 px-8 border-2" onClick={()=>{setType("All"); setMinRating(0); setSearch("");}}>RESET ALL FILTERS</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {filtered.map((f, i) => (
              <motion.div 
                key={f.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.05 }}
                className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="h-2 w-full absolute top-0 left-0" style={{ background: f.isOpen ? `linear-gradient(90deg, #10b981, #34d399)` : `#94a3b8` }} />
                
                <div className="p-6 sm:p-8 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="w-16 h-16 rounded-[22px] flex items-center justify-center flex-shrink-0 shadow-inner text-white transition-transform group-hover:scale-110 group-hover:rotate-3" style={{ background: f.isOpen ? `linear-gradient(135deg, #0d9488, #14b8a6)` : `#94a3b8` }}>
                      <TypeIcon type={f.type}/>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={cn("px-3 py-1 rounded-full text-[10px] font-black border tracking-wider", f.isOpen ? "bg-emerald-500 text-white border-emerald-500" : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700")}>
                        {f.isOpen ? "OPEN 24/7" : "CLOSED NOW"}
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-900/10 px-2.5 py-1 rounded-lg border border-amber-100 dark:border-amber-900/50">
                        <Star className="w-3.5 h-3.5 fill-amber-500"/>
                        <span className="text-xs font-black">{f.rating || "NEW"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight tracking-tight group-hover:text-teal-600 transition-colors line-clamp-2">{f.name}</h3>
                       {f.verified && <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0"/>}
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black border", TYPE_STYLES[f.type])}>{f.type.toUpperCase()}</span>
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/>Bhubaneswar</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{f.address}</p>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-slate-50 dark:border-slate-800/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Reviews</span>
                      <span className="text-slate-700 dark:text-slate-200 font-extrabold">{f.reviewCount.toLocaleString()} certified verifications</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={`tel:${f.phone}`} className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95">
                        <Phone className="w-4 h-4"/>
                        CALL
                      </a>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(f.name + " " + f.address)}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl bg-teal-600 text-white text-xs font-black hover:bg-teal-700 shadow-lg shadow-teal-500/20 transition-all active:scale-95"
                      >
                        <Navigation className="w-4 h-4"/>
                        MAPS
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Emergency Global CTA */}
      <a href="tel:112" className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90vw] max-w-xl h-20 bg-red-600 hover:bg-red-700 text-white rounded-[32px] shadow-2xl shadow-red-500/40 flex items-center gap-4 px-6 transition-all group active:scale-95 z-50">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:rotate-12 transition-transform"><Ambulance className="w-6 h-6"/></div>
        <div className="flex-1">
          <p className="text-sm font-black tracking-tight leading-none uppercase">Emergency Support</p>
          <p className="text-[10px] text-red-100 font-bold opacity-80 mt-1 uppercase tracking-wider">TAP TO REQUEST AMBULANCE · 112</p>
        </div>
        <ChevronRight className="w-6 h-6 opacity-40 group-hover:translate-x-2 transition-transform"/>
      </a>
    </div>
  );
}