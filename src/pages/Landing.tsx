import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Briefcase, RefreshCw } from "lucide-react";
import NeuralBackground from "@/components/NeuralBackground";

const paths = [
  {
    title: "I'm a Student",
    description: "Discover your ideal career path based on your education and interests.",
    icon: GraduationCap,
    route: "/student",
  },
  {
    title: "I'm a Fresher",
    description: "Map your skills and projects to the best-fit roles in the industry.",
    icon: Briefcase,
    route: "/fresher",
  },
  {
    title: "I'm Changing Careers",
    description: "Navigate your transition with a personalized career realignment strategy.",
    icon: RefreshCw,
    route: "/career-change",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="fixed inset-[-20px] z-0">
        <NeuralBackground intensity={0.3} />
      </div>
      <div className="voca-vignette" />
      <div className="voca-grain" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-6 text-center"
        >
          <p className="font-display text-xs uppercase tracking-[0.4em] text-muted-foreground mb-4">
            The Projection System
          </p>
          <h1 className="voca-glow font-display text-3xl font-bold uppercase tracking-[0.15em] text-foreground sm:text-4xl md:text-5xl">
            Choose Your Signal
          </h1>
          <p className="mt-4 max-w-md mx-auto font-body text-sm text-muted-foreground leading-relaxed">
            Select the path that matches your current position. We'll project your optimal career trajectory.
          </p>
        </motion.div>

        <div className="mt-12 grid w-full max-w-4xl gap-6 sm:grid-cols-3">
          {paths.map((path, i) => (
            <motion.button
              key={path.route}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={() => navigate(path.route)}
              className="voca-sweep group relative flex flex-col items-center rounded-xl border border-border bg-card/50 px-6 py-10 text-center backdrop-blur-sm transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_40px_hsl(var(--voca-cyan)/0.1)]"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/5 transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                <path.icon className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-display text-base font-semibold uppercase tracking-[0.1em] text-foreground">
                {path.title}
              </h2>
              <p className="mt-3 font-body text-xs leading-relaxed text-muted-foreground">
                {path.description}
              </p>
              <span className="mt-6 font-display text-[10px] uppercase tracking-[0.3em] text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Enter →
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
