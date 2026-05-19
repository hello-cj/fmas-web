import { useEffect, useState } from "react";
import api from "../api/api";
import "../App.css";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const dashboardStyles = `
  .dash-root {
    --bg: #0f172a;
    --surface: #1e293b;
    --border: #334155;
    --text-bright: #f8fafc;
    --text-dim: #94a3b8;
    --accent-blue: #2563eb;
    --accent-blue-hover: #1d4ed8;
    --emerald: #34d399;
    --rose: #f87171;
    
    background-color: var(--bg);
    min-height: 100vh;
    color: var(--text-bright);
    font-family: system-ui, -apple-system, sans-serif;
  }

  .dash-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px;
  }

  /* Header Section */
  .dash-header {
    margin-bottom: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .dash-title {
    font-size: 28px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 4px 0;
  }

  .dash-subtitle {
    color: var(--text-dim);
    margin: 0;
    font-size: 14px;
  }

  .dash-btn-create {
    background-color: var(--accent-blue);
    color: #ffffff;
    border: none;
    padding: 10px 18px;
    border-radius: 6px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background 0.2s ease;
  }

  .dash-btn-create:hover {
    background-color: var(--accent-blue-hover);
  }

  /* Grid Metrics System */
  .dash-metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  .dash-card {
    background-color: var(--surface);
    padding: 24px;
    border-radius: 12px;
    border: 1px solid var(--border);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .dash-card h4 {
    margin: 0 0 8px 0;
    color: var(--text-dim);
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .dash-card h2 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: var(--text-bright);
  }

  /* Layout Distribution Grid */
  .dash-content-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .dash-section-card {
    background-color: var(--surface);
    padding: 24px;
    border-radius: 12px;
    border: 1px solid var(--border);
  }

  .dash-section-card h2 {
    margin: 0 0 20px 0;
    font-size: 18px;
    font-weight: 600;
    color: #f1f5f9;
  }

  /* Structural Table Core Styles */
  .dash-table-wrapper {
    overflow-x: auto;
  }

  .dash-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }

  .dash-table th {
    padding: 12px 8px;
    color: var(--text-dim);
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    border-bottom: 2px solid var(--border);
  }

  .dash-table td {
    padding: 14px 8px;
    border-bottom: 1px solid var(--border);
    font-size: 14px;
    vertical-align: middle;
  }

  .dash-table tbody tr:last-child td {
    border-bottom: none;
  }

  .dash-table tr:hover td {
    background: rgba(255, 255, 255, 0.01);
  }

  /* Internal Loading Engine Spinner */
  .dash-loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
    flex-direction: column;
    gap: 16px;
    background-color: #0f172a;
  }

  .dash-spinner {
    border: 4px solid #1e293b;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: dash-spin 1s linear infinite;
  }

  @keyframes dash-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, recentRes] = await Promise.all([
          api.get("/dashboard/summary"),
          api.get("/dashboard/recent-journal-entries?take=5"),
        ]);

        setSummary(summaryRes.data);
        setRecent(recentRes.data || []);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <style>{dashboardStyles}</style>
        <div className="dash-loader-container">
          <div className="dash-spinner"></div>
          <h3 style={{ color: "#94a3b8", fontWeight: "500", margin: 0 }}>Loading Dashboard...</h3>
        </div>
      </Layout>
    );
  }

  const totalDebit = Number(summary?.totalDebit || 0);
  const totalCredit = Number(summary?.totalCredit || 0);
  const netIncome = totalCredit - totalDebit;

  const chartData = [
    { name: "Debit", amount: totalDebit, fill: "#f87171" },
    { name: "Credit", amount: totalCredit, fill: "#34d399" },
  ];

  return (
    <Layout>
      <div className="dash-root">
        <style>{dashboardStyles}</style>
        <div className="dash-container">

          {/* HEADER SECTION CONTAINER */}
          <div className="dash-header">
            <div>
              <h1 className="dash-title">Admin Dashboard</h1>
              <p className="dash-subtitle">Financial overview and activity tracking</p>
            </div>
            <button 
              className="dash-btn-create"
              onClick={() => navigate("/journal-entry")}
            >
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>+</span> New Entry
            </button>
          </div>

          {/* METRIC KPIS MATRIX GRID */}
          <div className="dash-metrics-grid">
            <div className="dash-card">
              <h4>Journal Entries</h4>
              <h2>{summary?.totalJournalEntries || 0}</h2>
            </div>

            <div className="dash-card">
              <h4>Total Debit</h4>
              <h2>₱{totalDebit.toLocaleString()}</h2>
            </div>

            <div className="dash-card">
              <h4>Total Credit</h4>
              <h2>₱{totalCredit.toLocaleString()}</h2>
            </div>

            <div className="dash-card">
              <h4>Net Income</h4>
              <h2 style={{ color: netIncome >= 0 ? "var(--emerald)" : "var(--rose)" }}>
                {netIncome < 0 ? "- " : ""}₱{Math.abs(netIncome).toLocaleString()}
              </h2>
            </div>
          </div>

          {/* CHARTS AND LIST LAYOUT VIEWPORT CONTAINER */}
          <div className="dash-content-layout">
            
            {/* FINANCIAL POSITION BALANCE CHART */}
            <div className="dash-section-card">
              <h2>Financial Position</h2>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₱${v.toLocaleString()}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", color: "#f8fafc" }}
                      itemStyle={{ color: "#f8fafc" }}
                      formatter={(value) => [`₱${value.toLocaleString()}`, "Amount"]} 
                      cursor={{ fill: "#334155", opacity: 0.4 }} 
                    />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RECENT SUB-LEDGER TRANSACTION LOGS */}
            <div className="dash-section-card">
              <h2>Recent Journal Entries</h2>
              <div className="dash-table-wrapper">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th style={{ width: "15%" }}>Date</th>
                      <th style={{ width: "20%" }}>Reference</th>
                      <th style={{ width: "35%" }}>Description</th>
                      <th style={{ width: "15%", textAlign: "right" }}>Debit</th>
                      <th style={{ width: "15%", textAlign: "right" }}>Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: "32px 0", textAlign: "center", color: "#64748b" }}>
                          No recent entries found.
                        </td>
                      </tr>
                    ) : (
                      recent.map((item) => (
                        <tr key={item.journalEntryId}>
                          <td style={{ color: "var(--text-bright)" }}>{item.date?.split("T")[0]}</td>
                          <td style={{ color: "var(--text-bright)", fontWeight: "500" }}>{item.reference}</td>
                          <td style={{ color: "var(--text-dim)" }}>{item.description}</td>
                          <td style={{ color: "var(--emerald)", textAlign: "right", fontWeight: "500" }}>
                            ₱{Number(item.totalDebit || 0).toLocaleString()}
                          </td>
                          <td style={{ color: "var(--emerald)", textAlign: "right", fontWeight: "500" }}>
                            ₱{Number(item.totalCredit || 0).toLocaleString()}
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
      </div>
    </Layout>
  );
}