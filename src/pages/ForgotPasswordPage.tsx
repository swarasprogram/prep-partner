import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { fadeUp, staggerContainer } from "@/lib/animations";
import {
  GraduationCap,
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock password reset
    setTimeout(() => {
      setIsSent(true);
      setIsLoading(false);
      toast({
        title: "Reset link sent!",
        description: "Check your email for the password reset link.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen items-center justify-center p-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Logo */}
          <motion.div variants={fadeUp} className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-accent">
                <GraduationCap className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="font-heading text-2xl font-bold text-foreground">
                PrepLab
              </span>
            </Link>
          </motion.div>

          {!isSent ? (
            <>
              <motion.div variants={fadeUp}>
                <h2 className="mb-2 font-heading text-3xl font-bold text-foreground">
                  Forgot password?
                </h2>
                <p className="mb-8 text-muted-foreground">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>
              </motion.div>

              <motion.form
                variants={fadeUp}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
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
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Reset Link
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </motion.form>
            </>
          ) : (
            <motion.div
              variants={fadeUp}
              className="rounded-xl border border-success/50 bg-success/5 p-8 text-center"
            >
              <CheckCircle className="mx-auto mb-4 h-12 w-12 text-success" />
              <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">
                Check your email
              </h2>
              <p className="mb-6 text-muted-foreground">
                We've sent a password reset link to{" "}
                <span className="font-medium text-foreground">{email}</span>
              </p>
              <Button variant="outline" onClick={() => setIsSent(false)}>
                Didn't receive it? Send again
              </Button>
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="mt-8 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
