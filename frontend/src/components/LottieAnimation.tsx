import React, { useEffect, useState } from 'react';
// Using lottie-react for better React integration
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

interface LottieAnimationProps {
  animationData: string | object;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  onClick?: () => void;
}

// Fallback animation data - simplified version
const fallbackAnimation = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 90,
  w: 200,
  h: 200,
  nm: "Fallback Animation",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Shape Layer 1",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 4, k: [{ i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [0] }, { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [120] }, { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 60, s: [240] }, { t: 90, s: [360] }], ix: 10 },
        p: { a: 0, k: [100, 100, 0], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [40, 40], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              nm: "Ellipse Path 1",
              mn: "ADBE Vector Shape - Ellipse",
              hd: false
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.3, 0.7, 1, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false
            }
          ],
          nm: "Ellipse",
          np: 2,
          cix: 2,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false
        }
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0
    }
  ]
};

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  className = '',
  loop = true,
  autoplay = true,
  speed = 1,
  onClick,
}) => {
  const [resolvedAnimationData, setResolvedAnimationData] = useState<object | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const lottieRef = React.useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    const loadAnimation = async (): Promise<void> => {
      // Handle Vite/Webpack default exports for JSON when imported as objects
      let dataToUse = animationData;
      if (typeof dataToUse === 'object' && dataToUse !== null && 'default' in dataToUse) {
        dataToUse = (dataToUse as any).default;
      }

      // If animationData is already an object, use it directly
      if (typeof dataToUse !== 'string') {
        setResolvedAnimationData(dataToUse);
        setLoading(false);
        return;
      }

      // If animationData is a string path, fetch it
      try {
        // For Vite projects, files in the public directory can be fetched directly
        const response = await fetch(dataToUse as string);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch animation: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setResolvedAnimationData(data);
      } catch (err) {
        console.error('Error loading Lottie animation:', err);
        // Use fallback animation
        setResolvedAnimationData(fallbackAnimation);
      } finally {
        setLoading(false);
      }
    };

    loadAnimation();
  }, [animationData]);

  useEffect(() => {
    // Set the speed when the component mounts or when speed changes
    if (lottieRef.current && speed !== undefined) {
      lottieRef.current.setSpeed(speed);
    }
  }, [speed]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" role="status">
          <span className="sr-only">Loading animation...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={className} onClick={onClick}>
      {resolvedAnimationData && (
        <Lottie
          animationData={resolvedAnimationData}
          loop={loop}
          autoplay={autoplay}
          lottieRef={lottieRef}
          className="w-full h-full"
        />
      )}
    </div>
  );
};