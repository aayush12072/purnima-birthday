import { useState } from "react";
import { Headphones } from "lucide-react";

interface SplashScreenProps {
  onDone: () => void;
}

const SplashScreen = ({ onDone }: SplashScreenProps) => {
  const [fading, setFading] = useState(false);

  const handleDone = () => {
    setFading(true);
    setTimeout(onDone, 800);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center p-6 transition-opacity duration-700 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="animate-fade-up flex flex-col items-center gap-8 text-center
                      bg-white/5 border border-white/10 rounded-3xl px-8 py-12 w-full max-w-sm
                      shadow-[0_0_60px_rgba(255,255,255,0.06)]">
        <Headphones className="w-14 h-14 text-white animate-float" strokeWidth={1.5} />
        <p className="text-white/80 text-sm tracking-[0.2em] uppercase font-body leading-relaxed">
          Use earphones for the best experience
        </p>

        <button
          onClick={handleDone}
          className="mt-4 px-10 py-3 bg-white text-black rounded-full font-body text-sm font-medium tracking-wide
                     hover:scale-105 active:scale-95 transition-transform animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;
