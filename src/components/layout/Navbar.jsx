import { useNavigate } from "react-router-dom";

const navbarStyles = `
  .nv-root {
    --bg-dark: #0a0d14;
    --surface-hover: rgba(255, 255, 255, 0.04);
    --surface-active: #1f2a44;
    --border-line: #1f2a44;
    --text-bright: #ffffff;
    --text-dim: #aaaaaa;
    --accent-blue: #4f82ff;
    --accent-blue-hover: #3b6de6;
    
    height: 60px;
    background: #111520;
    color: var(--text-bright);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    border-bottom: 1px solid var(--border-line);
    box-sizing: border-box;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .nv-welcome {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-bright);
    letter-spacing: -0.01em;
  }

  .nv-btn-profile {
    background: var(--accent-blue);
    border: none;
    color: var(--text-bright);
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.1s ease;
  }

  .nv-btn-profile:hover {
    background: var(--accent-blue-hover);
  }

  .nv-btn-profile:active {
    transform: scale(0.98);
  }
`;

export default function Navbar() {
  const navigate = useNavigate(); // Using react-router-dom's hook prevents a hard page reload

  return (
    <div className="nv-root">
      <style>{navbarStyles}</style>
      
      <div className="nv-welcome">Welcome to FINOVA</div>

      <div>
        <button
          className="nv-btn-profile"
          onClick={() => navigate("/profile")}
        >
          Profile
        </button>
      </div>
    </div>
  );
}