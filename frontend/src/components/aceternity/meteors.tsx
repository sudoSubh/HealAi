"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const Meteors = ({
  number = 20,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const meteors = new Array(number).fill(true);
  
  return (
    <>
      {meteors.map((_, idx) => (
        <span
          key={"meteor" + idx}
          className={cn(
            "animate-meteor absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-emerald-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#10b981] before:to-transparent",
            className
          )}
          style={{
            top: Math.floor(Math.random() * 100) + "%",
            left: Math.floor(Math.random() * 100) + "%",
            animationDelay: Math.random() * 0.6 + 0.2 + "s",
            animationDuration: Math.floor(Math.random() * 8 + 2) + "s",
          }}
        />
      ))}
    </>
  );
};

export const MeteorsCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Meteors number={10} />
      {children}
    </div>
  );
};
