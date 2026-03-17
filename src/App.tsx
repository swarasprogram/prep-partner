import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/upload-criteria" element={<UploadCriteriaPage />} />
          <Route path="/mcq" element={<MCQPage />} />
          <Route path="/dsa" element={<DSAPage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/prep-pack" element={<PrepPackPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
