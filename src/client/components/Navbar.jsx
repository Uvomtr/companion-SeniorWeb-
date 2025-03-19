import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ handleLogout, role }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Only show the navbar if the user is a client
  if (role !== "client") return null;

  // Logout function
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
      {/* Logo */}
      <div className="Navbar-logo-container">
        <div className="Navbar-logo" onClick={() => navigate("/client-dashboard")}>
          Brgy. Gen. T. De Leon
        </div>
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="Navbar-hamburger" onClick={toggleSidebar}>
        <div className="Navbar-hamburger-icon"></div>
        <div className="Navbar-hamburger-icon"></div>
        <div className="Navbar-hamburger-icon"></div>
      </div>

      {/* Sidebar for Mobile */}
      <div className={`Sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul className="Sidebar-links">
          <li><Link to="/client-dashboard" onClick={toggleSidebar}>Home</Link></li>
          <li><Link to="/senior-care" onClick={toggleSidebar}>Senior Care</Link></li>
          <li><Link to="/profile" onClick={toggleSidebar}>Profile</Link></li>
          <li><Link to="/emergency" onClick={toggleSidebar}>Contact List</Link></li>
          <li><Link to="/chat" onClick={toggleSidebar}>Chat</Link></li>
          <li><button onClick={logoutHandler} className="logout-btn">Logout</button></li>
        </ul>
      </div>

      {/* Regular Desktop Navbar Links */}
      <ul className="Navbar-links">
        <li><Link to="/client-dashboard" className="Navbar-links-b">Home</Link></li>
        <li><Link to="/senior-care" className="Navbar-links-b">Appointment</Link></li>
        <li><Link to="/emergency" className="Navbar-links-b">Contact List</Link></li>
        <li><Link to="/chat" className="Navbar-links-b">Chat</Link></li>
        <li><button onClick={logoutHandler} className="Navbar-links-a">Logout</button></li>
      </ul>

      {/* Profile Button */}
      <div className="Navbar-edit-profile">
        <button className="Navbar-profile-button" onClick={() => navigate("/profile")}>
          Profile
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
