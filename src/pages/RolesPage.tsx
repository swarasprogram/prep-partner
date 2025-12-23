import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { usePrepStore } from "@/lib/store";
import { rolesAPI } from "@/services/api";
import { fadeUp, staggerContainer } from "@/lib/animations";
import {
  Code,
  BarChart3,
  Server,
  CheckCircle,
  Brain,
  Layout,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  skills: string[];
  icon: string;
}

const iconMap: Record<string, React.ElementType> = {
  code: Code,
  "bar-chart": BarChart3,
  server: Server,
  "check-circle": CheckCircle,
  brain: Brain,
  layout: Layout,
};

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { setRole } = usePrepStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      const data = await rolesAPI.getAll();
      setRoles(data);
    };
    fetchRoles();
  }, []);

  const handleSelectRole = (role: Role) => {
    setSelectedId(role.id);
    setRole(role.name);
  };

  const handleContinue = () => {
    if (selectedId) {
      navigate("/companies");
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
              Step 1 of 2
            </StatusBadge>
            <h1 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Choose Your Target Role
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Select the role you're preparing for. We'll customize your preparation
              path with role-specific questions and interview patterns.
            </p>
          </motion.div>

          {/* Role Cards Grid */}
          <motion.div variants={fadeUp} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => {
              const IconComponent = iconMap[role.icon] || Code;
              const isSelected = selectedId === role.id;

              return (
                <motion.div
                  key={role.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectRole(role)}
                  className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all ${
                    isSelected
                      ? "border-accent bg-accent/5 shadow-glow"
                      : "border-border bg-card hover:border-accent/50 hover:shadow-lg"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute right-4 top-4">
                      <CheckCircle className="h-6 w-6 text-accent" />
                    </div>
                  )}

                  <div
                    className={`mb-4 inline-flex rounded-xl p-3 ${
                      isSelected
                        ? "bg-accent text-accent-foreground"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    <IconComponent className="h-7 w-7" />
                  </div>

                  <h3 className="mb-2 font-heading text-xl font-semibold text-foreground">
                    {role.name}
                  </h3>

                  <p className="mb-4 text-sm text-muted-foreground">
                    {role.description}
                  </p>

                  <div className="mb-4">
                    <StatusBadge variant={getDifficultyVariant(role.difficulty)}>
                      {role.difficulty}
                    </StatusBadge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {role.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Continue Button */}
          <motion.div variants={fadeUp} className="flex justify-center pt-4">
            <Button
              variant="accent"
              size="xl"
              onClick={handleContinue}
              disabled={!selectedId}
              className="min-w-[200px]"
            >
              Continue to Companies
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
