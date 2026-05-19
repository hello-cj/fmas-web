import { useEffect, useState } from "react";
import api from "../api/api";
import Layout from "../components/layout/Layout";

const styles = `
  .je-root {
    --bg: #0f172a;
    --surface: #1e293b;
    --surface-light: #293548;
    --border: #334155;
    --border-focus: #3b82f6;
    --text: #f8fafc;
    --text-muted: #94a3b8;
    --accent-green: #10b981;
    --accent-red: #ef4444;
    --accent-red-glow: rgba(239, 68, 68, 0.1);
    --accent-green-glow: rgba(16, 185, 129, 0.1);
    font-family: system-ui, -apple-system, sans-serif;
  }

  .je-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 24px;
    color: var(--text);
  }

  .je-header-section {
    margin-bottom: 24px;
  }

  .je-title {
    font-size: 26px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 6px 0;
  }

  .je-subtitle {
    color: var(--text-muted);
    font-size: 14px;
    margin: 0;
  }

  /* Form Grid Cards */
  .je-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .je-form-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (max-width: 768px) {
    .je-form-grid { grid-template-columns: 1fr; }
  }

  .je-input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .je-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .je-input, .je-select {
    background: #0f172a;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    color: var(--text);
    font-size: 14px;
    font-family: inherit;
    transition: all 0.2s;
    outline: none;
  }

  .je-input:focus, .je-select:focus {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 1px var(--border-focus);
  }

  /* Ledger Table Architecture */
  .je-table-wrapper {
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: #0f172a;
  }

  .je-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;
  }

  .je-table th {
    background: var(--surface);
    padding: 12px 16px;
    font-weight: 600;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.05em;
  }

  .je-table td {
    padding: 10px 16px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }

  .je-table tr:last-child td {
    border-bottom: none;
  }

  .je-table-input {
    width: 100%;
    box-sizing: border-box;
    font-family: monospace;
  }

  /* Status and Action Controls */
  .je-action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    gap: 16px;
  }

  @media (max-width: 640px) {
    .je-action-bar { flex-direction: column; align-items: stretch; }
  }

  .je-btn {
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid transparent;
  }

  .je-btn-secondary {
    background: var(--surface);
    color: var(--text);
    border-color: var(--border);
  }

  .je-btn-secondary:hover {
    background: var(--surface-light);
    border-color: var(--text-muted);
  }

  .je-btn-primary {
    background: #3b82f6;
    color: #ffffff;
  }

  .je-btn-primary:hover:not(:disabled) {
    background: #2563eb;
  }

  .je-btn-primary:disabled {
    background: #1e293b;
    color: #64748b;
    cursor: not-allowed;
    border-color: #334155;
  }

  .je-btn-danger-icon {
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .je-btn-danger-icon:hover {
    color: var(--accent-red);
    background: var(--accent-red-glow);
  }

  /* Summary & Totals Panel */
  .je-summary-card {
    margin-top: 24px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }

  .je-summary-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    font-size: 14px;
  }

  .je-summary-value {
    font-family: monospace;
    font-weight: 600;
    font-size: 15px;
    text-align: left;
  }

  .je-status-banner {
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 15px;
  }

  .je-status-banner.balanced {
    background: var(--accent-green-glow);
    color: var(--accent-green);
  }

  .je-status-banner.unbalanced {
    background: var(--accent-red-glow);
    color: var(--accent-red);
  }
`;

export default function JournalEntry() {
  const [accounts, setAccounts] = useState([]);
  const [date, setDate] = useState("");
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [lines, setLines] = useState([
    { accountId: "", debit: 0, credit: 0 },
    { accountId: "", debit: 0, credit: 0 },
  ]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await api.get("/accounts/dropdown");
      setAccounts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch accounts", err);
      setAccounts([]);
    }
  };

  const addLine = () => {
    const lastLine = lines[lines.length - 1];
    if (!lastLine.accountId && lastLine.debit === 0 && lastLine.credit === 0) {
      alert("Fill the current row layout before appending another line.");
      return;
    }
    setLines([...lines, { accountId: "", debit: 0, credit: 0 }]);
  };

  const updateLine = (index, field, value) => {
    const updated = [...lines];
    if (field === "debit" || field === "credit") {
      updated[index][field] = value === "" ? 0 : Number(value);
    } else {
      updated[index][field] = value;
    }
    setLines(updated);
  };

  const removeLine = (index) => {
    if (lines.length <= 2) return;
    const updated = lines.filter((_, i) => i !== index);
    setLines(updated);
  };

  const totalDebit = lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.001;
  const imbalance = totalDebit - totalCredit;

  const handleSubmit = async () => {
    const hasEmptyAccount = lines.some((l) => !l.accountId);

    if (!date || !reference || !description) {
      alert("Please complete all header fields.");
      return;
    }
    if (lines.length < 2) {
      alert("Journal Entry must have at least 2 lines.");
      return;
    }
    if (hasEmptyAccount) {
      alert("Please select all accounts.");
      return;
    }
    if (!isBalanced) {
      alert("Debits and Credits must balance perfectly.");
      return;
    }

    try {
      const payload = {
        date: new Date(date).toISOString(),
        reference,
        description,
        lines: lines.map((line) => ({
          accountId: line.accountId,
          debit: Number(line.debit),
          credit: Number(line.credit),
        })),
      };

      await api.post("/journal-entries", payload);
      alert("Journal Entry Created successfully!");

      setDate("");
      setReference("");
      setDescription("");
      setLines([
        { accountId: "", debit: 0, credit: 0 },
        { accountId: "", debit: 0, credit: 0 },
      ]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating journal entry");
    }
  };

  return (
    <Layout>
      <style>{styles}</style>
      <div className="je-root">
        <div className="je-container">
          
          {/* HEADER SECTION TITLE */}
          <div className="je-header-section">
            <h1 className="je-title">New Journal Entry</h1>
            <p className="je-subtitle">Record and execute dynamic double-entry balanced accounting allocations</p>
          </div>

          {/* META DOCUMENT HEADER */}
          <div className="je-card">
            <div className="je-form-grid">
              <div className="je-input-group">
                <label className="je-label">Posting Date</label>
                <input
                  type="date"
                  className="je-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="je-input-group">
                <label className="je-label">Reference Number</label>
                <input
                  placeholder="e.g. JE-2026-001"
                  className="je-input"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />
              </div>

              <div className="je-input-group">
                <label className="je-label">Description / Memo</label>
                <input
                  placeholder="Describe transaction context"
                  className="je-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* TABLE MATRIX BLOCK */}
          <div className="je-card" style={{ padding: "12px" }}>
            <div className="je-table-wrapper">
              <table className="je-table">
                <thead>
                  <tr>
                    <th style={{ width: "50%" }}>Account Ledger Name</th>
                    <th style={{ width: "20%" }}>Debit ($)</th>
                    <th style={{ width: "20%" }}>Credit ($)</th>
                    <th style={{ width: "10%", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={index}>
                      <td>
                        <select
                          className="je-select"
                          style={{ width: "100%" }}
                          value={line.accountId}
                          onChange={(e) => updateLine(index, "accountId", e.target.value)}
                        >
                          <option value="">Select general ledger account...</option>
                          {accounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>
                              [{acc.code}] {acc.name} — ({acc.type})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="je-input je-table-input"
                          min="0"
                          step="any"
                          placeholder="0.00"
                          value={line.debit === 0 ? "" : line.debit}
                          onChange={(e) => updateLine(index, "debit", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="je-input je-table-input"
                          min="0"
                          step="any"
                          placeholder="0.00"
                          value={line.credit === 0 ? "" : line.credit}
                          onChange={(e) => updateLine(index, "credit", e.target.value)}
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          className="je-btn-danger-icon"
                          title="Remove line"
                          disabled={lines.length <= 2}
                          style={{ opacity: lines.length <= 2 ? 0.3 : 1, cursor: lines.length <= 2 ? "not-allowed" : "pointer" }}
                          onClick={() => removeLine(index)}
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* INTERACTION ROW */}
            <div className="je-action-bar">
              <button className="je-btn je-btn-secondary" onClick={addLine}>
                ➕ Add Entry Row
              </button>
            </div>
          </div>

          {/* LEDGER CALCULATION SUMMARY PANEL */}
          <div className="je-summary-card">
            <div className="je-summary-row" style={{ color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
              <span>Summary Breakdown</span>
              <span>Total Debits</span>
              <span>Total Credits</span>
            </div>
            <div className="je-summary-row">
              <span style={{ color: "var(--text-muted)" }}>Running Column Sums</span>
              <span className="je-summary-value" style={{ color: totalDebit > 0 ? "var(--text)" : "var(--text-muted)" }}>
                ${totalDebit.toFixed(2)}
              </span>
              <span className="je-summary-value" style={{ color: totalCredit > 0 ? "var(--text)" : "var(--text-muted)" }}>
                ${totalCredit.toFixed(2)}
              </span>
            </div>

            {/* BALANCED RUNTIME BANNER */}
            <div className={`je-status-banner ${isBalanced ? "balanced" : "unbalanced"}`}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>{isBalanced ? "✓" : "⚠"}</span>
                <span>{isBalanced ? "Ledger entries are completely balanced" : "Out of balance status detected"}</span>
              </div>
              <div className="je-summary-value">
                {isBalanced ? "Balanced" : `Variance: $${Math.abs(imbalance).toFixed(2)}`}
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON BAR */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
            <button
              className="je-btn je-btn-primary"
              style={{ padding: "12px 32px", fontSize: "15px" }}
              onClick={handleSubmit}
              disabled={!isBalanced || lines.length < 2}
            >
               Post Journal Entry
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
}