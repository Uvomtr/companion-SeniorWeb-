import { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import logoSrc from "./logo.png";
import axios from "axios";

const Login = ({ logo }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [dateTime, setDateTime] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      });
      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      setDateTime(`${formattedDate} | ${formattedTime}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost/senior/backend/auth.php",
        { username, password },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        const user = response.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        if (user.role === "admin") {
          navigate("/admin-dashboard");
        } else if (user.role === "client") {
          navigate("/client-dashboard");
        } else {
          setError("Invalid user role.");
        }
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin(e); // Call handleLogin when Enter is pressed
    }
  };

  return (
    <div className="login-page">
      <header className="header" style={{ backgroundColor: "#1e1785", textAlign: "center", color: "white", padding: "10px" }}></header>

      <div className="logo-container">
        <h1>Barangay General Tiburcio De Leon</h1>
        <div className="app-logo-container">
          <img src={logoSrc} alt="Logo" className="app-logo" />
        </div>
        <div className="date-time-container">
          <p>{dateTime}</p>
        </div>
      </div>

      <div className="login-container">
        <h1>Welcome to Barangay General Tiburcio De Leon Health Portal</h1>
        <p className="description">
          This platform is designed to make health services more accessible and convenient for everyone.
          Here, you can manage patient records, schedule appointments, and send inquiries directly to our health center.
          Your health and well-being are our priority!
        </p>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          className="input-field"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyPress} // Listen for the Enter key press
        />
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress} // Listen for the Enter key press
        />
        <button onClick={handleLogin} className="login-button">Login</button>
        <p>
          Don't have an account? <a href="/register" className="register-link">Register here</a>
        </p>
      </div>

      <footer className="footer" style={{ backgroundColor: "#1e1785", textAlign: "center", color: "white", padding: "5px" }}>
        <p>&copy; 2025 Barangay General Tiburcio De Leon Health Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
