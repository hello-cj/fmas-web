import { useEffect, useState } from "react";
import api from "../api/api";
import Layout from "../components/layout/Layout";

const styles = `
  .coa-root {
    --bg: #0f172a;
    --surface: #1e293b;
    --surface-light: #293548;
    --border: #334155;
    --border-focus: #3b82f6;
    --text: #f8fafc;
    --text-muted: #94a3b8;
    --blue: #3b82f6;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .coa-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 24px;
    color: var(--text);
  }

  .coa-header-section {
    margin-bottom: 24px;
  }

  .coa-title {
    font-size: 26px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 6px 0;
  }

  .coa-subtitle {
    color: var(--text-muted);
    font-size: 14px;
    margin: 0;
  }

  /* Form & Content Containers */
  .coa-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .coa-card-title {
    font-size: 15px;
    font-weight: 600;
    color: #f1f5f9;
    margin: 0 0 16px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .coa-form-grid {
    display: grid;
    grid-template-columns: 1fr 2fr 1.5fr auto;
    gap: 14px;
    align-items: flex-end;
  }

  @media (max-width: 768px) {
    .coa-form-grid { grid-template-columns: 1fr; }
    .coa-form-grid button { width: 100%; margin-top: 4px; }
  }

  .coa-input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .coa-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .coa-input, .coa-select {
    background: #0f172a;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    color: var(--text);
    font-size: 14px;
    font-family: inherit;
    transition: all 0.2s;
    outline: none;
    height: 42px;
    box-sizing: border-box;
  }

  .coa-input:focus, .coa-select:focus {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 1px var(--border-focus);
  }

  /* Ledger Table System */
  .coa-table-wrapper {
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: #0f172a;
  }

  .coa-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;
  }

  .coa-table th {
    background: var(--surface);
    padding: 14px 18px;
    font-weight: 600;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.05em;
  }

  .coa-table td {
    padding: 14px 18px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }

  .coa-table tr:last-child td {
    border-bottom: none;
  }

  .coa-table tr:hover td {
    background: rgba(255, 255, 255, 0.01);
  }

  .coa-code-text {
    font-family: monospace;
    font-weight: 600;
    color: #3b82f6;
  }

  /* Status and Type Tags */
  .coa-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    text-transform: capitalize;
  }

  .coa-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 6px;
  }

  /* Buttons */
  .coa-btn-primary {
    background: #3b82f6;
    color: #ffffff;
    padding: 10px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .coa-btn-primary:hover:not(:disabled) {
    background: #2563eb;
  }

  .coa-btn-primary:disabled {
    background: #1e293b;
    color: #64748b;
    cursor: not-allowed;
    border-color: #334155;
  }
`;

// Helper utility to get account type pill colors
const getTypeBadgeStyle = (type) => {
  const normType = type?.toLowerCase() || "";
  if (normType.includes("asset")) return { bg: "rgba(16, 185, 129, 0.1)", text: "#10b981" };
  if (normType.includes("liability")) return { bg: "rgba(245, 158, 11, 0.1)", text: "#f59e0b" };
  if (normType.includes("equity")) return { bg: "rgba(99, 102, 241, 0.1)", text: "#6366f1" };
  if (normType.includes("revenue")) return { bg: "rgba(59, 130, 246, 0.1)", text: "#3b82f6" };
  return { bg: "rgba(239, 68, 68, 0.1)", text: "#ef4444" }; // Expense
};

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState("Asset");
  const [loading, setLoading] = useState(false);

  const fetchAccounts = async () => {
    try {
      const res = await api.get("/accounts");
      setAccounts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const createAccount = async () => {
    if (!code || !name) {
      alert("Please populate the account code and structural description fields.");
      return;
    }
    setLoading(true);

    try {
      await api.post("/accounts", {
        code,
        name,
        accountType,
      });

      setCode("");
      setName("");
      setAccountType("Asset");
      await fetchAccounts();
      alert("Account created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create account configuration record.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <style>{styles}</style>
      <div className="coa-root">
        <div className="coa-container">
          
          {/* HEADER SECTION METADATA */}
          <div className="coa-header-section">
            <h1 className="coa-title">Chart of Accounts</h1>
            <p className="coa-subtitle">Maintain, structure, and categorize corporate general ledger parameters</p>
          </div>

          {/* ASYNC INTERACTION REGISTRATION FORM */}
          <div className="coa-card">
            <h2 className="coa-card-title">✨ Establish New Ledger Account</h2>
            <div className="coa-form-grid">
              <div className="coa-input-group">
                <label className="coa-label">Account Code</label>
                <input
                  placeholder="e.g. 1010"
                  className="coa-input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>

              <div className="coa-input-group">
                <label className="coa-label">Account Identification Name</label>
                <input
                  placeholder="e.g. Corporate Operating Cash"
                  className="coa-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="coa-input-group">
                <label className="coa-label">Accounting Tier Group</label>
                <select
                  className="coa-select"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                >
                  <option value="Asset">Asset</option>
                  <option value="Liability">Liability</option>
                  <option value="Equity">Equity</option>
                  <option value="Revenue">Revenue</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>

              <button 
                className="coa-btn-primary" 
                onClick={createAccount}
                disabled={loading || !code || !name}
              >
                {loading ? "Creating..." : "＋ Add Account"}
              </button>
            </div>
          </div>

          {/* MAIN DATATABLE CONTAINER */}
          <div className="coa-card" style={{ padding: "16px" }}>
            <h2 className="coa-card-title" style={{ marginBottom: "14px" }}>📋 Active Registry Ledger ({accounts.length})</h2>
            <div className="coa-table-wrapper">
              <table className="coa-table">
                <thead>
                  <tr>
                    <th style={{ width: "20%" }}>Index Code</th>
                    <th style={{ width: "45%" }}>Account Name</th>
                    <th style={{ width: "20%" }}>Category Classification</th>
                    <th style={{ width: "15%" }}>Operational Status</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center", color: "var(--text-muted)", padding: "30px" }}>
                        No records parsed in Chart of Accounts ledger database.
                      </td>
                    </tr>
                  ) : (
                    accounts.map((a) => {
                      const typeStyles = getTypeBadgeStyle(a.accountType);
                      const active = a.isActive !== false; // Fallback handles undefined/null records as true safely
                      return (
                        <tr key={a.accountId || a.code}>
                          <td className="coa-code-text">{a.code}</td>
                          <td style={{ fontWeight: "500", color: "#f1f5f9" }}>{a.name}</td>
                          <td>
                            <span 
                              className="coa-badge" 
                              style={{ backgroundColor: typeStyles.bg, color: typeStyles.text }}
                            >
                              {a.accountType}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", fontSize: "13px", color: active ? "#e2e8f0" : "var(--text-muted)" }}>
                              <span 
                                className="coa-status-dot" 
                                style={{ backgroundColor: active ? "#10b981" : "#64748b" }}
                              />
                              {active ? "Active" : "Inactive"}
                            </div>
                          </td>
                        </tr>
                      );
                    })
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