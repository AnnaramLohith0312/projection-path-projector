import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import NeuralBackground from "@/components/NeuralBackground";
import TagInput from "@/components/TagInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FresherForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    degree: "",
    graduationYear: "",
    skills: [] as string[],
    projects: [] as string[],
    certifications: [] as string[],
    preferredRole: "",
  });

  const canSubmit = form.fullName.trim() && form.degree.trim() && form.graduationYear.trim() && form.skills.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    navigate("/results", { state: { userType: "fresher", formData: form } });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="fixed inset-[-20px] z-0"><NeuralBackground intensity={0.4} /></div>
      <div className="voca-vignette" />
      <div className="voca-grain" />

      <div className="relative z-10 flex min-h-screen flex-col items-center px-6 py-16">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => navigate("/")} className="absolute left-6 top-6 flex items-center gap-2 font-display text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-lg">
          <h1 className="voca-glow mb-2 font-display text-2xl font-bold uppercase tracking-[0.12em] text-foreground text-center">Fresher Profile</h1>
          <p className="mb-10 text-center font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">Signal Input — Graduate Path</p>

          <div className="space-y-5">
            <Field label="Full Name">
              <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Enter your full name" className="bg-card/50 border-border" />
            </Field>
            <Field label="Degree">
              <Input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="e.g. B.Tech Computer Science" className="bg-card/50 border-border" />
            </Field>
            <Field label="Graduation Year">
              <Input value={form.graduationYear} onChange={(e) => setForm({ ...form, graduationYear: e.target.value })} placeholder="e.g. 2025" className="bg-card/50 border-border" />
            </Field>
            <Field label="Skills">
              <TagInput tags={form.skills} onChange={(t) => setForm({ ...form, skills: t })} placeholder="Type a skill and press Enter" />
            </Field>
            <Field label="Projects" optional>
              <TagInput tags={form.projects} onChange={(t) => setForm({ ...form, projects: t })} placeholder="Type a project name and press Enter" />
            </Field>
            <Field label="Certifications" optional>
              <TagInput tags={form.certifications} onChange={(t) => setForm({ ...form, certifications: t })} placeholder="Type a certification and press Enter" />
            </Field>
            <Field label="Preferred Role" optional>
              <Input value={form.preferredRole} onChange={(e) => setForm({ ...form, preferredRole: e.target.value })} placeholder="e.g. Frontend Developer" className="bg-card/50 border-border" />
            </Field>

            <Button onClick={handleSubmit} disabled={!canSubmit} className="w-full mt-4 font-display text-sm uppercase tracking-[0.15em] h-12">
              Analyze My Path →
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="font-display text-xs uppercase tracking-[0.15em] text-muted-foreground">
        {label} {optional && <span className="text-muted-foreground/50">(optional)</span>}
      </label>
      {children}
    </div>
  );
}
