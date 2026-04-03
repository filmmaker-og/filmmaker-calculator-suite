import { useNavigate } from "react-router-dom";
import { BG, GOLD, gold, white } from "@/lib/tokens";

/* ═══════════════════════════════════════════════════════════════════
   Login Page — Placeholder (no functionality yet)
   ═══════════════════════════════════════════════════════════════════ */

const Login = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG.void,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px 60px",
      }}
    >
      <div
        style={{
          maxWidth: 420,
          width: "100%",
          background: BG.elevated,
          border: `1px solid ${gold(0.12)}`,
          borderRadius: "12px",
          padding: "40px 32px 36px",
          textAlign: "center",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: `2px solid ${GOLD}`,
            margin: "0 auto 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "18px",
              color: GOLD,
              letterSpacing: "0.05em",
            }}
          >
            OG
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "32px",
            color: white(0.92),
            letterSpacing: "0.08em",
            marginBottom: "8px",
          }}
        >
          WELCOME BACK
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "15px",
            color: white(0.65),
            marginBottom: "32px",
            lineHeight: 1.5,
          }}
        >
          Sign in to your filmmaker.og account.
        </p>

        {/* Google button */}
        <button
          className="btn-cta-primary"
          style={{
            width: "100%",
            height: "48px",
            fontSize: "17px",
            cursor: "pointer",
            marginBottom: "12px",
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.97)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Continue with Google
        </button>

        {/* Email button */}
        <button
          className="btn-cta-primary"
          style={{
            width: "100%",
            height: "48px",
            fontSize: "17px",
            cursor: "pointer",
            marginBottom: "28px",
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.97)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Continue with Email
        </button>

        {/* Signup link */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            color: white(0.65),
          }}
        >
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            style={{
              color: "#F9E076",
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
