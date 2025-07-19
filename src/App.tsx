
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import PlanningEditor from "./pages/PlanningEditor";
import FocusMode from "./pages/FocusMode";
import PauseMode from "./pages/PauseMode";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import CalendarIntegration from "./pages/CalendarIntegration";
import EmailManagement from "./pages/EmailManagement";
import TeamCollaboration from "./pages/TeamCollaboration";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import About from "./pages/About";
import Community from "./pages/Community";
import Roadmap from "./pages/Roadmap";
import Pricing from "./pages/Pricing";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";
import OAuthCallback from "./pages/OAuthCallback";
import TermsOfService from "./pages/TermsOfService";
import DistractionMonitor from "./components/DistractionMonitor";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Toaster />
      <Sonner position="top-right" duration={3000} closeButton />
      <DistractionMonitor />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<LoginPage />} />
          <Route path="/auth/google/callback" element={<OAuthCallback />} />
          <Route path="/auth/microsoft/callback" element={<OAuthCallback />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/planning" element={<PlanningEditor />} />
          <Route path="/focus" element={<FocusMode />} />
          <Route path="/pause" element={<PauseMode />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/calendar" element={<CalendarIntegration />} />
          <Route path="/calendar-integration" element={<CalendarIntegration />} />
          <Route path="/email" element={<EmailManagement />} />
          <Route path="/team" element={<TeamCollaboration />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/about" element={<About />} />
          <Route path="/community" element={<Community />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
