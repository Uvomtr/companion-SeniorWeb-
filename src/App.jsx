import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./admin/pages/AdminDashboard";
import Seniors from "./admin/pages/Seniors";
import Events from "./admin/pages/Events";
import Appointments from "./admin/pages/Appointments";
import Emergencies from "./admin/pages/Emergencies";
import ChatAdmin from "./admin/pages/ChatAdmin";
import Help from "./admin/pages/Help";
import Settings from "./admin/pages/Settings";
import AdminLayout from "./admin/pages/components/AdminLayout"; // ✅ Correct path









import ClientDashboard from "./client/pages/Dashboard";
import Profile from "./client/pages/Profile"; // ✅ Import Profile
import SeniorCare from "./client/pages/SeniorCare";
import Emergency from "./client/pages/Emergency";
import Chat from "./client/pages/Chat";


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
        
        {/* Seniors Page (Only for Admin) ✅ */}
        <Route
          path="/seniors"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
               <AdminLayout>
              <Seniors />
              </AdminLayout>
            </PrivateRoute>
          }
        />

         {/* Events Page (Only for Admin) ✅ */}
         <Route
          path="/events"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
               <AdminLayout>
              <Events />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* Appointments Page (Only for Admin) ✅ */}
        <Route
          path="/appointments"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
               <AdminLayout>
              <Appointments />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* Emergency for Admin Page (Only for Admin) ✅ */}
        <Route
          path="/emergenciesadmin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
               <AdminLayout>
              <Emergencies />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* ChatInquiries Page (Only for Admin) ✅ */}
        <Route
          path="/chatinquiries"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
               <AdminLayout>
              <ChatAdmin />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* Help Page (Only for Admin) ✅ */}
        <Route
          path="/helpadmin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
               <AdminLayout>
              <Help />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* Settings Page (Only for Admin) ✅ */}
        <Route
          path="/settingsadmin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
               <AdminLayout>
              <Settings />
              </AdminLayout>
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

        
          {/* Appointments Page (Only for Clients) ✅ */}
          <Route
          path="/senior-care"
          element={
            <PrivateRoute allowedRoles={["client"]}>
              <SeniorCare />
            </PrivateRoute>
          }
        />

        
          {/* ContactList Page (Only for Clients) ✅ */}
          <Route
          path="/emergency"
          element={
            <PrivateRoute allowedRoles={["client"]}>
              <Emergency />
            </PrivateRoute>
          }
        />

        
          {/* Chat Page (Only for Clients) ✅ */}
          <Route
          path="/chat"
          element={
            <PrivateRoute allowedRoles={["client"]}>
              <Chat />
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

      </Routes>
    </Router>
  );
}

export default App;
