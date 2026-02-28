import { useLocation } from "react-router-dom";
import { useEffect } from "react";


const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-bebas text-[40px] text-gold mb-4">404</h1>
          <p className="text-ink-body text-[16px] mb-6">This page doesn't exist.</p>
          <a
            href="/"
            className="text-ink-secondary text-[14px] font-semibold tracking-[0.08em] hover:text-ink-body transition-colors"
          >
            BACK TO HOME
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
