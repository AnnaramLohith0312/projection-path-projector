import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface CareerResult {
  title: string;
  emoji: string;
  alignment: number;
}

const careerPaths: CareerResult[] = [
  { title: "Product Management", emoji: "🎯", alignment: 87 },
  { title: "UX Design", emoji: "✨", alignment: 74 },
  { title: "Data Science", emoji: "📊", alignment: 68 },
  { title: "Engineering Leadership", emoji: "⚡", alignment: 62 },
  { title: "Growth Strategy", emoji: "🚀", alignment: 55 },
];

function getResultFromAnswers(answers: number[]): { primary: CareerResult; others: CareerResult[] } {
  // Simple mapping based on answer patterns
  const sum = answers.reduce((a, b) => a + b, 0);
  const idx = sum % careerPaths.length;
  const primary = { ...careerPaths[idx], alignment: 80 + (sum % 15) };
  const others = careerPaths.filter((_, i) => i !== idx).slice(0, 3).map((c, i) => ({
    ...c,
    alignment: primary.alignment - 10 - i * 8,
  }));
  return { primary, others };
}

function ProgressRing({ value, size = 160, strokeWidth = 3 }: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (value / 100) * circumference);
    }, 300);
    return () => clearTimeout(timer);
  }, [value, circumference]);

  return (
    <svg width={size} height={size} className="voca-ring">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="hsl(0 0% 14%)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="hsl(191 100% 50%)"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 6px hsl(191 100% 50% / 0.4))" }}
      />
    </svg>
  );
}

interface RevealProps {
  answers: number[];
  onRestart: () => void;
}

export default function Reveal({ answers, onRestart }: RevealProps) {
  const { primary, others } = getResultFromAnswers(answers);
  const [showFlare, setShowFlare] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowFlare(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20">
      {/* Spotlight glow behind */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute z-0 h-[400px] w-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(191 100% 50%), transparent 70%)",
        }}
      />

      {/* Lens flare */}
      {showFlare && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: [0, 0.6, 0], scaleX: [0, 1, 0] }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute z-0 h-[1px] w-[300px]"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(191 100% 70%), transparent)",
          }}
        />
      )}

      {/* Main result */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative mb-8 flex items-center justify-center">
          <ProgressRing value={primary.alignment} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-bold text-foreground">{primary.alignment}%</span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Alignment</span>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-2 text-4xl"
        >
          {primary.emoji}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="voca-title voca-glow mb-4 text-center text-3xl sm:text-4xl md:text-5xl"
        >
          {primary.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="voca-subtitle mb-16 text-center text-sm sm:text-base"
        >
          Your projected career vector based on signal analysis
        </motion.p>
      </motion.div>

      {/* Secondary results */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="relative z-10 flex w-full max-w-md flex-col gap-3"
      >
        <p className="mb-2 text-center font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Other Projections
        </p>
        {others.map((career, idx) => (
          <motion.div
            key={career.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2 + idx * 0.2, duration: 0.5 }}
            className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 px-5 py-3"
          >
            <span className="font-body text-sm text-secondary-foreground">
              {career.emoji} {career.title}
            </span>
            <span className="font-display text-sm text-muted-foreground">{career.alignment}%</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Restart */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 0.8 }}
        onClick={onRestart}
        className="voca-sweep mt-16 rounded-full border border-border bg-secondary/20 px-8 py-3 font-display text-xs uppercase tracking-[0.2em] text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:text-foreground"
      >
        Recalibrate
      </motion.button>
    </div>
  );
}
