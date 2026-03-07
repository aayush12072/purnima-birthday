import { useState, useCallback, useRef, useEffect } from "react";

/* ── CUSTOMIZATION: Surprise button text sequence ── */
const CLICK_MESSAGES = [
  "Haha - got you.",
  "Even though you don't drink – are you drunk?",
  "Okay okay – before you get mad – here it is.",
];

/* ── CUSTOMIZATION: Final destination URL ── */
const FINAL_URL = "https://www.instagram.com/reel/DVmACiDkiYpBkYsW84H2UvPdCNCQX1TdJ1-A4Q0/?igsh=c3NpYTAyajQ1YTdl";

const SurpriseButton = () => {
  const [clickCount, setClickCount] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const moveButton = useCallback(() => {
    if (!containerRef.current || !buttonRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const btn = buttonRef.current.getBoundingClientRect();
    const padding = 12;

    const maxTx = (container.width - btn.width) / 2 - padding;
    const maxTy = (container.height - btn.height) / 2 - padding * 3;

    const quadrants = [
      { x: -maxTx * 0.85, y: -maxTy * 0.8 },
      { x: maxTx * 0.85, y: -maxTy * 0.8 },
      { x: -maxTx * 0.85, y: maxTy * 0.8 },
      { x: maxTx * 0.85, y: maxTy * 0.8 },
      { x: 0, y: -maxTy * 0.9 },
      { x: -maxTx * 0.9, y: 0 },
      { x: maxTx * 0.9, y: 0 },
      { x: 0, y: maxTy * 0.9 },
    ];

    let best = quadrants[0];
    let bestDist = 0;
    for (const q of quadrants) {
      const dist = Math.abs(q.x - offset.x) + Math.abs(q.y - offset.y);
      if (dist > bestDist) {
        bestDist = dist;
        best = q;
      }
    }

    const jitterX = (Math.random() - 0.5) * maxTx * 0.3;
    const jitterY = (Math.random() - 0.5) * maxTy * 0.3;

    setOffset({
      x: Math.max(-maxTx, Math.min(maxTx, best.x + jitterX)),
      y: Math.max(-maxTy, Math.min(maxTy, best.y + jitterY)),
    });
  }, [offset]);

  useEffect(() => {
    const handleResize = () => {
      setOffset({ x: 0, y: 0 });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* FIX #2: Click sequence — clicks 1-3 move, click 4 opens Instagram */
  const handleClick = () => {
    const next = clickCount + 1;
    setClickCount(next);

    if (next <= CLICK_MESSAGES.length) {
      setMessage(CLICK_MESSAGES[next - 1]);
      // Move on every click that shows a message (clicks 1, 2, 3)
      setTimeout(moveButton, 100);
    }

    if (next > CLICK_MESSAGES.length) {
      window.open(FINAL_URL, "_blank");
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center overflow-hidden"
      style={{ height: "280px" }}
    >
      {message && (
        <div className="text-center mb-4 animate-fade-up relative z-10">
          <p className="font-display text-xl text-rose-gold-light italic">
            {message}
          </p>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center w-full">
        <button
          ref={buttonRef}
          onClick={handleClick}
          className="px-8 py-4 rounded-lg font-display text-lg font-semibold
                     bg-primary text-primary-foreground rose-glow shimmer
                     hover:scale-105 active:scale-95 whitespace-nowrap"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {clickCount >= CLICK_MESSAGES.length ? "🎁 Open Your Surprise" : "🎁 Click for Surprise"}
        </button>
      </div>
    </div>
  );
};

export default SurpriseButton;