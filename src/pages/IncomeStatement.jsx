import { useEffect, useState } from "react";
import api from "../api/api";
import Layout from "../components/layout/Layout";

const styles = `
  .is-root {
    --bg: #0f172a;
    --surface: #1e293b;
    --surface-light: #293548;
    --border: #334155;
    --text: #f8fafc;
    --text-muted: #94a3b8;
    --emerald: #10b981;
    --rose: #f43f5e;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .is-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 24px;
    color: var(--text);
  }

  .is-header-section {
    margin-bottom: 24px;
  }

  .is-title {
    font-size: 26px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 6px 0;
  }

  .is-subtitle {
    color: var(--text-muted);
    font-size: 14px;
    margin: 0;
  }

  /* Structural Content Cards */
  .is-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .is-card-title {
    font-size: 16px;
    font-weight: 600;
    color: #f1f5f9;
    margin: 0 0 14px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .is-table-wrapper {
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: #0f172a;
  }

  .is-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;
  }

  .is-table th {
    background: rgba(255, 255, 255, 0.02);
    padding: 12px 18px;
    font-weight: 600;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.05em;
  }

  .is-table td {
    padding: 12px 18px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }

  .is-table tr:hover td {
    background: rgba(255, 255, 255, 0.01);
  }

  /* Ledger Total Summary Rows */
  .is-total-row td {
    background: var(--surface-light);
    font-weight: 700;
    color: #ffffff;
    border-top: 1px solid var(--border);
    border-bottom: double 4px var(--border);
  }

  .is-num {
    font-family: monospace;
    font-size: 14px;
    text-align: right;
  }

  /* Bottom Line Net Profit/Loss Display Banner */
  .is-net-banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-radius: 12px;
    border: 1px solid transparent;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  }

  .is-net-banner.profit {
    background: rgba(16, 185, 129, 0.08);
    border-color: rgba(16, 185, 129, 0.25);
  }

  .is-net-banner.loss {
    background: rgba(244, 63, 94, 0.08);
    border-color: rgba(244, 63, 94, 0.25);
  }

  .is-net-label-block h3 {
    margin: 0 0 4px 0;
    font-size: 18px;
    font-weight: 700;
  }

  .is-net-label-block p {
    margin: 0;
    font-size: 13px;
    color: var(--text-muted);
  }

  .is-net-amount {
    font-family: monospace;
    font-size: 32px;
    font-weight: 800;
  }

  /* Async Loader Components */
  .is-loading-wrapper {
    padding: 60px;
    text-align: center;
    color: var(--text-muted);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
  }

  .is-spinner {
    width: 28px;
    height: 28px;
    border: 3px solid rgba(255,255,255,0.1);
    border-radius: 50%;
    border-top-color: #3b82f6;
    animation: is-spin 0.8s linear infinite;
    margin: 0 auto 12px auto;
  }

  @keyframes is-spin {
    to { transform: rotate(360deg); }
  }
`;

export default function IncomeStatement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncomeStatement();
  }, []);

  const fetchIncomeStatement = async () => {
    try {
      const res = await api.get("/financial-statements/income-statement");
      setData(res.data || []);
    } catch (err) {
      console.error("Failed to fetch income statement", err);
    } finally {
      setLoading(false);
    }
  };

  const revenues = data.filter((x) => x.type === "Revenue");
  const expenses = data.filter((x) => x.type === "Expense");

  const totalRevenue = revenues.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalExpense = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const netIncome = totalRevenue - totalExpense;

  const formatCurrency = (val) => {
    const num = Number(val);
    if (isNaN(num)) return "$0.00";
    const prefix = num < 0 ? "-" : "";
    return `${prefix}$${Math.abs(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Layout>
      <style>{styles}</style>
      <div className="is-root">
        <div className="is-container">
          
          {/* HEADER SECTION METADATA */}
          <div className="is-header-section">
            <h1 className="is-title">Income Statement</h1>
            <p className="is-subtitle">Profit and loss statement metrics mapping top-line revenue against operational expenses</p>
          </div>

          {loading ? (
            /* LOADING BLOCK PLACEHOLDER */
            <div className="is-loading-wrapper">
              <div className="is-spinner"></div>
              <span>Compiling general ledger balances...</span>
            </div>
          ) : (
            <>
              {/* REVENUE GENERATION METRICS CARD */}
              <div className="is-card">
                <h2 className="is-card-title"> Operating Revenue</h2>
                <div className="is-table-wrapper">
                  <table className="is-table">
                    <thead>
                      <tr>
                        <th>Account Classification</th>
                        <th style={{ textAlign: "right" }}>Balance Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenues.length === 0 ? (
                        <tr>
                          <td colSpan="2" style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>
                            No active revenue streams parsed.
                          </td>
                        </tr>
                      ) : (
                        revenues.map((item, index) => (
                          <tr key={index}>
                            <td style={{ fontWeight: "500" }}>{item.accountName}</td>
                            <td className="is-num" style={{ color: "#34d399" }}>{formatCurrency(item.amount)}</td>
                          </tr>
                        ))
                      )}
                      <tr className="is-total-row">
                        <td>Gross Revenue Aggregate</td>
                        <td className="is-num">{formatCurrency(totalRevenue)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* OPERATING EXPENSES CARD */}
              <div className="is-card">
                <h2 className="is-card-title"> Operating Expenses</h2>
                <div className="is-table-wrapper">
                  <table className="is-table">
                    <thead>
                      <tr>
                        <th>Account Classification</th>
                        <th style={{ textAlign: "right" }}>Balance Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.length === 0 ? (
                        <tr>
                          <td colSpan="2" style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>
                            No operational expense items parsed.
                          </td>
                        </tr>
                      ) : (
                        expenses.map((item, index) => (
                          <tr key={index}>
                            <td style={{ fontWeight: "500" }}>{item.accountName}</td>
                            <td className="is-num" style={{ color: "#f87171" }}>{formatCurrency(item.amount)}</td>
                          </tr>
                        ))
                      )}
                      <tr className="is-total-row">
                        <td>Gross Expense Aggregate</td>
                        <td className="is-num">{formatCurrency(totalExpense)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* BOTTOM LINE NET INCOME EXECUTIVE METRIC DISPLAY */}
              <div className={`is-net-banner ${netIncome >= 0 ? "profit" : "loss"}`}>
                <div className="is-net-label-block">
                  <h3 style={{ color: netIncome >= 0 ? "var(--emerald)" : "var(--rose)" }}>
                    {netIncome >= 0 ? "Net Income Retained (Profit)" : "Net Operating Deficit (Loss)"}
                  </h3>
                  <p>Calculated total residual net income balance for the current historical accounting period scope.</p>
                </div>
                <div 
                  className="is-net-amount" 
                  style={{ color: netIncome >= 0 ? "var(--emerald)" : "var(--rose)" }}
                >
                  {formatCurrency(netIncome)}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </Layout>
  );
}