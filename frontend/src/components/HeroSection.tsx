import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import { GlareCard } from "@/components/aceternity/glare-card";
import TextHoverEffect from "@/components/aceternity/text-hover-effect";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-100 to-white/50 py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <TextHoverEffect 
              text="Empower Your Health Journey" 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              preset="blur"
            />
            <p className="text-lg md:text-xl text-gray-600 mb-8 animate-fade-in">
              Your trusted partner for symptom analysis, local resources, and more—all in one app.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="gap-2">
                <a href="/symptoms">
                  Get Started Today
                </a>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                Learn More
                <PlayCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <GlareCard className="rounded-xl">
              <img
                src="/heroImage.webp"
                alt="App Preview"
                className="w-full h-auto rounded-xl shadow-2xl bg-gradient-to-t from-emerald-100 to-white/50 animate-fade-in"
              />
            </GlareCard>
          </div>
        </div>
      </div>
    </div>
  );
}