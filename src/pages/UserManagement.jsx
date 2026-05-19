import { useEffect, useState } from "react";
import api from "../api/api";
import Layout from "../components/layout/Layout";

const styles = `
  .usr-root {
    --bg: #0f172a;
    --surface: #1e293b;
    --surface-light: #293548;
    --border: #334155;
    --text: #f8fafc;
    --text-muted: #94a3b8;
    --accent-blue: #3b82f6;
    --emerald: #10b981;
    --rose: #f43f5e;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .usr-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
    color: var(--text);
  }

  .usr-header {
    margin-bottom: 28px;
  }

  .usr-title {
    font-size: 26px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 6px 0;
  }

  .usr-subtitle {
    color: var(--text-muted);
    font-size: 14px;
    margin: 0;
  }

  /* Structural Profile Composition Card */
  .usr-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px;
  }

  .usr-card h3 {
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 16px 0;
    color: #f1f5f9;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  /* Inline Creation Row Controls */
  .usr-creation-bar {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    align-items: center;
  }

  .usr-input, .usr-select {
    background: #0f172a;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px 14px;
    color: var(--text);
    font-size: 14px;
    outline: none;
    min-width: 240px;
    box-sizing: border-box;
  }

  .usr-select {
    min-width: 160px;
    cursor: pointer;
  }

  .usr-input:focus, .usr-select:focus {
    border-color: var(--accent-blue);
  }

  .usr-btn-submit {
    background: var(--accent-blue);
    color: #ffffff;
    font-weight: 600;
    font-size: 14px;
    padding: 10px 20px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: background 0.15s;
  }

  .usr-btn-submit:hover:not(:disabled) {
    background: #2563eb;
  }

  .usr-btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* User Directory Table Structure */
  .usr-table-wrapper {
    overflow-x: auto;
  }

  .usr-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;
  }

  .usr-table th {
    background: rgba(255, 255, 255, 0.02);
    padding: 14px 18px;
    font-weight: 600;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.05em;
  }

  .usr-table td {
    padding: 14px 18px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }

  .usr-table tbody tr:last-child td {
    border-bottom: none;
  }

  .usr-table tr:hover td {
    background: rgba(255, 255, 255, 0.01);
  }

  .usr-email-cell {
    font-weight: 500;
    color: #ffffff;
    font-family: monospace;
  }

  /* Identity Role and State Labels */
  .usr-role-badge {
    font-size: 12px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 4px;
    background: var(--surface-light);
    border: 1px solid var(--border);
    color: #e2e8f0;
    display: inline-block;
  }

  .usr-status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
  }

  .usr-status-pill::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .usr-status-pill.active { color: var(--emerald); }
  .usr-status-pill.active::before { background: var(--emerald); }

  .usr-status-pill.inactive { color: var(--text-muted); }
  .usr-status-pill.inactive::before { background: var(--border); }

  /* Destructive Triggers */
  .usr-btn-delete {
    background: rgba(244, 63, 94, 0.08);
    color: var(--rose);
    border: 1px solid rgba(244, 63, 94, 0.2);
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .usr-btn-delete:hover {
    background: var(--rose);
    color: #ffffff;
    border-color: var(--rose);
  }

  .usr-loading-indicator {
    padding: 40px;
    text-align: center;
    color: var(--text-muted);
  }
`;

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Clerk");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchUsers = async () => {
    try {
      setFetching(true);
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch ledger user registry map", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      await api.post("/users", { email, password, role });
      setEmail("");
      setPassword("");
      setRole("Clerk");
      fetchUsers();
    } catch (err) {
      console.error("User creation transaction aborted:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    const confirmed = window.confirm(
      "Revoke this user's corporate identity record? Revoking access completely terminates active session tokens instantly."
    );
    if (!confirmed) return;

    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Failed to process authority record purge", err);
    }
  };

  return (
    <Layout>
      <style>{styles}</style>
      <div className="usr-root">
        <div className="usr-container">
          
          {/* CONTROL SECTION TITLE HEADER */}
          <div className="usr-header">
            <h1 className="usr-title">Identity & Access Management</h1>
            <p className="usr-subtitle">Provision operational node operators, authorize role matrix scope, and track access tokens</p>
          </div>

          {/* CREATION CONSOLE FRAMEWORK BLOCK */}
          <div className="usr-card">
            <h3>Provision New Credentials</h3>
            <div className="usr-creation-bar">
              <input
                className="usr-input"
                placeholder="Identity Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                className="usr-input"
                placeholder="Secure Access Token/Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <select
                className="usr-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Accountant">Accountant</option>
                <option value="Clerk">Clerk</option>
              </select>

              <button
                className="usr-btn-submit"
                onClick={createUser}
                disabled={loading || !email || !password}
              >
                {loading ? "Processing Traces..." : "Provision Operator"}
              </button>
            </div>
          </div>

          {/* MAIN ACCESS CONTROL MATRIX CARD */}
          <div className="usr-card" style={{ padding: 0 }}>
            <div className="usr-table-wrapper">
              <table className="usr-table">
                <thead>
                  <tr>
                    <th style={{ width: "40%" }}>User Account Anchor</th>
                    <th style={{ width: "25%" }}>Assigned System Role</th>
                    <th style={{ width: "20%" }}>Operational Status</th>
                    <th style={{ width: "15%", textAlign: "center" }}>Revocation</th>
                  </tr>
                </thead>

                <tbody>
                  {fetching ? (
                    <tr>
                      <td colSpan="4">
                        <div className="usr-loading-indicator">
                          <span>Querying ecosystem authorization charts...</span>
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center", color: "var(--text-muted)", padding: "30px" }}>
                        No identity mappings found in this deployment workspace.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.userId}>
                        <td className="usr-email-cell">
                          {u.email}
                        </td>
                        
                        <td>
                          <span className="usr-role-badge">
                            {u.role ?? "No Explicit Scope Assigned"}
                          </span>
                        </td>
                        
                        <td>
                          <span className={`usr-status-pill ${u.isActive !== false ? "active" : "inactive"}`}>
                            {u.isActive !== false ? "Active Session Eligible" : "Suspended"}
                          </span>
                        </td>
                        
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="usr-btn-delete"
                            onClick={() => deleteUser(u.userId)}
                          >
                            Revoke Access
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}