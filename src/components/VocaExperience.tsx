import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NeuralBackground from "./NeuralBackground";
import CinematicIntro from "./CinematicIntro";
import Assessment from "./Assessment";
import Processing from "./Processing";
import Reveal from "./Reveal";

type Scene = "intro" | "assessment" | "processing" | "reveal";

export default function VocaExperience() {
  const [scene, setScene] = useState<Scene>("intro");
  const [answers, setAnswers] = useState<number[]>([]);

  const bgIntensity =
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
    setScene("intro");
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Layers */}
      <NeuralBackground intensity={bgIntensity} />
      <div className="voca-vignette" />
      <div className="voca-grain" />

      {/* Scene content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {scene === "intro" && <CinematicIntro onComplete={() => setScene("assessment")} />}
          {scene === "assessment" && <Assessment onComplete={handleAssessmentComplete} />}
          {scene === "processing" && <Processing onComplete={handleProcessingComplete} />}
          {scene === "reveal" && <Reveal answers={answers} onRestart={handleRestart} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
