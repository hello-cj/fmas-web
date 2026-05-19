import { useState } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";

const LOGO_PATH = "/src/images/YdoJx.jpg";

export default function Register() {
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  const navigate = useNavigate();

  const register = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        organization_name: organization,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") register();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #07090f;
          --surface: #0d1017;
          --surface2: #111520;
          --surface3: #161d2e;
          --border: rgba(255,255,255,0.06);
          --border-active: rgba(99,157,255,0.5);
          --blue: #5b8fff;
          --blue-soft: rgba(91,143,255,0.12);
          --blue-glow: rgba(91,143,255,0.2);
          --gold: #c9a96e;
          --gold-soft: rgba(201,169,110,0.08);
          --text: #dde4f0;
          --text-muted: #5a6680;
          --text-dim: #2e3a52;
          --white: #ffffff;
          --error: #ff6b6b;
        }

        html, body, #root {
          height: 100%;
          background: var(--bg);
          font-family: 'Geist', sans-serif;
          color: var(--text);
          -webkit-font-smoothing: antialiased;
        }

        /* ── ROOT LAYOUT ── */
        .reg-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        /* ── LEFT PANEL ── */
        .reg-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px 72px;
          background: var(--surface);
          position: relative;
          overflow: hidden;
        }

        .reg-left::before {
          content: '';
          position: absolute;
          top: -120px; left: -80px;
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(91,143,255,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .reg-left::after {
          content: '';
          position: absolute;
          bottom: -100px; right: -60px;
          width: 340px; height: 340px;
          background: radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── LOGO MARK ── */
        .reg-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 52px;
        }

        .reg-logo-mark {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, var(--blue) 0%, #3a6bff 100%);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }

        .reg-logo-mark svg {
          width: 16px; height: 16px;
        }

        .reg-logo-name {
          font-family: 'Instrument Serif', serif;
          font-size: 18px;
          letter-spacing: 0.04em;
          color: var(--white);
        }

        /* ── HEADING ── */
        .reg-heading {
          font-family: 'Instrument Serif', serif;
          font-size: 36px;
          font-weight: 400;
          line-height: 1.2;
          color: var(--white);
          margin-bottom: 6px;
        }

        .reg-heading em {
          font-style: italic;
          color: var(--gold);
        }

        .reg-sub {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 40px;
          font-weight: 300;
          letter-spacing: 0.01em;
        }

        /* ── STEP INDICATOR ── */
        .reg-steps {
          display: flex;
          gap: 6px;
          margin-bottom: 36px;
        }

        .reg-step {
          height: 3px;
          border-radius: 2px;
          flex: 1;
          background: var(--border);
          transition: background 0.4s;
        }

        .reg-step.active {
          background: var(--blue);
        }

        .reg-step.done {
          background: var(--gold);
        }

        /* ── FIELD GROUP ── */
        .field-group {
          margin-bottom: 16px;
          position: relative;
          animation: slideUp 0.4s ease both;
        }

        .field-group:nth-child(1) { animation-delay: 0.05s; }
        .field-group:nth-child(2) { animation-delay: 0.10s; }
        .field-group:nth-child(3) { animation-delay: 0.15s; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 8px;
          transition: color 0.2s;
        }

        .field-group.is-focused .field-label {
          color: var(--blue);
        }

        .field-wrap {
          position: relative;
        }

        .field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px; height: 16px;
          color: var(--text-dim);
          pointer-events: none;
          transition: color 0.2s;
        }

        .field-group.is-focused .field-icon {
          color: var(--blue);
        }

        .reg-input {
          width: 100%;
          padding: 13px 14px 13px 42px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--surface2);
          color: var(--text);
          font-family: 'Geist', sans-serif;
          font-size: 14px;
          font-weight: 400;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          letter-spacing: 0.01em;
        }

        .reg-input::placeholder {
          color: var(--text-dim);
        }

        .reg-input:focus {
          border-color: var(--border-active);
          background: var(--surface3);
          box-shadow: 0 0 0 3px var(--blue-glow);
        }

        /* password toggle */
        .toggle-pw {
          position: absolute;
          right: 13px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer;
          color: var(--text-muted);
          display: flex; align-items: center;
          padding: 4px;
          transition: color 0.2s;
        }

        .toggle-pw:hover { color: var(--text); }

        /* ── CTA ── */
        .reg-btn {
          width: 100%;
          padding: 14px;
          background: var(--blue);
          background: linear-gradient(135deg, #5b8fff 0%, #3a6bff 100%);
          border: none;
          border-radius: 10px;
          color: white;
          font-family: 'Geist', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.03em;
          cursor: pointer;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(91,143,255,0.25);
        }

        .reg-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .reg-btn:hover:not(:disabled)::before { opacity: 1; }
        .reg-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(91,143,255,0.35); }
        .reg-btn:active:not(:disabled) { transform: translateY(0); }
        .reg-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        /* spinner */
        .btn-inner {
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }

        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── DIVIDER ── */
        .reg-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 20px 0;
        }

        .reg-divider-line {
          flex: 1; height: 1px; background: var(--border);
        }

        .reg-divider-text {
          font-size: 12px; color: var(--text-dim);
          letter-spacing: 0.04em;
        }

        /* ── BOTTOM TEXT ── */
        .reg-bottom {
          margin-top: 20px;
          font-size: 13px;
          color: var(--text-muted);
          text-align: center;
        }

        .reg-link {
          color: var(--blue);
          text-decoration: none;
          font-weight: 500;
          transition: opacity 0.15s;
        }

        .reg-link:hover { opacity: 0.8; }

        /* ── TERMS ── */
        .reg-terms {
          margin-top: 28px;
          font-size: 11px;
          color: var(--text-dim);
          text-align: center;
          line-height: 1.6;
        }

        .reg-terms a {
          color: var(--text-muted);
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        /* ── RIGHT PANEL ── */
        .reg-right {
          background: var(--bg);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px;
          position: relative;
          overflow: hidden;
          border-left: 1px solid var(--border);
        }

        /* Decorative grid */
        .reg-right::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
        }

        .right-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 320px;
        }

        /* Orb */
        .right-orb {
          width: 120px; height: 120px;
          margin: 0 auto 36px;
          position: relative;
        }

        .right-orb-inner {
          width: 100%; height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #5b8fff, #1a3a8f 60%, #07090f);
          box-shadow:
            0 0 40px rgba(91,143,255,0.3),
            inset 0 0 30px rgba(255,255,255,0.05);
          animation: pulse 4s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 40px rgba(91,143,255,0.3), inset 0 0 30px rgba(255,255,255,0.05); }
          50%       { box-shadow: 0 0 70px rgba(91,143,255,0.5), inset 0 0 30px rgba(255,255,255,0.08); }
        }

        .right-orb-ring {
          position: absolute;
          inset: -14px;
          border-radius: 50%;
          border: 1px solid rgba(91,143,255,0.18);
          animation: rotate 12s linear infinite;
        }

        .right-orb-dot {
          position: absolute;
          top: -4px; left: 50%;
          transform: translateX(-50%);
          width: 6px; height: 6px;
          background: var(--blue);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--blue);
        }

        @keyframes rotate { to { transform: rotate(360deg); } }

        .right-brand {
          font-family: 'Instrument Serif', serif;
          font-size: 32px;
          font-weight: 400;
          color: var(--white);
          letter-spacing: 0.06em;
          margin-bottom: 12px;
        }

        .right-tagline {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.7;
          font-weight: 300;
        }

        /* Feature chips */
        .right-chips {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 36px;
          width: 100%;
        }

        .right-chip {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 10px;
          text-align: left;
          transition: border-color 0.2s, background 0.2s;
        }

        .right-chip:hover {
          background: rgba(91,143,255,0.05);
          border-color: rgba(91,143,255,0.2);
        }

        .chip-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: var(--blue-soft);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: var(--blue);
        }

        .chip-text {
          flex: 1;
        }

        .chip-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 1px;
        }

        .chip-desc {
          font-size: 11px;
          color: var(--text-muted);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 780px) {
          .reg-root { grid-template-columns: 1fr; }
          .reg-right { display: none; }
          .reg-left { padding: 48px 32px; }
        }
      `}</style>

      <div className="reg-root">

        {/* ── LEFT PANEL ── */}
        <div className="reg-left">

          {/* Logo */}
          <div className="reg-logo">
            <div className="reg-logo-mark">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2L13 5V11L8 14L3 11V5L8 2Z" stroke="white" strokeWidth="1.2" fill="none"/>
                <circle cx="8" cy="8" r="2" fill="white"/>
              </svg>
            </div>
            <span className="reg-logo-name">FINOVA</span>
          </div>

          {/* Step indicator */}
          <div className="reg-steps">
            <div className="reg-step done"></div>
            <div className="reg-step active"></div>
            <div className="reg-step"></div>
          </div>

          <h1 className="reg-heading">Create your <em>account</em></h1>
          <p className="reg-sub">Join thousands of organizations managing finance smarter.</p>

          {/* Fields */}
          <div
            className={`field-group ${focused === "org" ? "is-focused" : ""}`}
          >
            <label className="field-label">Organization</label>
            <div className="field-wrap">
              <svg className="field-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="6" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 6V4a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="8" cy="10" r="1" fill="currentColor"/>
              </svg>
              <input
                className="reg-input"
                placeholder="Acme Corp"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                onKeyDown={handleKey}
                onFocus={() => setFocused("org")}
                onBlur={() => setFocused(null)}
              />
            </div>
          </div>

          <div
            className={`field-group ${focused === "email" ? "is-focused" : ""}`}
          >
            <label className="field-label">Email Address</label>
            <div className="field-wrap">
              <svg className="field-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M1.5 5.5l6.5 4 6.5-4" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              <input
                className="reg-input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKey}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
              />
            </div>
          </div>

          <div
            className={`field-group ${focused === "pw" ? "is-focused" : ""}`}
          >
            <label className="field-label">Password</label>
            <div className="field-wrap">
              <svg className="field-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="8" cy="10.5" r="1" fill="currentColor"/>
              </svg>
              <input
                className="reg-input"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKey}
                onFocus={() => setFocused("pw")}
                onBlur={() => setFocused(null)}
                style={{ paddingRight: "42px" }}
              />
              <button
                className="toggle-pw"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2"/>
                    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/>
                    <line x1="2" y1="14" x2="14" y2="2" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2"/>
                    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button className="reg-btn" onClick={register} disabled={loading}>
            <span className="btn-inner">
              {loading && <span className="spinner" />}
              {loading ? "Creating account…" : "Create Account →"}
            </span>
          </button>

          <p className="reg-bottom">
            Already have an account?{" "}
            <Link to="/" className="reg-link">Sign in</Link>
          </p>

          <p className="reg-terms">
            By registering, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="reg-right">
          <div className="right-content">

            <div className="right-orb">
              <div className="right-orb-inner" />
              <div className="right-orb-ring">
                <div className="right-orb-dot" />
              </div>
            </div>

            <div className="right-brand">FINOVA</div>
            <p className="right-tagline">
              Intelligent financial infrastructure<br />
              built for modern organizations.
            </p>

            <div className="right-chips">
              <div className="right-chip">
                <div className="chip-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="chip-text">
                  <div className="chip-title">Real-time Analytics</div>
                  <div className="chip-desc">Live insights across all accounts</div>
                </div>
              </div>

              <div className="right-chip">
                <div className="chip-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="4" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M4 4V3a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                </div>
                <div className="chip-text">
                  <div className="chip-title">Bank-grade Security</div>
                  <div className="chip-desc">256-bit encryption & MFA</div>
                </div>
              </div>

              <div className="right-chip">
                <div className="chip-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="chip-text">
                  <div className="chip-title">Instant Onboarding</div>
                  <div className="chip-desc">Set up in under 5 minutes</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}