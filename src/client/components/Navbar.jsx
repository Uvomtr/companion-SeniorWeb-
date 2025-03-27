import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Logosrc from "./brgy.png";

function Navbar({ handleLogout, role, onServiceSelect }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  if (role !== "client") return null;

  const logoutHandler = () => {
    if (handleLogout) {
      handleLogout();
    } else {
      console.error("handleLogout function is not provided!");
    }
    navigate("/login");
  };

  const handleServiceSelect = (service) => {
    if (onServiceSelect) {
      onServiceSelect(service);  // Call the prop to pass the selected service
    }
  };

  return (
    <nav className="Navbar">
      <div className="Navbar-logo-container" onClick={() => navigate("/client-dashboard")}>
        <img src={Logosrc} alt="Logo" className="app-logo" />
        <div className="Navbar-logo">Brgy. Gen. T. De Leon</div>
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
          <li className="dropdown" onClick={toggleDropdown}>
            <span>Appointment</span>
            <ul className={`dropdown-menu ${isDropdownOpen ? "open" : ""}`}>
              <li><Link to="/appointment/health-checkup" onClick={() => {handleServiceSelect("Health Check-up"); toggleSidebar();}}>Health Check-up</Link></li>
              <li><Link to="/appointment/free-medicine" onClick={() => {handleServiceSelect("Free Medicine"); toggleSidebar();}}>Free Medicine</Link></li>
              <li><Link to="/appointment/massage" onClick={() => {handleServiceSelect("Massage"); toggleSidebar();}}>Massage</Link></li>
              <li><Link to="/appointment/dental-checkup" onClick={() => {handleServiceSelect("Dental Check-up"); toggleSidebar();}}>Dental Check-up</Link></li>
              <li><Link to="/appointment/eye-checkup" onClick={() => {handleServiceSelect("Eye Check-up"); toggleSidebar();}}>Eye Check-up</Link></li>
            </ul>
          </li>
          <li><Link to="/emergency" onClick={toggleSidebar}>Contact List</Link></li>
          <li><Link to="/chat" onClick={toggleSidebar}>Chat</Link></li>
          <li><Link to="/login" onClick={logoutHandler} className="logout-link">Logout</Link></li>
        </ul>
      </div>

      {/* Desktop Navbar */}
      <ul className="Navbar-links">
        <li><Link to="/client-dashboard">Home</Link></li>

        {/* Dropdown Menu for Appointment */}
        <li className="dropdown" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
          <span>Appointment</span>
          <ul className={`dropdown-menu ${isDropdownOpen ? "open" : ""}`}>
            <li><Link to="/appointment/health-checkup" onClick={() => handleServiceSelect("Health Check-up")}>Health Check-up</Link></li>
            <li><Link to="/appointment/free-medicine" onClick={() => handleServiceSelect("Free Medicine")}>Free Medicine</Link></li>
            <li><Link to="/appointment/massage" onClick={() => handleServiceSelect("Massage")}>Massage</Link></li>
            <li><Link to="/appointment/dental-checkup" onClick={() => handleServiceSelect("Dental Check-up")}>Dental Check-up</Link></li>
            <li><Link to="/appointment/eye-checkup" onClick={() => handleServiceSelect("Eye Check-up")}>Eye Check-up</Link></li>
          </ul>
        </li>

        <li><Link to="/emergency">Contact List</Link></li>
        <li><Link to="/chat">Chat</Link></li>
        <li><Link to="/login" onClick={logoutHandler} className="logout-link">Logout</Link></li>
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
