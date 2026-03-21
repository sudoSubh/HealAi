import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MedicalChatbot } from "@/components/MedicalChatbot";
import { 
  ArrowLeft, 
  Bot, 
  Sparkles, 
  Clock, 
  MessageCircle, 
  Zap,
  Shield,
  Brain,
  Heart,
  Activity,
  Stethoscope,
  Microscope,
  Users,
  Award
} from "lucide-react";
import { motion } from "framer-motion";
import { LottieAnimation } from "@/components/LottieAnimation";
import { ModeToggle } from "@/components/mode-toggle";
import { HeartAnimation } from "@/components/HeartAnimation";
import medicalBotAnimation from "../../public/animations/ai-health-animation.json";

export default function MedicalBot() {
  const [chatStarted, setChatStarted] = useState(false);
  const [initialQuestion, setInitialQuestion] = useState<string | null>(null);

  // Reset initial question when chat is reset
  useEffect(() => {
    if (!chatStarted) {
      setInitialQuestion(null);
    }
  }, [chatStarted]);

  const quickQuestions = [
    "What are the symptoms of the flu?",
    "How can I improve my sleep quality?",
    "What should I eat for better heart health?",
    "How do I manage stress and anxiety?",
    "What are the benefits of regular exercise?",
    "How much water should I drink daily?",
    "What vitamins are essential for immunity?",
    "How can I reduce back pain naturally?"
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Advanced medical knowledge at your fingertips"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Get health guidance anytime, anywhere"
    },
    {
      icon: Shield,
      title: "Privacy Protected",
      description: "Your conversations are secure and confidential"
    },
    {
      icon: Zap,
      title: "Instant Responses",
      description: "Get immediate answers to your health questions"
    },
    {
      icon: Stethoscope,
      title: "Professional Guidance",
      description: "Evidence-based medical information"
    },
    {
      icon: Users,
      title: "Personalized Care",
      description: "Tailored advice for your health needs"
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: "Expert Knowledge",
      description: "Powered by cutting-edge AI technology"
    },
    {
      icon: Microscope,
      title: "Accurate Information",
      description: "Medically reviewed content and advice"
    }
  ];

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
                  <Bot className="w-6 h-6 mr-2 text-primary" />
                  AI Medical Assistant
                </h1>
                <p className="text-muted-foreground text-sm">Your intelligent health companion</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-500 text-primary-foreground shadow-lg rounded-full text-xs px-2 py-1">
                <Activity className="w-3 h-3 mr-1" />
                Online
              </Badge>
              <Badge className="bg-primary text-primary-foreground shadow-lg rounded-full text-xs px-2 py-1">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-2">
        <div className="max-w-6xl mx-auto">
          {!chatStarted ? (
            <div className="space-y-6">
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-8 mb-6 border border-emerald-100/50 shadow-lg"
              >
                <div className="absolute inset-0 bg-grid-emerald-500/5 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <motion.h1 
                      className="text-3xl md:text-4xl font-bold text-foreground mb-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Your Personal <span className="text-emerald-600">AI Health Assistant</span>
                    </motion.h1>
                    <motion.p 
                      className="text-lg text-muted-foreground mb-6 max-w-2xl"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Get instant, reliable medical information and health guidance powered by advanced AI technology. 
                      Ask questions, receive personalized advice, and take control of your health journey.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3 shadow-lg rounded-full text-base"
                        onClick={() => setChatStarted(true)}
                      >
                        <Bot className="w-5 h-5 mr-2" />
                        Start Conversation
                      </Button>
                    </motion.div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl"></div>
                      <LottieAnimation 
                        animationData={medicalBotAnimation}
                        className="w-48 h-48 relative z-10"
                        loop={true}
                        autoplay={true}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Benefits Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="h-full"
                  >
                    <Card className="h-full bg-card border shadow-sm rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-5 flex items-start">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mr-4 flex-shrink-0">
                          <benefit.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="h-full"
                  >
                    <Card className="h-full text-center hover:shadow-lg transition-shadow bg-card border shadow-sm rounded-2xl overflow-hidden">
                      <div className="h-1 bg-gradient-to-r from-primary to-primary/80"></div>
                      <CardContent className="p-5">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                          <feature.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Quick Questions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mb-6"
              >
                <Card className="bg-card border shadow-sm rounded-2xl overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-primary to-purple-500"></div>
                  <CardHeader className="py-4">
                    <CardTitle className="flex items-center text-xl">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Popular Questions
                    </CardTitle>
                    <CardDescription>
                      Click on any question to get started, or ask your own
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {quickQuestions.map((question, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                          whileHover={{ x: 5 }}
                        >
                          <Button
                            variant="outline"
                            className="justify-start h-auto p-4 text-left w-full border-input hover:bg-muted hover:border-primary transition-colors rounded-xl text-sm"
                            onClick={() => {
                              setInitialQuestion(question);
                              setChatStarted(true);
                            }}
                          >
                            <HeartAnimation size={16} className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
                            <span className="text-foreground">{question}</span>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Card className="border-amber-500/50 bg-amber-500/5 shadow-sm rounded-2xl overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-500/80"></div>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                          Medical Disclaimer
                        </p>
                        <p className="text-sm text-amber-700/80 dark:text-amber-300/80">
                          This AI assistant provides general health information and should not replace 
                          professional medical advice, diagnosis, or treatment. Always consult with 
                          qualified healthcare providers for medical concerns. This information is for 
                          awareness and educational purposes only.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="shadow-xl bg-card border rounded-2xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-2xl py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bot className="w-6 h-6 mr-3" />
                      <div>
                        <CardTitle className="text-xl">HealerAi Medical Assistant</CardTitle>
                        <CardDescription className="text-emerald-100">
                          Ask me anything about health and wellness
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="bg-white/20 text-white hover:bg-white/30 rounded-full h-9 px-4 backdrop-blur-sm"
                      onClick={() => setChatStarted(false)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <MedicalChatbot initialQuestion={initialQuestion} />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}