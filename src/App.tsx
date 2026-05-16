import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import RolesPage from "./pages/RolesPage";
import CompaniesPage from "./pages/CompaniesPage";
import UploadCriteriaPage from "./pages/UploadCriteriaPage";
import MCQPage from "./pages/MCQPage";
import DSAPage from "./pages/DSAPage";
import InterviewPage from "./pages/InterviewPage";
import PrepPackPage from "./pages/PrepPackPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import PaymentPage from "./pages/PaymentPage";
import NotFound from "./pages/NotFound";
import { useAuthStore } from "@/lib/store";
import { api } from "@/services/api";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AuthInitializer() {
  const { login, logout } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    api.get('/users/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const u = res.data;
        login({ id: String(u.id), name: u.full_name || u.email, email: u.email });
      })
      .catch(() => {
        logout();
      });
  }, []);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthInitializer />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/roles" element={<ProtectedRoute><RolesPage /></ProtectedRoute>} />
          <Route path="/companies" element={<ProtectedRoute><CompaniesPage /></ProtectedRoute>} />
          <Route path="/upload-criteria" element={<ProtectedRoute><UploadCriteriaPage /></ProtectedRoute>} />
          <Route path="/mcq" element={<ProtectedRoute><MCQPage /></ProtectedRoute>} />
          <Route path="/dsa" element={<ProtectedRoute><DSAPage /></ProtectedRoute>} />
          <Route path="/interview" element={<ProtectedRoute><InterviewPage /></ProtectedRoute>} />
          <Route path="/prep-pack" element={<ProtectedRoute><PrepPackPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


