import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { progressAPI } from "@/services/api";
import { fadeUp, staggerContainer } from "@/lib/animations";
import {
  Clock,
  Building2,
  TrendingUp,
  Calendar,
  Sparkles,
  Filter,
} from "lucide-react";

interface Attempt {
  id: string;
  company: string;
  date: string;
  score: number;
  round: string;
}

export default function HistoryPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [filterRound, setFilterRound] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await progressAPI.get();
      setAttempts(data.recentAttempts);
    };
    fetchHistory();
  }, []);

  const filteredAttempts = filterRound
    ? attempts.filter((a) => a.round === filterRound)
    : attempts;

  const rounds = [...new Set(attempts.map((a) => a.round))];

  const avgScore = attempts.length
    ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
    : 0;

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
          <motion.div variants={fadeUp} className="text-center">
            <StatusBadge variant="accent" className="mb-4">
              <Sparkles className="mr-1 h-3 w-3" />
              Practice History
            </StatusBadge>
            <h1 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Your Practice History
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Review your past attempts and track your improvement over time.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent/10 p-3 text-accent">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="font-heading text-2xl font-bold text-foreground">
                    {avgScore}%
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-info/10 p-3 text-info">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Attempts</p>
                  <p className="font-heading text-2xl font-bold text-foreground">
                    {attempts.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-3 text-success">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Companies</p>
                  <p className="font-heading text-2xl font-bold text-foreground">
                    {new Set(attempts.map((a) => a.company)).size}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div variants={fadeUp} className="flex gap-2">
            <Button
              variant={filterRound === null ? "accent" : "outline"}
              size="sm"
              onClick={() => setFilterRound(null)}
            >
              <Filter className="mr-1 h-3 w-3" />
              All
            </Button>
            {rounds.map((round) => (
              <Button
                key={round}
                variant={filterRound === round ? "accent" : "outline"}
                size="sm"
                onClick={() =>
                  setFilterRound(filterRound === round ? null : round)
                }
              >
                {round}
              </Button>
            ))}
          </motion.div>

          {/* Attempts List */}
          <motion.div variants={fadeUp} className="space-y-4">
            {filteredAttempts.map((attempt, index) => (
              <motion.div
                key={attempt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-2xl">
                    {attempt.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {attempt.company}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {attempt.date}
                      </span>
                      <StatusBadge variant="accent">{attempt.round}</StatusBadge>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-heading text-2xl font-bold text-foreground">
                    {attempt.score}%
                  </p>
                  <StatusBadge
                    variant={
                      attempt.score >= 70
                        ? "success"
                        : attempt.score >= 50
                          ? "warning"
                          : "destructive"
                    }
                  >
                    {attempt.score >= 70
                      ? "Passed"
                      : attempt.score >= 50
                        ? "Average"
                        : "Needs Work"}
                  </StatusBadge>
                </div>
              </motion.div>
            ))}

            {filteredAttempts.length === 0 && (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <Clock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                  No attempts yet
                </h3>
                <p className="text-muted-foreground">
                  Start practicing to see your history here.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
