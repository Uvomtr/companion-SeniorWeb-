import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

// Import icons
import logo from "./icons/logo.png";
import dashboardIcon from "./icons/dashboard.png";
import seniorsIcon from "./icons/seniors.png";
import eventsIcon from "./icons/events.png";
import appointmentsIcon from "./icons/app.png";
import emergencyIcon from "./icons/emergency.png";
import chatIcon from "./icons/chat.png";
import settingsIcon from "./icons/settings.png";
import helpIcon from "./icons/help.png";
import logoutIcon from "./icons/logout.png";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" className="sidebar-logo-img" />
        <span className="sidebar-logo-text">Brgy. Gen. T. De Leon</span>
      </div>

      {/* Menu Items */}
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link to="/admin-dashboard" className="sidebar-link">
            <img src={dashboardIcon} alt="Dashboard" className="sidebar-icon" />
            Dashboard
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/seniors" className="sidebar-link">
            <img src={seniorsIcon} alt="Seniors" className="sidebar-icon" />
            Users
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/events" className="sidebar-link">
            <img src={eventsIcon} alt="Events" className="sidebar-icon" />
            Events
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/appointments" className="sidebar-link">
            <img src={appointmentsIcon} alt="Appointments" className="sidebar-icon" />
            Appointments
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/emergenciesadmin" className="sidebar-link">
            <img src={emergencyIcon} alt="Emergencies" className="sidebar-icon" />
            Emergencies
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/chatinquiries" className="sidebar-link">
            <img src={chatIcon} alt="Chat" className="sidebar-icon" />
            Chat Inquiries
          </Link>
        </li>
      </ul>

      <hr className="sidebar-divider" />

      {/* Settings & Support */}
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link to="/settingsadmin" className="sidebar-link">
            <img src={settingsIcon} alt="Settings" className="sidebar-icon" />
            Settings
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/helpadmin" className="sidebar-link">
            <img src={helpIcon} alt="Help" className="sidebar-icon" />
            Help & Support
          </Link>
        </li>
      </ul>

      {/* Logout Section */}
      <div className="sidebar-logout" onClick={handleLogout}>
        <span>Admin Name</span>
        <img src={logoutIcon} alt="Logout" className="sidebar-icon" />
      </div>
    </div>
  );
};

export default Sidebar;
