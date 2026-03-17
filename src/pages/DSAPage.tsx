import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { questionsAPI } from "@/services/api";
import { fadeUp, staggerContainer } from "@/lib/animations";
import {
  Code,
  Search,
  Building2,
  Filter,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface DSAProblem {
  id: string;
  title: string;
  difficulty: string;
  topics: string[];
  companies: string[];
}

export default function DSAPage() {
  const [problems, setProblems] = useState<DSAProblem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      const data = await questionsAPI.getDSA();
      setProblems(data);
    };
    fetchProblems();
  }, []);

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter
      ? problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
      : true;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "easy";
      case "medium":
        return "medium";
      case "hard":
        return "hard";
      default:
        return "default";
    }
  };

  const difficulties = ["Easy", "Medium", "Hard"];

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
              DSA Practice
            </StatusBadge>
            <h1 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Data Structures & Algorithms
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Practice the most frequently asked DSA problems from top tech companies.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div variants={fadeUp} className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={difficultyFilter === null ? "accent" : "outline"}
                size="sm"
                onClick={() => setDifficultyFilter(null)}
              >
                <Filter className="mr-1 h-3 w-3" />
                All
              </Button>
              {difficulties.map((diff) => (
                <Button
                  key={diff}
                  variant={difficultyFilter === diff ? "accent" : "outline"}
                  size="sm"
                  onClick={() =>
                    setDifficultyFilter(difficultyFilter === diff ? null : diff)
                  }
                >
                  {diff}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Problems List */}
          <motion.div variants={fadeUp} className="space-y-4">
            {filteredProblems.map((problem, index) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:border-accent/50 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Code className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {problem.title}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <StatusBadge
                        variant={getDifficultyVariant(problem.difficulty)}
                      >
                        {problem.difficulty}
                      </StatusBadge>
                      {problem.topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden items-center gap-1 sm:flex">
                    {problem.companies.map((company) => (
                      <span
                        key={company}
                        className="flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent"
                      >
                        <Building2 className="h-3 w-3" />
                        {company}
                      </span>
                    ))}
                  </div>
                  <Button variant="ghost" size="icon" className="opacity-0 transition-opacity group-hover:opacity-100">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}

            {filteredProblems.length === 0 && (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <Code className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                  No problems found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters.
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
