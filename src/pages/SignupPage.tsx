import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/store";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { GraduationCap, Mail, Lock, ArrowRight, Eye, EyeOff, User } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock signup
    setTimeout(() => {
      login({ id: "1", name, email });
      localStorage.setItem("auth_token", "mock_token");
      toast({
        title: "Account created!",
        description: "Welcome to PrepLab. Let's start your journey.",
      });
      navigate("/roles");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Left Panel - Branding */}
        <div className="hidden w-1/2 bg-gradient-hero lg:block">
          <div className="flex h-full flex-col items-center justify-center p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md text-center"
            >
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/20">
                <GraduationCap className="h-10 w-10 text-accent" />
              </div>
              <h1 className="mb-4 font-heading text-4xl font-bold text-primary-foreground">
                Join PrepLab
              </h1>
              <p className="text-lg text-primary-foreground/80">
                Start your preparation journey and land your dream placement.
              </p>
              <div className="mt-12 space-y-4">
                {["Role-based preparation paths", "Company-specific practice", "Mock interviews & feedback"].map((item) => (
                  <div key={item} className="flex items-center justify-center gap-3 text-primary-foreground/80">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20">
                      <span className="text-xs text-accent">✓</span>
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md"
          >
            {/* Mobile Logo */}
            <motion.div variants={fadeUp} className="mb-8 text-center lg:hidden">
              <Link to="/" className="inline-flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-accent">
                  <GraduationCap className="h-5 w-5 text-accent-foreground" />
                </div>
                <span className="font-heading text-2xl font-bold text-foreground">
                  PrepLab
                </span>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp}>
              <h2 className="mb-2 font-heading text-3xl font-bold text-foreground">
                Create your account
              </h2>
              <p className="mb-8 text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-accent hover:underline">
                  Sign in
                </Link>
              </p>
            </motion.div>

            <motion.form variants={fadeUp} onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              </div>

              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create account
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </motion.form>

            <motion.p variants={fadeUp} className="mt-8 text-center text-sm text-muted-foreground">
              By signing up, you agree to our{" "}
              <a href="#" className="text-accent hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-accent hover:underline">
                Privacy Policy
              </a>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
