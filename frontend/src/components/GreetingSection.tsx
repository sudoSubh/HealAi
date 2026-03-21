import { useEffect, useState } from "react";
import TextHoverEffect from "@/components/aceternity/text-hover-effect";
import { AnimatedBackground } from "@/components/aceternity/animated-background";

export function GreetingSection() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <AnimatedBackground className="rounded-xl mb-8">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 backdrop-blur-sm bg-white/80">
        <TextHoverEffect 
          text={`${greeting}, User`} 
          className="text-2xl font-semibold mb-2"
          preset="scale"
        />
        <p className="text-gray-600">
          Track your health journey and discover personalized wellness resources.
        </p>
      </div>
    </AnimatedBackground>
  );
}