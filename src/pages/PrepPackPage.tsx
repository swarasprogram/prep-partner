import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";
import { usePrepStore } from "@/lib/store";
import { fadeUp, staggerContainer } from "@/lib/animations";
import {
  Target,
  FileQuestion,
  Code,
  Video,
  Users,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Clock,
  BookOpen,
  Play,
} from "lucide-react";

interface PrepRound {
  title: string;
  description: string;
  icon: React.ElementType;
  topics: string[];
  totalQuestions: number;
  completedQuestions: number;
  duration: string;
  link: string;
}

export default function PrepPackPage() {
  const { selectedRole, selectedCompany } = usePrepStore();

  const prepRounds: PrepRound[] = [
    {
      title: "MCQ Round",
      description: "Multiple choice questions on aptitude and technical topics",
      icon: FileQuestion,
      topics: ["Aptitude", "Technical", "Logical Reasoning"],
      totalQuestions: 30,
      completedQuestions: 12,
      duration: "60 min",
      link: "/mcq",
    },
    {
      title: "DSA Round",
      description: "Data Structures & Algorithms coding problems",
      icon: Code,
      topics: ["Arrays", "Strings", "Trees", "Dynamic Programming"],
      totalQuestions: 15,
      completedQuestions: 5,
      duration: "90 min",
      link: "/dsa",
    },
    {
      title: "Technical Interview",
      description: "System design and project discussion preparation",
      icon: Video,
      topics: ["System Design", "OOP", "Projects"],
      totalQuestions: 10,
      completedQuestions: 3,
      duration: "45 min",
      link: "/interview",
    },
    {
      title: "HR Interview",
      description: "Behavioral and situational interview preparation",
      icon: Users,
      topics: ["Behavioral", "Situational", "Company-specific"],
      totalQuestions: 8,
      completedQuestions: 2,
      duration: "30 min",
      link: "/interview",
    },
  ];

  const totalQuestions = prepRounds.reduce((sum, r) => sum + r.totalQuestions, 0);
  const completedQuestions = prepRounds.reduce(
    (sum, r) => sum + r.completedQuestions,
    0
  );
  const overallProgress = Math.round((completedQuestions / totalQuestions) * 100);

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
              Your Prep Pack
            </StatusBadge>
            <h1 className="mb-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Personalized Preparation Plan
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {selectedCompany
                ? `Customized prep pack for ${selectedCompany}`
                : "Your personalized interview preparation plan"}
              {selectedRole ? ` — ${selectedRole} role` : ""}
            </p>
          </motion.div>

          {/* Overall Progress */}
          <motion.div
            variants={fadeUp}
            className="rounded-xl border border-border bg-card p-6 shadow-card"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground">
                  Overall Progress
                </h2>
                <p className="text-sm text-muted-foreground">
                  {completedQuestions} of {totalQuestions} questions completed
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-heading text-3xl font-bold text-accent">
                    {overallProgress}%
                  </p>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
              </div>
            </div>
            <Progress value={overallProgress} className="mt-4 h-3" />
          </motion.div>

          {/* Prep Rounds */}
          <motion.div variants={fadeUp} className="grid gap-6 md:grid-cols-2">
            {prepRounds.map((round, index) => {
              const roundProgress = Math.round(
                (round.completedQuestions / round.totalQuestions) * 100
              );
              return (
                <motion.div
                  key={round.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:border-accent/50 hover:shadow-lg"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-accent/10 p-3 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                        <round.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-foreground">
                          {round.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {round.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {round.totalQuestions} questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {round.duration}
                    </span>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {round.topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="mb-4 space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">
                        {round.completedQuestions}/{round.totalQuestions}
                      </span>
                    </div>
                    <Progress value={roundProgress} className="h-2" />
                  </div>

                  <Link to={round.link}>
                    <Button variant="accent" className="w-full">
                      {round.completedQuestions > 0 ? (
                        <>
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Start
                        </>
                      )}
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Tips */}
          <motion.div
            variants={fadeUp}
            className="rounded-xl border border-border bg-card p-6 shadow-card"
          >
            <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">
              Preparation Tips
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  tip: "Start with MCQs to build a strong foundation",
                  icon: Target,
                },
                {
                  tip: "Practice at least 2 DSA problems daily",
                  icon: Code,
                },
                {
                  tip: "Record yourself in mock interviews to review later",
                  icon: Video,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg bg-muted/50 p-4"
                >
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <p className="text-sm text-foreground">{item.tip}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
