"use client";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

export const GlareCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const isPointerInside = useRef(false);
  const refElement = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!refElement.current) return;
    const rect = refElement.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPointerPosition({ x, y });
    if (!isPointerInside.current) {
      isPointerInside.current = true;
      setOpacity(1);
    }
  };

  const handleMouseLeave = () => {
    isPointerInside.current = false;
    setOpacity(0);
  };

  return (
    <div
      ref={refElement}
      className={cn(
        "relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        boxShadow: "0 0 20px rgba(0,0,0,0.1)",
      }}
    >
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${pointerPosition.x}px ${pointerPosition.y}px, rgba(255,255,255,.1), transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};