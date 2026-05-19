import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import api from "../../api/api";

export default function OrganizationManagement() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    organizationName: "",
    adminEmail: "",
    adminPassword: "",
  });

  useEffect(() => {
    loadOrganizations();
  }, []);

  // ================= LOAD ORGANIZATIONS =================
  const loadOrganizations = async () => {
    try {
      setLoading(true);

      const res = await api.get("/superadmin/organizations");

      setOrganizations(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load organizations.");
    } finally {
      setLoading(false);
    }
  };

  // ================= CREATE ORGANIZATION =================
  const createOrganization = async (e) => {
    e.preventDefault();

    try {
      await api.post("/superadmin/organizations", {
        organizationName: form.organizationName,
        adminEmail: form.adminEmail,
        adminPassword: form.adminPassword,
      });

      setForm({
        organizationName: "",
        adminEmail: "",
        adminPassword: "",
      });

      await loadOrganizations();

      alert("Organization created successfully.");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Failed to create organization."
      );
    }
  };

  // ================= RESET PASSWORD =================
  const resetPassword = async (organization) => {
    const newPassword = prompt(
      `Enter new password for ${organization.name}`
    );

    if (!newPassword) return;

    try {
      await api.put(
        `/superadmin/organizations/${organization.organizationId}/reset-password`,
        {
          newPassword,
        }
      );

      alert("Admin password reset successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to reset password.");
    }
  };

  // ================= TOGGLE STATUS =================
  const toggleStatus = async (organizationId) => {
    try {
      await api.put(
        `/superadmin/organizations/${organizationId}/toggle-status`
      );

      await loadOrganizations();
    } catch (err) {
      console.error(err);
      alert("Failed to update organization status.");
    }
  };

  return (
    <Layout>
      <div style={styles.page}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>Manage Organizations</h1>

            <p style={styles.subtitle}>
              Platform-level SaaS organization management.
            </p>
          </div>
        </div>

        {/* ================= CREATE ================= */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Create Organization</h2>

          <form onSubmit={createOrganization} style={styles.form}>
            <input
              type="text"
              placeholder="Organization Name"
              value={form.organizationName}
              onChange={(e) =>
                setForm({
                  ...form,
                  organizationName: e.target.value,
                })
              }
              style={styles.input}
              required
            />

            <input
              type="email"
              placeholder="Admin Email"
              value={form.adminEmail}
              onChange={(e) =>
                setForm({
                  ...form,
                  adminEmail: e.target.value,
                })
              }
              style={styles.input}
              required
            />

            <input
              type="password"
              placeholder="Admin Password"
              value={form.adminPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  adminPassword: e.target.value,
                })
              }
              style={styles.input}
              required
            />

            <button type="submit" style={styles.createButton}>
              Create Organization
            </button>
          </form>
        </div>

        {/* ================= ORGANIZATION LIST ================= */}
        <div style={styles.card}>
          <div style={styles.tableHeader}>
            <h2 style={styles.cardTitle}>Organizations</h2>
          </div>

          {loading ? (
            <p style={styles.loading}>Loading organizations...</p>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Organization</th>
                    <th style={styles.th}>Admin Email</th>
                    <th style={styles.th}>Created</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {organizations.map((org) => (
                    <tr key={org.organizationId}>
                      <td style={styles.td}>{org.name}</td>

                      <td style={styles.td}>{org.email}</td>

                      <td style={styles.td}>
                        {new Date(
                          org.createdAt
                        ).toLocaleDateString()}
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.status,
                            background:
                              org.isActive
                                ? "#13351d"
                                : "#4a1b1b",
                            color:
                              org.isActive
                                ? "#4ade80"
                                : "#f87171",
                          }}
                        >
                          {org.isActive
                            ? "Active"
                            : "Suspended"}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <div style={styles.actionRow}>
                          <button
                            style={styles.resetButton}
                            onClick={() => resetPassword(org)}
                          >
                            Reset Password
                          </button>

                          <button
                            style={styles.suspendButton}
                            onClick={() =>
                              toggleStatus(org.organizationId)
                            }
                          >
                            {org.isActive
                              ? "Suspend"
                              : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  page: {
    padding: "25px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
  },

  headerRow: {
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "700",
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: "8px",
  },

  card: {
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
  },

  cardTitle: {
    marginTop: 0,
    marginBottom: "20px",
    fontSize: "18px",
  },

  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #374151",
    background: "#0f172a",
    color: "white",
    outline: "none",
  },

  createButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px",
    cursor: "pointer",
    fontWeight: "600",
  },

  loading: {
    color: "#94a3b8",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "14px",
    borderBottom: "1px solid #1f2937",
    color: "#94a3b8",
    fontSize: "13px",
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #1f2937",
  },

  status: {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },

  actionRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  resetButton: {
    background: "#2563eb",
    border: "none",
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  suspendButton: {
    background: "#dc2626",
    border: "none",
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};