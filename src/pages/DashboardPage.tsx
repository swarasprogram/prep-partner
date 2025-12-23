import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { StatusBadge } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore, usePrepStore } from "@/lib/store";
import { progressAPI } from "@/services/api";
import { fadeUp, staggerContainer } from "@/lib/animations";
import {
  Target,
  Building2,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle,
  Code,
  FileQuestion,
  Video,
  Users,
  Calendar,
  Trophy,
} from "lucide-react";

interface ProgressData {
  mcq: number;
  dsa: number;
  technical: number;
  hr: number;
  overallScore: number;
  recentAttempts: Array<{
    id: string;
    company: string;
    date: string;
    score: number;
    round: string;
  }>;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { selectedRole, selectedCompany } = usePrepStore();
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      const data = await progressAPI.get();
      setProgress(data);
    };
    fetchProgress();
  }, []);

  const roundProgress = [
    { name: "MCQ Round", value: progress?.mcq || 0, icon: FileQuestion, color: "bg-info" },
    { name: "DSA Round", value: progress?.dsa || 0, icon: Code, color: "bg-warning" },
    { name: "Technical", value: progress?.technical || 0, icon: Video, color: "bg-accent" },
    { name: "HR Round", value: progress?.hr || 0, icon: Users, color: "bg-success" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Welcome Header */}
          <motion.div variants={fadeUp} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground">
                Welcome back, {user?.name || "Student"}! 👋
              </h1>
              <p className="text-muted-foreground">
                Track your progress and continue your preparation journey.
              </p>
            </div>
            <Link to="/roles">
              <Button variant="accent">
                Continue Prep
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Current Role"
              value={selectedRole || "Not Selected"}
              icon={<Target className="h-5 w-5" />}
              variant="gradient"
            />
            <StatCard
              title="Target Company"
              value={selectedCompany || "Not Selected"}
              icon={<Building2 className="h-5 w-5" />}
              variant="gradient"
            />
            <StatCard
              title="Readiness Score"
              value={`${progress?.overallScore || 0}%`}
              icon={<TrendingUp className="h-5 w-5" />}
              trend={{ value: 5, positive: true }}
              variant="accent"
            />
            <StatCard
              title="Days Active"
              value="14"
              subtitle="Keep going!"
              icon={<Clock className="h-5 w-5" />}
              variant="gradient"
            />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Progress Overview */}
            <motion.div variants={fadeUp} className="lg:col-span-2 space-y-6">
              {/* Overall Progress */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-heading text-xl font-semibold text-foreground">
                    Overall Progress
                  </h2>
                  <StatusBadge variant="accent">
                    <Trophy className="mr-1 h-3 w-3" />
                    On Track
                  </StatusBadge>
                </div>
                
                <div className="flex flex-col items-center gap-8 md:flex-row">
                  <ProgressRing
                    progress={progress?.overallScore || 0}
                    size={160}
                    strokeWidth={12}
                    label="Complete"
                  />
                  
                  <div className="flex-1 space-y-4">
                    {roundProgress.map((round) => (
                      <div key={round.name} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <round.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">{round.name}</span>
                          </div>
                          <span className="text-muted-foreground">{round.value}%</span>
                        </div>
                        <Progress value={round.value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">
                  Quick Actions
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Link
                    to="/mcq"
                    className="group flex items-center gap-4 rounded-lg border border-border p-4 transition-all hover:border-accent/50 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-info/10 p-3 text-info transition-colors group-hover:bg-info group-hover:text-info-foreground">
                      <FileQuestion className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Practice MCQs</p>
                      <p className="text-sm text-muted-foreground">150 questions left</p>
                    </div>
                  </Link>
                  
                  <Link
                    to="/dsa"
                    className="group flex items-center gap-4 rounded-lg border border-border p-4 transition-all hover:border-accent/50 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-warning/10 p-3 text-warning transition-colors group-hover:bg-warning group-hover:text-warning-foreground">
                      <Code className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">DSA Problems</p>
                      <p className="text-sm text-muted-foreground">45 problems pending</p>
                    </div>
                  </Link>
                  
                  <Link
                    to="/interview"
                    className="group flex items-center gap-4 rounded-lg border border-border p-4 transition-all hover:border-accent/50 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-accent/10 p-3 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                      <Video className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Mock Interview</p>
                      <p className="text-sm text-muted-foreground">2 scheduled</p>
                    </div>
                  </Link>
                  
                  <Link
                    to="/upload-criteria"
                    className="group flex items-center gap-4 rounded-lg border border-border p-4 transition-all hover:border-accent/50 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-success/10 p-3 text-success transition-colors group-hover:bg-success group-hover:text-success-foreground">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Upload Criteria</p>
                      <p className="text-sm text-muted-foreground">Get personalized prep</p>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Recent Activity */}
            <motion.div variants={fadeUp} className="space-y-6">
              {/* Recent Attempts */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-heading text-lg font-semibold text-foreground">
                    Recent Attempts
                  </h2>
                  <Link to="/history" className="text-sm text-accent hover:underline">
                    View all
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {progress?.recentAttempts.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-lg">
                          {attempt.company.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{attempt.company}</p>
                          <p className="text-xs text-muted-foreground">
                            {attempt.round} • {attempt.date}
                          </p>
                        </div>
                      </div>
                      <StatusBadge
                        variant={attempt.score >= 70 ? "success" : attempt.score >= 50 ? "warning" : "destructive"}
                      >
                        {attempt.score}%
                      </StatusBadge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Goals */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-accent" />
                  <h2 className="font-heading text-lg font-semibold text-foreground">
                    Today's Goals
                  </h2>
                </div>
                
                <div className="space-y-3">
                  {[
                    { task: "Complete 10 MCQs", done: true },
                    { task: "Solve 2 DSA problems", done: true },
                    { task: "Review System Design", done: false },
                    { task: "Practice HR questions", done: false },
                  ].map((goal, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 rounded-lg p-2 ${
                        goal.done ? "bg-success/5" : "bg-muted/50"
                      }`}
                    >
                      <CheckCircle
                        className={`h-5 w-5 ${
                          goal.done ? "text-success" : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          goal.done
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}
                      >
                        {goal.task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
