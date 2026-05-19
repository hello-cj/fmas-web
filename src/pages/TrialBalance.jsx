import { useEffect, useState } from "react";
import api from "../api/api";
import Layout from "../components/layout/Layout";

const styles = `
  .tb-root {
    --bg: #0f172a;
    --surface: #1e293b;
    --surface-light: #293548;
    --border: #334155;
    --border-focus: #3b82f6;
    --text: #f8fafc;
    --text-muted: #94a3b8;
    --accent-green: #10b981;
    --accent-red: #ef4444;
    --accent-green-glow: rgba(16, 185, 129, 0.1);
    --accent-red-glow: rgba(239, 68, 68, 0.1);
    font-family: system-ui, -apple-system, sans-serif;
  }

  .tb-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
    color: var(--text);
  }

  .tb-header-section {
    margin-bottom: 24px;
  }

  .tb-title {
    font-size: 26px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 6px 0;
  }

  .tb-subtitle {
    color: var(--text-muted);
    font-size: 14px;
    margin: 0;
  }

  /* Summary Metrics Cards Grid */
  .tb-metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  @media (max-width: 768px) {
    .tb-metrics-grid { grid-template-columns: 1fr; }
  }

  .tb-metric-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .tb-metric-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 6px;
  }

  .tb-metric-val {
    font-size: 22px;
    font-weight: 700;
    font-family: monospace;
    color: #f1f5f9;
  }

  /* Main Document Sheet Card */
  .tb-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px;
  }

  .tb-table-wrapper {
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: #0f172a;
  }

  .tb-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;
  }

  .tb-table th {
    background: var(--surface);
    padding: 14px 18px;
    font-weight: 600;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.05em;
  }

  .tb-table td {
    padding: 14px 18px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }

  .tb-table tr:hover td {
    background: rgba(255, 255, 255, 0.01);
  }

  /* Table Summary Total Row Styling */
  .tb-total-row td {
    background: var(--surface-light);
    border-top: 2px solid var(--border);
    border-bottom: double 4px var(--border);
    font-weight: 700;
    color: #ffffff;
  }

  .tb-num {
    font-family: monospace;
    font-size: 14px;
    text-align: right;
  }

  /* Balance Verification Status Ribbon */
  .tb-status-banner {
    border-radius: 8px;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    font-size: 14px;
    border: 1px solid transparent;
  }

  .tb-status-banner.balanced {
    background: var(--accent-green-glow);
    color: var(--accent-green);
    border-color: rgba(16, 185, 129, 0.2);
  }

  .tb-status-banner.unbalanced {
    background: var(--accent-red-glow);
    color: var(--accent-red);
    border-color: rgba(239, 68, 68, 0.2);
  }

  /* Loading State Framework */
  .tb-loading-wrapper {
    padding: 60px;
    text-align: center;
    color: var(--text-muted);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
  }

  .tb-spinner {
    width: 28px;
    height: 28px;
    border: 3px solid rgba(255,255,255,0.1);
    border-radius: 50%;
    border-top-color: var(--border-focus);
    animation: tb-spin 0.8s linear infinite;
    margin: 0 auto 12px auto;
  }

  @keyframes tb-spin {
    to { transform: rotate(360deg); }
  }
`;

export default function TrialBalance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrialBalance();
  }, []);

  const fetchTrialBalance = async () => {
    try {
      const res = await api.get("/trial-balance");
      setData(res.data || []);
    } catch (err) {
      console.error("Failed to fetch trial balance", err);
    } finally {
      setLoading(false);
    }
  };

  const totalDebit = data.reduce((sum, item) => sum + (Number(item.totalDebit) || 0), 0);
  const totalCredit = data.reduce((sum, item) => sum + (Number(item.totalCredit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.001;
  const variance = Math.abs(totalDebit - totalCredit);

  const formatCurrency = (val) => {
    const num = Number(val);
    if (isNaN(num) || num === 0) return "—";
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatBalance = (val) => {
    const num = Number(val);
    if (isNaN(num) || num === 0) return "$0.00";
    const prefix = num < 0 ? "-" : "";
    return `${prefix}$${Math.abs(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Layout>
      <style>{styles}</style>
      <div className="tb-root">
        <div className="tb-container">
          
          {/* HEADER SECTION TITLE */}
          <div className="tb-header-section">
            <h1 className="tb-title">Trial Balance</h1>
            <p className="tb-subtitle">Real-time compilation of unadjusted ledger balances for technical auditing</p>
          </div>

          {loading ? (
            /* ASYNC SKELETON PRELOADER SPIN */
            <div className="tb-loading-wrapper">
              <div className="tb-spinner"></div>
              <span>Processing trial balance aggregation calculations...</span>
            </div>
          ) : (
            <>
              {/* TOP LEVEL METRIC CARDS OVERVIEW */}
              <div className="tb-metrics-grid">
                <div className="tb-metric-card" style={{ borderLeft: "4px solid #3b82f6" }}>
                  <div className="tb-metric-label">Aggregate Debits Summary</div>
                  <div className="tb-metric-val" style={{ color: "#34d399" }}>
                    ${totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="tb-metric-card" style={{ borderLeft: "4px solid #6366f1" }}>
                  <div className="tb-metric-label">Aggregate Credits Summary</div>
                  <div className="tb-metric-val" style={{ color: "#f87171" }}>
                    ${totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="tb-metric-card" style={{ borderLeft: isBalanced ? "4px solid #10b981" : "4px solid #ef4444" }}>
                  <div className="tb-metric-label">Unreconciled Sheet Variance</div>
                  <div className="tb-metric-val" style={{ color: isBalanced ? "var(--accent-green)" : "var(--accent-red)" }}>
                    ${variance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* MAIN DATA SHEET CONTENT */}
              <div className="tb-card">
                <div className="tb-table-wrapper">
                  <table className="tb-table">
                    <thead>
                      <tr>
                        <th style={{ width: "40%" }}>Ledger Account Account Name</th>
                        <th style={{ width: "20%", textAlign: "right" }}>Total Debit</th>
                        <th style={{ width: "20%", textAlign: "right" }}>Total Credit</th>
                        <th style={{ width: "20%", textAlign: "right" }}>Net Statement Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: "center", color: "var(--text-muted)", padding: "30px" }}>
                            No active general account lines compiled into system records.
                          </td>
                        </tr>
                      ) : (
                        data.map((item, index) => (
                          <tr key={index}>
                            <td style={{ fontWeight: "500", color: "#f1f5f9" }}>{item.accountName}</td>
                            <td className="tb-num" style={{ color: item.totalDebit ? "var(--text)" : "var(--text-muted)" }}>
                              {formatCurrency(item.totalDebit)}
                            </td>
                            <td className="tb-num" style={{ color: item.totalCredit ? "var(--text)" : "var(--text-muted)" }}>
                              {formatCurrency(item.totalCredit)}
                            </td>
                            <td className="tb-num" style={{ fontWeight: "600", color: "#e2e8f0" }}>
                              {formatBalance(item.balance)}
                            </td>
                          </tr>
                        ))
                      )}

                      {/* SUMMARY COMPILATION ROW */}
                      <tr className="tb-total-row">
                        <td style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "12px" }}>
                          Total Financial Aggregate
                        </td>
                        <td className="tb-num">${totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="tb-num">${totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="tb-num" style={{ color: isBalanced ? "var(--accent-green)" : "var(--accent-red)" }}>
                          {isBalanced ? "$0.00" : formatBalance(totalDebit - totalCredit)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* DYNAMIC VERIFICATION SUB-BANNER STATUS BLOCK */}
              <div className={`tb-status-banner ${isBalanced ? "balanced" : "unbalanced"}`}>
                <span style={{ fontSize: "16px" }}>{isBalanced ? "✓" : "⚠"}</span>
                <span>
                  {isBalanced 
                    ? "Reconciliation complete: Total debits completely align with total credits in double-entry guidelines."
                    : `System out of balance mismatch! Statement validation holds an active discrepancy variance of $${variance.toFixed(2)}.`}
                </span>
              </div>
            </>
          )}

        </div>
      </div>
    </Layout>
  );
}