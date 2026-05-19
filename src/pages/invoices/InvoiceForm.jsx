import { useState, useEffect } from "react";
import api from "../../api/api";
import Layout from "../../components/layout/Layout";
import { useNavigate } from "react-router-dom";

const invoiceFormStyles = `
  .inv-root {
    --bg: #0f172a;
    --surface: #1e293b;
    --surface-light: #293548;
    --border: #334155;
    --text: #f8fafc;
    --text-muted: #94a3b8;
    --accent-blue: #2563eb;
    --accent-blue-hover: #1d4ed8;
    --rose: #f43f5e;
    
    background-color: var(--bg);
    min-height: 100vh;
    color: var(--text);
    font-family: system-ui, -apple-system, sans-serif;
  }

  .inv-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 32px 24px;
  }

  .inv-title {
    font-size: 28px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 24px 0;
  }

  /* Segmented Type Controller Tabs */
  .inv-tab-group {
    display: flex;
    gap: 8px;
    background: #090d16;
    padding: 4px;
    border-radius: 8px;
    border: 1px solid var(--border);
    margin-bottom: 24px;
    width: max-content;
  }

  .inv-tab-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .inv-tab-btn:hover {
    color: var(--text);
  }

  .inv-tab-btn.active {
    background: var(--surface);
    color: var(--text);
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }

  /* Form Architecture */
  .inv-form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 32px;
  }

  .inv-grid-full {
    grid-column: span 2;
  }

  @media (max-width: 640px) {
    .inv-form-grid {
      grid-template-columns: 1fr;
    }
    .inv-grid-full {
      grid-column: span 1;
    }
  }

  .inv-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .inv-input, .inv-select {
    width: 100%;
    background-color: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px 14px;
    color: var(--text);
    font-size: 14px;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s ease;
  }

  .inv-input:focus, .inv-select:focus {
    border-color: var(--accent-blue);
  }

  /* Section Title Sub-Headings */
  .inv-section-title {
    font-size: 16px;
    font-weight: 600;
    color: #f1f5f9;
    margin: 32px 0 16px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }

  /* Dynamic Line Items Row Matrix */
  .inv-line-row {
    display: grid;
    grid-template-columns: 3fr 1fr 1.5fr auto;
    gap: 12px;
    align-items: center;
    margin-bottom: 12px;
  }

  @media (max-width: 640px) {
    .inv-line-row {
      grid-template-columns: 1fr;
      background: var(--surface);
      padding: 12px;
      border-radius: 6px;
      border: 1px solid var(--border);
    }
  }

  .inv-btn-remove {
    background: rgba(244, 63, 94, 0.1);
    color: var(--rose);
    border: 1px solid rgba(244, 63, 94, 0.2);
    width: 38px;
    height: 38px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
  }

  .inv-btn-remove:hover {
    background: var(--rose);
    color: #ffffff;
    border-color: var(--rose);
  }

  /* Auxiliary Buttons styling */
  .inv-btn-secondary {
    background: transparent;
    border: 1px dashed var(--border);
    color: var(--text-muted);
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    margin-top: 8px;
  }

  .inv-btn-secondary:hover {
    border-color: var(--text-muted);
    color: var(--text);
  }

  /* Financial Footer Total Bar */
  .inv-footer-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 32px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
  }

  .inv-total-text {
    font-size: 20px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0;
  }

  .inv-btn-submit {
    background: var(--accent-blue);
    color: #ffffff;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .inv-btn-submit:hover {
    background: var(--accent-blue-hover);
  }
`;

export default function InvoiceForm() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [type, setType] = useState("AR");

  const [form, setForm] = useState({
    invoiceNumber: "",
    description: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],
    customerId: "",
    vendorId: "",
    lines: [
      {
        description: "",
        quantity: 1,
        unitPrice: 0,
      },
    ],
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/customers");
        setCustomers(res.data);
      } catch (err) {
        console.error("Failed to load customers:", err.response?.data || err);
      }
    };

    const fetchVendors = async () => {
      try {
        const res = await api.get("/vendors");
        setVendors(res.data);
      } catch (err) {
        console.error("Failed to load vendors:", err.response?.data || err);
      }
    };

    fetchCustomers();
    fetchVendors();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLineChange = (index, field, value) => {
    const updated = [...form.lines];
    updated[index][field] = value;
    setForm({
      ...form,
      lines: updated,
    });
  };

  const addLine = () => {
    setForm({
      ...form,
      lines: [
        ...form.lines,
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    });
  };

  const removeLine = (index) => {
    const updated = form.lines.filter((_, i) => i !== index);
    setForm({
      ...form,
      lines: updated,
    });
  };

  const total = form.lines.reduce(
    (sum, l) => sum + Number(l.quantity || 0) * Number(l.unitPrice || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (type === "AR") {
        const payload = {
          customerId: form.customerId,
          invoiceNumber: form.invoiceNumber || "",
          invoiceDate: form.invoiceDate,
          dueDate: form.dueDate,
          description: form.description,
          lines: form.lines.map((l) => ({
            description: l.description,
            quantity: Number(l.quantity),
            unitPrice: Number(l.unitPrice),
          })),
        };

        console.log("AR PAYLOAD:", payload);
        await api.post("/ar-invoices", payload);
      } else {
        const payload = {
          vendorId: form.vendorId,
          date: form.invoiceDate,
          reference: form.invoiceNumber || "",
          description: form.description,
          lines: form.lines.map((l) => ({
            description: l.description,
            quantity: Number(l.quantity),
            unitPrice: Number(l.unitPrice),
          })),
        };

        console.log("AP PAYLOAD:", payload);
        await api.post("/ap-invoices", payload);
      }

      navigate("/invoices");
    } catch (err) {
      console.error("FAILED TO CREATE INVOICE:", err);
      alert(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to create invoice"
      );
    }
  };

  return (
    <Layout>
      <div className="inv-root">
        <style>{invoiceFormStyles}</style>
        <div className="inv-container">
          <h1 className="inv-title">Create Invoice</h1>

          {/* BALANCED STRUCTURAL TYPE CONTROLLER SWITCH */}
          <div className="inv-tab-group">
            <button
              type="button"
              className={`inv-tab-btn ${type === "AR" ? "active" : ""}`}
              onClick={() => {
                setType("AR");
                setForm((prev) => ({ ...prev, vendorId: "" }));
              }}
            >
              Accounts Receivable
            </button>
            <button
              type="button"
              className={`inv-tab-btn ${type === "AP" ? "active" : ""}`}
              onClick={() => {
                setType("AP");
                setForm((prev) => ({ ...prev, customerId: "" }));
              }}
            >
              Accounts Payable
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* META ENTRY FIELDS MATRIX HEADER */}
            <div className="inv-form-grid">
              <div>
                <label className="inv-label">Invoice Reference Code</label>
                <input
                  className="inv-input"
                  name="invoiceNumber"
                  placeholder="Invoice Number (optional)"
                  value={form.invoiceNumber}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="inv-label">
                  {type === "AR" ? "Target Client Entity" : "Origin Vendor Node"}
                </label>
                {type === "AR" ? (
                  <select
                    name="customerId"
                    value={form.customerId}
                    onChange={handleChange}
                    required
                    className="inv-select"
                  >
                    <option value="">Select Customer</option>
                    {customers.map((c) => (
                      <option key={c.customerId} value={c.customerId}>
                        {c.name} ({c.email})
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    name="vendorId"
                    value={form.vendorId}
                    onChange={handleChange}
                    required
                    className="inv-select"
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map((v) => (
                      <option key={v.vendorId} value={v.vendorId}>
                        {v.name} ({v.email})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="inv-grid-full">
                <label className="inv-label">Allocation Context Summary</label>
                <input
                  className="inv-input"
                  name="description"
                  placeholder="General statement purpose details"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="inv-label">Issue Generation Date</label>
                <input
                  className="inv-input"
                  type="date"
                  name="invoiceDate"
                  value={form.invoiceDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="inv-label">Maturity Settlement Target</label>
                <input
                  className="inv-input"
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* DYNAMIC SUB-LEDGER TRACK ITEMS */}
            <h3 className="inv-section-title">Invoice Lines</h3>

            {form.lines.map((line, index) => (
              <div key={index} className="inv-line-row">
                <div>
                  <label className="inv-label" style={{ display: index > 0 ? "none" : "block" }}>Line Item Description</label>
                  <input
                    className="inv-input"
                    placeholder="Item details description statement"
                    value={line.description}
                    onChange={(e) => handleLineChange(index, "description", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="inv-label" style={{ display: index > 0 ? "none" : "block" }}>Quantity</label>
                  <input
                    className="inv-input"
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={line.quantity}
                    onChange={(e) => handleLineChange(index, "quantity", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="inv-label" style={{ display: index > 0 ? "none" : "block" }}>Unit Valuation</label>
                  <input
                    className="inv-input"
                    type="number"
                    step="0.01"
                    placeholder="Unit Price (₱)"
                    value={line.unitPrice}
                    onChange={(e) => handleLineChange(index, "unitPrice", e.target.value)}
                    required
                  />
                </div>

                <div>
                  {index > 0 && (
                    <button
                      type="button"
                      className="inv-btn-remove"
                      onClick={() => removeLine(index)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button type="button" className="inv-btn-secondary" onClick={addLine}>
              + Add Line Item Rule
            </button>

            {/* BALANCED SUMMARY ACTION TRACE FOOTER */}
            <div className="inv-footer-summary">
              <h3 className="inv-total-text">
                Total Matrix Value: <span style={{ color: "var(--text)" }}>₱{total.toLocaleString()}</span>
              </h3>

              <button type="submit" className="inv-btn-submit">
                Commit & Save Ledger Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}