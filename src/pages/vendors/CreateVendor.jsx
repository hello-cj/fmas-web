import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import api from "../../api/api";

const vendorFormStyles = `
  .vend-root {
    --bg: #0f172a;
    --surface: #1e293b;
    --border: #334155;
    --text-bright: #f8fafc;
    --text-dim: #94a3b8;
    --accent-emerald: #10b981;
    --accent-emerald-hover: #059669;
    --accent-slate: #475569;
    --accent-slate-hover: #334155;
    
    background-color: var(--bg);
    min-height: 100vh;
    color: var(--text-bright);
    font-family: system-ui, -apple-system, sans-serif;
  }

  .vend-container {
    max-width: 700px;
    margin: 0 auto;
    padding: 32px 24px;
  }

  /* Title Heading Block */
  .vend-header-block {
    margin-bottom: 24px;
  }

  .vend-title {
    font-size: 28px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 6px 0;
  }

  .vend-subtitle {
    font-size: 14px;
    color: var(--text-dim);
    margin: 0;
  }

  /* Context Surface Form Sheet */
  .vend-card-form {
    background-color: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 28px;
  }

  .vend-form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 18px;
    margin-bottom: 28px;
  }

  .vend-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-dim);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .vend-input, .vend-textarea {
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
    font-family: inherit;
  }

  .vend-input:focus, .vend-textarea:focus {
    border-color: var(--accent-emerald);
  }

  .vend-textarea {
    resize: vertical;
  }

  /* Action Control Panel Footer */
  .vend-action-bar {
    display: flex;
    gap: 12px;
  }

  .vend-btn-primary {
    background-color: var(--accent-emerald);
    color: #ffffff;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  .vend-btn-primary:hover {
    background-color: var(--accent-emerald-hover);
  }

  .vend-btn-secondary {
    background-color: var(--accent-slate);
    color: var(--text-bright);
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  .vend-btn-secondary:hover {
    background-color: var(--accent-slate-hover);
  }
`;

export default function CreateVendor() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/vendors", form);
      navigate("/vendors");
    } catch (error) {
      console.error("FAILED TO SAVE VENDOR MATRIX RESOURCE", error);
      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to establish vendor registry file."
      );
    }
  };

  return (
    <Layout>
      <div className="vend-root">
        <style>{vendorFormStyles}</style>
        <div className="vend-container">
          
          {/* CONTEXT ARCHITECTURE HEADER BLOCK */}
          <div className="vend-header-block">
            <h1 className="vend-title">Create Vendor</h1>
            <p className="vend-subtitle">Add a new commercial supplier or service provider registry index</p>
          </div>

          {/* VENDOR DATA FILE METADATA SUBMISSION FIELD */}
          <form onSubmit={handleSubmit} className="vend-card-form">
            <div className="vend-form-grid">
              <div>
                <label className="vend-label">Vendor Entity Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Official legal organization identifier"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="vend-input"
                />
              </div>

              <div>
                <label className="vend-label">Email Communications Hub</label>
                <input
                  type="email"
                  name="email"
                  placeholder="billing@vendorhub.org"
                  value={form.email}
                  onChange={handleChange}
                  className="vend-input"
                />
              </div>

              <div>
                <label className="vend-label">Contact Phone Route</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="+63 (X) XXX XXXX"
                  value={form.phone}
                  onChange={handleChange}
                  className="vend-input"
                />
              </div>

              <div>
                <label className="vend-label">Physical Remittance Hub Address</label>
                <textarea
                  name="address"
                  placeholder="Primary corporate location operations point"
                  value={form.address}
                  onChange={handleChange}
                  rows="4"
                  className="vend-textarea"
                />
              </div>
            </div>

            {/* CONTROL BAR INTERACTION BUTTONS */}
            <div className="vend-action-bar">
              <button type="submit" className="vend-btn-primary">
                Save Vendor Node
              </button>
              
              <button
                type="button"
                onClick={() => navigate("/vendors")}
                className="vend-btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>

        </div>
      </div>
    </Layout>
  );
}