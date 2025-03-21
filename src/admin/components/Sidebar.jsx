import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

// Import the images from the local 'icons' folder
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

const Sidebar = ({ setSelectedOption }) => {
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
        <li className="sidebar-item" onClick={() => navigate("/admin/dashboard")}>
          <img src={dashboardIcon} alt="Dashboard" className="sidebar-icon" />
          Dashboard
        </li>

        <li className="sidebar-item" onClick={() => setSelectedOption("seniors")}>
          <img src={seniorsIcon} alt="Seniors" className="sidebar-icon" />
          Seniors
        </li>
        <li className="sidebar-item" onClick={() => setSelectedOption("events")}>
          <img src={eventsIcon} alt="Events" className="sidebar-icon" />
          Events
        </li>
        <li className="sidebar-item" onClick={() => setSelectedOption("appointments")}>
          <img src={appointmentsIcon} alt="Appointments" className="sidebar-icon" />
          Appointments
        </li>
        <li className="sidebar-item" onClick={() => setSelectedOption("emergenciesadmin")}>
          <img src={emergencyIcon} alt="Emergencies" className="sidebar-icon" />
          Emergencies
        </li>
        <li className="sidebar-item" onClick={() => setSelectedOption("chat")}>
          <img src={chatIcon} alt="Chat" className="sidebar-icon" />
          Chat Inquiries
        </li>
      </ul>

      <hr className="sidebar-divider" />

      {/* Settings & Support */}
      <ul className="sidebar-menu">
        <li className="sidebar-item" onClick={() => setSelectedOption("settings")}>
          <img src={settingsIcon} alt="Settings" className="sidebar-icon" />
          Settings
        </li>
        <li className="sidebar-item" onClick={() => setSelectedOption("help")}>
          <img src={helpIcon} alt="Help" className="sidebar-icon" />
          Help & Support
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
