import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

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
        <img src="/icons/logo.png" alt="Logo" className="sidebar-logo-img" />
        <span className="sidebar-logo-text">Brgy. Gen. T. De Leon</span>
      </div>

      {/* Menu Items */}
      <ul className="sidebar-menu">
      <li className="sidebar-item" onClick={() => navigate("/admin/dashboard")}>
  <img src="/icons/dashboard.png" alt="Dashboard" className="sidebar-icon" />
  Dashboard
</li>

        <li className="sidebar-item" onClick={() => setSelectedOption("seniors")}>
          <img src="/icons/seniors.png" alt="Seniors" className="sidebar-icon" />
          Seniors
        </li>
        <li className="sidebar-item" onClick={() => setSelectedOption("events")}>
          <img src="/icons/events.png" alt="Events" className="sidebar-icon" />
          Events
        </li>
        <li className="sidebar-item" onClick={() => setSelectedOption("appointments")}>
          <img src="/icons/app.png" alt="Appointments" className="sidebar-icon" />
          Appointments
        </li>
        <li className="sidebar-item" onClick={() => setSelectedOption("emergenciesadmin")}>
          <img src="/icons/emergency.png" alt="Emergencies" className="sidebar-icon" />
          Emergencies
        </li>
        <li className="sidebar-item" onClick={() => setSelectedOption("chat")}>
          <img src="/icons/chat.png" alt="Chat" className="sidebar-icon" />
          Chat Inquiries
        </li>
      </ul>

      <hr className="sidebar-divider" />

      {/* Settings & Support */}
      <ul className="sidebar-menu">
        <li className="sidebar-item" onClick={() => setSelectedOption("settings")}>
          <img src="/icons/settings.png" alt="Settings" className="sidebar-icon" />
          Settings
        </li>
        <li className="sidebar-item" onClick={() => setSelectedOption("help")}>
          <img src="/icons/help.png" alt="Help" className="sidebar-icon" />
          Help & Support
        </li>
      </ul>

      {/* Logout Section */}
      <div className="sidebar-logout" onClick={handleLogout}>
        <span>Admin Name</span>
        <img src="/icons/logout.png" alt="Logout" className="sidebar-icon" />
      </div>
    </div>
  );
};

export default Sidebar;