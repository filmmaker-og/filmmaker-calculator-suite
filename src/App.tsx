import { lazy, Suspense, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import BottomTabBar from "./components/BottomTabBar";
import OgBotSheet from "./components/OgBotSheet";

import MobileMenu from "./components/MobileMenu";
import AppHeader from "./components/AppHeader";

/* ═══════════════════════════════════════════════════════════════════
   Lazy-loaded pages — only the landing page is eagerly loaded.
   Everything else loads on demand with a Suspense fallback.
   ═══════════════════════════════════════════════════════════════════ */
import Index from "./pages/Index";

const BudgetInfo = lazy(() => import("./pages/BudgetInfo"));
const CapitalInfo = lazy(() => import("./pages/CapitalInfo"));
const FeesInfo = lazy(() => import("./pages/FeesInfo"));
const WaterfallInfo = lazy(() => import("./pages/WaterfallInfo"));
const Glossary = lazy(() => import("./pages/Glossary"));
const Resources = lazy(() => import("./pages/Resources"));
const Auth = lazy(() => import("./pages/Auth"));
const Calculator = lazy(() => import("./pages/Calculator"));
const Store = lazy(() => import("./pages/Store"));
const StorePackage = lazy(() => import("./pages/StorePackage"));
const StoreCompare = lazy(() => import("./pages/StoreCompare"));
const BuildYourPlan = lazy(() => import("./pages/BuildYourPlan"));
const NotFound = lazy(() => import("./pages/NotFound"));

/* ═══════════════════════════════════════════════════════════════════
   Route-level loading fallback
   ═══════════════════════════════════════════════════════════════════ */
const PageLoader = () => (
  <div className="min-h-screen bg-bg-void flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-text-dim text-sm">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

/* ─── Root layout — mounts AppHeader + BottomTabBar + OgBotSheet globally ─── */
const AppShell = () => {
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <AppHeader
        onMoreOpen={() => setIsMenuOpen(true)}
      />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/budget-info" element={<BudgetInfo />} />
          <Route path="/capital-info" element={<CapitalInfo />} />
          <Route path="/fees-info" element={<FeesInfo />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/waterfall-info" element={<Navigate to="/resources?tab=waterfall" replace />} />
          <Route path="/glossary" element={<Navigate to="/resources?tab=terms" replace />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/store" element={<Store />} />
          <Route path="/store/compare" element={<StoreCompare />} />
          <Route path="/store/:slug" element={<StorePackage />} />
          <Route path="/build-your-plan" element={<BuildYourPlan />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {/* Global persistent UI — always mounted */}
      <OgBotSheet isOpen={isBotOpen} onOpenChange={setIsBotOpen} />
      <MobileMenu isOpen={isMenuOpen} onOpenChange={setIsMenuOpen} />
      <BottomTabBar onBotOpen={() => setIsBotOpen(true)} />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <ErrorBoundary>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
