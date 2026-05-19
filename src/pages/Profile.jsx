import { useEffect, useState } from "react";
import api from "../api/api";
import Layout from "../components/layout/Layout";
import { useNavigate } from "react-router-dom";

const styles = `
  .profile-root {
    --bg: #0f172a;
    --surface: #1e293b;
    --surface-2: #334155;
    --border: #334155;
    --text: #f8fafc;
    --text-muted: #94a3b8;
    --accent: #34d399;
    --accent-red: #ef4444;
    --accent-glow: rgba(52, 211, 153, 0.1);
    /* MATCHED FONT STACK TO DASHBOARD */
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .profile-page {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    padding: 40px 24px;
    display: flex;
    justify-content: center;
  }

  .profile-container {
    width: 100%;
    max-width: 560px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Header */
  .profile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }
  .profile-header-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .profile-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--accent);
    font-family: monospace;
  }
  .profile-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.9); }
  }

  /* Avatar card */
  .profile-avatar-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    animation: slideUp 0.4s ease both;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .profile-avatar {
    width: 64px;
    height: 64px;
    border-radius: 10px;
    background: linear-gradient(135deg, #3b82f6 0%, #34d399 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 700;
    color: #0f172a;
    flex-shrink: 0;
  }
  .profile-avatar-info {
    flex: 1;
    min-width: 0;
  }
  .profile-name {
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .profile-email {
    font-size: 13px;
    color: var(--text-muted);
    margin-top: 2px;
    font-family: monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .profile-role-badge {
    display: inline-flex;
    align-items: center;
    margin-top: 10px;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    background: var(--accent-glow);
    color: var(--accent);
    border: 1px solid rgba(52, 211, 153, 0.2);
  }

  /* Info cards */
  .profile-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    animation: slideUp 0.4s ease both;
  }
  .profile-card:nth-child(3) { animation-delay: 0.05s; }
  .profile-card:nth-child(4) { animation-delay: 0.1s; }

  .profile-card-title {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.03em;
    color: var(--text);
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.01);
  }

  .profile-field {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
  }
  .profile-field:last-child { border-bottom: none; }
  .profile-field:hover { background: rgba(255, 255, 255, 0.02); }

  .profile-field-label {
    font-size: 13px;
    color: var(--text-muted);
    font-weight: 500;
  }
  .profile-field-value {
    font-size: 13px;
    color: var(--text);
    font-family: monospace;
    text-align: right;
    max-width: 65%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .profile-field-value.muted {
    color: var(--text-muted);
    font-style: italic;
    font-family: system-ui, sans-serif;
  }

  /* Actions */
  .profile-actions {
    margin-top: 4px;
    animation: slideUp 0.4s ease 0.15s both;
  }
  .profile-btn-danger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    font-family: system-ui, sans-serif;
    cursor: pointer;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
    transition: all 0.2s ease;
  }
  .profile-btn-danger:hover {
    border-color: rgba(239, 68, 68, 0.4);
    color: var(--accent-red);
    background: rgba(239, 68, 68, 0.08);
  }

  /* Loading */
  .profile-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 240px;
    gap: 16px;
    color: var(--text-muted);
    font-size: 14px;
  }
  .profile-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--border);
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function getInitials(email) {
  if (!email) return "?";
  return email.slice(0, 2).toUpperCase();
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    navigate("/");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <Layout>
      <style>{styles}</style>
      <div className="profile-root">
        <div className="profile-page">
          <div className="profile-container">

            {/* Header */}
            <div className="profile-header">
              <span className="profile-header-label">Account Profile</span>
              {user && (
                <span className="profile-status">
                  <span className="profile-status-dot" />
                  Active Session
                </span>
              )}
            </div>

            {!user ? (
              <div className="profile-loading">
                <div className="profile-spinner" />
                <span>Loading profile details...</span>
              </div>
            ) : (
              <>
                {/* Avatar card */}
                <div className="profile-avatar-card">
                  <div className="profile-avatar">{getInitials(user.email)}</div>
                  <div className="profile-avatar-info">
                    <div className="profile-name">{user.email ? user.email.split("@")[0] : "User"}</div>
                    <div className="profile-email">{user.email}</div>
                    <span className="profile-role-badge">{user.role}</span>
                  </div>
                </div>

                {/* User info */}
                <div className="profile-card">
                  <div className="profile-card-title">User Information</div>
                  <div className="profile-field">
                    <span className="profile-field-label">Email Address</span>
                    <span className="profile-field-value">{user.email}</span>
                  </div>
                  <div className="profile-field">
                    <span className="profile-field-label">Assigned Role</span>
                    <span className="profile-field-value" style={{ textTransform: "capitalize" }}>{user.role}</span>
                  </div>
                  <div className="profile-field">
                    <span className="profile-field-label">User ID</span>
                    <span className="profile-field-value">{user.userId}</span>
                  </div>
                </div>

                {/* Organization */}
                <div className="profile-card">
                  <div className="profile-card-title">Organization Details</div>
                  <div className="profile-field">
                    <span className="profile-field-label">Company Name</span>
                    <span className={`profile-field-value${!user.organizationName ? " muted" : ""}`}>
                      {user.organizationName || "Not assigned"}
                    </span>
                  </div>
                  <div className="profile-field">
                    <span className="profile-field-label">Organization ID</span>
                    <span className={`profile-field-value${!user.organizationId ? " muted" : ""}`}>
                      {user.organizationId || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="profile-actions">
                  <button
                    className="profile-btn-danger"
                    onClick={logout}
                  >
                     Sign Out from Dashboard
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}