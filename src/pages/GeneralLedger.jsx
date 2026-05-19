import { useEffect, useState } from "react";
import api from "../api/api";
import Layout from "../components/layout/Layout";

const styles = `
  .gl-root {
    --bg: #0f172a;
    --surface: #1e293b;
    --surface-light: #293548;
    --border: #334155;
    --border-focus: #3b82f6;
    --text: #f8fafc;
    --text-muted: #94a3b8;
    --accent-blue: #3b82f6;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .gl-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
    color: var(--text);
  }

  .gl-header-section {
    margin-bottom: 24px;
  }

  .gl-title {
    font-size: 26px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 6px 0;
  }

  .gl-subtitle {
    color: var(--text-muted);
    font-size: 14px;
    margin: 0;
  }

  /* Filters Action Card */
  .gl-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .gl-card-title {
    font-size: 14px;
    font-weight: 600;
    color: #f1f5f9;
    margin: 0 0 16px 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .gl-filter-grid {
    display: grid;
    grid-template-columns: 2fr 1.25fr 1.25fr auto;
    gap: 14px;
    align-items: flex-end;
  }

  @media (max-width: 868px) {
    .gl-filter-grid { grid-template-columns: 1fr; }
    .gl-filter-grid button { width: 100%; margin-top: 4px; }
  }

  .gl-input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .gl-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .gl-input, .gl-select {
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

  .gl-input:focus, .gl-select:focus {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 1px var(--border-focus);
  }

  /* Financial Statement Ledger Table */
  .gl-table-wrapper {
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: #0f172a;
  }

  .gl-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;
  }

  .gl-table th {
    background: var(--surface);
    padding: 14px 18px;
    font-weight: 600;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.05em;
  }

  .gl-table td {
    padding: 14px 18px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }

  .gl-table tr:last-child td {
    border-bottom: none;
  }

  .gl-table tr:hover td {
    background: rgba(255, 255, 255, 0.01);
  }

  /* Financial Column Typography Formatting */
  .gl-mono-num {
    font-family: monospace;
    font-size: 14px;
    text-align: right;
  }

  .gl-mono-num.balance-bold {
    font-weight: 600;
    color: #f1f5f9;
  }

  .gl-date-col {
    color: var(--text-muted);
    font-family: monospace;
    font-size: 13px;
  }

  .gl-ref-badge {
    background: var(--surface);
    color: var(--accent-blue);
    padding: 3px 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
    border: 1px solid var(--border);
    font-weight: 500;
  }

  /* Interactive Elements */
  .gl-btn-primary {
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

  .gl-btn-primary:hover:not(:disabled) {
    background: #2563eb;
  }

  .gl-btn-primary:disabled {
    background: #1e293b;
    color: #64748b;
    cursor: not-allowed;
    border-color: #334155;
  }

  .gl-empty-state {
    padding: 48px;
    text-align: center;
    color: var(--text-muted);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
`;

export default function GeneralLedger() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [ledger, setLedger] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await api.get("/accounts");
      setAccounts(res.data || []);
    } catch (err) {
      console.error("Error loading accounts", err);
    }
  };

  const fetchLedger = async (accountId) => {
    if (!accountId) return;

    try {
      const params = {};
      if (fromDate) params.from = new Date(fromDate).toISOString();
      if (toDate) params.to = new Date(toDate).toISOString();

      const res = await api.get(`/ledger/${accountId}`, { params });
      setLedger(res.data || []);
    } catch (err) {
      console.error("Error loading ledger", err);
    }
  };

  const handleAccountChange = (e) => {
    const value = e.target.value;
    setSelectedAccount(value);
    if (value) {
      fetchLedger(value);
    } else {
      setLedger([]);
    }
  };

  const formatCurrency = (val) => {
    const num = Number(val);
    if (isNaN(num) || num === 0) return "—";
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatBalance = (val) => {
    const num = Number(val);
    if (isNaN(num)) return "$0.00";
    const pref = num < 0 ? "-" : "";
    return `${pref}$${Math.abs(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) 
      ? "—" 
      : d.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
    <Layout>
      <style>{styles}</style>
      <div className="gl-root">
        <div className="gl-container">
          
          {/* HEADER METADATA */}
          <div className="gl-header-section">
            <h1 className="gl-title">General Ledger</h1>
            <p className="gl-subtitle">Audit, inspect, and trace execution sequences across system accounts</p>
          </div>

          {/* PARAMETER CONFIGURATION GRID */}
          <div className="gl-card">
            <h2 className="gl-card-title">🔍 Statement Query Controls</h2>
            <div className="gl-filter-grid">
              <div className="gl-input-group">
                <label className="gl-label">Selected Account Target</label>
                <select 
                  className="gl-select"
                  value={selectedAccount} 
                  onChange={handleAccountChange}
                >
                  <option value="">Select corporate account filter...</option>
                  {accounts.map((acc) => {
                    // Safe fallback variant processing for id/accountId key mismatches
                    const idKey = acc.id || acc.accountId;
                    return (
                      <option key={idKey} value={idKey}>
                        [{acc.code}] {acc.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="gl-input-group">
                <label className="gl-label">From Date (Inclusive)</label>
                <input
                  type="date"
                  className="gl-input"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="gl-input-group">
                <label className="gl-label">To Date (Inclusive)</label>
                <input
                  type="date"
                  className="gl-input"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              <button 
                className="gl-btn-primary"
                onClick={() => fetchLedger(selectedAccount)}
                disabled={!selectedAccount}
              >
                ⚡ Apply Filter
              </button>
            </div>
          </div>

          {/* LEDGER RECONCILIATION STATEMENT */}
          <div className="gl-card" style={{ padding: "16px" }}>
            <h2 className="gl-card-title" style={{ marginBottom: "14px" }}>📊 Historical Allocation Statement Matrix</h2>
            
            {!selectedAccount ? (
              <div className="gl-empty-state">
                <span style={{ fontSize: "28px" }}>📭</span>
                <span style={{ fontWeight: "600", color: "#f1f5f9" }}>No Target Ledger Selected</span>
                <span>Choose a chart account from the criteria matrix above to run dynamic general statement calculations.</span>
              </div>
            ) : (
              <div className="gl-table-wrapper">
                <table className="gl-table">
                  <thead>
                    <tr>
                      <th style={{ width: "12%" }}>Posting Date</th>
                      <th style={{ width: "15%" }}>Reference Doc</th>
                      <th style={{ width: "37%" }}>Description Context / Memo</th>
                      <th style={{ width: "12%", textAlign: "right" }}>Debit</th>
                      <th style={{ width: "12%", textAlign: "right" }}>Credit</th>
                      <th style={{ width: "12%", textAlign: "right" }}>Running Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px 20px" }}>
                          No line allocations recorded for this parameters scope.
                        </td>
                      </tr>
                    ) : (
                      ledger.map((l, i) => (
                        <tr key={i}>
                          <td className="gl-date-col">
                            {formatDate(l.date)}
                          </td>
                          <td>
                            <span className="gl-ref-badge">{l.reference || "N/A"}</span>
                          </td>
                          <td style={{ color: "#e2e8f0", fontWeight: "400" }}>
                            {l.description || <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No Memo</span>}
                          </td>
                          <td className="gl-mono-num" style={{ color: l.debit ? "#34d399" : "var(--text-muted)" }}>
                            {formatCurrency(l.debit)}
                          </td>
                          <td className="gl-mono-num" style={{ color: l.credit ? "#f87171" : "var(--text-muted)" }}>
                            {formatCurrency(l.credit)}
                          </td>
                          <td className="gl-mono-num gl-mono-bold balance-bold">
                            {formatBalance(l.balance)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}