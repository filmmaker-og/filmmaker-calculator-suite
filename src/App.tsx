import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import IntroView from "./pages/IntroView";
import BudgetInfo from "./pages/BudgetInfo";
import CapitalInfo from "./pages/CapitalInfo";
import FeesInfo from "./pages/FeesInfo";
import WaterfallInfo from "./pages/WaterfallInfo";
import Glossary from "./pages/Glossary"; // Import new page
import Auth from "./pages/Auth";
import Calculator from "./pages/Calculator";
import Store from "./pages/Store";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/intro" element={<IntroView />} />
          <Route path="/budget-info" element={<BudgetInfo />} />
          <Route path="/capital-info" element={<CapitalInfo />} />
          <Route path="/fees-info" element={<FeesInfo />} />
          <Route path="/waterfall-info" element={<WaterfallInfo />} />
          <Route path="/glossary" element={<Glossary />} /> {/* New Route */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/store" element={<Store />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
