import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./admin/pages/AdminDashboard";
import ClientDashboard from "./client/pages/Dashboard";
import SeniorCare from "./client/pages/SeniorCare"; // Correct relative path

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/senior-care" element={<SeniorCare />} />

      </Routes> 
    </Router>
  );
};

export default AppRoutes;
