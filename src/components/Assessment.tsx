import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Question {
  id: number;
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "When facing a complex problem, you instinctively…",
    options: [
      "Break it into smaller components",
      "Look for patterns in existing data",
      "Rally the team for perspectives",
      "Prototype a quick solution",
    ],
  },
  {
    id: 2,
    text: "The work that makes you lose track of time…",
    options: [
      "Designing systems and workflows",
      "Crafting stories and narratives",
      "Analyzing data for insights",
      "Building and shipping features",
    ],
  },
  {
    id: 3,
    text: "In a team, you naturally gravitate toward…",
    options: [
      "Setting the vision and strategy",
      "Connecting people and ideas",
      "Optimizing processes",
      "Executing with precision",
    ],
  },
  {
    id: 4,
    text: "Your strongest signal comes from…",
    options: [
      "User behavior and feedback",
      "Market trends and competition",
      "Technical feasibility",
      "Creative intuition",
    ],
  },
  {
    id: 5,
    text: "What drives your deepest satisfaction?",
    options: [
      "Seeing metrics move",
      "Making something beautiful",
      "Solving an impossible puzzle",
      "Empowering others to succeed",
    ],
  },
];

interface AssessmentProps {
  onComplete: (answers: number[]) => void;
}

export default function Assessment({ onComplete }: AssessmentProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAnswer = (optionIdx: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const newAnswers = [...answers, optionIdx];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent((c) => c + 1);
        setIsTransitioning(false);
      } else {
        onComplete(newAnswers);
      }
    }, 600);
  };

  const question = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
      {/* Progress bar */}
      <div className="fixed left-0 top-0 z-20 h-[2px] w-full bg-muted">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>

      {/* Question counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-12 font-display text-xs uppercase tracking-[0.3em] text-muted-foreground"
      >
        Signal {current + 1} of {questions.length}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex max-w-2xl flex-col items-center"
        >
          <h2 className="mb-12 text-center font-display text-xl font-light leading-relaxed tracking-wide text-foreground sm:text-2xl md:text-3xl">
            {question.text}
          </h2>

          <div className="flex w-full flex-col gap-3">
            {question.options.map((option, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.15 + idx * 0.08,
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                onClick={() => handleAnswer(idx)}
                className="group w-full rounded-lg border border-border bg-secondary/30 px-6 py-4 text-left font-body text-sm text-secondary-foreground transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 sm:text-base"
              >
                <span className="mr-3 inline-block font-display text-xs uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-primary">
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
