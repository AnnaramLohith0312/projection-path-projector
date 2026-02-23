import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const lines = [
  "Every choice creates a pattern.",
  "Every pattern reveals direction.",
  "Let's project yours.",
];

const PAUSE_MS = 1800;
const FADE_DURATION = 1.2;

interface CinematicIntroProps {
  onComplete: () => void;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [currentLine, setCurrentLine] = useState(-1);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    // Start after a brief delay for black screen
    const timer = setTimeout(() => setCurrentLine(0), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentLine >= 0 && currentLine < lines.length - 1) {
      const timer = setTimeout(() => setCurrentLine((c) => c + 1), PAUSE_MS + FADE_DURATION * 1000);
      return () => clearTimeout(timer);
    }
    if (currentLine === lines.length - 1) {
      const timer = setTimeout(() => setShowCTA(true), PAUSE_MS + 400);
      return () => clearTimeout(timer);
    }
  }, [currentLine]);

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-4">
        <AnimatePresence>
          {lines.map(
            (line, i) =>
              i <= currentLine && (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: i === currentLine ? 1 : 0.35, y: 0 }}
                  transition={{
                    duration: FADE_DURATION,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="voca-subtitle text-center text-lg sm:text-2xl md:text-3xl"
                >
                  {line}
                </motion.p>
              )
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showCTA && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
            onClick={onComplete}
            className="voca-sweep voca-glow-box mt-16 rounded-full border border-primary/30 bg-primary/10 px-10 py-4 font-display text-sm font-medium uppercase tracking-[0.2em] text-primary transition-all duration-300 hover:border-primary/60 hover:bg-primary/20"
          >
            Begin Projection
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
