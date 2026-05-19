import { useEffect, useState } from "react";
import api from "../api/api";
import Layout from "../components/layout/Layout";

export default function JournalEntryList() {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const [filterStatus, setFilterStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

// FETCH ENTRIES
const fetchEntries = async () => {
  try {
    const res = await api.get("/journal-entries");
    setEntries(res.data || []);
  } catch (err) {
    console.error("Failed to load entries", err);
  }
};

useEffect(() => {
  fetchEntries();
}, []);
  // ─────────────────────────────
  // POST ENTRY
  // ─────────────────────────────
  const postEntry = async (id) => {
    try {
      await api.post(`/journal-entries/${id}/post`);
      fetchEntries();
    } catch (err) {
      alert(err.response?.data || "Error posting entry");
    }
  };

  // ─────────────────────────────
  // LOCK ENTRY
  // ─────────────────────────────
  const lockEntry = async (id) => {
    try {
      await api.post(`/journal-entries/${id}/lock`);
      fetchEntries();
    } catch (err) {
      alert(err.response?.data || "Error locking entry");
    }
  };

// ─────────────────────────────
// VIEW ENTRY DETAILS
// ─────────────────────────────
// VIEW ENTRY DETAILS
const viewEntry = async (id) => {
  try {
    const res = await api.get(`/journal-entries/${id}`);
    setSelectedEntry(res.data);
  } catch (err) {
    console.error(err);
    alert("Failed to load journal entry details");
  }
};

  // ─────────────────────────────
  // FILTERED DATA
  // ─────────────────────────────
  const filtered = entries.filter((e) => {
    const matchStatus = filterStatus ? e.status === filterStatus : true;
    const matchFrom = fromDate ? new Date(e.date) >= new Date(fromDate) : true;
    const matchTo = toDate ? new Date(e.date) <= new Date(toDate) : true;

    return matchStatus && matchFrom && matchTo;
  });

  // ─────────────────────────────
  // STATUS BADGE
  // ─────────────────────────────
  const getStatusBadge = (status) => {
    const base = {
      padding: "4px 8px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "bold",
    };

    if (status === "Draft")
      return <span style={{ ...base, background: "#444", color: "#fff" }}>Draft</span>;

    if (status === "Posted")
      return <span style={{ ...base, background: "orange", color: "#000" }}>Posted</span>;

    if (status === "Locked")
      return <span style={{ ...base, background: "green", color: "#fff" }}>Locked</span>;
  };

  return (
    <Layout>
      <div className="page-container">

        <h1 className="page-title">Journal Entries</h1>

        {/* ───────────────── FILTERS ───────────────── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Posted">Posted</option>
            <option value="Locked">Locked</option>
          </select>

          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>

        {/* ───────────────── TABLE ───────────────── */}
        <div className="table-container">

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Reference</th>
                <th>Description</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id}>

                  <td>{new Date(entry.date).toLocaleDateString()}</td>
                  <td>{entry.reference}</td>
                  <td>{entry.description}</td>
                  <td>{entry.totalDebit}</td>
                  <td>{entry.totalCredit}</td>

                  <td>{getStatusBadge(entry.status)}</td>

                  <td style={{ display: "flex", gap: 5 }}>

                    <button onClick={() => viewEntry(entry.id)}>
                      View
                    </button>

                    {entry.status === "Draft" && (
                      <button onClick={() => postEntry(entry.id)}>
                        Post
                      </button>
                    )}

                    {entry.status === "Posted" && (
                      <button onClick={() => lockEntry(entry.id)}>
                        Lock
                      </button>
                    )}

                    

                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ───────────────── MODAL ───────────────── */}
        {selectedEntry && (
          <div className="modal-overlay" onClick={() => setSelectedEntry(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>

              <h2>Journal Entry Details</h2>

              <p><b>Reference:</b> {selectedEntry.reference}</p>
              <p><b>Description:</b> {selectedEntry.description}</p>

              <table>
                <thead>
                  <tr>
                    <th>Account</th>
                    <th>Debit</th>
                    <th>Credit</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedEntry.lines?.map((line, i) => (
                    <tr key={i}>
                      <td>{line.accountName}</td>
                      <td>{line.debit}</td>
                      <td>{line.credit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button onClick={() => setSelectedEntry(null)}>
                Close
              </button>

            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}