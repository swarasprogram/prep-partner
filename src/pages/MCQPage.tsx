import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";
import { usePrepStore } from "@/lib/store";
import { questionsAPI } from "@/services/api";
import { fadeUp, staggerContainer } from "@/lib/animations";
import {
  FileQuestion,
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Clock,
  Target,
} from "lucide-react";

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  topic: string;
}

export default function MCQPage() {
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { selectedRole, selectedCompany } = usePrepStore();

  useEffect(() => {
    const fetchQuestions = async () => {
      const data = await questionsAPI.getMCQs();
      setQuestions(data);
    };
    fetchQuestions();
  }, []);

  const currentQuestion = questions[currentIndex];
  const progressPercent = questions.length
    ? ((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100
    : 0;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQuestion.correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsComplete(false);
  };

  const getOptionStyle = (index: number) => {
    if (!isAnswered) {
      return selectedOption === index
        ? "border-accent bg-accent/5"
        : "border-border hover:border-accent/50";
    }
    if (index === currentQuestion.correct) {
      return "border-success bg-success/5";
    }
    if (index === selectedOption && index !== currentQuestion.correct) {
      return "border-destructive bg-destructive/5";
    }
    return "border-border opacity-50";
  };

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl space-y-8"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center">
            <StatusBadge variant="accent" className="mb-4">
              <FileQuestion className="mr-1 h-3 w-3" />
              MCQ Practice
            </StatusBadge>
            <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">
              Multiple Choice Questions
            </h1>
            <p className="text-muted-foreground">
              {selectedRole && `Role: ${selectedRole}`}
              {selectedRole && selectedCompany && " • "}
              {selectedCompany && `Company: ${selectedCompany}`}
              {!selectedRole && !selectedCompany && "Practice aptitude and technical MCQs"}
            </p>
          </motion.div>

          {!isComplete ? (
            <>
              {/* Progress Bar */}
              <motion.div variants={fadeUp} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-accent">
                    <Target className="h-4 w-4" />
                    Score: {score}/{currentIndex + (isAnswered ? 1 : 0)}
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </motion.div>

              {/* Question Card */}
              <motion.div
                key={currentQuestion.id}
                variants={fadeUp}
                className="rounded-xl border border-border bg-card p-8 shadow-card"
              >
                <div className="mb-2 flex items-center gap-2">
                  <StatusBadge variant="accent">{currentQuestion.topic}</StatusBadge>
                </div>
                <h2 className="mb-8 font-heading text-xl font-semibold text-foreground">
                  {currentQuestion.question}
                </h2>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectOption(index)}
                      disabled={isAnswered}
                      className={`flex w-full items-center gap-4 rounded-lg border-2 p-4 text-left transition-all ${getOptionStyle(index)}`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                          isAnswered && index === currentQuestion.correct
                            ? "bg-success text-success-foreground"
                            : isAnswered && index === selectedOption
                              ? "bg-destructive text-destructive-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isAnswered && index === currentQuestion.correct ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : isAnswered && index === selectedOption ? (
                          <XCircle className="h-5 w-5" />
                        ) : (
                          String.fromCharCode(65 + index)
                        )}
                      </div>
                      <span className="font-medium text-foreground">{option}</span>
                    </button>
                  ))}
                </div>

                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex justify-end"
                  >
                    <Button variant="accent" onClick={handleNext}>
                      {currentIndex < questions.length - 1 ? "Next Question" : "View Results"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </>
          ) : (
            /* Results */
            <motion.div
              variants={fadeUp}
              className="rounded-xl border border-border bg-card p-12 text-center shadow-card"
            >
              <Trophy className="mx-auto mb-4 h-16 w-16 text-warning" />
              <h2 className="mb-2 font-heading text-3xl font-bold text-foreground">
                Quiz Complete!
              </h2>
              <p className="mb-6 text-muted-foreground">
                Here's how you performed
              </p>

              <div className="mx-auto mb-8 grid max-w-sm grid-cols-3 gap-4">
                <div className="rounded-lg bg-accent/10 p-4">
                  <p className="font-heading text-2xl font-bold text-accent">{score}</p>
                  <p className="text-xs text-muted-foreground">Correct</p>
                </div>
                <div className="rounded-lg bg-destructive/10 p-4">
                  <p className="font-heading text-2xl font-bold text-destructive">
                    {questions.length - score}
                  </p>
                  <p className="text-xs text-muted-foreground">Wrong</p>
                </div>
                <div className="rounded-lg bg-warning/10 p-4">
                  <p className="font-heading text-2xl font-bold text-warning">
                    {Math.round((score / questions.length) * 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Score</p>
                </div>
              </div>

              <StatusBadge
                variant={
                  score / questions.length >= 0.7
                    ? "success"
                    : score / questions.length >= 0.5
                      ? "warning"
                      : "destructive"
                }
                className="mb-6 text-sm"
              >
                {score / questions.length >= 0.7
                  ? "Excellent Performance!"
                  : score / questions.length >= 0.5
                    ? "Good Effort!"
                    : "Keep Practicing!"}
              </StatusBadge>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleRestart}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Try Again
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
