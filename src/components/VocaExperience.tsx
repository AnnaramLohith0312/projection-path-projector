import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NeuralBackground from "./NeuralBackground";
import HeroLanding from "./HeroLanding";
import CinematicIntro from "./CinematicIntro";
import Assessment from "./Assessment";
import Processing from "./Processing";
import Reveal from "./Reveal";

type Scene = "hero" | "intro" | "assessment" | "processing" | "reveal";

export default function VocaExperience() {
  const [scene, setScene] = useState<Scene>("hero");
  const [answers, setAnswers] = useState<number[]>([]);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setMouseOffset({ x, y });
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const bgIntensity =
    scene === "hero" ? 0.2 :
    scene === "intro" ? 0.3 :
    scene === "assessment" ? 0.5 :
    scene === "processing" ? 0.8 :
    0.4;

  const handleAssessmentComplete = useCallback((ans: number[]) => {
    setAnswers(ans);
    setScene("processing");
  }, []);

  const handleProcessingComplete = useCallback(() => {
    setScene("reveal");
  }, []);

  const handleRestart = useCallback(() => {
    setAnswers([]);
    setScene("hero");
  }, []);

  // Parallax: background slowest, neural grid faster, text static
  const bgTranslate = `translate(${mouseOffset.x * -4}px, ${mouseOffset.y * -4}px)`;
  const neuralTranslate = `translate(${mouseOffset.x * -10}px, ${mouseOffset.y * -10}px)`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Layer 1: Background gradient — slowest parallax */}
      <div
        className="fixed inset-[-20px] z-0 transition-transform duration-700 ease-out"
        style={{
          transform: bgTranslate,
          background: "radial-gradient(ellipse at 40% 40%, hsl(191 100% 42% / 0.04) 0%, transparent 60%), hsl(0 0% 4%)",
        }}
      />

      {/* Layer 2: Neural grid — medium parallax */}
      <div
        className="fixed inset-[-20px] z-[1] transition-transform duration-500 ease-out"
        style={{ transform: neuralTranslate }}
      >
        <NeuralBackground intensity={bgIntensity} />
      </div>

      {/* Atmosphere overlays */}
      <div className="voca-vignette" />
      <div className="voca-grain" />

      {/* Layer 3: Foreground content — no parallax, stable */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10"
        >
          {scene === "hero" && <HeroLanding onEnter={() => setScene("intro")} />}
          {scene === "intro" && <CinematicIntro onComplete={() => setScene("assessment")} />}
          {scene === "assessment" && <Assessment onComplete={handleAssessmentComplete} />}
          {scene === "processing" && <Processing onComplete={handleProcessingComplete} />}
          {scene === "reveal" && <Reveal answers={answers} onRestart={handleRestart} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}