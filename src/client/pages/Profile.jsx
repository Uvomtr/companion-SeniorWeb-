
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    birthday: "",
    address: "",
    idFile: null,
    profilePicture: null,
  });

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    const user = JSON.parse(localStorage.getItem("user")) || {};
    setProfile((prevProfile) => ({
      ...prevProfile,
      firstName: user.name || "John",
      email: user.email || "johndoe@example.com",
      phone: user.phone || "+123 456 7890",
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setProfile({ ...profile, [name]: files[0] });
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile information saved!");
    setIsEditing(false);
  };

  return (
    
    <div className="profile-container">
        
      <h1>My Profile</h1>
      <div className="profile-card">
        <img
          src={
            profile.profilePicture
              ? URL.createObjectURL(profile.profilePicture)
              : "/default-avatar.png"
          }
          alt="User Avatar"
          className="profile-avatar"
        />
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              required
            />
            <label>Middle Name:</label>
            <input
              type="text"
              name="middleName"
              value={profile.middleName}
              onChange={handleChange}
            />
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              required
            />
            <label>Birthday:</label>
            <input
              type="date"
              name="birthday"
              value={profile.birthday}
              onChange={handleChange}
              required
            />
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              required
            />
            <label>Upload ID:</label>
            <input
              type="file"
              name="idFile"
              onChange={handleFileChange}
              required
            />
            <label>Upload Profile Picture:</label>
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
            />
            <button type="submit" className="edit-btn">Save</button>
          </form>
        ) : (
          <div className="profile-details">
            <h2>{profile.firstName || "John Doe"}</h2>
            <p>Email: {profile.email}</p>
            <p>Phone: {profile.phone}</p>
            <p>Birthday: {profile.birthday || "N/A"}</p>
            <p>Address: {profile.address || "N/A"}</p>
            <p>ID Uploaded: {profile.idFile ? profile.idFile.name : "No file uploaded"}</p>
            <button onClick={toggleEdit} className="edit-btn">Edit Profile</button>
            <button onClick={() => navigate("/client-dashboard")} className="back-btn">Back to Home</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;