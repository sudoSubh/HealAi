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
                  Symptom Checker
                </h1>
                <p className="text-muted-foreground text-sm">AI-powered health analysis and insights</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-2">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-2"
          >
            <div className="inline-block">
              <LottieAnimation 
                animationData={symptomCheckerAnimation}
                className="w-24 h-24 mx-auto"
                loop={true}
                autoplay={true}
              />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-1">AI-Powered Symptom Analysis</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Describe your symptoms and get instant insights from our advanced medical AI
            </p>
          </motion.div>

          {/* Warning Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="mb-3 border-amber-500/50 bg-amber-500/5 shadow-sm rounded-2xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-500/80"></div>
              <CardContent className="p-3">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                      Important Medical Disclaimer
                    </p>
                    <p className="text-xs text-amber-700/80 dark:text-amber-300/80 mt-1">
                      This tool provides general health information only and should not replace professional medical advice. 
                      Always consult with a healthcare provider for proper diagnosis and treatment.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content - Simplified Layout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="shadow-lg bg-card border rounded-2xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary to-pink-500"></div>
              <CardHeader className="bg-gradient-to-r from-primary to-pink-500 text-primary-foreground rounded-t-2xl py-3">
                <CardTitle className="flex items-center text-lg">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  {showForm ? "Describe Your Symptoms" : "Analysis Results"}
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-sm">
                  {showForm 
                    ? "Provide detailed information about what you're experiencing"
                    : "Review your personalized health insights"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
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