import { useState } from "react";
import api from "../api/api";

export default function JournalEntry() {
  const [date, setDate] = useState("");
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");

  const [lines, setLines] = useState([
    { accountId: "", debit: 0, credit: 0 },
    { accountId: "", debit: 0, credit: 0 }
  ]);

  // Add new line
  const addLine = () => {
    setLines([...lines, { accountId: "", debit: 0, credit: 0 }]);
  };

  // Update line
  const updateLine = (index, field, value) => {
    const updated = [...lines];
    updated[index][field] = value;
    setLines(updated);
  };

  // Remove line
  const removeLine = (index) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  // Submit
  const handleSubmit = async () => {
    try {
      const payload = {
        date,
        reference,
        description,
        lines
      };

      const res = await api.post("/journal-entries", payload);

      alert("Journal Entry Created!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Error creating journal entry");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Journal Entry</h2>

      {/* HEADER */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        placeholder="Reference"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <hr />

      {/* LINES */}
      <h3>Lines</h3>

      {lines.map((line, index) => (
        <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            placeholder="Account ID"
            value={line.accountId}
            onChange={(e) => updateLine(index, "accountId", e.target.value)}
          />

          <input
            type="number"
            placeholder="Debit"
            value={line.debit}
            onChange={(e) => updateLine(index, "debit", parseFloat(e.target.value))}
          />

          <input
            type="number"
            placeholder="Credit"
            value={line.credit}
            onChange={(e) => updateLine(index, "credit", parseFloat(e.target.value))}
          />

          <button onClick={() => removeLine(index)}>X</button>
        </div>
      ))}

      <button onClick={addLine}>+ Add Line</button>

      <hr />

      <button onClick={handleSubmit}>Submit Journal Entry</button>
    </div>
  );
}