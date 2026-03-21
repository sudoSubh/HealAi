import { Heart, MapPin, BookOpen, Bot, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CardContainer, CardBody, CardItem } from "@/components/aceternity/3d-card";
import { GlareCard } from "@/components/aceternity/glare-card";
import { motion } from "framer-motion";

const features = [
  {
    icon: Heart,
    title: "Symptom Checker",
    description: "AI-powered analysis to help understand your symptoms and get personalized recommendations.",
    color: "from-rose-500 to-red-600",
    bgColor: "bg-rose-500/10",
    url: "/symptoms"
  },
  {
    icon: MapPin,
    title: "Resource Locator",
    description: "Find nearby health services, specialists, and wellness centers with ease.",
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-500/10",
    url: "/resources"
  },
  {
    icon: BookOpen,
    title: "Health Education",
    description: "Access comprehensive health resources and stay informed with expert content.",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-500/10",
    url: "/education"
  },
  {
    icon: Bot,
    title: "Medical Bot",
    description: "Get instant health guidance and support through our AI-powered medical assistant.",
    color: "from-cyan-500 to-teal-600",
    bgColor: "bg-cyan-500/10",
    url: "/medical-bot"
  },
];

export function FeaturesSection() {
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <motion.h2 
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Comprehensive Health Features
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Everything you need to manage your health and wellness journey in one place.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CardContainer className="inter-var w-full">
                <CardBody className="bg-card relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-card border-border w-full h-auto rounded-2xl p-6 border transition-all duration-300">
                  <CardItem
                    translateZ="100"
                    className="w-full"
                  >
                    <GlareCard className="p-6 bg-transparent border-0">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <CardItem
                          translateZ="50"
                          className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}
                        >
                          <feature.icon className="h-8 w-8 text-white" />
                        </CardItem>
                        <div className="space-y-2">
                          <CardItem
                            translateZ="60"
                            className="font-bold text-lg md:text-xl text-foreground"
                          >
                            {feature.title}
                          </CardItem>
                          <CardItem
                            as="p"
                            translateZ="40"
                            className="text-muted-foreground text-sm leading-relaxed"
                          >
                            {feature.description}
                          </CardItem>
                        </div>
                        <CardItem translateZ="80" className="w-full pt-2">
                          <Button 
                            variant="outline" 
                            className="w-full group/btn border-border hover:border-emerald-500/50 transition-all duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(feature.url);
                            }}
                          >
                            Explore
                            <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </CardItem>
                      </div>
                    </GlareCard>
                  </CardItem>
                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
