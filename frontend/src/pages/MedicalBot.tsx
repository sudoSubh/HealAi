import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { MedicalChatbot } from "@/components/MedicalChatbot";
import { ModeToggle } from "@/components/mode-toggle";
import {
  ArrowLeft, Bot, Sparkles, Clock, MessageCircle, Zap, Shield, Brain, Heart,
  Activity, Stethoscope, Plus, Send, Paperclip, Mic, MicOff,
  ChevronRight, ChevronLeft, Users, Baby, Apple, AlertTriangle,
  Trash2, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────
interface ChatSession {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  category: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const SPECIALIST_CATEGORIES = [
  { id: "general", label: "General", icon: Stethoscope, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-900/30" },
  { id: "mental", label: "Mental Health", icon: Brain, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/30" },
  { id: "nutrition", label: "Nutrition", icon: Apple, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
  { id: "pediatric", label: "Pediatric", icon: Baby, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30" },
  { id: "community", label: "Community", icon: Users, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/30" },
];

const SUGGESTED_PROMPTS = [
  "What causes fever?",
  "Is this normal?",
  "Find a doctor",
  "Side effects of ibuprofen?",
  "How to reduce stress?",
];



// ─── Sub-components ───────────────────────────────────────────────────────────

const TypingDots = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 rounded-full bg-teal-500"
        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </div>
);

const EmergencyBanner = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 8 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    className="flex items-start gap-3 bg-red-50 dark:bg-red-950/40 border-l-4 border-red-500 rounded-xl p-4 my-3 mx-1 shadow-sm"
  >
    <span className="text-2xl flex-shrink-0">🚨</span>
    <div className="flex-1">
      <p className="font-bold text-red-700 dark:text-red-400 text-sm">Seek Emergency Care Immediately</p>
      <p className="text-red-600 dark:text-red-300 text-xs mt-1">
        Your symptoms may require urgent medical attention. Call emergency services right away.
      </p>
      <a
        href="tel:102"
        className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-full transition-colors"
      >
        📞 Call 102 (Ambulance)
      </a>
    </div>
  </motion.div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
export default function MedicalBot() {
  const [chatStarted, setChatStarted] = useState(false);
  const [initialQuestion, setInitialQuestion] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [activeCategory, setActiveCategory] = useState("general");
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    { id: "1", title: "Fever and headache symptoms", preview: "What are common causes of persistent...", timestamp: new Date(Date.now() - 3600000), category: "general" },
    { id: "2", title: "Stress management tips", preview: "How can I reduce stress at work...", timestamp: new Date(Date.now() - 86400000), category: "mental" },
    { id: "3", title: "Daily nutrition advice", preview: "What foods should I eat for better...", timestamp: new Date(Date.now() - 172800000), category: "nutrition" },
  ]);
  const [activeSession, setActiveSession] = useState<string | null>(null);

  useEffect(() => {
    if (!chatStarted) setInitialQuestion(null);
  }, [chatStarted]);

  const startNewChat = useCallback((question?: string) => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: question ? question.slice(0, 40) : "New Consultation",
      preview: question || "Start a new medical consultation...",
      timestamp: new Date(),
      category: activeCategory,
    };
    setChatSessions(prev => [newSession, ...prev]);
    setActiveSession(newSession.id);
    if (question) setInitialQuestion(question);
    setChatStarted(true);
  }, [activeCategory]);

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatSessions(prev => prev.filter(s => s.id !== id));
    if (activeSession === id) {
      setChatStarted(false);
      setActiveSession(null);
    }
  };

  const filteredSessions = chatSessions.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* ─── LEFT SIDEBAR ─────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-72 flex-shrink-0 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-20 shadow-sm"
          >
            {/* Sidebar header */}
            <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm">
                    <Heart className="w-4 h-4 text-white" fill="currentColor" />
                  </div>
                  <span className="text-sm font-black text-slate-800 dark:text-white">
                    Heal<span className="text-teal-600">AI</span>
                  </span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              {/* New Consultation button */}
              <Button
                onClick={() => startNewChat()}
                className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-sm h-9 text-sm font-semibold gap-2"
              >
                <Plus className="w-4 h-4" />
                New Consultation
              </Button>
            </div>

            {/* Search */}
            <div className="px-3 py-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Specialist categories */}
            <div className="px-3 pb-2">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2 px-1">Specialist</p>
              <div className="space-y-0.5">
                {SPECIALIST_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                      activeCategory === cat.id
                        ? `${cat.bg} ${cat.color}`
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    <cat.icon className={cn("w-4 h-4", activeCategory === cat.id ? cat.color : "text-slate-400")} />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat history */}
            <div className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2 px-1 pt-1">Recent Chats</p>
              <div className="space-y-1">
                {filteredSessions.map(session => (
                  <motion.div
                    key={session.id}
                    whileHover={{ x: 2 }}
                    onClick={() => { setActiveSession(session.id); setChatStarted(true); }}
                    className={cn(
                      "group relative flex items-start gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all",
                      activeSession === session.id
                        ? "bg-teal-50 dark:bg-teal-900/20 border border-teal-200/60 dark:border-teal-800/40"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500/20 to-teal-600/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MessageCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{session.title}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{session.preview}</p>
                      <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-0.5">{formatTime(session.timestamp)}</p>
                    </div>
                    <button
                      onClick={(e) => deleteSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex-shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar bottom */}
            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Home
              </Link>
              <div className="ml-auto">
                <ModeToggle />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Sidebar collapsed button */}
      {!sidebarOpen && (
        <div className="flex flex-col items-center py-4 px-2 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 gap-3 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-slate-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => startNewChat()}
            className="p-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-sm"
            title="New Consultation"
          >
            <Plus className="w-4 h-4" />
          </button>
          {SPECIALIST_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSidebarOpen(true); }}
              className={cn("p-2 rounded-xl transition-colors", activeCategory === cat.id ? `${cat.bg} ${cat.color}` : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800")}
              title={cat.label}
            >
              <cat.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      )}

      {/* ─── MAIN CHAT AREA ───────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top bar */}
        <div className="h-14 flex items-center justify-between px-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">
                {SPECIALIST_CATEGORIES.find(c => c.id === activeCategory)?.label || "General"} Consultant
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-medium">AI Online · Powered by Gemini</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[10px] font-semibold gap-1 rounded-full px-2.5">
              <Activity className="w-2.5 h-2.5" /> Live
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-[10px] font-semibold gap-1 rounded-full px-2.5">
              <Sparkles className="w-2.5 h-2.5" /> AI-Powered
            </Badge>

          </div>
        </div>

        {/* Chat window */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {!chatStarted ? (
            /* ── Welcome / Landing ── */
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-2xl mx-auto px-6 py-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-teal-500/30 mx-auto">
                      <span className="text-white font-black text-3xl">H</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold">AI</span>
                    </div>
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2">
                    HealAI Medical Assistant
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
                    Ask me anything about health. I provide evidence-based information and guidance — available 24/7.
                  </p>
                </motion.div>

                {/* Capability chips */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap justify-center gap-2 mb-10"
                >
                  {[
                    { icon: Brain, label: "Symptoms Analysis", color: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300" },
                    { icon: Apple, label: "Diet & Nutrition", color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300" },
                    { icon: Shield, label: "Medication Info", color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300" },
                    { icon: Zap, label: "Instant Answers", color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300" },
                    { icon: Clock, label: "24/7 Available", color: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300" },
                  ].map(({ icon: Icon, label, color }) => (
                    <span key={label} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border", color)}>
                      <Icon className="w-3 h-3" />
                      {label}
                    </span>
                  ))}
                </motion.div>

                {/* Suggested prompt cards */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 text-center">Try asking…</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { q: "What are symptoms of diabetes?", icon: "🩺", sub: "Symptoms" },
                      { q: "Best foods for heart health?", icon: "❤️", sub: "Nutrition" },
                      { q: "How to manage anxiety naturally?", icon: "🧘", sub: "Mental Health" },
                      { q: "When should I see a doctor?", icon: "🏥", sub: "General Advice" },
                    ].map(({ q, icon, sub }) => (
                      <motion.button
                        key={q}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => startNewChat(q)}
                        className="group flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-md transition-all text-left"
                      >
                        <span className="text-xl flex-shrink-0">{icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{q}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-500 flex-shrink-0 mt-0.5 transition-colors" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Disclaimer */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/30">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                      <span className="font-bold">Medical Disclaimer:</span> This AI provides general health information only and does not constitute professional medical advice. Always consult a qualified healthcare provider for diagnosis and treatment.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
            /* ── Active Chat ── */
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Back pill */}
              <div className="px-5 pt-3 pb-0 flex items-center gap-2">
                <button
                  onClick={() => { setChatStarted(false); setActiveSession(null); }}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  New chat
                </button>
              </div>

              {/* Chat content - render existing MedicalChatbot */}
              <div className="flex-1 overflow-hidden max-w-[720px] w-full mx-auto px-4">
                <MedicalChatbot initialQuestion={initialQuestion} hideShell />
              </div>
            </div>
          )}

          {/* ── Suggested prompts & Input Area ── */}
          <div className="flex-shrink-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 pt-3 pb-4">
            <div className="max-w-[720px] mx-auto">
              {/* Suggested prompts row */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-2">
                {SUGGESTED_PROMPTS.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => startNewChat(prompt)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 dark:hover:bg-teal-900/20 dark:hover:text-teal-300 dark:hover:border-teal-700 transition-all whitespace-nowrap"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input bar */}
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2 shadow-sm hover:shadow-md focus-within:shadow-md focus-within:border-teal-400 dark:focus-within:border-teal-600 transition-all h-12">
                <button className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors flex-shrink-0">
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 outline-none min-w-0"
                  placeholder="Ask me anything about your health…"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      startNewChat(e.currentTarget.value.trim());
                      e.currentTarget.value = "";
                    }
                  }}
                />

                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={cn(
                    "p-1.5 rounded-lg transition-all flex-shrink-0",
                    isRecording
                      ? "text-red-500 bg-red-50 dark:bg-red-900/20 animate-pulse"
                      : "text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                  )}
                  title={isRecording ? "Stop recording" : "Voice input"}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => startNewChat()}
                  className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm flex-shrink-0 transition-all hover:shadow-teal-500/30 hover:shadow-md"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </motion.button>
              </div>

              <p className="text-[10px] text-slate-400 text-center mt-2">
                HealAI can make mistakes. Always verify important medical information with a healthcare professional.
              </p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}