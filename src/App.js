// I placed this 3 here
import { BrowserRouter, Routes, Route } from "react-router-dom";
//import ProtectedRoute from "./components/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import JournalEntry from "./pages/JournalEntry";
import Login from "./pages/Login";

// 🔐 AUTH CHECK FUNCTION (PUT IT HERE)
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        // Route to registration page
        <Route path="/register" element={<Register />} />

        // Route to login page
        <Route path="/" element={<Login />} />
        
        // Route to dashboard, but check if authenticated first
        <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Login />} />

        // Route to journal entry page
        <Route path="/journal-entry" element={<JournalEntry />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
