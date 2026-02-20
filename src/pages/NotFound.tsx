import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import MiniHeader from "@/components/MiniHeader";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-bg-void flex flex-col">
      <MiniHeader />
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-bebas text-6xl text-gold mb-4">404</h1>
          <p className="text-text-mid text-sm mb-6">This page doesn't exist.</p>
          <a
            href="/"
            className="text-text-dim text-sm font-semibold tracking-wider hover:text-text-mid transition-colors"
          >
            BACK TO HOME
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
