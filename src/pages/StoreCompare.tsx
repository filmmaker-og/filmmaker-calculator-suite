import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/** StoreCompare is deprecated — comparison table now lives inline on Store.tsx.
 *  This component exists only to redirect any bookmarked/cached URLs. */
const StoreCompare = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/store", { replace: true });
  }, [navigate]);
  return null;
};

export default StoreCompare;
