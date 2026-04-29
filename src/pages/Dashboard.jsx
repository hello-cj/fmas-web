export default function Dashboard() {
  return (
    <div style={{ padding: 40 }}>
      <h2>Welcome to FINOVA 🚀</h2>
      <p>You are logged in.</p>

      <button onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      }}>
        Logout
      </button>
    </div>
  );
}