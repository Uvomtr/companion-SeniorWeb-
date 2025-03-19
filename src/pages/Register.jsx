import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "client",
    age: "",
    sex: "Male",
    address: "",
    health_issue: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost/senior/backend/auth.php", {
        ...formData,
        register: true
      });

      if (response.data.success) {
        navigate("/");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input type="text" name="username" placeholder="Username" className="border p-2 mb-2" value={formData.username} onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" className="border p-2 mb-2" value={formData.password} onChange={handleChange} />
      <input type="number" name="age" placeholder="Age" className="border p-2 mb-2" value={formData.age} onChange={handleChange} />
      <select name="sex" className="border p-2 mb-2" value={formData.sex} onChange={handleChange}>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <input type="text" name="address" placeholder="Address" className="border p-2 mb-2" value={formData.address} onChange={handleChange} />
      <input type="text" name="health_issue" placeholder="Health Issue" className="border p-2 mb-4" value={formData.health_issue} onChange={handleChange} />
      <button onClick={handleRegister} className="bg-green-500 text-white px-4 py-2">Register</button>
      <p className="mt-2">
        Already have an account? <Link to="/" className="text-green-500">Login</Link>
      </p>
    </div>
  );
};

export default Register;
