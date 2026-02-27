import { useEffect, useRef, useState } from "react";

interface ProgressBarProps {
  targetProgress: number;
}

const ProgressBar = ({ targetProgress }: ProgressBarProps) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const animRef = useRef<number>();
  const currentRef = useRef(0);

  useEffect(() => {
    const start = currentRef.current;
    const end = targetProgress;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = start + (end - start) * eased;
      currentRef.current = value;
      setDisplayProgress(value);
      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [targetProgress]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2 font-body text-sm">
        <span className="text-muted-foreground tracking-wider uppercase text-xs">Progress</span>
        <span className="text-rose-gold font-medium">{Math.round(displayProgress)}%</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden rose-glow">
        <div
          className="h-full rounded-full transition-none"
          style={{
            width: `${displayProgress}%`,
            background: `linear-gradient(90deg, hsl(var(--rose-gold-dark)), hsl(var(--rose-gold)), hsl(var(--gold-shimmer)))`,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;