import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { criteriaAPI } from "@/services/api";
import { fadeUp, staggerContainer } from "@/lib/animations";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  Clock,
  Target,
  BookOpen,
} from "lucide-react";

type UploadStatus = "idle" | "uploading" | "processing" | "success" | "error";

interface ExtractedCriteria {
  eligibility: { cgpa: number; branches: string[] };
  rounds: Array<{ type: string; topics: string[]; duration: number; questions: number | null }>;
  topics: string[];
  difficulty: string;
  weightage: { dsa: number; mcq: number; interview: number };
}

export default function UploadCriteriaPage() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [pastedText, setPastedText] = useState("");
  const [extractedData, setExtractedData] = useState<ExtractedCriteria | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const simulateUpload = async (input: File | string) => {
    setStatus("uploading");
    setProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 50; i += 10) {
      await new Promise((r) => setTimeout(r, 100));
      setProgress(i);
    }

    setStatus("processing");

    // Simulate processing
    for (let i = 50; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 150));
      setProgress(i);
    }

    try {
      const result = await criteriaAPI.upload(input);
      setExtractedData(result.data);
      setStatus("success");
      toast({
        title: "Criteria extracted!",
        description: "We've analyzed your criteria and created a personalized prep plan.",
      });
    } catch {
      setStatus("error");
      toast({
        title: "Upload failed",
        description: "Please try again or paste the criteria as text.",
        variant: "destructive",
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateUpload(e.target.files[0]);
    }
  };

  const handlePasteSubmit = () => {
    if (pastedText.trim()) {
      simulateUpload(pastedText);
    }
  };

  const handleGeneratePrepPack = () => {
    navigate("/prep-pack");
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
              AI-Powered Extraction
            </StatusBadge>
            <h1 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Upload Company Criteria
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Upload the company's interview pattern or criteria document. Our AI will
              extract and structure it into a personalized prep pack.
            </p>
          </motion.div>

          {status === "idle" && (
            <motion.div variants={fadeUp} className="space-y-6">
              {/* Upload Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-all ${
                  dragActive
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50"
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                  Drop your file here
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  or click to browse (PDF, TXT, DOC)
                </p>
                <Button variant="outline">Browse Files</Button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-sm text-muted-foreground">or paste text</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Text Input */}
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste the company criteria or interview pattern here..."
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  className="min-h-[150px]"
                />
                <Button
                  variant="accent"
                  className="w-full"
                  onClick={handlePasteSubmit}
                  disabled={!pastedText.trim()}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Extract Criteria
                </Button>
              </div>
            </motion.div>
          )}

          {(status === "uploading" || status === "processing") && (
            <motion.div
              variants={fadeUp}
              className="rounded-xl border border-border bg-card p-12 text-center"
            >
              <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-accent" />
              <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                {status === "uploading" ? "Uploading..." : "Analyzing criteria..."}
              </h3>
              <p className="mb-6 text-sm text-muted-foreground">
                {status === "processing"
                  ? "Our AI is extracting interview patterns and topics"
                  : "Please wait while we upload your file"}
              </p>
              <Progress value={progress} className="mx-auto max-w-md" />
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              variants={fadeUp}
              className="rounded-xl border border-destructive/50 bg-destructive/5 p-12 text-center"
            >
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
              <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                Upload Failed
              </h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Something went wrong. Please try again.
              </p>
              <Button variant="outline" onClick={() => setStatus("idle")}>
                Try Again
              </Button>
            </motion.div>
          )}

          {status === "success" && extractedData && (
            <motion.div variants={fadeUp} className="space-y-6">
              {/* Success Header */}
              <div className="rounded-xl border border-success/50 bg-success/5 p-6 text-center">
                <CheckCircle className="mx-auto mb-2 h-10 w-10 text-success" />
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  Criteria Extracted Successfully!
                </h3>
              </div>

              {/* Extracted Data */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Eligibility */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <h4 className="mb-4 flex items-center gap-2 font-heading font-semibold text-foreground">
                    <Target className="h-5 w-5 text-accent" />
                    Eligibility
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Min CGPA</span>
                      <span className="font-semibold text-foreground">
                        {extractedData.eligibility.cgpa}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Branches</span>
                      <span className="font-semibold text-foreground">
                        {extractedData.eligibility.branches.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Difficulty */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <h4 className="mb-4 flex items-center gap-2 font-heading font-semibold text-foreground">
                    <BookOpen className="h-5 w-5 text-accent" />
                    Difficulty & Weightage
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Overall</span>
                      <StatusBadge variant="warning">
                        {extractedData.difficulty}
                      </StatusBadge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">DSA</span>
                        <span>{extractedData.weightage.dsa}%</span>
                      </div>
                      <Progress value={extractedData.weightage.dsa} className="h-1.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Rounds */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h4 className="mb-4 font-heading font-semibold text-foreground">
                  Interview Rounds
                </h4>
                <div className="space-y-4">
                  {extractedData.rounds.map((round, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 rounded-lg border border-border p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 font-semibold text-accent">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{round.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {round.topics.join(", ")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {round.duration} min
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h4 className="mb-4 font-heading font-semibold text-foreground">
                  Key Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {extractedData.topics.map((topic) => (
                    <StatusBadge key={topic} variant="accent">
                      {topic}
                    </StatusBadge>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Button
                variant="hero"
                size="xl"
                className="w-full"
                onClick={handleGeneratePrepPack}
              >
                Generate My Prep Pack
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
