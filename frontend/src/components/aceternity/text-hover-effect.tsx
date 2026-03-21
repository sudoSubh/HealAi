"use client";

import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type PresetType = "blur" | "shake" | "scale" | "jump" | "background" | "stroke";
type TextHoverEffectProps = {
  text: string;
  className?: string;
  duration?: number;
  preset?: PresetType;
};

const defaultVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

const presetVariants: Record<PresetType, Variants> = {
  blur: {
    initial: {
      filter: "blur(10px)",
      opacity: 0,
    },
    animate: {
      filter: "blur(0px)",
      opacity: 1,
    },
  },
  shake: {
    initial: {
      x: 0,
    },
    animate: {
      x: [0, -5, 5, -5, 5, 0],
      transition: {
        duration: 0.5,
      },
    },
  },
  scale: {
    initial: {
      scale: 0,
    },
    animate: {
      scale: 1,
    },
  },
  jump: {
    initial: {
      y: 0,
    },
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 0.5,
      },
    },
  },
  background: {
    initial: {
      backgroundClip: "text",
      background: "linear-gradient(90deg, #000, #000)",
    },
    animate: {
      background: ["linear-gradient(90deg, #000, #000)", "linear-gradient(90deg, #000, #000)"],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  },
  stroke: {
    initial: {
      textShadow: "0 0 0px #000",
    },
    animate: {
      textShadow: ["0 0 0px #000", "0 0 10px #000", "0 0 0px #000"],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  },
};

const TextHoverEffect = ({
  text,
  className,
  duration = 0.3,
  preset = "blur",
}: TextHoverEffectProps) => {
  const variants = presetVariants[preset] || defaultVariants;

  return (
    <motion.div
      className={cn("text-4xl font-bold cursor-pointer", className)}
      initial="initial"
      whileHover="animate"
      variants={variants}
      transition={{ duration, ease: "easeInOut" }}
    >
      {text}
    </motion.div>
  );
};

export default TextHoverEffect;