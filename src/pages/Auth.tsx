import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import NeuralBackground from "@/components/NeuralBackground";

type Tab = "signin" | "signup" | "forgot";

const heroLines = [
  "Your Future Is Not Random.",
  "It's Patterned. Structured. Projected.",
  "We engineer alignment.",
];

export default function Auth() {
  const { user, signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [accessGranted, setAccessGranted] = useState(false);

  // Hero text animation
  const [visibleLine, setVisibleLine] = useState(-1);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
      return;
    }
    const timers = [
      setTimeout(() => setVisibleLine(0), 600),
      setTimeout(() => setVisibleLine(1), 2200),
      setTimeout(() => setVisibleLine(2), 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [user, navigate]);

  const validate = () => {
    if (!email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email address.";
    if (tab === "forgot") return null;
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (tab === "signup") {
      if (password !== confirmPassword) return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      if (tab === "signin") {
        const { error } = await signIn(email, password);
        if (error) { setError(error); setLoading(false); return; }
        setAccessGranted(true);
        setTimeout(() => navigate("/", { replace: true }), 1800);
      } else if (tab === "signup") {
        const { error } = await signUp(email, password, displayName);
        if (error) { setError(error); setLoading(false); return; }
        setSuccess("Check your email to verify your account.");
        setLoading(false);
      } else {
        const { error } = await resetPassword(email);
        if (error) { setError(error); setLoading(false); return; }
        setSuccess("Password reset email sent.");
        setLoading(false);
      }
    } catch {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  if (accessGranted) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
        <div className="fixed inset-0 z-0">
          <NeuralBackground intensity={0.8} />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 text-center"
        >
          <motion.p
            className="voca-glow font-display text-3xl font-bold uppercase tracking-[0.3em] text-primary sm:text-5xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Access Granted
          </motion.p>
          <motion.div
            className="mx-auto mt-6 h-[1px] bg-primary/40"
            initial={{ width: 0 }}
            animate={{ width: 200 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row bg-background overflow-hidden">
      {/* Neural background */}
      <div className="fixed inset-0 z-0">
        <NeuralBackground intensity={0.25} />
      </div>
      <div className="voca-vignette" />
      <div className="voca-grain" />

      {/* LEFT — Cinematic ideology */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 py-16 lg:py-0">
        <div className="max-w-md space-y-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="font-display text-xs uppercase tracking-[0.35em] text-muted-foreground"
          >
            Enter The Projection System
          </motion.p>

          <div className="space-y-3">
            {heroLines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: i <= visibleLine ? 1 : 0, y: i <= visibleLine ? 0 : 12 }}
                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`font-display text-lg font-medium tracking-wide sm:text-2xl ${
                  i === 2 ? "voca-glow text-primary" : "text-foreground"
                }`}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — Glassmorphic auth panel */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-12 lg:py-0">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-sm rounded-2xl border border-border/40 bg-card/60 p-8 shadow-2xl backdrop-blur-xl"
        >
          {/* Tabs */}
          {tab !== "forgot" && (
            <div className="mb-8 flex gap-1 rounded-lg bg-muted/40 p-1">
              {(["signin", "signup"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(null); setSuccess(null); }}
                  className={`relative flex-1 rounded-md py-2 font-display text-xs uppercase tracking-[0.2em] transition-colors ${
                    tab === t ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === t && (
                    <motion.div
                      layoutId="auth-tab"
                      className="absolute inset-0 rounded-md bg-primary"
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  )}
                  <span className="relative z-10">{t === "signin" ? "Sign In" : "Create Account"}</span>
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {tab === "forgot" && (
                  <button
                    type="button"
                    onClick={() => { setTab("signin"); setError(null); setSuccess(null); }}
                    className="mb-2 font-display text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Back to Sign In
                  </button>
                )}

                {tab === "signup" && (
                  <div className="space-y-1.5">
                    <label className="font-display text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full rounded-lg border border-border/50 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="font-display text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-border/50 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                    placeholder="you@email.com"
                    required
                  />
                </div>

                {tab !== "forgot" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="font-display text-xs uppercase tracking-[0.15em] text-muted-foreground">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-lg border border-border/50 bg-background/60 px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {tab === "signup" && <PasswordStrengthMeter password={password} />}
                    </div>

                    {tab === "signup" && (
                      <div className="space-y-1.5">
                        <label className="font-display text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full rounded-lg border border-border/50 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Error / Success */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-destructive"
                >
                  {error}
                </motion.p>
              )}
              {success && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-primary"
                >
                  {success}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="voca-sweep group relative w-full overflow-hidden rounded-lg bg-primary py-3 font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {tab === "signin" ? "Initiate Access" : tab === "signup" ? "Create Projection" : "Send Reset Link"}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </button>

            {/* Forgot password link */}
            {tab === "signin" && (
              <button
                type="button"
                onClick={() => { setTab("forgot"); setError(null); setSuccess(null); }}
                className="w-full text-center font-display text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot Password?
              </button>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
