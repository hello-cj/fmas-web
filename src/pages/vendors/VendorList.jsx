import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import api from "../../api/api";

const styles = `
  .vnd-root {
    --bg: #0f172a;
    --surface: #1e293b;
    --surface-light: #293548;
    --border: #334155;
    --text: #f8fafc;
    --text-muted: #94a3b8;
    --accent-blue: #3b82f6;
    --rose: #f43f5e;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .vnd-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
    color: var(--text);
  }

  .vnd-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
  }

  .vnd-title {
    font-size: 26px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 6px 0;
  }

  .vnd-subtitle {
    color: var(--text-muted);
    font-size: 14px;
    margin: 0;
  }

  .vnd-btn-add {
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

  .vnd-btn-add:hover {
    background: #2563eb;
  }

  /* Core Presentation Panel */
  .vnd-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .vnd-table-wrapper {
    overflow-x: auto;
  }

  .vnd-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;
  }

  .vnd-table th {
    background: rgba(255, 255, 255, 0.02);
    padding: 14px 18px;
    font-weight: 600;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.05em;
  }

  .vnd-table td {
    padding: 14px 18px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
    color: #e2e8f0;
  }

  .vnd-table tbody tr:last-child td {
    border-bottom: none;
  }

  .vnd-table tr:hover td {
    background: rgba(255, 255, 255, 0.01);
  }

  .vnd-name-cell {
    font-weight: 600;
    color: #ffffff !important;
  }

  .vnd-text-mono {
    font-family: monospace;
    font-size: 13px;
  }

  /* Deletion Triggers */
  .vnd-btn-delete {
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

  .vnd-btn-delete:hover {
    background: var(--rose);
    color: #ffffff;
    border-color: var(--rose);
  }

  /* Async Loader State Layouts */
  .vnd-loading-block {
    padding: 60px;
    text-align: center;
    color: var(--text-muted);
  }

  .vnd-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(255,255,255,0.1);
    border-radius: 50%;
    border-top-color: var(--accent-blue);
    animation: vnd-spin 0.8s linear infinite;
    margin: 0 auto 12px auto;
  }

  @keyframes vnd-spin {
    to { transform: rotate(360deg); }
  }
`;

export default function VendorList() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const response = await api.get("/vendors");
      setVendors(response.data || []);
    } catch (error) {
      console.error("Failed to compile operational vendor directories", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteVendor = async (id) => {
    if (!window.confirm("Delete this vendor record? This action unlinks profile mappings from your accounts payable history.")) return;

    try {
      await api.delete(`/vendors/${id}`);
      loadVendors();
    } catch (error) {
      console.error("Failed executing entity deletion record drop", error);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "—" : date.toLocaleDateString(undefined, {
      year: "numeric", month: "short", day: "numeric"
    });
  };

  return (
    <Layout>
      <style>{styles}</style>
      <div className="vnd-root">
        <div className="vnd-container">
          
          {/* CONTROL SECTION ROW */}
          <div className="vnd-header-row">
            <div>
              <h1 className="vnd-title">Vendors & Suppliers</h1>
              <p className="vnd-subtitle">Accounts Payable directory tracking raw resource providers and vendor metrics</p>
            </div>

            <button
              onClick={() => navigate("/vendors/create")}
              className="vnd-btn-add"
            >
              + Register New Vendor
            </button>
          </div>

          {/* VENDOR MATRIX CARD BASEMENT */}
          <div className="vnd-card">
            <div className="vnd-table-wrapper">
              <table className="vnd-table">
                <thead>
                  <tr>
                    <th style={{ width: "22%" }}>Corporate / Supplier Name</th>
                    <th style={{ width: "22%" }}>Primary Email Address</th>
                    <th style={{ width: "14%" }}>Phone Connection</th>
                    <th style={{ width: "20%" }}>Fulfillment Warehouse Address</th>
                    <th style={{ width: "12%" }}>Record Opened</th>
                    <th style={{ width: "10%", textAlign: "center" }}>Actions Scope</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6">
                        <div className="vnd-loading-block">
                          <div className="vnd-spinner"></div>
                          <span>Accessing encrypted accounts payable registry files...</span>
                        </div>
                      </td>
                    </tr>
                  ) : vendors.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>
                        No records parsed inside the operational vendor registry core.
                      </td>
                    </tr>
                  ) : (
                    vendors.map((vendor) => (
                      <tr key={vendor.vendorId}>
                        <td className="vnd-name-cell">
                          {vendor.name || "Unnamed Supplier"}
                        </td>
                        
                        <td className="vnd-text-mono">
                          {vendor.email || "—"}
                        </td>
                        
                        <td className="vnd-text-mono">
                          {vendor.phone || "—"}
                        </td>
                        
                        <td style={{ fontSize: "13px" }}>
                          {vendor.address || "No designated logistics address"}
                        </td>
                        
                        <td className="vnd-text-mono" style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                          {formatDate(vendor.createdAt)}
                        </td>
                        
                        <td style={{ textAlign: "center" }}>
                          <button
                            onClick={() => deleteVendor(vendor.vendorId)}
                            className="vnd-btn-delete"
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