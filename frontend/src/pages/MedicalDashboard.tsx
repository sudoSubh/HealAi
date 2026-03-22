import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MedicalReportUpload, ReportFile } from "@/components/MedicalReportUpload";
import { UserProfileComponent, UserProfile } from "@/components/UserProfileComponent";
import { PersonalizedDietPlan } from "@/components/PersonalizedDietPlan";
import { DailyRecommendationsAndRemedies } from "@/components/DailyRecommendationsAndRemedies";
import {
  ArrowLeft, User, FileText, Utensils, Lightbulb, Activity,
  ChevronRight, Shield, CheckCircle, Upload, Sparkles, Heart,
  Clock, TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "profile", label: "Profile", icon: User, step: 1, description: "Set up your health profile" },
  { value: "reports", label: "Reports", icon: FileText, step: 2, description: "Upload & analyze reports" },
  { value: "diet", label: "Diet Plan", icon: Utensils, step: 3, description: "AI-powered diet plan" },
  { value: "recommendations", label: "Daily Advice", icon: Lightbulb, step: 4, description: "Personalized recommendations" },
];

export function MedicalDashboard() {
  const [profile, setProfile] = useState<UserProfile | undefined>();
  const [analyzedReports, setAnalyzedReports] = useState<ReportFile[]>([]);
  const [activeTab, setActiveTab] = useState("profile");

  const reportSummary = analyzedReports
    .filter((f) => f.status === "analyzed" && f.analysisResult)
    .map((f) => `[${f.name}]: ${f.analysisResult}`)
    .join("\n\n")
    .slice(0, 1200);

  const analyzedCount = analyzedReports.filter((f) => f.status === "analyzed").length;
  const currentStep = TABS.findIndex(t => t.value === activeTab);

  // Progress checks
  const profileComplete = !!profile?.name;
  const reportsComplete = analyzedCount > 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ── Premium Header ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-700" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 right-20 w-40 h-40 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute bottom-0 left-10 w-60 h-60 rounded-full bg-emerald-200/30 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-6 pb-16">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link to="/" className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Activity className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-extrabold text-white tracking-tight">Medical Dashboard</h1>
                  <p className="text-[11px] text-white/60">AI-powered health insights & report analysis</p>
                </div>
              </div>
            </div>

            {/* Status badges */}
            <div className="flex items-center gap-2">
              {analyzedCount > 0 && (
                <Badge className="rounded-full bg-white/15 text-white border-white/20 text-[10px] font-semibold gap-1 backdrop-blur-sm">
                  <CheckCircle className="w-2.5 h-2.5" />
                  {analyzedCount} report{analyzedCount !== 1 ? "s" : ""} analyzed
                </Badge>
              )}
              {profile?.name && (
                <Badge className="rounded-full bg-white/15 text-white border-white/20 text-[10px] font-semibold gap-1 backdrop-blur-sm">
                  <User className="w-2.5 h-2.5" /> {profile.name}
                </Badge>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: User, label: "Profile", value: profileComplete ? "Complete" : "Pending", done: profileComplete, gradient: "from-blue-500/20 to-indigo-500/20" },
              { icon: FileText, label: "Reports", value: analyzedCount > 0 ? `${analyzedCount} Analyzed` : "None yet", done: reportsComplete, gradient: "from-emerald-500/20 to-green-500/20" },
              { icon: Utensils, label: "Diet Plan", value: reportsComplete ? "Ready" : "Upload reports first", done: reportsComplete, gradient: "from-amber-500/20 to-orange-500/20" },
              { icon: Lightbulb, label: "Daily Advice", value: reportsComplete ? "Available" : "Upload reports first", done: reportsComplete, gradient: "from-purple-500/20 to-violet-500/20" },
            ].map(stat => (
              <div key={stat.label} className={cn("rounded-2xl p-3.5 border border-white/10 backdrop-blur-sm bg-gradient-to-br", stat.gradient)}>
                <div className="flex items-center gap-2 mb-1.5">
                  <stat.icon className="w-3.5 h-3.5 text-white/70" />
                  <span className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">{stat.label}</span>
                  {stat.done && <CheckCircle className="w-3 h-3 text-emerald-300 ml-auto" />}
                </div>
                <p className="text-sm font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20 pb-12">

        {/* Tab Navigation — Modern card style */}
        <div className="flex gap-2 mb-6 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-x-auto scrollbar-none">
          {TABS.map((tab, i) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            const isCompleted = (tab.value === "profile" && profileComplete) ||
                                (tab.value === "reports" && reportsComplete);
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "flex-1 flex items-center gap-3 px-4 py-3 rounded-xl transition-all min-w-0",
                  isActive
                    ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                  isActive ? "bg-white/20" : isCompleted ? "bg-emerald-50 dark:bg-emerald-900/30" : "bg-slate-100 dark:bg-slate-800"
                )}>
                  {isCompleted && !isActive ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-500 dark:text-slate-400")} />
                  )}
                </div>
                <div className="text-left min-w-0 hidden sm:block">
                  <p className={cn("text-xs font-bold leading-tight", isActive ? "text-white" : "text-slate-700 dark:text-slate-200")}>
                    {tab.label}
                  </p>
                  <p className={cn("text-[10px] truncate", isActive ? "text-white/70" : "text-slate-400")}>
                    {tab.description}
                  </p>
                </div>
                {/* Step number on mobile */}
                <span className={cn("sm:hidden text-xs font-bold", isActive ? "text-white" : "text-slate-500")}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Step progress indicator */}
        <div className="flex items-center gap-1 mb-6 px-2">
          {TABS.map((tab, i) => (
            <div key={tab.value} className="flex items-center flex-1">
              <div className={cn("h-1 rounded-full flex-1 transition-colors",
                i <= currentStep ? "bg-teal-500" : "bg-slate-200 dark:bg-slate-800"
              )} />
              {i < TABS.length - 1 && <div className="w-1" />}
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Info card */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200/60 dark:border-blue-800/40">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-800 dark:text-blue-200">Step 1: Set Up Your Health Profile</p>
                  <p className="text-xs text-blue-600/80 dark:text-blue-300/60 mt-0.5">Fill in your details so we can personalize your diet plans and recommendations.</p>
                </div>
              </div>

              <UserProfileComponent onChange={setProfile} />

              <div className="flex justify-end">
                <Button
                  onClick={() => setActiveTab("reports")}
                  className="rounded-full gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-md shadow-teal-500/20 px-6"
                >
                  Next: Upload Reports <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <motion.div key="reports" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800/40">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                  <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">Step 2: Upload Your Medical Reports</p>
                  <p className="text-xs text-emerald-600/80 dark:text-emerald-300/60 mt-0.5">Upload blood work, lab results or prescriptions. Our AI will analyze and extract key insights.</p>
                </div>
              </div>

              <MedicalReportUpload onAnalysisComplete={setAnalyzedReports} />

              {analyzedCount > 0 && (
                <div className="flex flex-wrap gap-3 justify-end">
                  <Button
                    onClick={() => setActiveTab("diet")}
                    className="rounded-full gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md shadow-amber-500/20 px-5"
                  >
                    <Utensils className="w-3.5 h-3.5" /> View Diet Plan <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => setActiveTab("recommendations")}
                    variant="outline"
                    className="rounded-full gap-2 border-slate-300 dark:border-slate-700 px-5"
                  >
                    <Lightbulb className="w-3.5 h-3.5" /> View Daily Advice <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Diet Plan Tab */}
          {activeTab === "diet" && (
            <motion.div key="diet" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/40">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-800 dark:text-amber-200">Step 3: Your Personalized Diet Plan</p>
                  <p className="text-xs text-amber-600/80 dark:text-amber-300/60 mt-0.5">
                    AI generates a culturally relevant Indian diet plan based on your profile and report analysis.
                  </p>
                </div>
              </div>

              {!reportsComplete ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <FileText className="w-7 h-7 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-200">Upload reports first</p>
                    <p className="text-sm text-slate-400 mt-1">We need your medical reports to generate a personalized diet plan.</p>
                  </div>
                  <Button onClick={() => setActiveTab("reports")} className="rounded-full gap-2 bg-teal-600 hover:bg-teal-700 text-white">
                    <Upload className="w-3.5 h-3.5" /> Upload Reports
                  </Button>
                </div>
              ) : (
                <PersonalizedDietPlan profile={profile} reportSummary={reportSummary} />
              )}
            </motion.div>
          )}

          {/* Daily Advice Tab */}
          {activeTab === "recommendations" && (
            <motion.div key="recs" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200/60 dark:border-purple-800/40">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-purple-800 dark:text-purple-200">Step 4: Personalized Daily Advice</p>
                  <p className="text-xs text-purple-600/80 dark:text-purple-300/60 mt-0.5">
                    Get home remedies, lifestyle tips and wellness insights based on your health data.
                  </p>
                </div>
              </div>

              {!reportsComplete ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <FileText className="w-7 h-7 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-200">Upload reports first</p>
                    <p className="text-sm text-slate-400 mt-1">We need your medical reports to personalize your daily advice.</p>
                  </div>
                  <Button onClick={() => setActiveTab("reports")} className="rounded-full gap-2 bg-teal-600 hover:bg-teal-700 text-white">
                    <Upload className="w-3.5 h-3.5" /> Upload Reports
                  </Button>
                </div>
              ) : (
                <DailyRecommendationsAndRemedies profile={profile} reportSummary={reportSummary} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust footer */}
        <div className="mt-12 flex items-center justify-center gap-4 text-[10px] text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-1"><Shield className="w-3 h-3" /> HIPAA Compliant</div>
          <div className="w-1 h-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> AI-Powered Analysis</div>
          <div className="w-1 h-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> Real-time Results</div>
        </div>
      </div>
    </div>
  );
}
