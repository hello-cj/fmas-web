import { useState } from "react";
import api from "../api/api";
import { getRole } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      alert("Login successful!");

      // redirect (basic)
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Invalid login");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>FINOVA Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <button onClick={login}>Login</button>

      <br /><br />

        <button onClick={() => navigate("/register")}>
          Create Account
        </button>

    </div>
  );
}