import React, { useEffect, useState } from "react";
import "./Appointments.css"; // Ensure this CSS file contains the styles

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [activeTab, setActiveTab] = useState("pending"); // Default tab
  const [remarks, setRemarks] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Fetch appointments from the backend
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost/senior/backend/getappointment.php");
      const data = await response.json();

      if (data.success && Array.isArray(data.appointments)) {
        setAppointments(data.appointments);
      } else {
        console.error("Invalid response from backend:", data);
        setStatusMessage("Error fetching appointments.");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setStatusMessage("Failed to fetch data.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Open appointment details modal
  const openReviewModal = (appointment) => {
    setSelectedAppointment(appointment);
    setRemarks(appointment.remarks || "");
  };

  // Function to handle action with confirmation and remarks
  const handleAction = async (status) => {
    if (!remarks.trim()) {
      alert("Please add remarks before proceeding.");
      return;
    }
    
    if (!window.confirm(`Are you sure you want to ${status} this appointment?`)) {
      return;
    }

    setStatusMessage("");
    try {
      const response = await fetch("http://localhost/senior/backend/update_appointment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointment_id: selectedAppointment.id, status, remarks }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatusMessage("Appointment status updated successfully.");
        setSelectedAppointment(null);
        fetchAppointments(); // Refresh appointments after update
      } else {
        console.error("Failed to update appointment status:", result.error);
        setStatusMessage("Failed to update status.");
      }
    } catch (error) {
      console.error("Error handling action:", error);
      setStatusMessage("An error occurred while updating the status.");
    }
  };

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  return (
    <div className="appointments-container">
      <h2>Appointment Requests</h2>
      {statusMessage && <div className="status-message">{statusMessage}</div>}

      {/* Tabs */}
      <div className="tab-container">
        {["pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            className={`tab-button ${activeTab === status ? "active" : ""}`}
            onClick={() => setActiveTab(status)}
          >
            {status === "pending" ? "⏳ Pending" : status === "approved" ? "✅ Approved" : "❌ Rejected"}
          </button>
        ))}
      </div>

      {/* Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Barangay Number</th>
            <th>Type</th>
            <th>Date</th>
            <th>Time</th>
            <th>Remarks</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.filter(app => app.status.toLowerCase() === activeTab).length > 0 ? (
            appointments
              .filter((app) => app.status.toLowerCase() === activeTab)
              .map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.username}</td>
                  <td>{appointment.barangay_id}</td>
                  <td>{appointment.service}</td>
                  <td>{appointment.date}</td>
                  <td className="time-text">{appointment.time}</td>
                  <td>{appointment.remarks || "No remarks"}</td>
                  <td className="action-icons">
                    {activeTab === "pending" && (
                      <button className="review-button" onClick={() => openReviewModal(appointment)}>
                        🔍 Review
                      </button>
                    )}
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>No {activeTab} appointments.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for reviewing appointment */}
      {selectedAppointment && (
        <div className="modal">
          <div className="modal-content">
            <h3>Review Appointment</h3>
            <p><strong>Username:</strong> {selectedAppointment.username}</p>
            <p><strong>Barangay Number:</strong> {selectedAppointment.barangay_id}</p>
            <p><strong>Type:</strong> {selectedAppointment.service}</p>
            <p><strong>Date:</strong> {selectedAppointment.date}</p>
            <p><strong>Time:</strong> {selectedAppointment.time}</p>
            <textarea
              placeholder="Add remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            {activeTab === "pending" && (
              <>
                <button className="approve-button" onClick={() => handleAction("approved")}>✔ Approve</button>
                <button className="reject-button" onClick={() => handleAction("rejected")}>✖ Reject</button>
              </>
            )}
            <button className="close-button" onClick={() => setSelectedAppointment(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
