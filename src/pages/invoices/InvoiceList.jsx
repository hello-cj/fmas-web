import { useEffect, useState } from "react";
import api from "../../api/api";
import Layout from "../../components/layout/Layout";
import { useNavigate } from "react-router-dom";

const styles = `
  .inv-root {
    --bg: #0f172a;
    --surface: #1e293b;
    --surface-light: #293548;
    --border: #334155;
    --text: #f8fafc;
    --text-muted: #94a3b8;
    --accent-blue: #3b82f6;
    --accent-green: #10b981;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .inv-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
    color: var(--text);
  }

  .inv-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
  }

  .inv-title {
    font-size: 26px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 6px 0;
  }

  .inv-subtitle {
    color: var(--text-muted);
    font-size: 14px;
    margin: 0;
  }

  /* Action Buttons */
  .inv-btn-primary {
    background: var(--accent-blue);
    color: #ffffff;
    font-weight: 600;
    font-size: 14px;
    padding: 10px 18px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .inv-btn-primary:hover {
    background: #2563eb;
  }

  /* Segmented Navigation Controls */
  .inv-tabs {
    display: flex;
    gap: 4px;
    background: #0f172a;
    padding: 4px;
    border-radius: 8px;
    border: 1px solid var(--border);
    width: fit-content;
    margin-bottom: 24px;
  }

  .inv-tab-btn {
    background: transparent;
    color: var(--text-muted);
    border: none;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .inv-tab-btn.active {
    background: var(--surface-light);
    color: #ffffff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }

  /* Data Table Layout */
  .inv-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .inv-table-wrapper {
    overflow-x: auto;
  }

  .inv-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;
  }

  .inv-table th {
    background: rgba(255, 255, 255, 0.02);
    padding: 14px 18px;
    font-weight: 600;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.05em;
  }

  .inv-table td {
    padding: 14px 18px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }

  .inv-table tbody tr:last-child td {
    border-bottom: none;
  }

  .inv-table tr:hover td {
    background: rgba(255, 255, 255, 0.01);
  }

  .inv-num-cell {
    font-family: monospace;
    font-size: 14px;
    text-align: right;
  }

  /* Status Badge Badges */
  .inv-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .inv-badge.paid { background: rgba(16, 185, 129, 0.12); color: #34d399; }
  .inv-badge.pending { background: rgba(245, 158, 11, 0.12); color: #fbbf24; }
  .inv-badge.overdue { background: rgba(244, 63, 94, 0.12); color: #f87171; }
  .inv-badge.draft { background: rgba(148, 163, 184, 0.12); color: #cbd5e1; }

  .inv-type-tag {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
    background: var(--surface-light);
    border: 1px solid var(--border);
  }

  .inv-btn-view {
    background: var(--surface-light);
    color: #e2e8f0;
    border: 1px solid var(--border);
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .inv-btn-view:hover {
    background: #334155;
    color: #ffffff;
    border-color: #475569;
  }

  /* Loading State Framework */
  .inv-loading-wrapper {
    padding: 60px;
    text-align: center;
    color: var(--text-muted);
  }

  .inv-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(255,255,255,0.1);
    border-radius: 50%;
    border-top-color: var(--accent-blue);
    animation: inv-spin 0.8s linear infinite;
    margin: 0 auto 12px auto;
  }

  @keyframes inv-spin {
    to { transform: rotate(360deg); }
  }
`;

export default function InvoiceList() {
  const navigate = useNavigate();

  const [type, setType] = useState("AR");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      if (type === "AR") {
        const res = await api.get("/ar-invoices");
        const mapped = (res.data || []).map((x) => {
          const total = x.lines?.reduce(
            (sum, l) => sum + (Number(l.quantity || 0) * Number(l.unitPrice || 0)),
            0
          ) || 0;

          return {
            id: x.arInvoiceId,
            reference: x.invoiceNumber || "-",
            customerVendor: x.customer?.name || "No Customer",
            date: x.invoiceDate,
            total,
            status: x.status || "Draft",
            type: "AR",
          };
        });
        setInvoices(mapped);
      } else {
        const res = await api.get("/ap-invoices");
        const mapped = (res.data || []).map((x) => {
          const total = x.lines?.reduce(
            (sum, l) => sum + (Number(l.quantity || 0) * Number(l.unitPrice || 0)),
            0
          ) || 0;

          return {
            id: x.apInvoiceId,
            reference: x.reference || "-",
            customerVendor: x.vendor?.name || "No Vendor",
            date: x.invoiceDate,
            total,
            status: x.status || "Draft",
            type: "AP",
          };
        });
        setInvoices(mapped);
      }
    } catch (err) {
      console.error("FAILED TO LOAD INVOICES", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [type]);

  const getStatusStyle = (status) => {
    const s = String(status).toLowerCase();
    if (s.includes("paid")) return "inv-badge paid";
    if (s.includes("overdue") || s.includes("void")) return "inv-badge overdue";
    if (s.includes("pending") || s.includes("sent") || s.includes("approve")) return "inv-badge pending";
    return "inv-badge draft";
  };

  return (
    <Layout>
      <style>{styles}</style>
      <div className="inv-root">
        <div className="inv-container">
          
          {/* HEADER ROW ACTIONS */}
          <div className="inv-header">
            <div>
              <h1 className="inv-title">Invoices</h1>
              <p className="inv-subtitle">Audit, aggregate, and trace transactions across Accounts Receivable and Payable ledgers</p>
            </div>

            <button
              onClick={() => navigate("/invoices/new")}
              className="inv-btn-primary"
            >
              <span>+</span> Create New Invoice
            </button>
          </div>

          {/* DYNAMIC ACCOUNT TYPE FILTERS */}
          <div className="inv-tabs">
            <button
              onClick={() => setType("AR")}
              className={`inv-tab-btn ${type === "AR" ? "active" : ""}`}
            >
              Accounts Receivable
            </button>
            <button
              onClick={() => setType("AP")}
              className={`inv-tab-btn ${type === "AP" ? "active" : ""}`}
            >
              Accounts Payable
            </button>
          </div>

          {/* DATA CONTAINER CARD */}
          <div className="inv-card">
            <div className="inv-table-wrapper">
              <table className="inv-table">
                <thead>
                  <tr>
                    <th style={{ width: "15%" }}>Issue Date</th>
                    <th style={{ width: "20%" }}>Reference No.</th>
                    <th style={{ width: "25%" }}>{type === "AR" ? "Client / Customer" : "Supplier / Vendor"}</th>
                    <th style={{ width: "15%", textAlign: "right" }}>Gross Total</th>
                    <th style={{ width: "12%", textAlign: "center" }}>Status</th>
                    <th style={{ width: "10%", textAlign: "center" }}>Category</th>
                    <th style={{ width: "13%", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7">
                        <div className="inv-loading-wrapper">
                          <div className="inv-spinner"></div>
                          <span>Querying active accounting nodes...</span>
                        </div>
                      </td>
                    </tr>
                  ) : invoices.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>
                        No records parsed for this fiscal scope parameters.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td style={{ color: "#e2e8f0" }}>
                          {invoice.date ? new Date(invoice.date).toLocaleDateString(undefined, {
                            year: "numeric", month: "short", day: "numeric"
                          }) : "—"}
                        </td>
                        
                        <td style={{ fontWeight: "600", color: "#f1f5f9" }}>
                          {invoice.reference}
                        </td>
                        
                        <td style={{ color: "#e2e8f0" }}>
                          {invoice.customerVendor}
                        </td>
                        
                        <td className="inv-num-cell" style={{ fontWeight: "700", color: "var(--text)" }}>
                          ₱{Number(invoice.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        
                        <td style={{ textAlign: "center" }}>
                          <span className={getStatusStyle(invoice.status)}>
                            {invoice.status}
                          </span>
                        </td>
                        
                        <td style={{ textAlign: "center" }}>
                          <span className="inv-type-tag">
                            {invoice.type}
                          </span>
                        </td>
                        
                        <td style={{ textAlign: "center" }}>
                          <button
                            onClick={() => navigate(`/invoices/${invoice.type}/${invoice.id}`)}
                            className="inv-btn-view"
                          >
                            Review Matrix
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