import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import Layout from "../../components/layout/Layout";

export default function BudgetDetails() {
  const { id } = useParams();

  const [budget, setBudget] = useState(null);
  const [report, setReport] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH BUDGET (DEBUG ENABLED)
  // =========================
  const fetchBudget = async () => {
    try {
      console.log("📡 Fetching budget:", id);

      const res = await api.get(`/budgets/${id}`);

      console.log("✅ Budget response:", res.data);

      setBudget(res.data);
    } catch (err) {
      console.error("❌ Budget fetch failed:");
      console.error(err?.response?.data || err.message);
    }
  };

  // =========================
  // FETCH VS ACTUAL (DEBUG ENABLED)
  // =========================
  const fetchReport = async (accountId = "") => {
    try {
      console.log("📡 Fetching vs-actual report...");
      console.log("Budget ID:", id);
      console.log("Account filter:", accountId);

      const params = {};

      if (accountId) {
        params.accountId = accountId;
      }

      console.log("Query params:", params);

      const res = await api.get(
        `/budgets/vs-actual/${id}`,
        { params }
      );

      console.log("✅ Report response:", res.data);

      setReport(res.data || []);
    } catch (err) {
      console.error("❌ Report fetch failed:");
      console.error("Status:", err?.response?.status);
      console.error("Data:", err?.response?.data);
      console.error("Message:", err.message);
    }
  };

  // =========================
  // LOAD
  // =========================
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      await fetchBudget();
      await fetchReport();

      setLoading(false);
    };

    load();
  }, [id]);

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <Layout>
        <div className="p-6 text-white">
          Loading Budget Details...
        </div>
      </Layout>
    );
  }

  // =========================
  // EMPTY STATE SAFETY
  // =========================
  if (!budget) {
    return (
      <Layout>
        <div className="p-6 text-red-400">
          Budget not found or failed to load.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 text-white">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-2">
          {budget.name}
        </h1>

        <p className="text-gray-400 mb-6">
          {budget.startDate?.split("T")[0]} → {budget.endDate?.split("T")[0]}
        </p>

        {/* ACCOUNT FILTER */}
        <div className="mb-4">
          <select
            value={selectedAccount}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedAccount(value);
              fetchReport(value);
            }}
            className="bg-[#1e1e1e] p-2 border border-gray-700"
          >
            <option value="">All Accounts</option>

            {budget?.lines?.map((l) => (
              <option key={l.accountId} value={l.accountId}>
                {l.accountId}
              </option>
            ))}
          </select>
        </div>

        {/* DEBUG INFO PANEL */}
        <div className="mb-4 text-xs text-gray-500">
          <p>Budget ID: {id}</p>
          <p>Report Count: {report.length}</p>
        </div>

        {/* TABLE */}
        <div className="bg-[#1e1e1e] border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#151515] text-gray-400">
              <tr>
                <th className="p-3 text-left">Account</th>
                <th className="p-3 text-left">Budget</th>
                <th className="p-3 text-left">Actual</th>
                <th className="p-3 text-left">Variance</th>
              </tr>
            </thead>

            <tbody>
              {(report || []).length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-4 text-center text-gray-500"
                  >
                    No budget vs actual data found
                  </td>
                </tr>
              ) : (
                report.map((r, i) => (
                  <tr key={i} className="border-t border-gray-800">
                    <td className="p-3 font-semibold">
                        {r.accountName || "Unknown Account"}
                    </td>

                    <td className="p-3">
                      ₱{Number(r.budget || 0).toLocaleString()}
                    </td>

                    <td className="p-3">
                      ₱{Number(r.actual || 0).toLocaleString()}
                    </td>

                    <td
                      className="p-3 font-bold"
                      style={{
                        color: r.variance < 0 ? "red" : "green",
                      }}
                    >
                      ₱{Number(r.variance || 0).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </Layout>
  );
}