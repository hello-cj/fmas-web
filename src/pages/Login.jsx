import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getRole } from "../utils/auth";

// ─────────────────────────────────────────────
// 🔧 LOGO PATH
const LOGO_PATH = "/src/images/YdoJx.jpg"; // ← e.g. "/assets/finova-logo.png"
// ─────────────────────────────────────────────

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
  setLoading(true);

  try {
    const res = await api.post("/auth/login", { email, password });

    const token = res.data.token;

    localStorage.setItem("token", token);

    // wait a tick so storage is ready
    const role = getRole();

    if (role === "Admin") navigate("/dashboard");
    else if (role === "Accountant") navigate("/dashboard");
    else if (role === "Clerk") navigate("/dashboard");
    else navigate("/dashboard");

  } catch (err) {
  console.error(err);

  const message =
    err.response?.data?.message ||
    //err.response?.data ||
    "Login failed.";

  alert(message);
} finally {
    setLoading(false);
  }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") login();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0a0d14;
          --surface: #111520;
          --surface2: #161c2d;
          --border: rgba(255,255,255,0.07);
          --border-focus: rgba(79,130,255,0.6);
          --blue: #4f82ff;
          --blue-deep: #3a6bff;
          --blue-glow: rgba(79,130,255,0.25);
          --blue-subtle: rgba(79,130,255,0.08);
          --text: #e8edf8;
          --text-muted: #6b7a99;
          --text-dim: #3d4a65;
          --white: #ffffff;
          --danger: #ff5f6d;
        }

        html, body, #root {
          height: 100%;
          background: var(--bg);
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          -webkit-font-smoothing: antialiased;
        }

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: var(--bg);
          position: relative;
          overflow: hidden;
        }

        /* Ambient background glow */
        .login-root::before {
          content: '';
          position: fixed;
          top: -30%;
          left: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(79,130,255,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .login-root::after {
          content: '';
          position: fixed;
          bottom: -20%;
          right: -5%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(79,130,255,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Card wrapper */
        .login-card {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%;
          max-width: 980px;
          min-height: 620px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04),
            0 40px 120px rgba(0,0,0,0.6),
            0 0 80px rgba(79,130,255,0.04);
        }

        /* ── LEFT PANEL ── */
        .left-panel {
          padding: 48px 52px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0;
        }

        .lang-selector {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 48px;
          cursor: pointer;
          width: fit-content;
        }
        .lang-selector span { font-size: 18px; }
        .lang-selector svg { opacity: 0.5; }

        .welcome-title {
          font-family: 'Sora', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: var(--white);
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }

        .welcome-sub {
          font-size: 14px;
          color: var(--text-muted);
          font-weight: 400;
          margin-bottom: 36px;
          line-height: 1.5;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 18px;
        }

        .field-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 6px;
          letter-spacing: 0.01em;
        }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-dim);
          pointer-events: none;
          display: flex;
        }

        .input-field {
          width: 100%;
          padding: 13px 14px 13px 40px;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .input-field::placeholder { color: var(--text-dim); }
        .input-field:focus {
          border-color: var(--border-focus);
          background: #1a2035;
          box-shadow: 0 0 0 3px var(--blue-glow);
        }

        .eye-toggle {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-dim);
          display: flex;
          padding: 4px;
          transition: color 0.15s;
        }
        .eye-toggle:hover { color: var(--text-muted); }

        .forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 28px;
        }
        .forgot-link {
          font-size: 13px;
          color: var(--blue);
          text-decoration: none;
          font-weight: 500;
          transition: opacity 0.15s;
        }
        .forgot-link:hover { opacity: 0.75; }

        .btn-login {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #4f82ff 0%, #3a6bff 100%);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 24px rgba(79,130,255,0.35);
          position: relative;
          overflow: hidden;
        }
        .btn-login::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
        }
        .btn-login:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(79,130,255,0.45);
        }
        .btn-login:active:not(:disabled) { transform: translateY(0); }
        .btn-login:disabled { opacity: 0.6; cursor: not-allowed; }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
          color: var(--text-dim);
          font-size: 13px;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .social-btn {
          width: 100%;
          padding: 12px 14px;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.18s, border-color 0.18s;
          margin-bottom: 10px;
        }
        .social-btn:hover {
          background: #1c2238;
          border-color: rgba(255,255,255,0.12);
        }
        .social-btn:last-child { margin-bottom: 0; }

        .bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 32px;
        }
        .bottom-text {
          font-size: 13px;
          color: var(--text-muted);
        }
        .bottom-link {
          color: var(--blue);
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .bottom-link:hover { opacity: 0.75; }
        .help-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--text-muted);
          cursor: pointer;
          background: none;
          border: none;
          font-family: inherit;
          transition: color 0.15s;
        }
        .help-btn:hover { color: var(--text); }

        /* ── RIGHT PANEL ── */
        .right-panel {
          position: relative;
          background: #080c18;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        /* Starfield dots */
        .stars {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px);
          background-size: 120px 120px, 80px 80px, 200px 200px;
          background-position: 10px 20px, 50px 70px, 30px 100px;
          opacity: 0.4;
        }

        /* Blue ambient glow behind logo */
        .right-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -60%);
          width: 340px;
          height: 340px;
          background: radial-gradient(circle, rgba(79,130,255,0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Decorative ring shape */
        .ring-decoration {
          position: absolute;
          top: 15%;
          right: -40px;
          width: 200px;
          height: 200px;
          border: 2px solid rgba(79,130,255,0.15);
          border-radius: 50%;
          pointer-events: none;
        }
        .ring-decoration::after {
          content: '';
          position: absolute;
          inset: 20px;
          border: 1px solid rgba(79,130,255,0.08);
          border-radius: 50%;
        }

        .right-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px;
          text-align: center;
        }

        /* ── LOGO DISPLAY AREA ── */
        .logo-display {
          width: 220px;
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 36px;
          position: relative;
        }
        .logo-display img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 0 32px rgba(79,130,255,0.5)) drop-shadow(0 0 64px rgba(79,130,255,0.25));
          animation: floatLogo 4s ease-in-out infinite;
        }
        /* Fallback if no logo loaded */
        .logo-fallback {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #1a2a5e 0%, #2a4aff 100%);
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Sora', sans-serif;
          font-size: 40px;
          font-weight: 700;
          color: white;
          letter-spacing: -2px;
          box-shadow: 0 0 60px rgba(79,130,255,0.4), 0 20px 60px rgba(0,0,0,0.4);
        }

        @keyframes floatLogo {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        /* Orbit rings around logo */
        .orbit-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(79,130,255,0.15);
          pointer-events: none;
          animation: rotateRing 12s linear infinite;
        }
        .orbit-ring-1 {
          width: 260px; height: 260px;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation-duration: 15s;
        }
        .orbit-ring-2 {
          width: 310px; height: 310px;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          border-color: rgba(79,130,255,0.07);
          animation-duration: 22s;
          animation-direction: reverse;
        }
        /* Dot on orbit */
        .orbit-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          background: var(--blue);
          border-radius: 50%;
          top: 0;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 8px var(--blue);
        }
        @keyframes rotateRing {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .brand-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .brand-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #1a2a5e 0%, #3a6bff 100%);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Sora', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: white;
          box-shadow: 0 4px 16px rgba(79,130,255,0.35);
        }
        .brand-name {
          font-family: 'Sora', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--white);
          letter-spacing: -0.3px;
        }

        .brand-tagline {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
          max-width: 280px;
        }

        /* Bottom bar of right panel */
        .right-bottom-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px 32px;
          background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
          display: flex;
          gap: 6px;
          justify-content: center;
        }
        .dot-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
        }
        .dot-indicator.active {
          width: 20px;
          border-radius: 3px;
          background: var(--blue);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 720px) {
          .login-card {
            grid-template-columns: 1fr;
            max-width: 440px;
          }
          .right-panel { display: none; }
          .left-panel { padding: 36px 28px; }
        }

        /* Loading spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        /* Fade-in on mount */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .left-panel > * {
          animation: fadeUp 0.5s ease both;
        }
        .left-panel > *:nth-child(1) { animation-delay: 0.05s; }
        .left-panel > *:nth-child(2) { animation-delay: 0.1s; }
        .left-panel > *:nth-child(3) { animation-delay: 0.15s; }
        .left-panel > *:nth-child(4) { animation-delay: 0.2s; }
        .left-panel > *:nth-child(5) { animation-delay: 0.25s; }
        .left-panel > *:nth-child(6) { animation-delay: 0.3s; }
        .left-panel > *:nth-child(7) { animation-delay: 0.35s; }
        .left-panel > *:nth-child(8) { animation-delay: 0.4s; }
        .left-panel > *:nth-child(9) { animation-delay: 0.45s; }
      `}</style>

      <div className="login-root">
        <div className="login-card">

          {/* ── LEFT: FORM PANEL ── */}
          <div className="left-panel">

            {/* Language selector */}
            <div className="lang-selector">
              <span>🇺🇸</span>
              English (US)
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
            </div>

            {/* Heading */}
            <h1 className="welcome-title">Welcome Back!</h1>
            <p className="welcome-sub">Unlock the power of FINOVA and continue your financial journey.</p>

            {/* Email field */}
            <div className="field-group">
              <label className="field-label">Username or Email</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="3"/>
                    <path d="m22 7-10 7L2 7"/>
                  </svg>
                </span>
                <input
                  className="input-field"
                  type="email"
                  placeholder="Enter username or email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKey}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="field-group">
              <label className="field-label">Password</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  className="input-field"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKey}
                  autoComplete="current-password"
                />
                <button className="eye-toggle" onClick={() => setShowPassword(!showPassword)} type="button">
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="forgot-row">
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>

            {/* Login button */}
            <button className="btn-login" onClick={login} disabled={loading}>
              {loading ? <span className="spinner" /> : "Login"}
            </button>

            

            {/* Bottom row */}
            <div className="bottom-row">
              <p className="bottom-text">
                New to FINOVA?{" "}
                <Link to="/register" className="bottom-link">
                  Sign Up Here!
                </Link>
              </p>
              <button className="help-btn" type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Need Help?
              </button>
            </div>

          </div>

          {/* ── RIGHT: VISUAL PANEL ── */}
          <div className="right-panel">
            <div className="stars" />
            <div className="right-glow" />
            <div className="ring-decoration" />

            <div className="right-content">
              {/* ── YOUR LOGO GOES HERE ── */}
              <div className="logo-display">
                <div className="orbit-ring orbit-ring-1"><div className="orbit-dot" /></div>
                <div className="orbit-ring orbit-ring-2"><div className="orbit-dot" /></div>
                <img
                  src={LOGO_PATH}
                  alt="FINOVA Logo"
                  onError={(e) => {
                    // Fallback if logo.png is not found
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                {/* Fallback block — hidden when logo loads */}
                <div className="logo-fallback" style={{ display: "none" }}>F</div>
              </div>

              <div className="brand-row">
                <div className="brand-icon">F</div>
                <span className="brand-name">finova</span>
              </div>
              <p className="brand-tagline">
                Embark on a journey of financial clarity. FINOVA — where decisions align, goals shine, and wealth soars.
              </p>
            </div>

            {/* Slide indicator dots */}
            <div className="right-bottom-bar">
              <div className="dot-indicator active" />
              <div className="dot-indicator" />
              <div className="dot-indicator" />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}