import React, { useState, useEffect } from "react";
import "./Seniors.css";
import editIcon from "./edit.png";
import deleteIcon from "./delete.png";

const Seniors = () => {
  const [seniors, setSeniors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    age: "",
    sex: "",
    address: "",
    health_issue: "",
  });

  useEffect(() => {
    const fetchSeniors = async () => {
      try {
        const response = await fetch("http://localhost/php/getusers.php");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        if (result.success) setSeniors(result.users);
        else alert(result.message);
      } catch (error) {
        console.error("Error fetching seniors:", error.message);
      }
    };

    fetchSeniors();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSenior = async () => {
    if (
      !formData.username ||
      !formData.password ||
      !formData.age ||
      !formData.sex ||
      !formData.address ||
      !formData.health_issue
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost/php/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        alert("Senior added successfully");
        setSeniors([...seniors, formData]);
        setShowModal(false);
        setFormData({
          username: "",
          password: "",
          age: "",
          sex: "",
          address: "",
          health_issue: "",
        });
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error adding senior:", error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this senior?")) {
      try {
        const response = await fetch("http://localhost/php/getusers.php", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const result = await response.json();
        if (result.success) {
          alert(result.message);
          setSeniors(seniors.filter((senior) => senior.id !== id));
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error("Error deleting senior:", error.message);
      }
    }
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Seniors</h2>
        <button className="add-senior-button" onClick={() => setShowModal(true)}>
          Add Senior
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Username</th>
            <th>Age</th>
            <th>Sex</th>
            <th>Address</th>
            <th>Health Issue</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {seniors.map((senior) => (
            <tr key={senior.id}>
              <td>
                <input type="checkbox" />
              </td>
              <td>{senior.username}</td>
              <td>{senior.age}</td>
              <td>{senior.sex}</td>
              <td>{senior.address}</td>
              <td>{senior.health_issue}</td>
              <td className="action-icons">
                <img src={editIcon} alt="Edit" />
                <img
                  src={deleteIcon}
                  alt="Delete"
                  onClick={() => handleDelete(senior.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Senior</h2>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleInputChange}
            />
            <select
              name="sex"
              value={formData.sex}
              onChange={handleInputChange}
            >
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="health_issue"
              placeholder="Health Issue"
              value={formData.health_issue}
              onChange={handleInputChange}
            />
            <button onClick={handleAddSenior}>Add Senior</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Seniors;
