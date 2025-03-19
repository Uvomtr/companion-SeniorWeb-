import { useState } from "react";
import './Login.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost/senior/backend/auth.php",
        { username, password },
        { 
          withCredentials: true, // Important for sessions
          headers: { "Content-Type": "application/json" }
        }
      );
  
      if (response.data.success) {
        const user = response.data.user;
        localStorage.setItem("user", JSON.stringify(user)); // Store user data
  
        // Redirect based on role
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
  

  return (
    <div className="login-container">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 error-message">{error}</p>}
      <input 
        type="text" 
        placeholder="Username" 
        className="input-field"
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        className="input-field"
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={handleLogin} className="login-button">
        Login
      </button>
    </div>
  );
};

export default Login;
