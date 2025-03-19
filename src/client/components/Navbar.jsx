import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SeniorCare from "../pages/SeniorCare";  // Move up to client, then go to pages


import "./Navbar.css";

function Navbar({ handleLogout, role }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Ensure Navbar only renders for clients
  if (role !== "client") return null;

  // Function to handle logout
  const logoutHandler = () => {
    if (handleLogout) {
      handleLogout();
    } else {
      console.error("handleLogout function is not provided!");
    }
    navigate("/login");
  };

  return (
    <nav className="Navbar">
      <div className="Navbar-logo-container">
        <div className="Navbar-logo">Brgy. Gen. T. De Leon</div>
      </div>

      <div className="Navbar-hamburger" onClick={toggleSidebar}>
        <div className="Navbar-hamburger-icon"></div>
        <div className="Navbar-hamburger-icon"></div>
        <div className="Navbar-hamburger-icon"></div>
      </div>

      {/* Sidebar for mobile */}
      <div className={`Sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul className="Sidebar-links">
          <li><Link to="/client-dashboard">Home</Link></li>
          <li><Link to="/senior-care">Senior Care</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><button onClick={logoutHandler} className="logout-btn">Logout</button></li>
        </ul>
      </div>

      {/* Regular navbar links */}
      <ul className="Navbar-links">
        <li><Link to="/client-dashboard" className="Navbar-links-b">Home</Link></li>
        <li><Link to="/senior-care" className="Navbar-links-b">Appointment</Link></li>
        <li><Link to="/emergency" className="Navbar-links-b">Contact List</Link></li>
        <li><Link to="/chat" className="Navbar-links-b">Chat</Link></li>
        <li><button onClick={logoutHandler} className="Navbar-links-a">Logout</button></li>
      </ul>

      {/* Profile Button */}
      <div className="Navbar-edit-profile">
        <button className="Navbar-profile-button">
          <Link to="/profile" className="profile-link">Profile</Link>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
