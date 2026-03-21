import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  BookOpen, 
  Video, 
  Calendar, 
  Calculator, 
  Users,
  Search,
  Star,
  Clock,
  Play,
  TrendingUp,
  Target,
  Brain,
  Shield,
  Activity,
  Droplets,
  Thermometer,
  Wind,
  MapPin,
  CloudRain,
  Leaf,
  Utensils,
  Baby,
  Waves,
  Sun,
  Bookmark,
  Syringe,
  ChevronRight,
  Filter
} from "lucide-react";
import { motion } from "framer-motion";
import { LottieAnimation } from "@/components/LottieAnimation";
import { ModeToggle } from "@/components/mode-toggle";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { HealthMetricCard } from "@/components/ui/health-metrics-card";
import { GradientButton } from "@/components/ui/gradient-button";
import educationAnimation from "../../public/animations/ai-health-animation.json";

// Types for our educational content
interface EducationalResource {
  id: string;
  title: string;
  type: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  color: string;
  bgColor: string;
  count: string;
  rating: number;
}

interface FeaturedContent {
  id: string;
  title: string;
  type: string;
  duration: string;
  category: string;
  rating: number;
  views: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  region: string;
  image?: string;
}

interface HealthTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  articles: number;
  videos: number;
  region: string;
}

interface DiseaseInfo {
  id: string;
  name: string;
  cases: number;
  deaths: number;
  recovery: number;
  prevention: string[];
  region: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface PreventionMethod {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  steps: string[];
  region: string;
  image?: string;
}

export default function EducationHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("prevention");

  // Categories for filtering
  const categories = [
    { id: "all", name: "All Topics", count: 245 },
    { id: "preventive-care", name: "Preventive Care", count: 68 },
    { id: "disease-awareness", name: "Disease Awareness", count: 52 },
    { id: "nutrition", name: "Nutrition", count: 42 },
    { id: "fitness", name: "Fitness", count: 38 },
    { id: "mental-health", name: "Mental Health", count: 28 },
    { id: "maternal-child", name: "Maternal & Child", count: 17 }
  ];

  // Educational resources
  const educationalResources: EducationalResource[] = [
    {
      id: "1",
      title: "Preventive Health Articles",
      type: "Article Collection",
      description: "Evidence-based articles on disease prevention and wellness",
      icon: BookOpen,
      link: "/education/articles",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      count: "150+ Articles",
      rating: 4.9
    },
    {
      id: "2",
      title: "Health Education Videos",
      type: "Video Content",
      description: "Expert-led educational videos on health topics",
      icon: Video,
      link: "/education/videos",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      count: "95+ Videos",
      rating: 4.8
    },
    {
      id: "3",
      title: "Live Health Webinars",
      type: "Interactive Sessions",
      description: "Real-time sessions with healthcare experts from Odisha",
      icon: Calendar,
      link: "/education/webinars",
      color: "text-green-500",
      bgColor: "bg-green-50",
      count: "25+ Sessions",
      rating: 4.7
    },
    {
      id: "4",
      title: "Health Calculators",
      type: "Interactive Tools",
      description: "Calculate your BMI, BMR, and more",
      icon: Calculator,
      link: "/education/calculators",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      count: "10+ Calculators",
      rating: 4.6
    },
    {
      id: "5",
      title: "Healthcare Professionals",
      type: "Directory",
      description: "Find doctors, specialists, and clinics in Odisha",
      icon: Users,
      link: "/education/doctors",
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      count: "500+ Professionals",
      rating: 4.5
    }
  ];

  // Append Vaccinations resource
  educationalResources.push({
    id: "6",
    title: "Vaccinations",
    type: "Immunization",
    description: "General immunization info and schedules (UIP India)",
    icon: Syringe,
    link: "/education/vaccinations",
    color: "text-teal-500",
    bgColor: "bg-teal-50",
    count: "All age groups",
    rating: 4.9
  });

  // Health topics specific to Odisha and India
  const healthTopics: HealthTopic[] = [
    {
      id: "1",
      title: "Malaria Prevention",
      description: "Prevention methods for malaria in Odisha's climate",
      icon: Droplets,
      color: "text-red-500",
      articles: 24,
      videos: 12,
      region: "Odisha"
    },
    {
      id: "2",
      title: "Dengue Awareness",
      description: "Understanding and preventing dengue outbreaks",
      icon: Thermometer,
      color: "text-orange-500",
      articles: 18,
      videos: 9,
      region: "India"
    },
    {
      id: "3",
      title: "Monsoon Health",
      description: "Staying healthy during monsoon season in India",
      icon: CloudRain,
      color: "text-blue-500",
      articles: 15,
      videos: 7,
      region: "India"
    },
    {
      id: "4",
      title: "Ayurvedic Wellness",
      description: "Traditional Indian wellness practices",
      icon: Leaf,
      color: "text-green-500",
      articles: 32,
      videos: 18,
      region: "India"
    },
    {
      id: "5",
      title: "Maternal Health",
      description: "Prenatal and postnatal care in rural Odisha",
      icon: Baby,
      color: "text-pink-500",
      articles: 28,
      videos: 14,
      region: "Odisha"
    },
    {
      id: "6",
      title: "Nutrition for All",
      description: "Balanced nutrition for different age groups in India",
      icon: Utensils,
      color: "text-amber-500",
      articles: 22,
      videos: 11,
      region: "India"
    }
  ];

  // Disease information for Odisha and India
  const diseaseInfo: DiseaseInfo[] = [
    {
      id: "1",
      name: "Malaria",
      cases: 1247,
      deaths: 3,
      recovery: 98,
      prevention: [
        "Use mosquito nets",
        "Eliminate stagnant water",
        "Apply repellents",
        "Seek early treatment"
      ],
      region: "Odisha",
      icon: Droplets,
      color: "text-red-500"
    },
    {
      id: "2",
      name: "Dengue",
      cases: 856,
      deaths: 2,
      recovery: 95,
      prevention: [
        "Cover water containers",
        "Wear protective clothing",
        "Use repellents",
        "Report symptoms early"
      ],
      region: "Odisha",
      icon: Thermometer,
      color: "text-orange-500"
    },
    {
      id: "3",
      name: "Cholera",
      cases: 142,
      deaths: 0,
      recovery: 100,
      prevention: [
        "Drink boiled water",
        "Wash hands regularly",
        "Eat cooked food",
        "Maintain hygiene"
      ],
      region: "Odisha",
      icon: Waves,
      color: "text-blue-500"
    },
    {
      id: "4",
      name: "Tuberculosis",
      cases: 3241,
      deaths: 45,
      recovery: 85,
      prevention: [
        "Complete treatment",
        "Cover mouth when coughing",
        "Ventilate rooms",
        "Healthy nutrition"
      ],
      region: "India",
      icon: Wind,
      color: "text-gray-500"
    }
  ];

  // Prevention methods
  const preventionMethods: PreventionMethod[] = [
    {
      id: "1",
      title: "Mosquito-Borne Disease Prevention",
      description: "Protect yourself from malaria, dengue, and chikungunya",
      icon: Droplets,
      steps: [
        "Eliminate stagnant water around your home",
        "Use mosquito nets and repellents",
        "Wear full-sleeve clothing during peak hours",
        "Seek medical help at first sign of fever"
      ],
      region: "Odisha",
      image: "/demoPlaceholder.webp"
    },
    {
      id: "2",
      title: "Waterborne Disease Prevention",
      description: "Stay safe from cholera, typhoid, and diarrhea",
      icon: Waves,
      steps: [
        "Drink only boiled or purified water",
        "Wash hands with soap regularly",
        "Cook food thoroughly",
        "Maintain kitchen and toilet hygiene"
      ],
      region: "India",
      image: "/mental-health.jpg"
    },
    {
      id: "3",
      title: "Respiratory Infection Prevention",
      description: "Prevent flu, cold, and tuberculosis",
      icon: Wind,
      steps: [
        "Cover mouth and nose when coughing/sneezing",
        "Avoid crowded places during outbreaks",
        "Ventilate rooms regularly",
        "Maintain good nutrition and exercise"
      ],
      region: "India",
      image: "/nutrition.jpg"
    },
    {
      id: "4",
      title: "Seasonal Health Maintenance",
      description: "Stay healthy during monsoon and summer",
      icon: Sun,
      steps: [
        "Stay hydrated and eat light food",
        "Avoid street food during monsoon",
        "Use umbrellas and light clothing",
        "Take precautions against heatstroke"
      ],
      region: "India",
      image: "/fitness.jpg"
    }
  ];

  // Featured content specific to Odisha and India
  const featuredContent: FeaturedContent[] = [
    {
      id: "1",
      title: "Malaria Prevention in Odisha: A Complete Guide",
      type: "Article",
      duration: "12 min read",
      category: "Disease Prevention",
      rating: 4.9,
      views: "15.2k",
      icon: Droplets,
      link: "/education/articles/malaria-prevention",
      region: "Odisha",
      image: "/demoPlaceholder.webp"
    },
    {
      id: "2",
      title: "Monsoon Health Tips for Indian Families",
      type: "Video",
      duration: "18 min",
      category: "Seasonal Health",
      rating: 4.8,
      views: "12.7k",
      icon: CloudRain,
      link: "/education/videos/monsoon-health",
      region: "India",
      image: "/mindfulness.jpg"
    },
    {
      id: "3",
      title: "Ayurvedic Immunity Boosters for All Seasons",
      type: "Article",
      duration: "10 min read",
      category: "Traditional Medicine",
      rating: 4.7,
      views: "9.5k",
      icon: Leaf,
      link: "/education/articles/ayurvedic-immunity",
      region: "India",
      image: "/meal-prep.jpg"
    },
    {
      id: "4",
      title: "Maternal Health Care in Rural Odisha",
      type: "Video",
      duration: "22 min",
      category: "Maternal Health",
      rating: 4.9,
      views: "8.3k",
      icon: Baby,
      link: "/education/videos/maternal-health",
      region: "Odisha",
      image: "/heroImage.webp"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-card shadow-lg border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center">
                  <BookOpen className="w-8 h-8 mr-3 text-primary" />
                  Health Education Hub
                </h1>
                <p className="text-muted-foreground mt-1">Preventive care, disease awareness, and wellness for Odisha & India</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-primary text-primary-foreground shadow-lg rounded-full px-4 py-2">
                <MapPin className="w-4 h-4 mr-1" />
                Odisha, India
              </Badge>
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Hero Section with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-10 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border relative overflow-hidden"
          >
            {/* Background image */}
            <div className="absolute inset-0 bg-[url('/heroImage.webp')] bg-cover bg-center opacity-20"></div>
            
            <div className="relative z-10">
              <div className="inline-block mb-6">
                <LottieAnimation 
                  animationData={educationAnimation}
                  className="w-40 h-40 mx-auto"
                  loop={true}
                  autoplay={true}
                />
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-4">Empower Your Health Journey</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Evidence-based health education focused on preventive care, disease awareness, and wellness
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <GradientButton variant="primary" size="lg" onClick={() => setActiveTab("prevention")}> 
                  <Shield className="w-5 h-5 mr-2" />
                  Preventive Care
                </GradientButton>
                <GradientButton variant="secondary" size="lg" onClick={() => setActiveTab("diseases")}>
                  <Activity className="w-5 h-5 mr-2" />
                  Disease Awareness
                </GradientButton>
                <Link to="/education/vaccinations">
                  <GradientButton variant="success" size="lg">
                    <Syringe className="w-5 h-5 mr-2" />
                    Vaccinations
                  </GradientButton>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Search and Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-3xl p-8 shadow-lg border"
          >
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search health topics, diseases, or wellness guides..."
                  className="pl-12 bg-background border-input rounded-full h-12 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Filter by Category</h3>
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-5 py-3 rounded-full text-base font-medium transition-all ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name} <span className="opacity-70 ml-1">({category.count})</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Tab Navigation for Content Sections */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button 
              variant={activeTab === "prevention" ? "default" : "outline"} 
              className={`rounded-full ${activeTab === "prevention" ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setActiveTab("prevention")}
            >
              <Shield className="w-4 h-4 mr-2" />
              Prevention Methods
            </Button>
            <Button 
              variant={activeTab === "diseases" ? "default" : "outline"} 
              className={`rounded-full ${activeTab === "diseases" ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setActiveTab("diseases")}
            >
              <Activity className="w-4 h-4 mr-2" />
              Disease Awareness
            </Button>
            <Button 
              variant={activeTab === "topics" ? "default" : "outline"} 
              className={`rounded-full ${activeTab === "topics" ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setActiveTab("topics")}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Health Topics
            </Button>
          </div>

          {/* Prevention Methods Section */}
          {activeTab === "prevention" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <h3 className="text-3xl font-bold text-foreground flex items-center">
                <Shield className="w-8 h-8 mr-3 text-primary" />
                Preventive Health Care Methods
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {preventionMethods.map((method, index) => (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ y: -5 }}
                    className="h-full"
                  >
                    <Card className="h-full bg-card border shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
                      <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-start mb-6 gap-6">
                          <div className={`w-16 h-16 rounded-2xl ${method.icon === Droplets ? 'bg-red-100 text-red-600' : method.icon === Waves ? 'bg-blue-100 text-blue-600' : method.icon === Wind ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-600'} flex items-center justify-center flex-shrink-0`}>
                            <method.icon className="w-8 h-8" />
                          </div>
                          <div>
                            <h4 className="text-2xl font-bold text-foreground">{method.title}</h4>
                            <Badge variant="secondary" className="mt-2">
                              {method.region === "Odisha" ? (
                                <span className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" /> {method.region}
                                </span>
                              ) : method.region}
                            </Badge>
                          </div>
                        </div>
                        
                        {method.image && (
                          <div className="mb-6 rounded-2xl overflow-hidden">
                            <img 
                              src={method.image} 
                              alt={method.title} 
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        )}
                        
                        <p className="text-muted-foreground mb-6 text-lg">{method.description}</p>
                        
                        <div className="space-y-4">
                          <h5 className="font-semibold text-lg flex items-center">
                            <Target className="w-5 h-5 mr-2 text-primary" />
                            Key Prevention Steps:
                          </h5>
                          <ul className="space-y-3">
                            {method.steps.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-start">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                  {stepIndex + 1}
                                </div>
                                <span className="text-foreground">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <Button className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6 text-lg">
                          Learn More Prevention Methods
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Disease Awareness Section */}
          {activeTab === "diseases" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <h3 className="text-3xl font-bold text-foreground flex items-center">
                <Activity className="w-8 h-8 mr-3 text-primary" />
                Disease Awareness & Prevention
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {diseaseInfo.map((disease, index) => (
                  <motion.div
                    key={disease.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ y: -10, scale: 1.03 }}
                    className="h-full"
                  >
                    <Card className="h-full bg-card border shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden">
                      <div className={`h-2 ${disease.color === "text-red-500" ? "bg-red-500" : disease.color === "text-orange-500" ? "bg-orange-500" : disease.color === "text-blue-500" ? "bg-blue-500" : "bg-gray-500"}`}></div>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 rounded-2xl ${disease.color === "text-red-500" ? 'bg-red-100 text-red-600' : disease.color === "text-orange-500" ? 'bg-orange-100 text-orange-600' : disease.color === "text-blue-500" ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'} flex items-center justify-center`}>
                            <disease.icon className="w-6 h-6" />
                          </div>
                          <div className="ml-3">
                            <h4 className="text-xl font-bold text-foreground">{disease.name}</h4>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {disease.region}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-muted-foreground">Cases Reported</span>
                            <span className="font-bold text-foreground">{disease.cases.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-muted-foreground">Recovery Rate</span>
                            <span className="font-bold text-green-600">{disease.recovery}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Deaths</span>
                            <span className="font-bold text-red-600">{disease.deaths}</span>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <h5 className="font-semibold text-foreground mb-2">Prevention Tips:</h5>
                          <ul className="space-y-1">
                            {disease.prevention.slice(0, 2).map((tip, tipIndex) => (
                              <li key={tipIndex} className="flex items-start text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2 flex-shrink-0"></div>
                                <span className="text-muted-foreground">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <Button variant="outline" className="w-full rounded-full border-primary text-primary hover:bg-primary/10">
                          View Complete Guide
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {/* Detailed Disease Information */}
              <Card className="bg-card border shadow-lg rounded-3xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Brain className="w-6 h-6 mr-2 text-primary" />
                    Understanding Disease Spread in Odisha
                  </CardTitle>
                  <CardDescription>
                    Key factors contributing to disease transmission and prevention strategies
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                      <Droplets className="w-10 h-10 text-blue-600 mb-4" />
                      <h4 className="text-xl font-bold text-foreground mb-2">Monsoon Season Risks</h4>
                      <p className="text-muted-foreground mb-4">
                        Increased risk of waterborne and vector-borne diseases during monsoon months (June-September)
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></div>
                          <span>Malaria and dengue cases peak</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></div>
                          <span>Cholera and diarrhea outbreaks</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                      <Thermometer className="w-10 h-10 text-orange-600 mb-4" />
                      <h4 className="text-xl font-bold text-foreground mb-2">Summer Health Concerns</h4>
                      <p className="text-muted-foreground mb-4">
                        Heat-related illnesses and dehydration risks during hot months (March-June)
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mr-2"></div>
                          <span>Heatstroke and dehydration</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mr-2"></div>
                          <span>Food poisoning from spoiled food</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
                      <Leaf className="w-10 h-10 text-green-600 mb-4" />
                      <h4 className="text-xl font-bold text-foreground mb-2">Traditional Prevention</h4>
                      <p className="text-muted-foreground mb-4">
                        Integrating Ayurvedic practices with modern medicine for holistic health
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600 mr-2"></div>
                          <span>Neem and tulsi for immunity</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600 mr-2"></div>
                          <span>Turmeric and ginger for inflammation</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Health Topics Section */}
          {activeTab === "topics" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <h3 className="text-3xl font-bold text-foreground flex items-center">
                <BookOpen className="w-8 h-8 mr-3 text-primary" />
                Health Topics for Odisha & India
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {healthTopics.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="h-full"
                  >
                    <Card className="h-full bg-card border shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 rounded-2xl ${topic.color === "text-red-500" ? 'bg-red-100 text-red-600' : topic.color === "text-orange-500" ? 'bg-orange-100 text-orange-600' : topic.color === "text-blue-500" ? 'bg-blue-100 text-blue-600' : topic.color === "text-green-500" ? 'bg-green-100 text-green-600' : topic.color === "text-pink-500" ? 'bg-pink-100 text-pink-600' : 'bg-amber-100 text-amber-600'} flex items-center justify-center`}>
                            <topic.icon className="w-6 h-6" />
                          </div>
                          <div className="ml-3">
                            <h4 className="text-xl font-bold text-foreground">{topic.title}</h4>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {topic.region}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-6">{topic.description}</p>
                        
                        <div className="flex justify-between mb-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{topic.articles}</div>
                            <div className="text-sm text-muted-foreground">Articles</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{topic.videos}</div>
                            <div className="text-sm text-muted-foreground">Videos</div>
                          </div>
                        </div>
                        
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                          Explore Topic
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {/* Educational Resources Grid */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Target className="w-6 h-6 mr-2 text-primary" />
                  Learning Resources
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {educationalResources.map((resource, index) => (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                      whileHover={{ y: -10, scale: 1.03 }}
                      className="h-full"
                    >
                      <Card className="h-full bg-card border shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden">
                        <div className={`h-2 bg-gradient-to-r from-primary to-primary/80`}></div>
                        <CardContent className="p-6">
                          <div className={`w-14 h-14 rounded-2xl ${resource.bgColor} ${resource.color} flex items-center justify-center mb-4`}>
                            <resource.icon className="w-7 h-7" />
                          </div>
                          <h4 className="text-xl font-bold text-foreground mb-2">{resource.title}</h4>
                          <p className="text-muted-foreground text-base mb-4">{resource.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-sm">
                              {resource.count}
                            </Badge>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-base font-medium ml-1 text-foreground">{resource.rating}</span>
                            </div>
                          </div>
                          <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                            Explore
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Featured Content Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-3xl font-bold text-foreground mb-6 flex items-center">
              <TrendingUp className="w-8 h-8 mr-3 text-primary" />
              Featured Health Education Content
            </h3>
            
            <Carousel className="w-full">
              <CarouselContent>
                {featuredContent.map((content, index) => (
                  <CarouselItem key={content.id} className="md:basis-1/2 lg:basis-1/2">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="h-full p-1"
                    >
                      <Card className="h-full bg-card border shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
                        <div className="relative">
                          {content.image ? (
                            <img 
                              src={content.image} 
                              alt={content.title} 
                              className="w-full h-56 object-cover"
                            />
                          ) : (
                            <div className="w-full h-56 bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center">
                              <div className={`w-16 h-16 rounded-2xl ${content.icon === Droplets ? 'bg-red-100 text-red-600' : content.icon === CloudRain ? 'bg-blue-100 text-blue-600' : content.icon === Leaf ? 'bg-green-100 text-green-600' : 'bg-pink-100 text-pink-600'} flex items-center justify-center`}>
                                <content.icon className="w-8 h-8" />
                              </div>
                            </div>
                          )}
                          <Badge className="absolute top-6 right-6 bg-primary text-primary-foreground rounded-full px-4 py-2">
                            {content.type}
                          </Badge>
                        </div>
                        <CardContent className="p-8">
                          <div className="flex items-center justify-between mb-4">
                            <Badge variant="outline" className="border-border rounded-full px-4 py-1.5">
                              {content.category}
                            </Badge>
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{content.duration}</span>
                            </div>
                          </div>
                          <h4 className="text-2xl font-bold text-foreground mb-4">{content.title}</h4>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                              <span className="text-lg font-medium ml-1 text-foreground">{content.rating}</span>
                              <span className="text-base text-muted-foreground ml-3">({content.views} views)</span>
                            </div>
                            <div className="flex items-center">
                              <Badge variant="secondary" className="mr-2">
                                <MapPin className="w-3 h-3 mr-1" /> {content.region}
                              </Badge>
                              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                                <Play className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </motion.div>

          {/* Health Metrics Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h3 className="text-3xl font-bold text-foreground mb-6 flex items-center">
              <Target className="w-8 h-8 mr-3 text-primary" />
              Health Education Impact
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <HealthMetricCard
                title="Educational Resources"
                value={245}
                icon={BookOpen}
                trend="+12%"
                trendDirection="up"
                color="text-blue-500"
                progress={85}
                maxProgress={100}
              />
              
              <HealthMetricCard
                title="Active Learners"
                value={15420}
                icon={Users}
                trend="+8%"
                trendDirection="up"
                color="text-green-500"
                progress={78}
                maxProgress={100}
              />
              
              <HealthMetricCard
                title="Course Completion"
                value="87%"
                icon={Target}
                trend="+5%"
                trendDirection="up"
                color="text-purple-500"
                progress={87}
                maxProgress={100}
              />
              
              <HealthMetricCard
                title="Satisfaction Rate"
                value="4.8/5"
                icon={Star}
                trend="+0.2"
                trendDirection="up"
                color="text-yellow-500"
                progress={96}
                maxProgress={100}
              />
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center py-12 rounded-3xl bg-gradient-to-r from-primary to-secondary backdrop-blur-sm border"
          >
            <h3 className="text-3xl font-bold text-primary-foreground mb-4">Stay Informed, Stay Healthy</h3>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
              Join thousands of Odisha residents who are taking control of their health through education
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <GradientButton variant="secondary" size="lg">
                <Bookmark className="w-5 h-5 mr-2" />
                Subscribe to Health Updates
              </GradientButton>
              <GradientButton variant="secondary" size="lg" className="bg-white/20 hover:bg-white/30 border border-white">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Health Checkup
              </GradientButton>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
