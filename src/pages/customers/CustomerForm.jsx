import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import api from "../../api/api";

const customerFormStyles = `
  .cust-root {
    --bg: #0f172a;
    --surface: #1e293b;
    --border: #334155;
    --text-bright: #f8fafc;
    --text-dim: #94a3b8;
    --accent-blue: #2563eb;
    --accent-blue-hover: #1d4ed8;
    
    background-color: var(--bg);
    min-height: 100vh;
    color: var(--text-bright);
    font-family: system-ui, -apple-system, sans-serif;
  }

  .cust-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 32px 24px;
  }

  .cust-title {
    font-size: 28px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 24px 0;
  }

  /* Form Layout Matrix */
  .cust-form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  .cust-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-dim);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .cust-input, .cust-textarea {
    width: 100%;
    background-color: var(--surface);
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

  .cust-input:focus, .cust-textarea:focus {
    border-color: var(--accent-blue);
  }

  .cust-textarea {
    resize: vertical;
  }

  /* Submission Action Button */
  .cust-btn-submit {
    background-color: var(--accent-blue);
    color: #ffffff;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s ease;
    width: 100%;
    margin-top: 8px;
  }

  .cust-btn-submit:hover {
    background-color: var(--accent-blue-hover);
  }
`;

export default function CustomerForm() {
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
      await api.post("/customers", form);
      navigate("/customers");
    } catch (err) {
      console.error(err);
      alert("Failed to create customer");
    }
  };

  return (
    <Layout>
      <div className="cust-root">
        <style>{customerFormStyles}</style>
        <div className="cust-container">
          <h1 className="cust-title">Create Customer</h1>

          <form onSubmit={handleSubmit}>
            <div className="cust-form-grid">
              <div>
                <label className="cust-label">Customer Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Legal or trading entity name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="cust-input"
                />
              </div>

              <div>
                <label className="cust-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={handleChange}
                  className="cust-input"
                />
              </div>

              <div>
                <label className="cust-label">Phone Connection Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="+63 (X) XXX XXXX"
                  value={form.phone}
                  onChange={handleChange}
                  className="cust-input"
                />
              </div>

              <div>
                <label className="cust-label">Physical Billing Address</label>
                <textarea
                  name="address"
                  placeholder="Registered HQ or delivery hub location details"
                  value={form.address}
                  onChange={handleChange}
                  rows={4}
                  className="cust-textarea"
                />
              </div>

              <button type="submit" className="cust-btn-submit">
                Commit & Save Customer Node
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}