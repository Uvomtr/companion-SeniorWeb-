import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./admin/pages/AdminDashboard";
import ClientDashboard from "./client/pages/Dashboard";
import Profile from "./client/pages/Profile"; // ✅ Import Profile
import SeniorCare from "./client/pages/SeniorCare";

const PrivateRoute = ({ children, allowedRoles }) => {
  let user = null;

  // Safe localStorage parsing
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Dashboard (Only for Admins) */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Client Dashboard (Only for Clients) */}
        <Route
          path="/client-dashboard"
          element={
            <PrivateRoute allowedRoles={["client"]}>
              <ClientDashboard />
            </PrivateRoute>
          }
        />

        {/* Profile Page (Only for Clients) ✅ */}
        <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={["client"]}>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/senior-care"
          element={
            <PrivateRoute allowedRoles={["client"]}>
              <SeniorCare />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
