import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import pages
import UserTypeSelection from "./pages/UserTypeSelection";
import Login from "./pages/Login";
import ContactUs from "./pages/ContactUs";
import HelpCenter from "./pages/HelpCenter";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FarmerSignup from "./pages/farmer/FarmerSignup";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import CropUpload from "./pages/farmer/CropUpload";
import ExploreCrops from "./pages/farmer/ExploreCrops";
import MyCrops from "./pages/farmer/MyCrops";
import Messages from "./pages/farmer/Messages";
import SellerSignup from "./pages/seller/SellerSignup";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerMessages from "./pages/seller/SellerMessages";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<UserTypeSelection />} />
            <Route path="/login" element={<Login />} />

            {/* Support Pages */}
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

            {/* Farmer Routes */}
            <Route path="/farmer/signup" element={<FarmerSignup />} />
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/farmer/crop-upload" element={<CropUpload />} />
            <Route path="/farmer/my-crops" element={<MyCrops />} />
            <Route path="/farmer/explore" element={<ExploreCrops />} />
            <Route path="/farmer/messages" element={<Messages />} />

            {/* Seller Routes */}
            <Route path="/seller/signup" element={<SellerSignup />} />
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/messages" element={<SellerMessages />} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
