import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ position: "relative" }}>

      {/* PROFILE BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "#222",
          color: "white",
          padding: "8px 12px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
        }}
      >
        👤 Profile
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "40px",
            background: "#1e1e1e",
            border: "1px solid #333",
            borderRadius: "8px",
            width: "180px",
            zIndex: 1000,
          }}
        >

          <div
            style={menuItem}
            onClick={() => navigate("/profile")}
          >
             My Profile
          </div>

          <div
            style={menuItem}
            onClick={() =>
              navigate("/change-password")
            }
          >
             Change Password
          </div>

          <div
            style={{
              ...menuItem,
              color: "red",
              borderTop: "1px solid #333",
            }}
            onClick={logout}
          >
             Logout
          </div>

        </div>
      )}
    </div>
  );
}

const menuItem = {
  padding: "10px",
  cursor: "pointer",
  color: "white",
  fontSize: "14px",
};