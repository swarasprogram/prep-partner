import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePrepStore } from "@/lib/store";
import { companiesAPI } from "@/services/api";
import { fadeUp, staggerContainer } from "@/lib/animations";
import {
  Search,
  Building2,
  ArrowRight,
  Users,
  Award,
  CheckCircle,
  Sparkles,
  FileUp,
  Play,
} from "lucide-react";

interface Company {
  id: string;
  name: string;
  logo: string;
  difficulty: string;
  rounds: number;
  roles: string[];
  avgPackage: string;
  eligibility: {
    cgpa: number;
    branches: string[];
  };
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedRole, setCompany } = usePrepStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      const data = await companiesAPI.getAll();
      setCompanies(data);
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleStartPrep = () => {
    if (selectedCompany) {
      setCompany(selectedCompany.name);
      navigate("/prep-pack");
    }
  };

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
              Step 2 of 2
            </StatusBadge>
            <h1 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Select Your Dream Company
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {selectedRole
                ? `Showing companies hiring for ${selectedRole}. Pick your target and start preparing.`
                : "Browse companies and select where you want to work."}
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div variants={fadeUp} className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => navigate("/upload-criteria")}>
              <FileUp className="mr-2 h-4 w-4" />
              Upload Criteria
            </Button>
          </motion.div>

          {/* Companies Grid */}
          <motion.div variants={fadeUp} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCompanies.map((company) => (
              <motion.div
                key={company.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCompanyClick(company)}
                className="cursor-pointer rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:border-accent/50 hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-3xl">
                    {company.logo}
                  </div>
                  <StatusBadge variant={getDifficultyVariant(company.difficulty)}>
                    {company.difficulty}
                  </StatusBadge>
                </div>

                <h3 className="mb-2 font-heading text-xl font-semibold text-foreground">
                  {company.name}
                </h3>

                <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {company.rounds} Rounds
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    {company.avgPackage}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {company.roles.slice(0, 2).map((role) => (
                    <span
                      key={role}
                      className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent"
                    >
                      {role}
                    </span>
                  ))}
                  {company.roles.length > 2 && (
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      +{company.roles.length - 2} more
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Company Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted text-4xl">
                {selectedCompany?.logo}
              </div>
              <div>
                <DialogTitle className="font-heading text-2xl">
                  {selectedCompany?.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedCompany?.rounds} interview rounds
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Eligibility */}
            <div>
              <h4 className="mb-2 font-semibold text-foreground">Eligibility</h4>
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Min CGPA</p>
                    <p className="font-semibold text-foreground">
                      {selectedCompany?.eligibility.cgpa}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Branches</p>
                    <p className="font-semibold text-foreground">
                      {selectedCompany?.eligibility.branches.join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interview Rounds */}
            <div>
              <h4 className="mb-2 font-semibold text-foreground">Interview Rounds</h4>
              <div className="space-y-2">
                {["Online Assessment", "Technical Round 1", "Technical Round 2", "HR Round"].slice(0, selectedCompany?.rounds || 4).map((round, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-border p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                      {i + 1}
                    </div>
                    <span className="text-foreground">{round}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Roles */}
            <div>
              <h4 className="mb-2 font-semibold text-foreground">Hiring For</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCompany?.roles.map((role) => (
                  <StatusBadge key={role} variant="accent">
                    {role}
                  </StatusBadge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="accent"
                className="flex-1"
                onClick={handleStartPrep}
              >
                <Play className="mr-2 h-4 w-4" />
                Start Company Prep
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  navigate("/upload-criteria");
                }}
              >
                <FileUp className="mr-2 h-4 w-4" />
                Upload Criteria
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
