"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export const MovingBorder = ({
  children,
  duration = 2000,
  className,
  containerClassName,
  borderClassName,
  as: Component = "div",
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  as?: React.ElementType;
  [key: string]: unknown;
}) => {
  return (
    <Component
      className={cn(
        "bg-transparent relative text-xl p-[1px] overflow-hidden",
        containerClassName
      )}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: "inherit" }}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: duration / 1000,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            inset: "-100%",
            background: `conic-gradient(from 0deg, transparent 0 340deg, #10b981 360deg)`,
          }}
          className={cn(borderClassName)}
        />
      </div>

      <div
        className={cn(
          "relative bg-card backdrop-blur-xl flex items-center justify-center w-full h-full text-sm antialiased",
          className
        )}
        style={{ borderRadius: "inherit" }}
      >
        {children}
      </div>
    </Component>
  );
};

export const MovingBorderButton = ({
  children,
  className,
  containerClassName,
  borderClassName,
  duration,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
}) => {
  return (
    <MovingBorder
      as="button"
      duration={duration}
      containerClassName={cn("rounded-full", containerClassName)}
      borderClassName={borderClassName}
      className={cn(
        "px-6 py-3 font-medium text-foreground rounded-full",
        className
      )}
      {...props}
    >
      {children}
    </MovingBorder>
  );
};
