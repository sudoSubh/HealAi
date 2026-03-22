import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SymptomForm } from "@/components/symptom-checker/SymptomForm";
import { AnalysisResults } from "@/components/symptom-checker/AnalysisResults";
import { AnalysisResponse } from "@/services/symptom-checker-gemini-service";
import { 
  ArrowLeft, 
  AlertTriangle, 
  Stethoscope
} from "lucide-react";
import { motion } from "framer-motion";
import { LottieAnimation } from "@/components/LottieAnimation";
import symptomCheckerAnimation from "../../public/animations/ai-health-animation.json";

export default function SymptomChecker() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [showForm, setShowForm] = useState(true);
  const location = useLocation();

  // Reset the form when navigating to the page with fresh state
  useEffect(() => {
    if (location.state?.fresh) {
      setAnalysisResult(null);
      setShowForm(true);
      // Clear the state to prevent repeated resets
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleAnalysis = (result: AnalysisResponse) => {
    setAnalysisResult(result);
    setShowForm(false);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center">
                  <Stethoscope className="w-6 h-6 mr-2 text-primary" />
                  Symptoms
                </h1>
                <p className="text-muted-foreground text-sm">AI-powered health analysis and insights</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-2">
        <div className="max-w-4xl mx-auto">
          {/* Background Elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-pulse"></div>
            <div className="absolute top-40 -left-40 w-96 h-96 bg-pink-500/20 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          </div>

          {/* Hero Section with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-6 backdrop-blur-sm bg-white/30 dark:bg-slate-900/30 rounded-3xl border border-white/40 dark:border-slate-800/40 shadow-xl mb-8 mt-2"
          >
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-150"></div>
              <LottieAnimation 
                animationData={symptomCheckerAnimation}
                className="w-28 h-28 mx-auto relative z-10"
                loop={true}
                autoplay={true}
              />
            </div>
            <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 mb-2 drop-shadow-sm">
              AI-Powered Symptom Analysis
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">
              Describe your symptoms and get instant insights from our advanced medical AI
            </p>
          </motion.div>

          {/* Warning Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="mb-6 border-amber-500/30 bg-amber-500/10 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-amber-500/20 rounded-full">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                      Important Medical Disclaimer
                    </p>
                    <p className="text-xs text-amber-700/90 dark:text-amber-300/90 mt-1 leading-relaxed">
                      This tool provides general health information only and should not replace professional medical advice. 
                      Always consult with a healthcare provider for proper diagnosis and treatment.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content - Glassmorphism Layout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-3xl overflow-hidden relative z-10">
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-80" />
              <CardHeader className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-t-3xl border-b border-white/20 dark:border-slate-700/50 py-5">
                <CardTitle className="flex items-center text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl mr-3 shadow-inner">
                    <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  {showForm ? "Describe Your Symptoms" : "Analysis Results"}
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 ml-[44px]">
                  {showForm 
                    ? "Provide detailed information about what you're experiencing"
                    : "Review your personalized health insights"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                {showForm ? (
                  <SymptomForm onAnalyze={handleAnalysis} />
                ) : (
                  <AnalysisResults data={analysisResult!} onReset={handleReset} />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
