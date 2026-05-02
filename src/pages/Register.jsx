import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const register = async () => {
    try {
      const res = await api.post("/auth/register", {
        organization_name: organization,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      alert("Registered successfully!");
      
      navigate("/dashboard");

    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Register</h2>

      <input
        placeholder="Organization Name"
        onChange={(e) => setOrganization(e.target.value)}
      />
      <br />

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

      <button onClick={register}>Register</button>

        <br /><br />

        <button onClick={() => navigate("/")}>
          Back to Login
        </button>

    </div>
  );
}