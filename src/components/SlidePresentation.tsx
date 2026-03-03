import { useState, useCallback } from "react";
import ProgressBar from "./ProgressBar";
import MemoryGame from "./MemoryGame";
import SurpriseButton from "./SurpriseButton";

/* ── CUSTOMIZATION: Slide titles and messages ── */
const SLIDES = [
{
  title: "Hey Love ✨",
  subtitle: "Did you really think, I'd wish you normally?",
  body: "Had to put some non-monetary efforts to prove that I still love you",
  nextLabel: "Of Course not",
  backLabel: "I had some hope"
},
{
  title: "Chapter One 🌹",
  subtitle: "Was it destiny or was it Aayush... Why are we doing this?",
  body: "Funny it all started with CAT, and we both wanted to give CAT and do MBA during the initial phase of our career and now CAT isn't even part of our life, or maybe it's role was just to bring us closer, together.",
  nextLabel: "Destiny",
  backLabel: "Aayush..."
},
{
  title: "Chapter Two 💫",
  subtitle: "The growth",
  body: "We grew together, through laughter, through everything. That's what makes us, us.",
  nextLabel: "Of Course not",
  backLabel: "I had some hope"
},
{
  title: "Happy Birthday 💕",
  subtitle: "But but but, today is not about us, it is about youu!!",
  body: "So Purnima, here's your surprise for the day, my birthday girl!",
  nextLabel: "Open it ASAP",
  backLabel: "Is this a trick?"
}];


const JOKE_MESSAGE =
"Haha got you. You are only 50% of the way in. Don't rely on progress bars. Rely on your boyfriend. 😏";

const FINAL_REVEAL = {
  title: "You Did It! 🎉",
  subtitle: "Now here's your real surprise..."
};

const SlidePresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [gamePhase, setGamePhase] = useState<
    "slides" | "joke" | "game" | "reveal">(
    "slides");
  const [progress, setProgress] = useState(25);
  const [gameStarted, setGameStarted] = useState(false);

  const getSlideProgress = (slide: number) => {
    return (slide + 1) / SLIDES.length * 100;
  };

  const handleNext = useCallback(() => {
    if (gamePhase === "slides") {
      if (currentSlide < SLIDES.length - 1) {
        const next = currentSlide + 1;
        setCurrentSlide(next);
        setProgress(getSlideProgress(next));
      } else {
        setGamePhase("joke");
        setProgress(100);
        setTimeout(() => setProgress(50), 1500);
      }
    } else if (gamePhase === "joke") {
      setGamePhase("game");
    }
  }, [currentSlide, gamePhase]);

  const handlePrev = useCallback(() => {
    if (gamePhase === "slides" && currentSlide > 0) {
      const prev = currentSlide - 1;
      setCurrentSlide(prev);
      setProgress(getSlideProgress(prev));
    }
  }, [currentSlide, gamePhase]);

  const handleGameStart = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
      setProgress(75);
    }
  }, [gameStarted]);

  const handleGameComplete = useCallback(() => {
    setGamePhase("reveal");
    setProgress(100);
  }, []);

  return (
    <div className="min-h-screen bg-wash noise-overlay flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-40 p-4 pt-6">
        <ProgressBar targetProgress={progress} />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pt-20 pb-8">
        <div className="glass-strong rounded-2xl rose-glow p-8 md:p-12 w-full max-w-lg relative overflow-hidden">
          <div className="shimmer absolute inset-0 rounded-2xl pointer-events-none" />

          <div className="relative z-10">
            {gamePhase === "slides" &&
            <div key={currentSlide} className="animate-fade-up text-center space-y-6">
                <h1 className="font-display text-4xl font-bold text-rose-gradient leading-normal py-1 md:text-6xl">
                  {SLIDES[currentSlide].title}
                </h1>
                <p className="font-display text-lg italic text-rose-gold-light">
                  {SLIDES[currentSlide].subtitle}
                </p>
                <p className="font-body text-foreground/80 text-base leading-relaxed">
                  {SLIDES[currentSlide].body}
                </p>

                <div className="flex flex-col items-center gap-3 pt-4">
                  <button
                  onClick={handleNext}
                  className="px-8 py-3 rounded-lg font-body text-sm font-medium
                               bg-primary text-primary-foreground rose-glow
                               hover:scale-105 active:scale-95 transition-transform w-full max-w-[200px]">
                  
                    {SLIDES[currentSlide].nextLabel}
                  </button>
                  <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-lg font-body text-sm
                               bg-secondary text-primary
                               hover:bg-secondary/80 transition-colors w-full max-w-[200px]">
                  
                    {SLIDES[currentSlide].backLabel}
                  </button>
                </div>

                <div className="flex justify-center gap-2 pt-2">
                  {SLIDES.map((_, i) =>
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide ?
                  "bg-primary w-6" :
                  i < currentSlide ?
                  "bg-rose-gold/50" :
                  "bg-muted"}`
                  } />

                )}
                </div>
              </div>
            }

            {gamePhase === "joke" &&
            <div className="animate-fade-up text-center space-y-6">
                <div className="text-5xl animate-heart-beat">😏</div>
                <p className="font-display text-xl md:text-2xl text-foreground leading-relaxed">
                  {JOKE_MESSAGE}
                </p>
                <button
                onClick={handleNext}
                className="px-8 py-3 rounded-lg font-body text-sm font-medium
                             bg-primary text-primary-foreground rose-glow
                             hover:scale-105 active:scale-95 transition-transform mt-4">
                
                  Okay, not funny 🙄
                </button>
              </div>
            }

            {gamePhase === "game" &&
            <div className="animate-fade-up">
                <MemoryGame
                onStart={handleGameStart}
                onComplete={handleGameComplete} />
              
              </div>
            }

            {gamePhase === "reveal" &&
            <div className="animate-fade-up text-center space-y-8">
                <h1 className="font-display text-4xl md:text-5xl font-bold text-rose-gradient">
                  {FINAL_REVEAL.title}
                </h1>
                <p className="font-display text-lg italic text-rose-gold-light">
                  {FINAL_REVEAL.subtitle}
                </p>
                <div className="pt-4">
                  <SurpriseButton />
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

};

export default SlidePresentation;