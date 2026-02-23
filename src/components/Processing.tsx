import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const stages = [
  "Analyzing signal strength.",
  "Mapping skill clusters.",
  "Projecting career vectors.",
];

interface ProcessingProps {
  onComplete: () => void;
}

export default function Processing({ onComplete }: ProcessingProps) {
  const [stage, setStage] = useState(-1);
  const [showRevealText, setShowRevealText] = useState(false);
  const [showSweep, setShowSweep] = useState(false);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    // Show stages one by one
    timers.push(setTimeout(() => setStage(0), 800));
    timers.push(setTimeout(() => setStage(1), 2400));
    timers.push(setTimeout(() => setStage(2), 4000));
    // Pause then sweep
    timers.push(setTimeout(() => setShowSweep(true), 5800));
    // Show alignment text
    timers.push(setTimeout(() => setShowRevealText(true), 6600));
    // Complete
    timers.push(setTimeout(() => onComplete(), 8200));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
      {/* Light sweep */}
      {showSweep && (
        <motion.div
          initial={{ left: "-10%", opacity: 0 }}
          animate={{ left: "110%", opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed top-0 z-30 h-full w-[2px]"
          style={{
            background: "linear-gradient(180deg, transparent, hsl(191 100% 50%), transparent)",
            boxShadow: "0 0 40px 10px hsl(191 100% 50% / 0.3)",
          }}
        />
      )}

      <div className="flex flex-col items-center gap-6">
        {stages.map((text, i) => (
          <motion.p
            key={text}
            initial={{ opacity: 0 }}
            animate={{ opacity: i <= stage ? (i === stage ? 0.9 : 0.3) : 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-sm uppercase tracking-[0.2em] text-muted-foreground sm:text-base"
          >
            {text}
          </motion.p>
        ))}
      </div>

      {showRevealText && (
        <motion.p
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="voca-glow mt-16 font-display text-lg font-medium uppercase tracking-[0.25em] text-primary sm:text-xl"
        >
          Alignment Identified.
        </motion.p>
      )}
    </div>
  );
}
