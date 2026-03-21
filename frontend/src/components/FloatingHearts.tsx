import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface FloatingHeartProps {
  delay?: number;
  duration?: number;
  size?: number;
  opacity?: number;
}

const FloatingHeart = ({ 
  delay = 0, 
  duration = 5,
  size = 20,
  opacity = 0.3
}: FloatingHeartProps) => {
  return (
    <motion.div
      className="absolute"
      initial={{ opacity: 0, y: 0 }}
      animate={{ 
        opacity: [0, opacity, 0],
        y: -100,
        x: [0, 5, -5, 0], // Reduced movement for subtlety
        scale: [1, 1.1, 1] // Added subtle scaling
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3, // Reduced repeat delay
        ease: "easeOut"
      }}
    >
      <Heart 
        size={size} 
        className="text-primary" // Use primary color from theme
        fill="currentColor"
      />
    </motion.div>
  );
};

export function FloatingHearts() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => ( // Reduced number of hearts for subtlety
        <div 
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          <FloatingHeart 
            delay={i * 0.8} // Increased delay between animations
            duration={6 + Math.random() * 4} // Slightly longer duration
            size={12 + Math.random() * 12} // Smaller size range
            opacity={0.15 + Math.random() * 0.2} // Lower opacity for subtlety
          />
        </div>
      ))}
    </div>
  );
}