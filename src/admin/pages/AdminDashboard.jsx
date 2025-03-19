import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Sidebar from "../components/Sidebar";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyAppointments, setDailyAppointments] = useState([]);
  const [summary, setSummary] = useState({
    totalPatients: 0,
    patientPercentChange: 0,
    totalAppointments: 0,
    appointmentPercentChange: 0,
    totalInquiries: 0,
    inquiryPercentChange: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchDailyAppointments(selectedDate);
  }, [selectedDate, appointments]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost/senior/backend/getappointment.php");
      const data = await response.json();
      console.log("Fetched Data:", data);

      if (data.success) {
        setAppointments(data.appointments);
        setSummary(data.summary);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchDailyAppointments = (date) => {
    const formattedDate = date.toLocaleDateString("en-CA"); // Fix for timezone shift
    console.log("Selected Date:", formattedDate);
    console.log("All Appointments:", appointments);

    const filteredAppointments = appointments.filter(
      (apt) => apt.date.startsWith(formattedDate)
    );

    console.log("Filtered Appointments:", filteredAppointments);
    setDailyAppointments(filteredAppointments);
  };

  const formatPercentChange = (value) => {
    return `${value >= 0 ? "+" : ""}${value}% Last Month`;
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = date.toLocaleDateString("en-CA");
      return appointments.some((apt) => apt.date.startsWith(formattedDate)) ? "highlight" : null;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="card total-patients">
            <h3>Total Seniors</h3>
            <p className="count">{summary.totalPatients.toLocaleString()}</p>
            
          </div>
          <div className="card card-light">
            <h3>Total Appointments</h3>
            <p className="count">{summary.totalAppointments.toLocaleString()}</p>
            
          </div>
          <div className="card card-light">
            <h3>Total Inquiries</h3>
            <p className="count">{summary.totalInquiries.toLocaleString()}</p>
       
          </div>
        </div>

        {/* Appointments and Calendar */}
        <div className="flex gap-6 mt-6">
          {/* Daily Appointments Table */}
          <div className="appointments-section w-1/2">
            <h2 className="text-xl font-semibold">Appointments on {selectedDate.toDateString()}</h2>
            {loading ? (
              <p>Loading appointments...</p>
            ) : (
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Service</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyAppointments.length > 0 ? (
                    dailyAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.username || "Unknown"}</td>
                        <td>{appointment.service || "N/A"}</td>
                        <td>{appointment.time}</td>
                        <td>{appointment.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">No appointments found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Calendar */}
          <div className="calendar-container w-1/2">
            <h2 className="text-xl font-semibold">Appointments Calendar</h2>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileClassName={tileClassName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
