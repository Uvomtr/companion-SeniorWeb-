import React, { useState, useEffect } from "react";
import "./Seniors.css";
import editIcon from "./edit.png";
import deleteIcon from "./delete.png";

const healthIssuesList = ["Diabetes", "Hypertension", "Arthritis", "Heart Disease", "Osteoporosis"];

const Seniors = () => {
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    age: "",
    sex: "",
    address: "",
    health_issue: [],
    barangay_id: "",
  });

  useEffect(() => {
    fetchSeniors();
  }, []);

  const fetchSeniors = async () => {
    try {
      const response = await fetch("http://localhost/senior/backend/getusers.php");
      const result = await response.json();
      if (result.success) {
        setPatients(result.users);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    if (name === "age") {
      value = value.replace(/\D/, ""); // Only numbers
      if (value && parseInt(value, 10) < 60) {
        alert("Age must be at least 60.");
        return;
      }
    }

    if (name === "barangay_id") {
      value = value.replace(/\D/, ""); // Only numbers
      if (value.length > 5) {
        alert("Barangay ID must be at most 5 digits.");
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleHealthIssueSelect = (e) => {
    const selectedValue = e.target.value;
    if (!selectedValue) return;

    if (formData.health_issue.includes(selectedValue)) {
      alert("Health issue already selected.");
      return;
    }

    if (formData.health_issue.length >= 3) {
      alert("You can select up to 3 health issues.");
      return;
    }

    setFormData({ ...formData, health_issue: [...formData.health_issue, selectedValue] });
  };

  const removeHealthIssue = (issue) => {
    setFormData({ ...formData, health_issue: formData.health_issue.filter((i) => i !== issue) });
  };

  const handleSaveSenior = async () => {
    const { username, password, age, sex, address, health_issue, barangay_id } = formData;

    if (!username || !age || !sex || !address || health_issue.length === 0 || !barangay_id) {
      alert("All fields are required!");
      return;
    }

    const payload = {
      ...formData,
      health_issue: health_issue.join(", "), // Convert array to string
      role: "senior",
    };

    try {
      const url = editingPatient
        ? "http://localhost/senior/backend/getusers.php"
        : "http://localhost/senior/backend/getusers.php";
      const method = editingPatient ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        alert(editingPatient ? "Senior updated successfully" : "Senior added successfully");
        fetchSeniors();
        closeModal();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error saving senior:", error);
    }
  };

  const handleDeleteSenior = async (id) => {
    if (!window.confirm("Are you sure you want to delete this senior?")) return;

    try {
      const response = await fetch("http://localhost/senior/backend/getusers.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Senior deleted successfully");
        fetchSeniors();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error deleting senior:", error);
    }
  };

  const openModal = (patient = null) => {
    setEditingPatient(patient);
    setFormData(
      patient
        ? {
            ...patient,
            health_issue: patient.health_issue ? patient.health_issue.split(", ") : [],
          }
        : { username: "", password: "", age: "", sex: "", address: "", health_issue: [], barangay_id: "" }
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPatient(null);
    setFormData({ username: "", password: "", age: "", sex: "", address: "", health_issue: [], barangay_id: "" });
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>All Users</h2>
        <button className="add-senior-button" onClick={() => openModal()}>Add Senior</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Username</th>
            <th>Barangay ID</th>
            <th>Age</th>
            <th>Sex</th>
            <th>Address</th>
            <th>Health Issue</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td><input type="checkbox" /></td>
              <td>{patient.username}</td>
              <td>{patient.barangay_id}</td>
              <td>{patient.age}</td>
              <td>{patient.sex}</td>
              <td>{patient.address}</td>
              <td>{patient.health_issue}</td>
              <td className="action-icons">
                <img src={editIcon} alt="Edit" onClick={() => openModal(patient)} />
                <img src={deleteIcon} alt="Delete" onClick={() => handleDeleteSenior(patient.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingPatient ? "Edit Senior" : "Add Senior"}</h2>
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} />
            <input type="text" name="barangay_id" placeholder="Barangay ID (Max: 5 digits)" value={formData.barangay_id} onChange={handleInputChange} />
            {!editingPatient && <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />}
            <input type="number" name="age" placeholder="Age (Min: 60)" value={formData.age} onChange={handleInputChange} min="60" />
            <select name="sex" value={formData.sex} onChange={handleInputChange}>
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} />
            <select onChange={handleHealthIssueSelect}>
              <option value="">Select Health Issue</option>
              {healthIssuesList.map((issue) => (
                <option key={issue} value={issue}>{issue}</option>
              ))}
            </select>
            <div className="selected-health-issues">
              {formData.health_issue.map((issue) => (
                <span key={issue} className="health-tag" onClick={() => removeHealthIssue(issue)}>
                  {issue} ✖
                </span>
              ))}
            </div>
            <button onClick={handleSaveSenior}>{editingPatient ? "Update" : "Submit"}</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Seniors;
