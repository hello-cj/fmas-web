import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import api from "../../api/api";

const styles = `
  .crm-root {
    --bg: #0f172a;
    --surface: #1e293b;
    --surface-light: #293548;
    --border: #334155;
    --text: #f8fafc;
    --text-muted: #94a3b8;
    --accent-blue: #3b82f6;
    --rose: #f43f5e;
    --rose-hover: #e11d48;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .crm-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
    color: var(--text);
  }

  .crm-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
  }

  .crm-title {
    font-size: 26px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 6px 0;
  }

  .crm-subtitle {
    color: var(--text-muted);
    font-size: 14px;
    margin: 0;
  }

  .crm-btn-add {
    background: var(--accent-blue);
    color: #ffffff;
    font-weight: 600;
    font-size: 14px;
    padding: 10px 18px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
  }

  .crm-btn-add:hover {
    background: #2563eb;
  }

  /* Core Directory Presentation Card */
  .crm-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .crm-table-wrapper {
    overflow-x: auto;
  }

  .crm-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;
  }

  .crm-table th {
    background: rgba(255, 255, 255, 0.02);
    padding: 14px 18px;
    font-weight: 600;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.05em;
  }

  .crm-table td {
    padding: 14px 18px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
    color: #e2e8f0;
  }

  .crm-table tbody tr:last-child td {
    border-bottom: none;
  }

  .crm-table tr:hover td {
    background: rgba(255, 255, 255, 0.01);
  }

  .crm-name-cell {
    font-weight: 600;
    color: #ffffff !important;
  }

  .crm-text-mono {
    font-family: monospace;
    font-size: 13px;
  }

  /* Danger Metric Trigger Button Styles */
  .crm-btn-delete {
    background: rgba(244, 63, 94, 0.08);
    color: var(--rose);
    border: 1px solid rgba(244, 63, 94, 0.2);
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .crm-btn-delete:hover {
    background: var(--rose);
    color: #ffffff;
    border-color: var(--rose);
  }

  /* Async Loader Layouts */
  .crm-loading-block {
    padding: 60px;
    text-align: center;
    color: var(--text-muted);
  }

  .crm-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(255,255,255,0.1);
    border-radius: 50%;
    border-top-color: var(--accent-blue);
    animation: crm-spin 0.8s linear infinite;
    margin: 0 auto 12px auto;
  }

  @keyframes crm-spin {
    to { transform: rotate(360deg); }
  }
`;

export default function CustomerList() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/customers");
      setCustomers(res.data || []);
    } catch (err) {
      console.error("Failed to parse accounts directory database metadata", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to terminate this customer profile card? This action permanently disconnects associated legacy transaction traces."
    );
    
    if (!confirmation) return;

    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      console.error("Failed executing customer record drop", err);
    }
  };

  return (
    <Layout>
      <style>{styles}</style>
      <div className="crm-root">
        <div className="crm-container">
          
          {/* HEADER DASHBOARD ROW CONTROLS */}
          <div className="crm-header-row">
            <div>
              <h1 className="crm-title">Customers</h1>
              <p className="crm-subtitle">Global Accounts Receivable profile records directory mapping client system nodes</p>
            </div>

            <button 
              onClick={() => navigate("/customers/new")}
              className="crm-btn-add"
            >
              + Register New Customer
            </button>
          </div>

          {/* CRM ACCOUNTS TABLE CARD BASEMENT */}
          <div className="crm-card">
            <div className="crm-table-wrapper">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th style={{ width: "25%" }}>Corporate / Customer Entity</th>
                    <th style={{ width: "25%" }}>Primary Email Address</th>
                    <th style={{ width: "15%" }}>Phone Number</th>
                    <th style={{ width: "23%" }}>Billing/Mailing Address Location</th>
                    <th style={{ width: "12%", textAlign: "center" }}>Actions Scope</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5">
                        <div className="crm-loading-block">
                          <div className="crm-spinner"></div>
                          <span>Querying customer relations tracking data matrices...</span>
                        </div>
                      </td>
                    </tr>
                  ) : customers.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>
                        No records parsed inside the global customer registry core.
                      </td>
                    </tr>
                  ) : (
                    customers.map((customer) => (
                      <tr key={customer.customerId}>
                        <td className="crm-name-cell">
                          {customer.name || "Unnamed Entity"}
                        </td>
                        
                        <td className="crm-text-mono">
                          {customer.email || "—"}
                        </td>
                        
                        <td className="crm-text-mono">
                          {customer.phone || "—"}
                        </td>
                        
                        <td style={{ fontSize: "13px" }}>
                          {customer.address || "No designated billing address"}
                        </td>
                        
                        <td style={{ textAlign: "center" }}>
                          <button
                            onClick={() => handleDelete(customer.customerId)}
                            className="crm-btn-delete"
                          >
                            Delete
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