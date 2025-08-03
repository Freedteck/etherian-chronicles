import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Stories from "./pages/Stories";
import StoryDetail from "./pages/StoryDetail";
import Proposals from "./pages/Proposals";
import ProposalDetail from "./pages/ProposalDetail";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import CreateStory from "./pages/CreateStory";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./contexts/ThemeContext";
import RegistrationModal from "./components/ui/RegistrationModal";
import { getUserCompleteProfile } from "./data/proposalData";
import { useActiveAccount } from "thirdweb/react";
import { useEffect, useState } from "react";
import ScrollToTop from "./components/ui/scroll-to-top";

const queryClient = new QueryClient();
const App = () => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const account = useActiveAccount();

  useEffect(() => {
    if (!account) {
      return;
    }
    const checkProfile = async () => {
      const user = await getUserCompleteProfile(account.address);
      if (!user?.profile.isRegistered) {
        setShowRegistrationModal(true);
      }
    };
    checkProfile();
  }, [account]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ThemeProvider> */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RegistrationModal
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
        />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/stories/:id" element={<StoryDetail />} />
            <Route path="/proposals" element={<Proposals />} />
            <Route path="/proposals/:id" element={<ProposalDetail />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/create" element={<CreateStory />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      {/* </ThemeProvider> */}
    </QueryClientProvider>
  );
};

export default App;
