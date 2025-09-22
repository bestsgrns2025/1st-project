import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy"; // Import the new component
import ForgotPassword from "./pages/ForgotPassword"; // Import the new component
import ResetPassword from "./pages/ResetPassword"; // Import the new component
import ImageManagement from "./pages/ImageManagement";
import ContentManagement from "./pages/ContentManagement";
import ProductManagement from "./pages/ProductManagement";
import InquiryManagement from "./pages/InquiryManagement";
import InquiryEmailPreview from "./pages/InquiryEmailPreview";
import Categories from "./pages/Categories";

import TeamPage from "./pages/TeamPage";
import EditImagePage from "./pages/EditImagePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />}>
            <Route path="content-management" element={<ContentManagement />} />
          </Route>
          <Route path="/admin/image-management" element={<ImageManagement />} />
          <Route path="/admin/image-management/edit/:imageId" element={<EditImagePage />} />
          <Route path="/admin/product-management" element={<ProductManagement />} />
          <Route path="/admin/inquiries" element={<InquiryManagement />} />
          <Route path="/admin/inquiry-preview" element={<InquiryEmailPreview />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/reset-password/:token" element={<ResetPassword />} />
          <Route path="/categories" element={<Categories />} />
          
          <Route path="/team" element={<TeamPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
