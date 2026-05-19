import { useEffect, useState } from "react";
import api from "../../api/api";
import Layout from "../../components/layout/Layout";

const styles = `
  .adt-root {
    --bg: #0f172a;
    --surface: #1e293b;
    --surface-light: #293548;
    --border: #334155;
    --text: #f8fafc;
    --text-muted: #94a3b8;
    --accent-blue: #3b82f6;
    --emerald: #10b981;
    --amber: #f59e0b;
    --rose: #f43f5e;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .adt-container {
    max-width: 1600px;
    margin: 0 auto;
    padding: 24px;
    color: var(--text);
  }

  .adt-header {
    margin-bottom: 24px;
  }

  .adt-title {
    font-size: 26px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 6px 0;
  }

  .adt-subtitle {
    color: var(--text-muted);
    font-size: 14px;
    margin: 0;
  }

  /* Structural Toolbar Filters Layout */
  .adt-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 24px;
    align-items: flex-end;
  }

  .adt-filter-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .adt-label {
    font-size: 11px;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .adt-select, .adt-input {
    background: #0f172a;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 8px 12px;
    color: var(--text);
    font-size: 14px;
    outline: none;
    min-width: 160px;
  }

  .adt-select:focus, .adt-input:focus {
    border-color: var(--accent-blue);
  }

  .adt-btn-query {
    background: var(--accent-blue);
    color: #ffffff;
    border: none;
    font-weight: 600;
    font-size: 14px;
    padding: 9px 20px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.15s ease;
    height: 38px;
  }

  .adt-btn-query:hover {
    background: #2563eb;
  }

  /* Main Logging Core Table presentation */
  .adt-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .adt-table-wrapper {
    overflow-x: auto;
  }

  .adt-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;
  }

  .adt-table th {
    background: rgba(255, 255, 255, 0.02);
    padding: 14px 18px;
    font-weight: 600;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.05em;
  }

  .adt-table td {
    padding: 14px 18px;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
  }

  .adt-table tbody tr:last-child td {
    border-bottom: none;
  }

  .adt-table tr:hover td {
    background: rgba(255, 255, 255, 0.01);
  }

  .adt-timestamp {
    font-family: monospace;
    font-size: 13px;
    color: #cbd5e1;
    white-space: nowrap;
  }

  .adt-identity {
    font-weight: 500;
    color: #f1f5f9;
  }

  /* Semantic Security Action Badges */
  .adt-badge {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    text-align: center;
    min-width: 65px;
  }

  .adt-badge.create { background: rgba(16, 185, 129, 0.12); color: #34d399; }
  .adt-badge.post { background: rgba(59, 130, 246, 0.12); color: #60a5fa; }
  .adt-badge.update { background: rgba(245, 158, 11, 0.12); color: #fbbf24; }
  .adt-badge.delete { background: rgba(244, 63, 94, 0.12); color: #f87171; }
  .adt-badge.lock { background: rgba(168, 85, 247, 0.12); color: #c084fc; }
  .adt-badge.fallback { background: rgba(148, 163, 184, 0.12); color: #cbd5e1; }

  .adt-module-tag {
    font-size: 12px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
    background: var(--surface-light);
    border: 1px solid var(--border);
    color: #e2e8f0;
    display: inline-block;
  }

  .adt-desc-text {
    color: #cbd5e1;
    line-height: 1.5;
    font-size: 13px;
  }

  /* Inline Code Metadata Diffs */
  .adt-meta-box {
    margin-top: 6px;
    background: #0f172a;
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 6px 10px;
    font-family: monospace;
    font-size: 11px;
    color: #94a3b8;
    max-width: 500px;
    overflow-x: auto;
  }

  /* Loading Frame Indicators */
  .adt-loading-block {
    padding: 80px;
    text-align: center;
    color: var(--text-muted);
  }

  .adt-spinner {
    width: 28px;
    height: 28px;
    border: 3px solid rgba(255,255,255,0.1);
    border-radius: 50%;
    border-top-color: var(--accent-blue);
    animation: adt-spin 0.8s linear infinite;
    margin: 0 auto 16px auto;
  }

  @keyframes adt-spin {
    to { transform: rotate(360deg); }
  }
`;

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [action, setAction] = useState("");
  const [module, setModule] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/audit-logs", {
        params: { from, to, action, module },
      });
      setLogs(res.data || []);
    } catch (err) {
      console.error("Failed to execute logs lookup query", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionBadgeClass = (act) => {
    const a = String(act).toUpperCase();
    if (a === "CREATE") return "adt-badge create";
    if (a === "POST") return "adt-badge post";
    if (a === "UPDATE") return "adt-badge update";
    if (a === "DELETE") return "adt-badge delete";
    if (a === "LOCK") return "adt-badge lock";
    return "adt-badge fallback";
  };

  return (
    <Layout>
      <style>{styles}</style>
      <div className="adt-root">
        <div className="adt-container">
          
          {/* HEADER SECTOR TITLE */}
          <div className="adt-header">
            <h1 className="adt-title">Security & Audit Logs</h1>
            <p className="adt-subtitle">Immutable chronological trail of ledger updates, access elevations, and manual balance structural offsets</p>
          </div>

          {/* CRITICAL DATA SEGMENT CONTROL FILTERS BAR */}
          <div className="adt-toolbar">
            <div className="adt-filter-field">
              <span className="adt-label">Action Metric</span>
              <select className="adt-select" value={action} onChange={(e) => setAction(e.target.value)}>
                <option value="">All Actions</option>
                <option value="CREATE">CREATE</option>
                <option value="POST">POST</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
                <option value="LOCK">LOCK</option>
              </select>
            </div>

            <div className="adt-filter-field">
              <span className="adt-label">System Module Node</span>
              <select className="adt-select" value={module} onChange={(e) => setModule(e.target.value)}>
                <option value="">All Modules</option>
                <option value="JournalEntry">Journal Entry</option>
                <option value="ARInvoice">AR Invoice</option>
                <option value="APInvoice">AP Invoice</option>
                <option value="Budget">Budget</option>
              </select>
            </div>

            <div className="adt-filter-field">
              <span className="adt-label">Audit Range From</span>
              <input type="date" className="adt-input" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>

            <div className="adt-filter-field">
              <span className="adt-label">Audit Range To</span>
              <input type="date" className="adt-input" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>

            <button onClick={fetchLogs} className="adt-btn-query">
              Execute Search
            </button>
          </div>

          {/* MAIN MUTATION DIRECTORY PANEL */}
          <div className="adt-card">
            <div className="adt-table-wrapper">
              <table className="adt-table">
                <thead>
                  <tr>
                    <th style={{ width: "18%" }}>System Timestamp</th>
                    <th style={{ width: "20%" }}>User Identity Context</th>
                    <th style={{ width: "12%" }}>Operation</th>
                    <th style={{ width: "15%" }}>Module Domain</th>
                    <th style={{ width: "35%" }}>Mutation Trace Details</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5">
                        <div className="adt-loading-block">
                          <div className="adt-spinner"></div>
                          <span>Querying immutable trace structures...</span>
                        </div>
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>
                        No operation logs found matching your filter parameters.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id}>
                        <td className="adt-timestamp">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString(undefined, {
                            dateStyle: "medium", timeStyle: "medium"
                          }) : "—"}
                        </td>
                        
                        <td className="adt-identity">
                          <div style={{ wordBreak: "break-all" }}>{log.userEmail || "System Engine Pipeline"}</div>
                        </td>
                        
                        <td>
                          <span className={getActionBadgeClass(log.action)}>
                            {log.action || "UNKNOWN"}
                          </span>
                        </td>
                        
                        <td>
                          <span className="adt-module-tag">
                            {log.module || "General Ledger"}
                          </span>
                        </td>
                        
                        <td>
                          <div className="adt-desc-text">{log.description || "No description text provided."}</div>
                          {log.metadata && (
                            <div className="adt-meta-box">
                              {typeof log.metadata === "object" ? JSON.stringify(log.metadata) : log.metadata}
                            </div>
                          )}
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