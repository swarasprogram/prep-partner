import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAuthStore, usePrepStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { fadeUp, staggerContainer } from "@/lib/animations";
import {
  User,
  Mail,
  Target,
  Building2,
  LogOut,
  Save,
  Sparkles,
  Shield,
} from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const { selectedRole, selectedCompany } = usePrepStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("auth_token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-2xl space-y-8"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center">
            <StatusBadge variant="accent" className="mb-4">
              <Sparkles className="mr-1 h-3 w-3" />
              Profile
            </StatusBadge>
            <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">
              Your Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </motion.div>

          {/* Avatar Card */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center rounded-xl border border-border bg-card p-8 shadow-card"
          >
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-accent text-3xl font-bold text-accent-foreground">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              {user?.name || "Student"}
            </h2>
            <p className="text-muted-foreground">{user?.email || "student@example.com"}</p>
            <div className="mt-4 flex gap-2">
              {selectedRole && (
                <StatusBadge variant="accent">
                  <Target className="mr-1 h-3 w-3" />
                  {selectedRole}
                </StatusBadge>
              )}
              {selectedCompany && (
                <StatusBadge variant="accent">
                  <Building2 className="mr-1 h-3 w-3" />
                  {selectedCompany}
                </StatusBadge>
              )}
            </div>
          </motion.div>

          {/* Personal Info */}
          <motion.div
            variants={fadeUp}
            className="rounded-xl border border-border bg-card p-6 shadow-card"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-heading text-xl font-semibold text-foreground">
                Personal Information
              </h3>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              ) : (
                <Button variant="accent" size="sm" onClick={handleSave}>
                  <Save className="mr-1 h-3 w-3" />
                  Save
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Preparation Info */}
          <motion.div
            variants={fadeUp}
            className="rounded-xl border border-border bg-card p-6 shadow-card"
          >
            <h3 className="mb-4 font-heading text-xl font-semibold text-foreground">
              Preparation Settings
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  Target Role
                </div>
                <p className="mt-1 font-semibold text-foreground">
                  {selectedRole || "Not Selected"}
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  Target Company
                </div>
                <p className="mt-1 font-semibold text-foreground">
                  {selectedCompany || "Not Selected"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            variants={fadeUp}
            className="rounded-xl border border-border bg-card p-6 shadow-card"
          >
            <h3 className="mb-4 font-heading text-xl font-semibold text-foreground">
              Security
            </h3>
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Password</p>
                  <p className="text-sm text-muted-foreground">
                    Last changed 30 days ago
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
          </motion.div>

          {/* Logout */}
          <motion.div variants={fadeUp}>
            <Button
              variant="outline"
              className="w-full text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
