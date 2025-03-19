import "./Register.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    age: "",
    sex: "Male",
    address: "",
    health_issue: "",
    role: "client" // Default role
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { username, password, age, address, health_issue } = formData;

    if (!username || !password || !age || !address || !health_issue) {
      setError("All fields are required.");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost/senior/backend/register.php", formData, {
        headers: { "Content-Type": "application/json" }
      });

      console.log("Response Data:", response.data);

      if (response.data.status === "success") {
        setSuccessMessage("Registration successful! Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Registration Error:", err.response ? err.response.data : err.message);
      setError("Registration failed. Please check your connection.");
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <form onSubmit={handleRegister}>
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} />

        <select name="sex" value={formData.sex} onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
        <input type="text" name="health_issue" placeholder="Health Issue" value={formData.health_issue} onChange={handleChange} />

        {/* Role Dropdown */}
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="client">Client</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Register</button>
      </form>

      <p>Already have an account? <Link to="/">Login</Link></p>
    </div>
  );
};

export default Register;
