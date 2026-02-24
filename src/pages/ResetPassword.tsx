import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import NeuralBackground from "@/components/NeuralBackground";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }

    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess(true);
    setTimeout(() => navigate("/", { replace: true }), 2000);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <div className="fixed inset-0 z-0"><NeuralBackground intensity={0.2} /></div>
      <div className="voca-vignette" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm rounded-2xl border border-border/40 bg-card/60 p-8 backdrop-blur-xl"
      >
        <h1 className="mb-6 font-display text-lg font-bold uppercase tracking-[0.2em] text-foreground">
          Set New Password
        </h1>

        {success ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="voca-glow font-display text-sm uppercase tracking-[0.2em] text-primary">
            Password Updated. Redirecting...
          </motion.p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full rounded-lg border border-border/50 bg-background/60 px-4 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded-lg border border-border/50 bg-background/60 px-4 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-3 font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50"
            >
              {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Update Password"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
