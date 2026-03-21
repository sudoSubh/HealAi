import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface HeartAnimationProps {
  className?: string;
  size?: number;
  color?: string;
}

export function HeartAnimation({ 
  className = "", 
  size = 24,
  color = "text-primary" // Changed to use primary theme color
}: HeartAnimationProps) {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.15, 1], // More subtle scaling
        rotate: [0, 3, -3, 0], // More subtle rotation
      }}
      transition={{
        duration: 3, // Slower, more elegant animation
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      <Heart 
        className={color} 
        size={size} 
        fill="currentColor"
      />
    </motion.div>
  );
}