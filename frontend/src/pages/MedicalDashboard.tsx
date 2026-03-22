import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MedicalReportUpload } from "@/components/MedicalReportUpload";
import { UserProfileComponent } from "@/components/UserProfileComponent";
import { PersonalizedDietPlan } from "@/components/PersonalizedDietPlan";
import { DailyRecommendationsAndRemedies } from "@/components/DailyRecommendationsAndRemedies";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export function MedicalDashboard() {
  const [reportAnalyzed, setReportAnalyzed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="rounded-full">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Medical Dashboard</h1>
              <p className="text-sm text-muted-foreground">Upload reports and get personalized health insights</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-6xl">
        {/* Tabs Navigation */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-lg">
            <TabsTrigger value="profile" className="rounded-md">Profile</TabsTrigger>
            <TabsTrigger value="reports" className="rounded-md">Reports</TabsTrigger>
            <TabsTrigger value="diet" className="rounded-md">Diet Plan</TabsTrigger>
            <TabsTrigger value="recommendations" className="rounded-md">Advice</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <UserProfileComponent />
            </motion.div>
            <Card className="bg-gradient-to-br from-blue-50/50 to-cyan-50/30 dark:from-blue-900/20 dark:to-cyan-900/10 border-blue-200/50 dark:border-blue-800/30 rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <FileText className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Your Health Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/30 border border-blue-200/30">
                  <p className="text-sm text-muted-foreground">Medical Records: 0 uploaded</p>
                </div>
                <div className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/30 border border-blue-200/30">
                  <p className="text-sm text-muted-foreground">Last Update: Never</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <MedicalReportUpload />
            </motion.div>
            
            {/* Report Analysis Section */}
            {reportAnalyzed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-900/20 dark:to-emerald-900/10 border-green-200/50 dark:border-green-800/30 rounded-2xl">
                  <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-600" />
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                      <BarChart3 className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                      Report Analysis Results
                    </CardTitle>
                    <CardDescription>AI-powered analysis of your uploaded medical reports</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/50 dark:bg-slate-800/30 border border-green-200/30 space-y-2">
                      <p className="font-medium text-foreground">Key Findings:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Blood Sugar Level: Slightly elevated - Recommend dietary changes</li>
                        <li>• Cholesterol: Within normal range</li>
                        <li>• Blood Pressure: Normal</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          {/* Diet Plan Tab */}
          <TabsContent value="diet" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PersonalizedDietPlan />
            </motion.div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <DailyRecommendationsAndRemedies />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
