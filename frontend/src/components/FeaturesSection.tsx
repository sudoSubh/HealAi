import { Heart, MapPin, BookOpen, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CardContainer, CardBody, CardItem } from "@/components/aceternity/3d-card";

const features = [
  {
    icon: Heart,
    title: "Symptom Checker",
    description: "AI-powered analysis to help understand your symptoms and get personalized recommendations.",
    color: "text-red-500",
    url: "/symptoms"
  },
  {
    icon: MapPin,
    title: "Resource Locator",
    description: "Find nearby health services, specialists, and wellness centers with ease.",
    color: "text-green-500",
    url: "/resources"
  },
  {
    icon: BookOpen,
    title: "Health Education",
    description: "Access comprehensive health resources and stay informed with expert content.",
    color: "text-purple-500",
    url: "/education"
  },
  
  {
    icon: Bot,
    title: "Medical Bot",
    description: "Get instant health guidance and support through our AI-powered medical assistant.",
    color: "text-cyan-500",
    url: "/medical-bot"
  },
];

export function FeaturesSection() {
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Comprehensive Health Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Everything you need to manage your health and wellness journey in one place.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <CardContainer key={feature.title} className="inter-var">
              <CardBody className="bg-white relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto h-auto rounded-xl p-6 border">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`${feature.color} p-3 rounded-lg bg-white shadow-sm`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg md:text-xl mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm md:text-base mb-4">{feature.description}</p>
                      <Button 
                        variant="outline" 
                        className="w-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(feature.url);
                        }}
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </div>
    </section>
  );
}