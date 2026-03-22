import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MedicalReportUpload, ReportFile } from "@/components/MedicalReportUpload";
import { UserProfileComponent, UserProfile } from "@/components/UserProfileComponent";
import { PersonalizedDietPlan } from "@/components/PersonalizedDietPlan";
import { DailyRecommendationsAndRemedies } from "@/components/DailyRecommendationsAndRemedies";
import { ArrowLeft, User, FileText, Utensils, Lightbulb, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "profile",         label: "Profile",     icon: User },
  { value: "reports",         label: "Reports",     icon: FileText },
  { value: "diet",            label: "Diet Plan",   icon: Utensils },
  { value: "recommendations", label: "Daily Advice",icon: Lightbulb },
];

export function MedicalDashboard() {
  const [profile, setProfile] = useState<UserProfile | undefined>();
  const [analyzedReports, setAnalyzedReports] = useState<ReportFile[]>([]);
  const [activeTab, setActiveTab] = useState("profile");

  // Derive a concise report summary from analyzed files to pass downstream
  const reportSummary = analyzedReports
    .filter((f) => f.status === "analyzed" && f.analysisResult)
    .map((f) => `[${f.name}]: ${f.analysisResult}`)
    .join("\n\n")
    .slice(0, 1200);

  const analyzedCount = analyzedReports.filter((f) => f.status === "analyzed").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-teal-50/10 to-emerald-50/20 dark:from-background dark:via-teal-950/10 dark:to-emerald-950/10">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="rounded-full gap-1.5 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" /> Home
              </Button>
            </Link>
            <div className="w-px h-5 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground leading-tight">Medical Dashboard</h1>
                <p className="text-xs text-muted-foreground">AI-powered health insights</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {analyzedCount > 0 && (
              <Badge className="rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs">
                {analyzedCount} report{analyzedCount !== 1 ? "s" : ""} analyzed
              </Badge>
            )}
            {profile?.name && (
              <Badge variant="outline" className="rounded-full text-xs gap-1">
                <User className="w-3 h-3" /> {profile.name}
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Tab nav */}
          <TabsList className="grid grid-cols-4 w-full rounded-2xl h-auto p-1 mb-8 bg-muted/60">
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className={cn(
                  "rounded-xl flex-col gap-1 py-3 text-xs font-medium transition-all",
                  "data-[state=active]:bg-background data-[state=active]:shadow-sm"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:block">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <UserProfileComponent onChange={setProfile} />

              {/* Quick nav to next step */}
              <div className="flex justify-end">
                <Button
                  onClick={() => setActiveTab("reports")}
                  className="rounded-full gap-2 bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Next: Upload Reports <ArrowLeft className="w-4 h-4 rotate-180" />
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <MedicalReportUpload onAnalysisComplete={setAnalyzedReports} />

              {analyzedCount > 0 && (
                <div className="flex justify-end gap-3">
                  <Button
                    onClick={() => setActiveTab("diet")}
                    className="rounded-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    View Diet Plan <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Button>
                  <Button
                    onClick={() => setActiveTab("recommendations")}
                    variant="outline"
                    className="rounded-full gap-2"
                  >
                    View Daily Advice <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Button>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Diet Plan Tab */}
          <TabsContent value="diet">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <PersonalizedDietPlan profile={profile} reportSummary={reportSummary} />
            </motion.div>
          </TabsContent>

          {/* Daily Advice Tab */}
          <TabsContent value="recommendations">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <DailyRecommendationsAndRemedies profile={profile} reportSummary={reportSummary} />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
