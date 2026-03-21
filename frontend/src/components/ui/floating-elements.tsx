import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FloatingElementProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FloatingElement({ 
  children, 
  delay = 0, 
  duration = 6, 
  className = "" 
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-10, 10, -10],
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

export function PulsingOrb({ 
  size = 100, 
  color = "bg-gradient-to-r from-blue-400 to-purple-500",
  className = "",
  delay = 0 
}: {
  size?: number;
  color?: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`rounded-full ${color} ${className}`}
      style={{ width: size, height: size }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

export function GlowingCard({ 
  children, 
  className = "",
  glowColor = "hsl(var(--health-primary))" 
}: {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}) {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      style={{
        filter: `drop-shadow(0 0 20px ${glowColor}40)`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" />
      {children}
    </motion.div>
  );
}