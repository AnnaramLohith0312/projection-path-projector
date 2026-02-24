import { motion } from "framer-motion";
import { useMemo } from "react";

interface PasswordStrengthMeterProps {
  password: string;
}

function getStrength(password: string): { score: number; label: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["Weak", "Weak", "Fair", "Good", "Strong", "Excellent"];
  return { score, label: labels[score] };
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const { score, label } = useMemo(() => getStrength(password), [password]);

  if (!password) return null;

  const colors = [
    "bg-destructive",
    "bg-destructive",
    "bg-yellow-500",
    "bg-yellow-400",
    "bg-primary",
    "bg-primary",
  ];

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className={`h-1 flex-1 rounded-full ${i < score ? colors[score] : "bg-muted"}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: i < score ? 1 : 0.5 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground font-display tracking-wider uppercase">
        {label}
      </p>
    </div>
  );
}
