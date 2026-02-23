import { motion } from "framer-motion";

interface HeroLandingProps {
  onEnter: () => void;
}

export default function HeroLanding({ onEnter }: HeroLandingProps) {
  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
      {/* Logo mark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-6"
      >
        <div className="voca-glow-box inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5">
          <span className="voca-glow font-display text-3xl font-bold tracking-[0.15em] text-primary">
            V
          </span>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
        className="voca-title voca-glow text-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
      >
        VOCA
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.9 }}
        className="voca-subtitle mt-4 text-center text-base sm:text-lg md:text-xl"
      >
        The Future Projection Experience
      </motion.p>

      {/* Divider line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 1.3 }}
        className="mt-8 h-px w-24 origin-center bg-primary/30"
      />

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 1.7 }}
        onClick={onEnter}
        className="voca-sweep voca-glow-box mt-12 rounded-full border border-primary/30 bg-primary/10 px-10 py-4 font-display text-sm font-medium uppercase tracking-[0.2em] text-primary transition-all duration-300 hover:border-primary/60 hover:bg-primary/20"
      >
        Enter Experience
      </motion.button>

      {/* Bottom hint */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.4 }}
        className="absolute bottom-8 font-body text-xs tracking-widest text-muted-foreground/50"
      >
        AI-POWERED CAREER PROJECTION
      </motion.span>
    </div>
  );
}
