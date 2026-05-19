import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { getRole } from "../../utils/auth";

const sidebarStyles = `
  .sbar-root {
    --bg-dark: #0a0d14;
    --surface-hover: rgba(255, 255, 255, 0.04);
    --surface-active: #1f2a44;
    --border-line: #1f2a44;
    --text-bright: #ffffff;
    --text-dim: #aaaaaa;
    --text-muted: #888888;
    
    width: 240px;
    height: 100vh;
    background: var(--bg-dark);
    border-right: 1px solid var(--border-line);
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow-y: auto;
    font-family: system-ui, -apple-system, sans-serif;
  }

  /* Custom Slim Scrollbar Integration for Sidebar */
  .sbar-root::-webkit-scrollbar {
    width: 5px;
  }
  .sbar-root::-webkit-scrollbar-track {
    background: transparent;
  }
  .sbar-root::-webkit-scrollbar-thumb {
    background: #1f2a44;
    border-radius: 10px;
  }

  .sbar-branding {
    font-size: 20px;
    font-weight: bold;
    color: var(--text-bright);
    margin: 0 0 24px 8px;
    letter-spacing: -0.02em;
  }

  .sbar-nav-item {
    display: flex;
    align-items: center;
    color: var(--text-dim);
    text-decoration: none;
    padding: 10px 12px;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.15s ease;
    margin-bottom: 4px;
  }

  .sbar-nav-item:hover {
    background: var(--surface-hover);
    color: var(--text-bright);
  }

  .sbar-nav-item.active {
    background: var(--surface-active);
    color: var(--text-bright);
    font-weight: 600;
  }

  .sbar-group-wrapper {
    margin-top: 15px;
  }

  .sbar-group-trigger {
    display: block;
    font-size: 12px;
    color: var(--text-muted);
    padding: 8px;
    cursor: pointer;
    user-select: none;
    font-weight: 500;
  }

  .sbar-group-trigger:hover {
    color: var(--text-bright);
  }

  .sbar-sub-directory {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-left: 10px;
    margin-top: 4px;
  }
`;

export default function Sidebar() {
  const location = useLocation();
  const role = getRole();

  const [open, setOpen] = useState(() => {
    const saved = localStorage.getItem("sidebar-state");
    return saved
      ? JSON.parse(saved)
      : {
          core: false,
          reports: false,
          arap: false,
          management: false,
        };
  });

  const isActive = (path) => location.pathname === path;

  const toggle = (key) => {
    setOpen((prev) => {
      const updated = {
        ...prev,
        [key]: !prev[key],
      };
      localStorage.setItem("sidebar-state", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="sbar-root">
      <style>{sidebarStyles}</style>
      
      <h2 className="sbar-branding">FINOVA</h2>

      {/* ================= DASHBOARD ================= */}
      <Link
        to="/dashboard"
        className={`sbar-nav-item ${isActive("/dashboard") ? "active" : ""}`}
      >
        Dashboard
      </Link>

      {/* ================= SUPER ADMIN =================== */}
      {role === "SuperAdmin" && (
        <div className="sbar-group-wrapper">
          <div className="sbar-group-trigger">Platform</div>
          <div className="sbar-sub-directory">
            <Link
              to="/organizations"
              className={`sbar-nav-item ${isActive("/organizations") ? "active" : ""}`}
            >
              Manage Organizations
            </Link>
          </div>
        </div>
      )}

      {/* ========== NON-SUPERADMIN MODULES =============== */}
      {role !== "SuperAdmin" && (
        <>
          {/* ================= CORE FINANCE ================= */}
          {(role === "Admin" || role === "Accountant") && (
            <div className="sbar-group-wrapper">
              <div className="sbar-group-trigger" onClick={() => toggle("core")}>
                Core Finance
              </div>

              {open.core && (
                <div className="sbar-sub-directory">
                  <Link
                    to="/journal-entry"
                    className={`sbar-nav-item ${isActive("/journal-entry") ? "active" : ""}`}
                  >
                    Journal Entry
                  </Link>

                  <Link
                    to="/accounts"
                    className={`sbar-nav-item ${isActive("/accounts") ? "active" : ""}`}
                  >
                    Accounts
                  </Link>

                  <Link
                    to="/general-ledger"
                    className={`sbar-nav-item ${isActive("/general-ledger") ? "active" : ""}`}
                  >
                    General Ledger
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ================= REPORTS ================= */}
          {(role === "Admin" || role === "Accountant") && (
            <div className="sbar-group-wrapper">
              <div className="sbar-group-trigger" onClick={() => toggle("reports")}>
                Reports
              </div>

              {open.reports && (
                <div className="sbar-sub-directory">
                  <Link
                    to="/trial-balance"
                    className={`sbar-nav-item ${isActive("/trial-balance") ? "active" : ""}`}
                  >
                    Trial Balance
                  </Link>

                  <Link
                    to="/income-statement"
                    className={`sbar-nav-item ${isActive("/income-statement") ? "active" : ""}`}
                  >
                    Income Statement
                  </Link>

                  <Link
                    to="/balance-sheet"
                    className={`sbar-nav-item ${isActive("/balance-sheet") ? "active" : ""}`}
                  >
                    Balance Sheet
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ================= AR / AP ================= */}
          {(role === "Admin" || role === "Accountant" || role === "Clerk") && (
            <div className="sbar-group-wrapper">
              <div className="sbar-group-trigger" onClick={() => toggle("arap")}>
                AR / AP
              </div>

              {open.arap && (
                <div className="sbar-sub-directory">
                  <Link
                    to="/invoices"
                    className={`sbar-nav-item ${isActive("/invoices") ? "active" : ""}`}
                  >
                    Invoices
                  </Link>

                  <Link
                    to="/customers"
                    className={`sbar-nav-item ${isActive("/customers") ? "active" : ""}`}
                  >
                    Customers
                  </Link>

                  {/* Vendors only Admin + Accountant */}
                  {(role === "Admin" || role === "Accountant") && (
                    <Link
                      to="/vendors"
                      className={`sbar-nav-item ${isActive("/vendors") ? "active" : ""}`}
                    >
                      Vendors
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= MANAGEMENT ================= */}
          {role === "Admin" && (
            <div className="sbar-group-wrapper">
              <div className="sbar-group-trigger" onClick={() => toggle("management")}>
                Management
              </div>

              {open.management && (
                <div className="sbar-sub-directory">
                  <Link
                    to="/budgets"
                    className={`sbar-nav-item ${isActive("/budgets") ? "active" : ""}`}
                  >
                    Budgets
                  </Link>

                  <Link
                    to="/audit-logs"
                    className={`sbar-nav-item ${isActive("/audit-logs") ? "active" : ""}`}
                  >
                    Audit Logs
                  </Link>

                  <Link
                    to="/users"
                    className={`sbar-nav-item ${isActive("/users") ? "active" : ""}`}
                  >
                    User Management
                  </Link>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}