import React from "react";
import Navbar from "../components/Navbar"; // Ensure correct path
import SeniorCare from "./SeniorCare"; // Ensure correct path

const Dashboard = () => {
  return (
    <div style={{ paddingTop: "60px" }}> {/* Prevent overlap with fixed Navbar */}
      <Navbar role="client" /> {/* Navbar with role passed */}

      <div style={{ padding: "20px", textAlign: "center" }}>
        {/* Senior Care */}
        <div style={{ marginBottom: "30px" }}>
          <h2>Senior Care</h2>
          <SeniorCare />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
