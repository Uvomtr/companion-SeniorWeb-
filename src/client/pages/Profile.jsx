import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [profile, setProfile] = useState({
        username: "",
        barangay_id: "",  // ✅ Kept for users table
        firstName: "",
        middleName: "",
        lastName: "",
        birthday: "",
        address: "",
        idFile: null,
        profilePicture: null,
    });

    // ✅ Fetch user profile
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = () => {
        fetch(`http://localhost/senior/backend/user_profile.php?timestamp=${new Date().getTime()}`, {
            credentials: "include",
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
            } else {
                setProfile({
                    username: data.username || "",
                    barangay_id: data.barangay_id || "",  // ✅ Ensure it is set
                    firstName: data.first_name || "",
                    middleName: data.middle_name || "",
                    lastName: data.last_name || "",
                    birthday: data.birthday || "",
                    address: data.address || "",
                    idFile: data.id_file || null,
                    profilePicture: data.profile_picture || null,
                });
            }
        })
        .catch(error => console.error("Error fetching profile:", error));
    };

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

    // ✅ Save and refresh profile
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("firstName", profile.firstName);
        formData.append("middleName", profile.middleName);
        formData.append("lastName", profile.lastName);
        formData.append("birthday", profile.birthday);
        formData.append("address", profile.address);
        if (profile.idFile) formData.append("idFile", profile.idFile);
        if (profile.profilePicture) formData.append("profilePicture", profile.profilePicture);

        fetch("http://localhost/senior/backend/user_profile.php", {
            method: "POST",
            body: formData,
            credentials: "include",
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setShowModal(true);
                setIsEditing(false);
                fetchUserProfile(); // Fetch updated profile after save
            } else {
                alert("Error updating profile: " + data.error);
            }
        })
        .catch(error => console.error("Error updating profile:", error));
    };

    return (
        <div className="profile-container">
            <h1>My Profile</h1>
            <div className="profile-card">
                <img
                    src={profile.profilePicture ? `http://localhost/senior/${profile.profilePicture}` : "/default-avatar.png"}
                    alt="User Avatar"
                    className="profile-avatar"
                />
                <div className="profile-details">
                    <p><strong>Username:</strong> {profile.username}</p>
                    <p><strong>Barangay ID:</strong> {profile.barangay_id}</p>  {/* ✅ Barangay ID is displayed */}

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="profile-form">
                            <label>First Name:</label>
                            <input type="text" name="firstName" value={profile.firstName} onChange={handleChange} required />

                            <label>Middle Name:</label>
                            <input type="text" name="middleName" value={profile.middleName} onChange={handleChange} />

                            <label>Last Name:</label>
                            <input type="text" name="lastName" value={profile.lastName} onChange={handleChange} required />

                            <label>Birthday:</label>
                            <input type="date" name="birthday" value={profile.birthday} onChange={handleChange} required />

                            <label>Address:</label>
                            <input type="text" name="address" value={profile.address} onChange={handleChange} required />

                            <label>Upload ID:</label>
                            <input type="file" name="idFile" onChange={handleFileChange} />

                            <label>Upload Profile Picture:</label>
                            <input type="file" name="profilePicture" onChange={handleFileChange} />

                            <button type="submit">Save</button>
                        </form>
                    ) : (
                        <button onClick={toggleEdit}>Edit Profile</button>
                    )}

                    <button onClick={() => navigate("/client-dashboard")}>Back to Home</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
