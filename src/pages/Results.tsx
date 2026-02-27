import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, X, Zap, Sparkles } from "lucide-react";
import NeuralBackground from "@/components/NeuralBackground";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface CareerResult {
  topCareer: { title: string; alignment: number; emoji: string };
  otherCareers: { title: string; alignment: number; emoji: string }[];
  skillsYouHave: string[];
  skillsYouNeed: string[];
  skillsToImprove: string[];
  advice: string;
}

function ProgressRing({ value, size = 140, strokeWidth = 3 }: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const t = setTimeout(() => setOffset(circumference - (value / 100) * circumference), 300);
    return () => clearTimeout(t);
  }, [value, circumference]);

  return (
    <svg width={size} height={size} className="voca-ring">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

const userTypeLabels: Record<string, string> = {
  student: "Student",
  fresher: "Fresher",
  "career-change": "Career Changer",
};

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userType, formData } = (location.state as { userType: string; formData: Record<string, any> }) || {};

  const [result, setResult] = useState<CareerResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userType || !formData) {
      navigate("/");
      return;
    }

    const analyze = async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke("career-advice", {
          body: { userType, formData },
        });
        if (fnError) throw fnError;
        setResult(data);
      } catch (e: any) {
        console.error(e);
        setError("Analysis failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    analyze();
  }, [userType, formData, navigate]);

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background">
        <div className="fixed inset-[-20px] z-0">
          <NeuralBackground intensity={0.7} />
        </div>
        <div className="voca-vignette" />
        <div className="voca-grain" />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6">
          <motion.p
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-display text-sm uppercase tracking-[0.25em] text-muted-foreground"
          >
            Analyzing your signal…
          </motion.p>
          <motion.p
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground/60"
          >
            Projecting career vectors
          </motion.p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background">
        <div className="fixed inset-[-20px] z-0">
          <NeuralBackground intensity={0.3} />
        </div>
        <div className="voca-vignette" />
        <div className="voca-grain" />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-4">
          <p className="font-display text-sm uppercase tracking-widest text-destructive">{error || "Something went wrong"}</p>
          <Button variant="outline" onClick={() => navigate("/")} className="font-display text-xs uppercase tracking-[0.15em]">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="fixed inset-[-20px] z-0">
        <NeuralBackground intensity={0.4} />
      </div>
      <div className="voca-vignette" />
      <div className="voca-grain" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 flex flex-col items-center gap-3">
          <Badge variant="outline" className="font-display text-xs uppercase tracking-[0.2em] border-primary/30 text-primary">
            {userTypeLabels[userType] || userType}
          </Badge>
          <h1 className="font-display text-lg font-medium uppercase tracking-[0.15em] text-foreground">{formData.fullName}</h1>
        </motion.div>

        {/* Top Career */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="voca-glow-box mb-8 flex flex-col items-center rounded-xl border border-primary/20 bg-card/60 p-8 backdrop-blur-sm"
        >
          <p className="mb-4 font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Top Projection</p>
          <div className="relative mb-4">
            <ProgressRing value={result.topCareer.alignment} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl">{result.topCareer.emoji}</span>
              <span className="mt-1 font-display text-lg font-bold text-primary">{result.topCareer.alignment}%</span>
            </div>
          </div>
          <h2 className="voca-glow font-display text-xl font-bold uppercase tracking-[0.1em] text-foreground">{result.topCareer.title}</h2>
        </motion.div>

        {/* Other Projections */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-8">
          <p className="mb-4 font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground text-center">Other Projections</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {result.otherCareers.map((c, i) => (
              <div key={i} className="flex flex-col items-center rounded-lg border border-border bg-card/40 p-4 backdrop-blur-sm">
                <span className="text-xl">{c.emoji}</span>
                <span className="mt-2 font-display text-xs font-medium uppercase tracking-wider text-foreground">{c.title}</span>
                <span className="mt-1 font-display text-sm font-bold text-primary">{c.alignment}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skill Gap */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mb-8">
          <p className="mb-4 font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground text-center">Skill Gap Analysis</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <SkillColumn
              icon={<Check className="h-4 w-4" />}
              title="Skills You Have"
              skills={result.skillsYouHave}
              color="text-green-400"
              borderColor="border-green-400/20"
              bgColor="bg-green-400/5"
            />
            <SkillColumn
              icon={<X className="h-4 w-4" />}
              title="Skills You Need"
              skills={result.skillsYouNeed}
              color="text-red-400"
              borderColor="border-red-400/20"
              bgColor="bg-red-400/5"
            />
            <SkillColumn
              icon={<Zap className="h-4 w-4" />}
              title="Skills to Improve"
              skills={result.skillsToImprove}
              color="text-yellow-400"
              borderColor="border-yellow-400/20"
              bgColor="bg-yellow-400/5"
            />
          </div>
        </motion.div>

        {/* AI Advice */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="voca-glow-box mb-10 rounded-xl border border-primary/20 bg-card/60 p-6 backdrop-blur-sm"
        >
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="font-display text-[10px] uppercase tracking-[0.3em] text-primary">AI Career Advice</p>
          </div>
          <p className="font-body text-sm leading-relaxed text-secondary-foreground">{result.advice}</p>
        </motion.div>

        {/* Recalibrate */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="font-display text-xs uppercase tracking-[0.2em] border-border hover:border-primary/40"
          >
            ← Recalibrate
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

function SkillColumn({
  icon,
  title,
  skills,
  color,
  borderColor,
  bgColor,
}: {
  icon: React.ReactNode;
  title: string;
  skills: string[];
  color: string;
  borderColor: string;
  bgColor: string;
}) {
  return (
    <div className={`rounded-lg border ${borderColor} ${bgColor} p-4 backdrop-blur-sm`}>
      <div className={`mb-3 flex items-center gap-2 ${color}`}>
        {icon}
        <span className="font-display text-[10px] uppercase tracking-[0.2em]">{title}</span>
      </div>
      <ul className="space-y-1.5">
        {skills.map((s, i) => (
          <li key={i} className="font-body text-xs text-secondary-foreground">
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
