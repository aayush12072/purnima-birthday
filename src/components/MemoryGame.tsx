import { useState, useEffect, useCallback, useRef } from "react";

/* ── CUSTOMIZATION: Card image pairs (10 pairs = 20 cards, will be 12 later) ── */
const CARD_IMAGES = [
  "/images/card1.jpg",
  "/images/card2.jpg",
  "/images/card3.jpg",
  "/images/card4.jpg",
  "/images/card5.jpg",
  "/images/card6.jpg",
  "/images/card7.jpg",
  "/images/card8.jpg",
  "/images/card9.jpg",
  "/images/card10.jpg",
  "/images/card11.jpg",
  "/images/card12.jpg",
];

interface MemoryGameProps {
  onComplete: () => void;
  onStart: () => void;
}

interface Card {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

/* ── Heart shape layout for 24 cards ── */
const HEART_POSITIONS: { row: number; col: number }[] = [
  { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 4 }, { row: 0, col: 5 },
  { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 }, { row: 1, col: 5 }, { row: 1, col: 6 },
  { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 }, { row: 2, col: 5 }, { row: 2, col: 6 },
  { row: 3, col: 1 }, { row: 3, col: 2 }, { row: 3, col: 3 }, { row: 3, col: 4 }, { row: 3, col: 5 },
  { row: 4, col: 3 },
];

const GRID_ROWS = 5;
const GRID_COLS = 7;

const MemoryGame = ({ onComplete, onStart }: MemoryGameProps) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [started, setStarted] = useState(false);
  const flipSoundRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Preload all images so they appear instantly when flipped
    CARD_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const pairs = [...CARD_IMAGES, ...CARD_IMAGES];
    const shuffled = pairs
      .map((image, i) => ({ image, sort: Math.random(), id: i }))
      .sort((a, b) => a.sort - b.sort)
      .map((item, index) => ({
        id: index,
        image: item.image,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
  }, []);

  const playFlipSound = useCallback(() => {
    try {
      if (!flipSoundRef.current) {
        flipSoundRef.current = new AudioContext();
      }
      const ctx = flipSoundRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio not available
    }
  }, []);

  const handleCardClick = useCallback(
    (id: number) => {
      if (!started) {
        setStarted(true);
        onStart();
      }

      if (flippedIds.length >= 2) return;
      const card = cards[id];
      if (!card || card.isFlipped || card.isMatched) return;

      playFlipSound();

      const newCards = [...cards];
      newCards[id] = { ...newCards[id], isFlipped: true };
      setCards(newCards);

      const newFlipped = [...flippedIds, id];
      setFlippedIds(newFlipped);

      if (newFlipped.length === 2) {
        const [first, second] = newFlipped;
        if (newCards[first].image === newCards[second].image) {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c, i) =>
                i === first || i === second ? { ...c, isMatched: true } : c
              )
            );
            const newMatched = matchedPairs + 1;
            setMatchedPairs(newMatched);
            if (newMatched === CARD_IMAGES.length) {
              setTimeout(onComplete, 600);
            }
          }, 500);
          setFlippedIds([]);
        } else {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c, i) =>
                i === first || i === second ? { ...c, isFlipped: false } : c
              )
            );
            setFlippedIds([]);
          }, 900);
        }
      }
    },
    [cards, flippedIds, matchedPairs, onComplete, onStart, playFlipSound, started]
  );

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="font-display text-2xl text-rose-gradient">
        Match the Pairs 💕
      </h2>
      <p className="text-rose-gold-light font-body text-xs text-center leading-relaxed max-w-[280px]">
        It's been long since we last played memory game, let's break that sad streak
        <br />
        <span className="italic text-muted-foreground">(Your b'day, I'll let you beat me this time)</span>
      </p>
      <p className="text-muted-foreground font-body text-sm">
        {matchedPairs}/{CARD_IMAGES.length} pairs found
      </p>

      <div className="w-full flex justify-center items-center">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
            gap: "6px",
            width: "min(90vw, 420px)",
            margin: "0 auto",
          }}
        >
          {Array.from({ length: GRID_ROWS * GRID_COLS }).map((_, i) => {
            const row = Math.floor(i / GRID_COLS);
            const col = i % GRID_COLS;
            const posIndex = HEART_POSITIONS.findIndex(
              (p) => p.row === row && p.col === col
            );

            if (posIndex === -1) {
              return <div key={`empty-${i}`} className="aspect-square" />;
            }

            const card = cards[posIndex];
            if (!card) return <div key={`empty-${i}`} className="aspect-square" />;

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(posIndex)}
                className={`aspect-square rounded-lg overflow-hidden flex items-center justify-center relative
                  transition-all duration-500 cursor-pointer select-none
                  ${
                    card.isMatched
                      ? "rose-glow-intense scale-95 opacity-80"
                      : card.isFlipped
                      ? "rose-glow"
                      : "hover:scale-105"
                  }`}
                style={{
                  background: card.isFlipped || card.isMatched
                    ? "transparent"
                    : `hsl(var(--secondary))`,
                  border: `1px solid ${
                    card.isFlipped || card.isMatched
                      ? "hsl(var(--rose-gold) / 0.5)"
                      : "hsl(var(--border))"
                  }`,
                  transform: card.isFlipped || card.isMatched ? "rotateY(180deg)" : "rotateY(0deg)",
                  transformStyle: "preserve-3d",
                }}
                disabled={card.isMatched}
              >
                <img
                  src={card.image}
                  alt="Memory card"
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover rounded-lg absolute inset-0"
                  style={{
                    transform: card.isFlipped || card.isMatched ? "rotateY(180deg)" : "rotateY(180deg)",
                    opacity: card.isFlipped || card.isMatched ? 1 : 0,
                    transition: "opacity 0.3s",
                  }}
                />
                {!card.isFlipped && !card.isMatched && (
                  <span className="text-muted-foreground text-xs">✦</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MemoryGame;
