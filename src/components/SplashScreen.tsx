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
      className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center transition-opacity duration-700 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="animate-fade-up flex flex-col items-center gap-6">
        <Headphones className="w-16 h-16 text-white animate-float" strokeWidth={1.5} />
        <p className="text-white/80 text-sm tracking-[0.25em] uppercase font-body">
          Use earphones for the best experience
        </p>
      </div>

      <button
        onClick={handleDone}
        className="mt-16 px-10 py-3 bg-white text-black rounded-full font-body text-sm font-medium tracking-wide
                   hover:scale-105 active:scale-95 transition-transform animate-fade-up"
        style={{ animationDelay: "0.4s" }}
      >
        Done
      </button>
    </div>
  );
};

export default SplashScreen;
