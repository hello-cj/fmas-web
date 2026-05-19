import { useEffect, useState } from "react";
import api from "../../api/api";
import Layout from "../../components/layout/Layout";
import { useNavigate } from "react-router-dom";

const styles = `
  .bgt-root {
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

  .bgt-container {
    max-width: 1500px;
    margin: 0 auto;
    padding: 24px;
    color: var(--text);
  }

  .bgt-header {
    margin-bottom: 24px;
  }

  .bgt-title {
    font-size: 26px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 6px 0;
  }

  .bgt-subtitle {
    color: var(--text-muted);
    font-size: 14px;
    margin: 0;
  }

  /* Two-Column Responsive Workspace Grid */
  .bgt-workspace-grid {
    display: grid;
    grid-template-columns: 450px 1fr;
    gap: 24px;
    align-items: start;
    margin-bottom: 24px;
  }

  @media (max-width: 1150px) {
    .bgt-workspace-grid {
      grid-template-columns: 1fr;
    }
  }

  .bgt-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
  }

  .bgt-card h2 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 16px 0;
    color: #f1f5f9;
    border-bottom: 1px solid var(--border);
    padding-bottom: 10px;
  }

  /* Structural Form Styling */
  .bgt-form-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .bgt-field-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    margin-bottom: -4px;
  }

  .bgt-input, .bgt-select {
    background: #0f172a;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 8px 12px;
    color: var(--text);
    font-size: 14px;
    outline: none;
    box-sizing: border-box;
    width: 100%;
  }

  .bgt-input:focus, .bgt-select:focus {
    border-color: var(--accent-blue);
  }

  /* Dynamic Line Items Styling */
  .bgt-lines-section {
    margin-top: 14px;
    border-top: 1px dashed var(--border);
    padding-top: 14px;
  }

  .bgt-line-row {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
  }

  /* Action Triggers */
  .bgt-btn-secondary {
    background: var(--surface-light);
    color: #ffffff;
    border: 1px solid var(--border);
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    margin-top: 4px;
  }

  .bgt-btn-secondary:hover {
    background: #334155;
  }

  .bgt-btn-primary {
    background: var(--emerald);
    color: #ffffff;
    border: none;
    padding: 10px 14px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 8px;
  }

  .bgt-btn-primary:hover {
    background: #059669;
  }

  .bgt-btn-remove {
    background: transparent;
    color: var(--text-muted);
    border: none;
    font-size: 16px;
    cursor: pointer;
    padding: 4px 8px;
  }

  .bgt-btn-remove:hover {
    color: var(--rose);
  }

  .bgt-btn-action {
    background: var(--surface-light);
    color: #e2e8f0;
    border: 1px solid var(--border);
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
  }

  .bgt-btn-action:hover {
    background: #334155;
    color: #ffffff;
  }

  /* Data Table Layouts */
  .bgt-table-wrapper {
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: #0f172a;
  }

  .bgt-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;
  }

  .bgt-table th {
    background: rgba(255, 255, 255, 0.02);
    padding: 12px 16px;
    font-weight: 600;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.05em;
  }

  .bgt-table td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }

  .bgt-table tbody tr:last-child td {
    border-bottom: none;
  }

  .bgt-num-cell {
    font-family: monospace;
    text-align: right;
  }

  /* Performance Analysis Variance Badges */
  .bgt-variance-badge {
    display: inline-block;
    font-family: monospace;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
  }

  .bgt-variance-badge.favorable {
    color: var(--emerald);
  }

  .bgt-variance-badge.unfavorable {
    background: rgba(244, 63, 94, 0.12);
    color: #f87171;
    border: 1px solid rgba(244, 63, 94, 0.15);
  }
`;

export default function BudgetDashboard() {
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [report, setReport] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    lines: [],
  });

  useEffect(() => {
    fetchBudgets();
    fetchAccounts();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await api.get("/budgets");
      setBudgets(res.data || []);
    } catch (err) {
      console.error("Failed to load budgets", err);
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await api.get("/accounts");
      setAccounts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addLine = () => {
    setForm({
      ...form,
      lines: [...form.lines, { accountId: "", amount: 0 }],
    });
  };

  const removeLine = (index) => {
    const updated = form.lines.filter((_, i) => i !== index);
    setForm({ ...form, lines: updated });
  };

  const updateLine = (index, field, value) => {
    const updated = [...form.lines];
    updated[index][field] = value;
    setForm({ ...form, lines: updated });
  };

  const createBudget = async (e) => {
    e.preventDefault();
    try {
      await api.post("/budgets", form);
      alert("Budget configuration processed successfully.");
      setForm({ name: "", startDate: "", endDate: "", lines: [] });
      fetchBudgets();
    } catch (err) {
      console.error(err);
      alert("Failed to initialize system budget profile.");
    }
  };

  const viewBudgetAnalysis = async (id) => {
    try {
      const res = await api.get(`/budgets/vs-actual/${id}`);
      setReport(res.data || []);
      setSelectedBudget(id);
    } catch (err) {
      alert("Failed to compile target performance variance audit lines.");
    }
  };

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return `₱${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Layout>
      <style>{styles}</style>
      <div className="bgt-root">
        <div className="bgt-container">
          
          {/* HEADER ROW DESCRIPTION */}
          <div className="bgt-header">
            <h1 className="bgt-title">Budgeting & Cost Controls</h1>
            <p className="bgt-subtitle">Establish structural operational spending limits and monitor cost realignments</p>
          </div>

          <div className="bgt-workspace-grid">
            
            {/* COLUMN 1: INTERACTIVE SPENDING CONFIGURATION PANEL */}
            <div className="bgt-card">
              <h2>Fiscal Limit Allocation Form</h2>
              <form onSubmit={createBudget} className="bgt-form-group">
                
                <span className="bgt-field-label">Budget Matrix Designation</span>
                <input
                  className="bgt-input"
                  placeholder="e.g., Q2 Operational Framework"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <span className="bgt-field-label">Effective From</span>
                    <input
                      type="date"
                      className="bgt-input"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <span className="bgt-field-label">Concludes On</span>
                    <input
                      type="date"
                      className="bgt-input"
                      value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* STRUCTURAL DYNAMIC LINES WRAPPER */}
                <div className="bgt-lines-section">
                  <span className="bgt-field-label" style={{ display: "block", marginBottom: "8px" }}>
                    Allocated Account Parameters ({form.lines.length})
                  </span>

                  {form.lines.map((line, i) => (
                    <div key={i} className="bgt-line-row">
                      <select
                        className="bgt-select"
                        style={{ flex: 2 }}
                        value={line.accountId}
                        onChange={(e) => updateLine(i, "accountId", e.target.value)}
                        required
                      >
                        <option value="">Select Ledger Target</option>
                        {accounts.map((a) => (
                          <option key={a.accountId} value={a.accountId}>
                            {a.code} — {a.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        className="bgt-input"
                        style={{ flex: 1, textTransform: "monospace" }}
                        placeholder="Amount"
                        value={line.amount || ""}
                        onChange={(e) => updateLine(i, "amount", Number(e.target.value))}
                        required
                      />

                      <button 
                        type="button" 
                        className="bgt-btn-remove"
                        onClick={() => removeLine(i)}
                        title="Discard assignment"
                      >
                        ✖
                      </button>
                    </div>
                  ))}

                  <button type="button" className="bgt-btn-secondary" onClick={addLine}>
                    + Append New Target Line
                  </button>
                </div>

                <button type="submit" className="bgt-btn-primary">
                  Commit Financial Framework
                </button>
              </form>
            </div>

            {/* COLUMN 2: ACTIVE BUDGET SHEETS COMPILATION GRID */}
            <div className="bgt-card">
              <h2>Registered Operating Profiles</h2>
              <div className="bgt-table-wrapper">
                <table className="bgt-table">
                  <thead>
                    <tr>
                      <th>Profile Label</th>
                      <th>Effective Range</th>
                      <th style={{ textAlign: "center" }}>Analysis Operations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgets.length === 0 ? (
                      <tr>
                        <td colSpan="3" style={{ textAlign: "center", color: "var(--text-muted)", padding: "24px" }}>
                          No active spend profiles configured.
                        </td>
                      </tr>
                    ) : (
                      budgets.map((b) => (
                        <tr key={b.budgetId}>
                          <td style={{ fontWeight: "600", color: "#ffffff" }}>{b.name}</td>
                          <td style={{ fontFamily: "monospace", fontSize: "13px" }}>
                            {b.startDate?.split("T")[0]} ➔ {b.endDate?.split("T")[0]}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button 
                              className="bgt-btn-action"
                              onClick={() => viewBudgetAnalysis(b.budgetId)}
                            >
                              Audit Alignment
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

          {/* DYNAMIC SPEND VS ACTUAL STRUCTURAL DRILL DOWN */}
          {selectedBudget && (
            <div className="bgt-card" style={{ marginTop: "24px" }}>
              <h2>Variance Breakdown: Target Plan vs Core Ledger Actuals</h2>
              <div className="bgt-table-wrapper">
                <table className="bgt-table">
                  <thead>
                    <tr>
                      <th>Account Classification Node</th>
                      <th style={{ textAlign: "right" }}>Projected Target</th>
                      <th style={{ textAlign: "right" }}>Ledger Actuals</th>
                      <th style={{ textAlign: "right" }}>Performance Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>
                          No allocation traces verified for this structural matrix index.
                        </td>
                      </tr>
                    ) : (
                      report.map((r, i) => {
                        const varianceVal = Number(r.variance) || 0;
                        const isOverBudget = varianceVal < 0; // Negative variance signals over spending limits
                        return (
                          <tr key={i}>
                            <td style={{ fontWeight: "500", color: "#f1f5f9" }}>
                              {r.accountName || `Node Identifier: ${r.accountId}`}
                            </td>
                            <td className="bgt-num-cell">{formatCurrency(r.budget)}</td>
                            <td className="bgt-num-cell" style={{ color: "#ffffff" }}>{formatCurrency(r.actual)}</td>
                            <td className="bgt-num-cell">
                              <span className={`bgt-variance-badge ${isOverBudget ? "unfavorable" : "favorable"}`}>
                                {varianceVal >= 0 ? "+" : ""}{varianceVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}