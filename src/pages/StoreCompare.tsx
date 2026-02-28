import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════════════
   STORE COMPARE — DEPRECATED
   Comparison table removed. Redirect to main store.
   ═══════════════════════════════════════════════════════════════════ */
const StoreCompare = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/store", { replace: true });
  }, [navigate]);
  return null;
};

export default StoreCompare;
