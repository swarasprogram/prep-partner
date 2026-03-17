import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";
import { usePrepStore } from "@/lib/store";
import { fadeUp, staggerContainer } from "@/lib/animations";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Clock,
  Play,
  SkipForward,
  CheckCircle,
  Sparkles,
  MessageSquare,
  User,
  ArrowRight,
} from "lucide-react";

type InterviewStatus = "setup" | "in-progress" | "completed";

interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  timeLimit: number;
}

const mockInterviewQuestions: InterviewQuestion[] = [
  {
    id: 1,
    question: "Tell me about yourself and your background.",
    category: "Introduction",
    timeLimit: 120,
  },
  {
    id: 2,
    question: "What is the difference between an array and a linked list? When would you use one over the other?",
    category: "Technical",
    timeLimit: 180,
  },
  {
    id: 3,
    question: "Describe a challenging project you worked on. What was your role and how did you overcome obstacles?",
    category: "Behavioral",
    timeLimit: 180,
  },
  {
    id: 4,
    question: "How would you design a URL shortener like bit.ly?",
    category: "System Design",
    timeLimit: 300,
  },
  {
    id: 5,
    question: "Why do you want to work at this company?",
    category: "HR",
    timeLimit: 120,
  },
];

export default function InterviewPage() {
  const [status, setStatus] = useState<InterviewStatus>("setup");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const { selectedRole, selectedCompany } = usePrepStore();

  const currentQuestion = mockInterviewQuestions[currentQuestionIndex];
  const progressPercent =
    (answeredQuestions.length / mockInterviewQuestions.length) * 100;

  const handleStartInterview = () => {
    setStatus("in-progress");
    setTimeRemaining(currentQuestion.timeLimit);
  };

  const handleNextQuestion = () => {
    setAnsweredQuestions((prev) => [...prev, currentQuestionIndex]);
    if (currentQuestionIndex < mockInterviewQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setTimeRemaining(mockInterviewQuestions[nextIndex].timeLimit);
    } else {
      setStatus("completed");
    }
  };

  const handleRestart = () => {
    setStatus("setup");
    setCurrentQuestionIndex(0);
    setAnsweredQuestions([]);
    setTimeRemaining(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl space-y-8"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center">
            <StatusBadge variant="accent" className="mb-4">
              <Sparkles className="mr-1 h-3 w-3" />
              Mock Interview
            </StatusBadge>
            <h1 className="mb-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Mock Interview Simulator
            </h1>
            <p className="text-muted-foreground">
              {selectedCompany
                ? `Practice for ${selectedCompany} interview`
                : "Practice with realistic interview questions"}
            </p>
          </motion.div>

          {status === "setup" && (
            <motion.div variants={fadeUp} className="space-y-6">
              {/* Interview Setup Card */}
              <div className="rounded-xl border border-border bg-card p-8 shadow-card">
                <h2 className="mb-6 font-heading text-xl font-semibold text-foreground">
                  Interview Setup
                </h2>

                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-semibold text-foreground">
                      {selectedRole || "General"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-semibold text-foreground">
                      {selectedCompany || "General Practice"}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="mb-3 font-semibold text-foreground">
                    Interview Rounds ({mockInterviewQuestions.length} questions)
                  </h3>
                  <div className="space-y-2">
                    {mockInterviewQuestions.map((q, i) => (
                      <div
                        key={q.id}
                        className="flex items-center gap-3 rounded-lg border border-border p-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-foreground">
                            {q.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTime(q.timeLimit)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="hero"
                  size="xl"
                  className="w-full"
                  onClick={handleStartInterview}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Mock Interview
                </Button>
              </div>
            </motion.div>
          )}

          {status === "in-progress" && (
            <motion.div variants={fadeUp} className="space-y-6">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Question {currentQuestionIndex + 1} of{" "}
                    {mockInterviewQuestions.length}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>

              {/* Video Area */}
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-gradient-hero">
                    <div className="flex h-full flex-col items-center justify-center text-primary-foreground">
                      <User className="mb-4 h-20 w-20 opacity-50" />
                      <p className="text-sm opacity-70">Your camera preview</p>
                    </div>
                    {/* Controls */}
                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3">
                      <Button
                        variant={isMicOn ? "secondary" : "destructive"}
                        size="icon"
                        onClick={() => setIsMicOn(!isMicOn)}
                      >
                        {isMicOn ? (
                          <Mic className="h-4 w-4" />
                        ) : (
                          <MicOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant={isVideoOn ? "secondary" : "destructive"}
                        size="icon"
                        onClick={() => setIsVideoOn(!isVideoOn)}
                      >
                        {isVideoOn ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <VideoOff className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Question Panel */}
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                    <div className="mb-3 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-accent" />
                      <StatusBadge variant="accent">
                        {currentQuestion.category}
                      </StatusBadge>
                    </div>
                    <p className="font-medium text-foreground">
                      {currentQuestion.question}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="accent"
                      className="flex-1"
                      onClick={handleNextQuestion}
                    >
                      {currentQuestionIndex < mockInterviewQuestions.length - 1
                        ? "Next Question"
                        : "Finish Interview"}
                      <SkipForward className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {status === "completed" && (
            <motion.div
              variants={fadeUp}
              className="rounded-xl border border-border bg-card p-12 text-center shadow-card"
            >
              <CheckCircle className="mx-auto mb-4 h-16 w-16 text-success" />
              <h2 className="mb-2 font-heading text-3xl font-bold text-foreground">
                Interview Complete!
              </h2>
              <p className="mb-6 text-muted-foreground">
                You've completed all {mockInterviewQuestions.length} questions.
                Great practice session!
              </p>

              <div className="mx-auto mb-8 grid max-w-md grid-cols-3 gap-4">
                <div className="rounded-lg bg-accent/10 p-4">
                  <p className="font-heading text-2xl font-bold text-accent">
                    {mockInterviewQuestions.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
                <div className="rounded-lg bg-success/10 p-4">
                  <p className="font-heading text-2xl font-bold text-success">
                    {mockInterviewQuestions.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Answered</p>
                </div>
                <div className="rounded-lg bg-warning/10 p-4">
                  <p className="font-heading text-2xl font-bold text-warning">
                    Good
                  </p>
                  <p className="text-xs text-muted-foreground">Performance</p>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleRestart}>
                  Practice Again
                </Button>
                <Button variant="accent" onClick={handleRestart}>
                  View Feedback
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
