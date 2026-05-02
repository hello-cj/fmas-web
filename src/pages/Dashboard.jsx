import { useEffect, useState } from "react";
import api from "../api/api";
import "../App.css";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, recentRes] = await Promise.all([
          api.get("/dashboard/summary"),
          api.get("/dashboard/recent-journal-entries?take=5"),
        ]);

        setSummary(summaryRes.data);
        setRecent(recentRes.data);
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
      <div className="dashboard-container">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {/* SUMMARY CARDS */}
      <div className="card-grid">

        <div className="card">
          <h3>Journal Entries</h3>
          <p>{summary?.totalJournalEntries}</p>
        </div>

        <div className="card">
          <h3>Total Debit</h3>
          <p>{summary?.totalDebit}</p>
        </div>

        <div className="card">
          <h3>Total Credit</h3>
          <p>{summary?.totalCredit}</p>
        </div>

        <div className="card">
          <h3>Users</h3>
          <p>{summary?.totalUsers}</p>
        </div>

      </div>

      {/* RECENT TABLE */}
      <div className="table-container">
        <h2>Recent Journal Entries</h2>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Reference</th>
              <th>Description</th>
              <th>Debit</th>
              <th>Credit</th>
            </tr>
          </thead>

          <tbody>
            {recent.map((item) => (
              <tr key={item.journalEntryId}>
                <td>{item.date?.split("T")[0]}</td>
                <td>{item.reference}</td>
                <td>{item.description}</td>
                <td>{item.totalDebit}</td>
                <td>{item.totalCredit}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}