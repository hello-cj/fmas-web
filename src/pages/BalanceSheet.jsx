import { useEffect, useState } from "react";
import api from "../api/api";
import Layout from "../components/layout/Layout";

const styles = `
  .bs-root {
    --bg: #0f172a;
    --surface: #1e293b;
    --surface-light: #293548;
    --border: #334155;
    --text: #f8fafc;
    --text-muted: #94a3b8;
    --emerald: #10b981;
    --amber: #f59e0b;
    --indigo: #6366f1;
    --rose: #f43f5e;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .bs-container {
    max-width: 1300px;
    margin: 0 auto;
    padding: 24px;
    color: var(--text);
  }

  .bs-header-section {
    margin-bottom: 24px;
  }

  .bs-title {
    font-size: 26px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 6px 0;
  }

  .bs-subtitle {
    color: var(--text-muted);
    font-size: 14px;
    margin: 0;
  }

  /* Core Ledger Dynamic Grid System */
  .bs-ledger-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    align-items: stretch; /* Forces equal heights columns without causing visual layout overflow */
    margin-bottom: 24px;
  }

  @media (max-width: 1024px) {
    .bs-ledger-grid {
      grid-template-columns: 1fr;
    }
  }

  .bs-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
  }

  /* Right-side container mapping Liabilities + Equities sequentially */
  .bs-right-column {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* Ensures individual internal cards expand dynamically to fit their nested text contents */
  .bs-right-column .bs-card {
    flex: 1; 
  }

  .bs-card-title {
    font-size: 16px;
    font-weight: 600;
    color: #f1f5f9;
    margin: 0 0 14px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .bs-table-wrapper {
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: #0f172a;
  }

  .bs-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;
  }

  .bs-table th {
    background: rgba(255, 255, 255, 0.02);
    padding: 12px 16px;
    font-weight: 600;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.05em;
  }

  .bs-table td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }

  .bs-table tr:hover td {
    background: rgba(255, 255, 255, 0.01);
  }

  /* Financial Statement Summary Formats */
  .bs-total-row td {
    background: var(--surface-light);
    font-weight: 700;
    color: #ffffff;
    border-top: 1px solid var(--border);
    border-bottom: double 4px var(--border);
  }

  .bs-num {
    font-family: monospace;
    font-size: 14px;
    text-align: right;
  }

  /* Fundamental Identity Bottom Banner Wrapper */
  .bs-equation-banner {
    border-radius: 12px;
    padding: 20px;
    border: 1px solid transparent;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
  }

  .bs-equation-banner.balanced {
    background: rgba(16, 185, 129, 0.06);
    border-color: rgba(16, 185, 129, 0.2);
  }

  .bs-equation-banner.unbalanced {
    background: rgba(244, 63, 94, 0.06);
    border-color: rgba(244, 63, 94, 0.2);
  }

  .bs-eq-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    padding-bottom: 8px;
  }

  .bs-eq-title-row h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .bs-eq-status-tag {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 4px;
    letter-spacing: 0.05em;
  }

  .bs-eq-formula-grid {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: monospace;
    font-size: 18px;
    font-weight: 700;
    flex-wrap: wrap;
    gap: 12px;
  }

  .bs-eq-block {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .bs-eq-block .lbl {
    font-family: system-ui, sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  .bs-eq-block .val {
    color: #f1f5f9;
    font-size: 20px;
  }

  /* Async Loader Components */
  .bs-loading-wrapper {
    padding: 60px;
    text-align: center;
    color: var(--text-muted);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
  }

  .bs-spinner {
    width: 28px;
    height: 28px;
    border: 3px solid rgba(255,255,255,0.1);
    border-radius: 50%;
    border-top-color: #3b82f6;
    animation: bs-spin 0.8s linear infinite;
    margin: 0 auto 12px auto;
  }

  @keyframes bs-spin {
    to { transform: rotate(360deg); }
  }
`;

export default function BalanceSheet() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalanceSheet();
  }, []);

  const fetchBalanceSheet = async () => {
    try {
      const res = await api.get("/financial-statements/balance-sheet");
      setData(res.data || []);
    } catch (err) {
      console.error("Failed to fetch balance sheet", err);
    } finally {
      setLoading(false);
    }
  };

  const assets = data.filter((x) => x.type === "Asset");
  const liabilities = data.filter((x) => x.type === "Liability");
  const equity = data.filter((x) => x.type === "Equity");

  const totalAssets = assets.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalLiabilities = liabilities.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalEquity = equity.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const rightHandSide = totalLiabilities + totalEquity;
  const isBalanced = Math.abs(totalAssets - rightHandSide) < 0.001;

  const formatCurrency = (val) => {
    const num = Number(val);
    if (isNaN(num)) return "$0.00";
    const prefix = num < 0 ? "-" : "";
    return `${prefix}$${Math.abs(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Layout>
      <style>{styles}</style>
      <div className="bs-root">
        <div className="bs-container">
          
          {/* HEADER SECTION META */}
          <div className="bs-header-section">
            <h1 className="bs-title">Balance Sheet</h1>
            <p className="bs-subtitle">Statement of corporate financial position locking net values at a static point in runtime</p>
          </div>

          {loading ? (
            /* ASYNC PRELOADER CONTENT BLOCK */
            <div className="bs-loading-wrapper">
              <div className="bs-spinner"></div>
              <span>Assembling balance sheets matrix statement...</span>
            </div>
          ) : (
            <>
              {/* TWO COLUMN SIDE BY SIDE STATEMENT MATRIX */}
              <div className="bs-ledger-grid">
                
                {/* LEFT COL: ASSET DEPLOYMENTS */}
                <div className="bs-card">
                  <h2 className="bs-card-title" style={{ color: "var(--emerald)" }}>🟢 Asset Accounts</h2>
                  <div className="bs-table-wrapper">
                    <table className="bs-table">
                      <thead>
                        <tr>
                          <th>Account Name</th>
                          <th style={{ textAlign: "right" }}>Balance Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assets.length === 0 ? (
                          <tr>
                            <td colSpan="2" style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>
                              No compiled assets reported.
                            </td>
                          </tr>
                        ) : (
                          assets.map((item, index) => (
                            <tr key={index}>
                              <td style={{ fontWeight: "500" }}>{item.accountName}</td>
                              <td className="bs-num">{formatCurrency(item.amount)}</td>
                            </tr>
                          ))
                        )}
                        <tr className="bs-total-row">
                          <td>Total Aggregate Assets</td>
                          <td className="bs-num">{formatCurrency(totalAssets)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* RIGHT COL: LIABILITIES & EQUITIES LAYOUT ENGINE BLOCK */}
                <div className="bs-right-column">
                  
                  {/* LIABILITIES COMPONENT */}
                  <div className="bs-card">
                    <h2 className="bs-card-title" style={{ color: "var(--amber)" }}>🟡 Obligations & Liabilities</h2>
                    <div className="bs-table-wrapper">
                      <table className="bs-table">
                        <thead>
                          <tr>
                            <th>Account Name</th>
                            <th style={{ textAlign: "right" }}>Balance Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {liabilities.length === 0 ? (
                            <tr>
                              <td colSpan="2" style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>
                                No liabilities recorded.
                              </td>
                            </tr>
                          ) : (
                            liabilities.map((item, index) => (
                              <tr key={index}>
                                <td style={{ fontWeight: "500" }}>{item.accountName}</td>
                                <td className="bs-num">{formatCurrency(item.amount)}</td>
                              </tr>
                            ))
                          )}
                          <tr className="bs-total-row">
                            <td>Total Liabilities</td>
                            <td className="bs-num">{formatCurrency(totalLiabilities)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* SHAREHOLDER EQUITY COMPONENT */}
                  <div className="bs-card">
                    <h2 className="bs-card-title" style={{ color: "var(--indigo)" }}>🟣 Shareholder Equity</h2>
                    <div className="bs-table-wrapper">
                      <table className="bs-table">
                        <thead>
                          <tr>
                            <th>Account Name</th>
                            <th style={{ textAlign: "right" }}>Balance Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {equity.length === 0 ? (
                            <tr>
                              <td colSpan="2" style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>
                                No stakeholder equity ledger tracks parsed.
                              </td>
                            </tr>
                          ) : (
                            equity.map((item, index) => (
                              <tr key={index}>
                                <td style={{ fontWeight: "500" }}>{item.accountName}</td>
                                <td className="bs-num">{formatCurrency(item.amount)}</td>
                              </tr>
                            ))
                          )}
                          <tr className="bs-total-row">
                            <td>Total Retained Equity</td>
                            <td className="bs-num">{formatCurrency(totalEquity)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>

              {/* FUNDAMENTAL DOUBLE ENTRY IDENTITY EQUATION BANNER */}
              <div className={`bs-equation-banner ${isBalanced ? "balanced" : "unbalanced"}`}>
                <div className="bs-eq-title-row">
                  <h3 style={{ color: isBalanced ? "var(--emerald)" : "var(--rose)" }}>
                    Accounting Identity Verification
                  </h3>
                  <span 
                    className="bs-eq-status-tag" 
                    style={{ 
                      backgroundColor: isBalanced ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)",
                      color: isBalanced ? "var(--emerald)" : "var(--rose)"
                    }}
                  >
                    {isBalanced ? "Balanced ✓" : "Out of Balance ⚠"}
                  </span>
                </div>

                <div className="bs-eq-formula-grid">
                  <div className="bs-eq-block">
                    <span className="lbl">Total Assets</span>
                    <span className="val" style={{ color: isBalanced ? "var(--emerald)" : "#ffffff" }}>
                      {formatCurrency(totalAssets)}
                    </span>
                  </div>

                  <span style={{ color: "var(--text-muted)", paddingBottom: "2px" }}>=</span>

                  <div className="bs-eq-block">
                    <span className="lbl">Liabilities</span>
                    <span className="val">{formatCurrency(totalLiabilities)}</span>
                  </div>

                  <span style={{ color: "var(--text-muted)", paddingBottom: "2px" }}>+</span>

                  <div className="bs-eq-block">
                    <span className="lbl">Equity Balance</span>
                    <span className="val">{formatCurrency(totalEquity)}</span>
                  </div>

                  <span style={{ color: "var(--text-muted)", paddingBottom: "2px" }}>➔</span>

                  <div className="bs-eq-block" style={{ textAlign: "right" }}>
                    <span className="lbl">L + E Combined Summary</span>
                    <span className="val" style={{ color: isBalanced ? "var(--emerald)" : "#ffffff" }}>
                      {formatCurrency(rightHandSide)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </Layout>
  );
}