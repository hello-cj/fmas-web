import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import Layout from "../../components/layout/Layout";

const invoiceDetailStyles = `
  .det-root {
    --bg: #0f172a;
    --surface: #1e293b;
    --border: #334155;
    --text-bright: #f8fafc;
    --text-dim: #94a3b8;
    --accent-blue: #2563eb;
    --accent-emerald: #10b981;
    --accent-emerald-hover: #059669;
    
    background-color: var(--bg);
    min-height: 100vh;
    color: var(--text-bright);
    font-family: system-ui, -apple-system, sans-serif;
  }

  .det-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 24px;
  }

  /* Header Meta Meta Details */
  .det-header-block {
    margin-bottom: 32px;
  }

  .det-title {
    font-size: 28px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 12px 0;
  }

  .det-meta-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: var(--text-dim);
    font-size: 14px;
  }

  .det-meta-list b {
    color: #f1f5f9;
    font-weight: 600;
  }

  /* Structural Value Metrics Grid */
  .det-metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }

  .det-metric-card {
    background-color: var(--surface);
    padding: 24px;
    border-radius: 10px;
    border: 1px solid var(--border);
  }

  .det-metric-label {
    color: var(--text-dim);
    font-size: 13px;
    font-weight: 500;
    margin: 0 0 8px 0;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  .det-metric-value {
    font-size: 26px;
    font-weight: 700;
    color: var(--text-bright);
    margin: 0;
  }

  /* Sub-Section Box Blocks */
  .det-section-card {
    background-color: var(--surface);
    border-radius: 10px;
    border: 1px solid var(--border);
    margin-bottom: 32px;
    overflow: hidden;
  }

  .det-section-header {
    padding: 18px 24px;
    border-bottom: 1px solid var(--border);
    background-color: rgba(255, 255, 255, 0.01);
  }

  .det-section-title {
    font-size: 18px;
    font-weight: 600;
    color: #f1f5f9;
    margin: 0;
  }

  /* Component Core Table Core Structure */
  .det-table-wrapper {
    overflow-x: auto;
  }

  .det-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }

  .det-table th {
    padding: 14px 24px;
    color: var(--text-dim);
    font-weight: 600;
    font-size: 13px;
    background-color: rgba(0, 0, 0, 0.15);
    border-bottom: 1px solid var(--border);
  }

  .det-table td {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    font-size: 14px;
    color: var(--text-bright);
  }

  .det-table tbody tr:last-child td {
    border-bottom: none;
  }

  /* Payment Registration Form Styles */
  .det-form-body {
    padding: 24px;
  }

  .det-form-layout {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (max-width: 768px) {
    .det-form-layout {
      grid-template-columns: 1fr;
    }
  }

  .det-input {
    width: 100%;
    background-color: #0f172a;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 11px 14px;
    color: var(--text-bright);
    font-size: 14px;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s ease;
  }

  .det-input:focus {
    border-color: var(--accent-blue);
  }

  .det-btn-action {
    background-color: var(--accent-emerald);
    color: #ffffff;
    border: none;
    border-radius: 6px;
    padding: 11px 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .det-btn-action:hover:not(:disabled) {
    background-color: var(--accent-emerald-hover);
  }

  .det-btn-action:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* Internal Page Loading Fallback UI */
  .det-loading-screen {
    display: flex;
    padding: 48px;
    color: var(--text-dim);
    font-size: 15px;
    justify-content: center;
    font-family: system-ui, sans-serif;
  }
`;

export default function InvoiceDetail() {
  const { type, id } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [payments, setPayments] = useState([]);

  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    reference: "",
    paymentDate: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);

  const fetchInvoice = async () => {
    try {
      const endpoint =
        type === "AR" ? `/ar-invoices/${id}` : `/ap-invoices/${id}`;
      const res = await api.get(endpoint);
      setInvoice(res.data);
    } catch (err) {
      console.error("FAILED TO LOAD INVOICE", err);
    }
  };

  const fetchPayments = async () => {
    try {
      const endpoint =
        type === "AR"
          ? `/ar-payments/invoice/${id}`
          : `/ap-payments/invoice/${id}`;
      const res = await api.get(endpoint);
      setPayments(res.data || []);
    } catch (err) {
      console.error("FAILED TO LOAD PAYMENTS", err);
    }
  };

  useEffect(() => {
    fetchInvoice();
    fetchPayments();
  }, [id, type]);

  const invoiceTotal =
    invoice?.lines?.reduce(
      (sum, l) => sum + Number(l.quantity || 0) * Number(l.unitPrice || 0),
      0
    ) || 0;

  const totalPaid =
    payments.reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;

  const balance = invoiceTotal - totalPaid;

  const handlePaymentChange = (e) => {
    setPaymentForm({
      ...paymentForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (type === "AR") {
        await api.post("/ar-payments", {
          arInvoiceId: invoice.arInvoiceId,
          customerId: invoice.customerId,
          amount: Number(paymentForm.amount),
          paymentDate: paymentForm.paymentDate,
          reference: paymentForm.reference,
        });
      } else {
        await api.post("/ap-payments", {
          apInvoiceId: invoice.apInvoiceId,
          vendorId: invoice.vendorId,
          amount: Number(paymentForm.amount),
          paymentDate: paymentForm.paymentDate,
          reference: paymentForm.reference,
        });
      }

      await fetchPayments();
      await fetchInvoice();

      setPaymentForm({
        amount: "",
        reference: "",
        paymentDate: new Date().toISOString().split("T")[0],
      });

      alert("Payment recorded successfully");
    } catch (err) {
      console.error("FAILED TO CREATE PAYMENT", err);
      alert(err.response?.data || "Failed to create payment");
    } finally {
      setLoading(false);
    }
  };

  if (!invoice) {
    return (
      <Layout>
        <div className="det-loading-screen">Loading system ledger data invoice updates...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="det-root">
        <style>{invoiceDetailStyles}</style>
        <div className="det-container">
          
          {/* TOP PAGE TITLES AND CONTEXT META */}
          <div className="det-header-block">
            <h1 className="det-title">{type} Invoice Details</h1>
            <div className="det-meta-list">
              <p><b>Reference Ident:</b> {invoice.invoiceNumber || invoice.reference || "-"}</p>
              <p><b>Allocation Summary Statement:</b> {invoice.description || "-"}</p>
              <p><b>Lifecycle Registry Status:</b> {String(invoice.status)}</p>
              <p>
                <b>{type === "AR" ? "Associated Account Target" : "Sourcing Account Node"}:</b>{" "}
                {type === "AR" ? invoice.customer?.name : invoice.vendor?.name}
              </p>
            </div>
          </div>

          {/* BALANCE AND INVOICE VALUE KPIS MATRIX */}
          <div className="det-metrics-grid">
            <div className="det-metric-card">
              <p className="det-metric-label">Statement Aggregation Total</p>
              <h2 className="det-metric-value">₱{invoiceTotal.toLocaleString()}</h2>
            </div>

            <div className="det-metric-card">
              <p className="det-metric-label">Processed Settlement Assets</p>
              <h2 className="det-metric-value">₱{totalPaid.toLocaleString()}</h2>
            </div>

            <div className="det-metric-card">
              <p className="det-metric-label">Outstanding Liability Remainder</p>
              <h2 className="det-metric-value">₱{balance.toLocaleString()}</h2>
            </div>
          </div>

          {/* COMPONENT BREAKDOWN LINE ITEMS VIEW */}
          <div className="det-section-card">
            <div className="det-section-header">
              <h2 className="det-section-title">Invoice Sub-ledger Lines</h2>
            </div>
            <div className="det-table-wrapper">
              <table className="det-table">
                <thead>
                  <tr>
                    <th>Item Specification Statement</th>
                    <th style={{ width: "12%" }}>Quantity</th>
                    <th style={{ width: "20%" }}>Unit Pricing Valuation</th>
                    <th style={{ width: "20%" }}>Subtotal Rule Value</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lines?.map((line, i) => (
                    <tr key={i}>
                      <td style={{ color: "var(--text-bright)" }}>{line.description}</td>
                      <td>{line.quantity}</td>
                      <td>₱{Number(line.unitPrice).toLocaleString()}</td>
                      <td style={{ fontWeight: "500" }}>
                        ₱{Number(line.quantity * line.unitPrice).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DYNAMIC RECORD TRANSACTION SUBMISSION PANEL */}
          <div className="det-section-card">
            <div className="det-section-header">
              <h2 className="det-section-title">
                {type === "AR" ? "Register Received Remittance" : "Authorize Vendor Settlement Wire"}
              </h2>
            </div>
            <div className="det-form-body">
              <form onSubmit={handleCreatePayment} className="det-form-layout">
                <input
                  type="number"
                  name="amount"
                  placeholder="Settlement Value (₱)"
                  value={paymentForm.amount}
                  onChange={handlePaymentChange}
                  required
                  max={balance}
                  className="det-input"
                />

                <input
                  type="text"
                  name="reference"
                  placeholder="Transaction Reference Tracking ID"
                  value={paymentForm.reference}
                  onChange={handlePaymentChange}
                  required
                  className="det-input"
                />

                <input
                  type="date"
                  name="paymentDate"
                  value={paymentForm.paymentDate}
                  onChange={handlePaymentChange}
                  required
                  className="det-input"
                />

                <button
                  type="submit"
                  disabled={loading || balance <= 0}
                  className="det-btn-action"
                  style={{ gridColumn: "span 3" }}
                >
                  {loading
                    ? "Processing Ledger Integration..."
                    : type === "AR"
                    ? "Record Payment Entry"
                    : "Post Settlement Transfer"}
                </button>
              </form>
            </div>
          </div>

          {/* SYSTEM RUNTIME TRANSACTION ARCHIVE RECORD */}
          <div className="det-section-card">
            <div className="det-section-header">
              <h2 className="det-section-title">System Audit Log Trace History</h2>
            </div>
            <div className="det-table-wrapper">
              <table className="det-table">
                <thead>
                  <tr>
                    <th>Settlement Calendar Date</th>
                    <th>Audit ID Reference Tracking</th>
                    <th>Transferred Allocation Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ padding: "32px 0", textAlign: "center", color: "var(--text-dim)" }}>
                        No accounting settlement records traced back to this ledger file index.
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment, i) => (
                      <tr key={i}>
                        <td>
                          {payment.paymentDate
                            ? new Date(payment.paymentDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td style={{ fontWeight: "500" }}>{payment.reference}</td>
                        <td style={{ color: "var(--accent-emerald)", fontWeight: "600" }}>
                          ₱{Number(payment.amount).toLocaleString()}
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