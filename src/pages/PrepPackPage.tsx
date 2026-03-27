import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { usePrepStore } from "@/lib/store";
import { questionsAPI } from "@/services/api";
import { fadeUp, staggerContainer } from "@/lib/animations";
import {
  ArrowLeft,
  Code2,
  Brain,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Sparkles,
  RefreshCw,
  Building2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: number;
  title: string;
  content: string;
  question_type: string;
  options: { options: string[] } | null;
  correct_answer: string | null;
  difficulty: string;
  tags: string[] | null;
}

type Tab = "DSA" | "MCQ" | "INTERVIEW";

const DIFFICULTY_VARIANT: Record<string, "easy" | "medium" | "hard" | "default"> = {
  Easy: "easy",
  Medium: "medium",
  Hard: "hard",
};

export default function PrepPackPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("DSA");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, boolean>>({});
  const { selectedCompany } = usePrepStore();
  const navigate = useNavigate();

  const companyName = selectedCompany || "Unknown";

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await questionsAPI.getByCompany(companyName);
      setQuestions(data);
      if (data.length === 0) {
        toast.info("No questions found. Seeding sample questions...");
        await handleSeed(true);
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        toast.error("You need to be logged in.");
        navigate("/login");
      } else {
        toast.error("Failed to load questions. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async (silent = false) => {
    setSeeding(true);
    try {
      const result = await questionsAPI.seedQuestions();
      if (!silent) toast.success(result.message);
      await fetchQuestions();
    } catch {
      if (!silent) toast.error("Failed to seed questions.");
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    if (!selectedCompany) {
      navigate("/companies");
      return;
    }
    fetchQuestions();
  }, [selectedCompany]);

  const tabs: { id: Tab; label: string; icon: typeof Code2 }[] = [
    { id: "DSA", label: "DSA Problems", icon: Code2 },
    { id: "MCQ", label: "MCQ Quiz", icon: Brain },
    { id: "INTERVIEW", label: "Interview Questions", icon: MessageSquare },
  ];

  const filteredQuestions = questions.filter((q) => q.question_type === activeTab);

  const handleAnswerSelect = (questionId: number, answer: string) => {
    if (submittedAnswers[questionId] !== undefined) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitAnswer = (question: Question) => {
    const selected = selectedAnswers[question.id];
    if (!selected) return;
    const isCorrect = selected === question.correct_answer;
    setSubmittedAnswers((prev) => ({ ...prev, [question.id]: isCorrect }));
    if (isCorrect) {
      toast.success("Correct! 🎉");
    } else {
      toast.error(`Incorrect. The answer is: ${question.correct_answer}`);
    }
  };

  const score = Object.values(submittedAnswers).filter(Boolean).length;
  const total = Object.keys(submittedAnswers).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/companies")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <Building2 className="h-6 w-6 text-accent" />
                <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                  {companyName} Prep Pack
                </h1>
              </div>
              <p className="text-muted-foreground text-sm">
                Company-specific questions curated for your preparation
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSeed(false)}
              disabled={seeding}
            >
              {seeding ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh Questions
            </Button>
          </motion.div>

          {/* Score Banner (if MCQ attempted) */}
          {total > 0 && activeTab === "MCQ" && (
            <motion.div
              variants={fadeUp}
              className="rounded-xl border border-accent/30 bg-accent/5 px-6 py-4 flex items-center gap-4"
            >
              <Sparkles className="h-5 w-5 text-accent" />
              <p className="text-foreground font-semibold">
                MCQ Score: {score} / {total} correct
              </p>
            </motion.div>
          )}

          {/* Tabs */}
          <motion.div variants={fadeUp} className="flex gap-2 border-b border-border pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const count = questions.filter((q) => q.question_type === tab.id).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                    activeTab === tab.id
                      ? "border-accent text-accent"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {count > 0 && (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${activeTab === tab.id ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <Loader2 className="h-10 w-10 animate-spin text-accent" />
                  <p className="text-muted-foreground">Loading questions for {companyName}...</p>
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
                  <Brain className="h-12 w-12 opacity-30" />
                  <p className="text-lg font-medium">No {activeTab} questions found for {companyName}</p>
                  <Button variant="outline" onClick={() => handleSeed(false)} disabled={seeding}>
                    {seeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Load Sample Questions
                  </Button>
                </div>
              ) : activeTab === "DSA" ? (
                <DSATab questions={filteredQuestions} />
              ) : activeTab === "MCQ" ? (
                <MCQTab
                  questions={filteredQuestions}
                  selectedAnswers={selectedAnswers}
                  submittedAnswers={submittedAnswers}
                  onSelect={handleAnswerSelect}
                  onSubmit={handleSubmitAnswer}
                />
              ) : (
                <InterviewTab questions={filteredQuestions} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────── */

function DSATab({ questions }: { questions: Question[] }) {
  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-xl border border-border bg-card p-6 hover:border-accent/40 transition-colors"
        >
          <div className="flex items-start justify-between mb-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                {i + 1}
              </div>
              <h3 className="font-semibold text-foreground text-lg">{q.title}</h3>
            </div>
            <StatusBadge variant={difficultyVariant(q.difficulty)}>{q.difficulty}</StatusBadge>
          </div>
          <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{q.content}</p>
          {q.tags && (
            <div className="flex flex-wrap gap-2">
              {q.tags.filter((t) => !["DSA", "MCQ", "INTERVIEW"].includes(t)).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-border">
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://leetcode.com/problems/${q.title.toLowerCase().replace(/\s+/g, "-")}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code2 className="mr-2 h-3.5 w-3.5" />
                Solve on LeetCode
              </a>
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function MCQTab({
  questions,
  selectedAnswers,
  submittedAnswers,
  onSelect,
  onSubmit,
}: {
  questions: Question[];
  selectedAnswers: Record<number, string>;
  submittedAnswers: Record<number, boolean>;
  onSelect: (id: number, answer: string) => void;
  onSubmit: (q: Question) => void;
}) {
  return (
    <div className="space-y-6">
      {questions.map((q, i) => {
        const options = q.options?.options ?? [];
        const selected = selectedAnswers[q.id];
        const submitted = submittedAnswers[q.id];
        const isCorrect = submitted === true;

        return (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`rounded-xl border bg-card p-6 transition-colors ${
              submitted !== undefined
                ? isCorrect
                  ? "border-green-500/40 bg-green-500/5"
                  : "border-red-500/40 bg-red-500/5"
                : "border-border"
            }`}
          >
            <div className="flex items-start justify-between mb-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-foreground">{q.title}</h3>
              </div>
              {submitted !== undefined && (
                isCorrect
                  ? <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  : <XCircle className="h-5 w-5 text-red-500 shrink-0" />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {options.map((opt) => {
                const isSelected = selected === opt;
                const isCorrectOpt = q.correct_answer === opt;
                let cls = "rounded-lg border p-3 text-sm cursor-pointer transition-all text-left ";
                if (submitted !== undefined) {
                  if (isCorrectOpt) cls += "border-green-500 bg-green-500/10 text-green-600 font-medium";
                  else if (isSelected && !isCorrect) cls += "border-red-500 bg-red-500/10 text-red-600";
                  else cls += "border-border text-muted-foreground";
                } else {
                  cls += isSelected
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border hover:border-accent/50 text-foreground";
                }
                return (
                  <button key={opt} className={cls} onClick={() => onSelect(q.id, opt)}>
                    {opt}
                  </button>
                );
              })}
            </div>

            {submitted === undefined && (
              <Button
                size="sm"
                variant="accent"
                disabled={!selected}
                onClick={() => onSubmit(q)}
              >
                Submit Answer
              </Button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function InterviewTab({ questions }: { questions: Question[] }) {
  const TIPS: Record<string, string> = {
    "Tell me about a time you resolved a conflict with a teammate.":
      "Use the STAR method: Situation → Task → Action → Result. Focus on empathy and collaboration.",
    "Describe a project where you had to learn a new technology quickly.":
      "Highlight your learning strategy, resources used, and the outcome. Show adaptability and ownership.",
    "Tell me about a time you delivered a project under tight deadline.":
      "Quantify the deadline, describe prioritization decisions, and emphasize ownership and delivery.",
  };

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-xl border border-border bg-card p-6 hover:border-accent/40 transition-colors"
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
              {i + 1}
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-base">{q.title}</h3>
              <p className="text-muted-foreground text-sm mt-1">{q.content}</p>
            </div>
          </div>

          {TIPS[q.title] && (
            <div className="mt-4 rounded-lg bg-accent/5 border border-accent/20 px-4 py-3 text-sm text-muted-foreground">
              <span className="font-semibold text-accent">💡 Tip: </span>
              {TIPS[q.title]}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-border">
            <textarea
              className="w-full rounded-lg border border-border bg-muted/30 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
              rows={4}
              placeholder="Practice your answer here..."
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function difficultyVariant(d: string): "easy" | "medium" | "hard" | "default" {
  return DIFFICULTY_VARIANT[d] ?? "default";
}
