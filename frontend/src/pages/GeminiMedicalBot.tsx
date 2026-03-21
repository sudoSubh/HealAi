import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GeminiMedicalChatbot } from "@/components/GeminiMedicalChatbot";
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
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { LottieAnimation } from "@/components/LottieAnimation";
import { ModeToggle } from "@/components/mode-toggle";
import { HeartAnimation } from "@/components/HeartAnimation";
import medicalBotAnimation from "../../public/animations/ai-health-animation.json";

export default function GeminiMedicalBotPage() {
  const [chatStarted, setChatStarted] = useState(false);

  const quickQuestions = [
    "What are the symptoms of the flu?",
    "How can I improve my sleep quality?",
    "What should I eat for better heart health?",
    "How do I manage stress and anxiety?",
    "What are the benefits of regular exercise?",
    "How much water should I drink daily?"
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
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
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
                  Gemini 1.5 Flash Medical Assistant
                </h1>
                <p className="text-muted-foreground">Your intelligent health companion powered by Google's Gemini 1.5 Flash</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-500 text-primary-foreground shadow-lg rounded-full">
                <Activity className="w-3 h-3 mr-1" />
                Online
              </Badge>
              <Badge className="bg-primary text-primary-foreground shadow-lg rounded-full">
                <Sparkles className="w-3 h-3 mr-1" />
                Gemini Powered
              </Badge>
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {!chatStarted ? (
            <div className="space-y-8">
              {/* Welcome Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8"
              >
                <div className="inline-block">
                  <LottieAnimation 
                    animationData={medicalBotAnimation}
                    className="w-32 h-32 mx-auto"
                    loop={true}
                    autoplay={true}
                  />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Hello! I'm your Gemini 1.5 Flash Health Assistant
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  I'm here to help answer your health questions using Google's powerful Gemini 1.5 Flash AI. 
                  How can I assist you today?
                </p>
              </motion.div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.03 }}
                    className="h-full"
                  >
                    <Card className="text-center hover:shadow-lg transition-shadow bg-card border shadow-sm rounded-2xl overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-primary to-primary/80"></div>
                      <CardContent className="p-6">
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
              >
                <Card className="bg-card border shadow-sm rounded-2xl overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-primary to-purple-500"></div>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Popular Questions
                    </CardTitle>
                    <CardDescription>
                      Click on any question to get started, or ask your own
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {quickQuestions.map((question, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                          whileHover={{ x: 5 }}
                        >
                          <Button
                            variant="outline"
                            className="justify-start h-auto p-4 text-left w-full border-input hover:bg-muted hover:border-primary transition-colors rounded-xl"
                            onClick={() => setChatStarted(true)}
                          >
                            <HeartAnimation size={16} className="w-4 h-4 mr-2 text-primary" />
                            <span className="text-sm text-foreground">{question}</span>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Start Chat Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-center"
              >
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 shadow-lg rounded-full"
                  onClick={() => setChatStarted(true)}
                >
                  <Bot className="w-5 h-5 mr-2" />
                  Start Conversation
                </Button>
              </motion.div>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <Card className="border-amber-500/50 bg-amber-500/5 shadow-sm rounded-2xl overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-500/80"></div>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                          Medical Disclaimer
                        </p>
                        <p className="text-sm text-amber-700/80 dark:text-amber-300/80">
                          This AI assistant provides general health information and should not replace 
                          professional medical advice, diagnosis, or treatment. Always consult with 
                          qualified healthcare providers for medical concerns.
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
              <Card className="shadow-lg bg-card border rounded-2xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/80"></div>
                <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bot className="w-6 h-6 mr-2" />
                      <div>
                        <CardTitle>Gemini 1.5 Flash Medical Assistant</CardTitle>
                        <CardDescription className="text-primary-foreground/80">
                          Ask me anything about health and wellness
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-primary-foreground hover:bg-primary/20 rounded-full"
                      onClick={() => setChatStarted(false)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <GeminiMedicalChatbot />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}