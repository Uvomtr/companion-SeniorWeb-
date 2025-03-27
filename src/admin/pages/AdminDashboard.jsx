import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Sidebar from "../components/Sidebar";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyAppointments, setDailyAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  
  const [summary, setSummary] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    totalPending: 0,
    totalApproved: 0,
  });

  // Filter state
  const [ageFilter, setAgeFilter] = useState("all"); // Default to show all ages
  const [searchQuery, setSearchQuery] = useState(""); // Search query for name, barangay ID, or health issue

  useEffect(() => {
    fetchAppointments();
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchDailyAppointments(selectedDate);
    filterUpcomingAppointments();
  }, [selectedDate, appointments]);

  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const response = await fetch("http://localhost/senior/backend/getappointment.php");
      const data = await response.json();

      if (data.success) {
        setAppointments(data.appointments);
        setSummary((prevSummary) => ({
          ...prevSummary,
          totalAppointments: data.appointments.length,
          totalPending: data.appointments.filter((apt) => apt.status === "pending").length,
          totalApproved: data.appointments.filter((apt) => apt.status === "approved").length,
        }));
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await fetch("http://localhost/senior/backend/getusers.php");
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        setSummary((prevSummary) => ({
          ...prevSummary,
          totalPatients: data.totalSeniors,
        }));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchDailyAppointments = (date) => {
    const formattedDate = date.toLocaleDateString("en-CA");
    const filteredAppointments = appointments.filter(
      (apt) => apt.date.startsWith(formattedDate) && new Date(apt.date + " " + apt.time) >= new Date()
    );
    setDailyAppointments(filteredAppointments);
  };

  const filterUpcomingAppointments = () => {
    const now = new Date();
    const futureAppointments = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date + " " + appointment.time);
      return appointmentDate >= now; // Include today's appointments and future ones
    });
    setUpcomingAppointments(futureAppointments);
  };

  // Function to highlight dates with appointments starting from today
  const tileClassName = ({ date, view }) => {
    const formattedDate = date.toLocaleDateString("en-CA");
    const hasAppointment = appointments.some(
      (appointment) => appointment.date.startsWith(formattedDate)
    );
    const isUpcoming = upcomingAppointments.some(
      (appointment) => appointment.date.startsWith(formattedDate)
    );

    if (view === "month") {
      if (isUpcoming) {
        return "upcoming-appointment"; // Highlight upcoming and today's appointments
      }
      if (hasAppointment) {
        return "highlight"; // Highlight any appointment
      }
    }
    return "";
  };

  // Function to filter users by age range
  const filterByAge = (users) => {
    if (ageFilter === "all") {
      return users;
    }

    return users.filter((user) => {
      const age = user.age;
      switch (ageFilter) {
        case "60-65":
          return age >= 60 && age <= 65;
        case "66-70":
          return age >= 66 && age <= 70;
        case "71-75":
          return age >= 71 && age <= 75;
        case "76-80":
          return age >= 76 && age <= 80;
        case "81-85":
          return age >= 81 && age <= 85;
        case "85plus":
          return age >= 85;
        default:
          return true;
      }
    });
  };

  // Function to search by name, barangay ID, or health issue
  const searchUsers = (users) => {
    return users.filter((user) => {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      return (
        user.username.toLowerCase().includes(lowerCaseSearchQuery) || // Search by name
        user.barangay_id.toString().includes(lowerCaseSearchQuery) || // Search by barangay ID
        user.health_issue.toLowerCase().includes(lowerCaseSearchQuery) // Search by health issue
      );
    });
  };

  const filteredUsers = searchUsers(filterByAge(users));

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Hello, Admin</h1>
        <p className="text-xl">Good Morning, Admin</p>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="card total-patients">
            <h3>Total Seniors</h3>
            <p className="count">{loadingUsers ? "Loading..." : summary.totalPatients.toLocaleString()}</p>
          </div>
          <div className="card card-light">
            <h3>Total Appointments</h3>
            <p className="count">{loadingAppointments ? "Loading..." : summary.totalAppointments.toLocaleString()}</p>
          </div>
          <div className="card card-light">
            <h3>Total Pending</h3>
            <p className="count">{loadingAppointments ? "Loading..." : summary.totalPending.toLocaleString()}</p>
          </div>
          <div className="card card-light">
            <h3>Total Approved</h3>
            <p className="count">{loadingAppointments ? "Loading..." : summary.totalApproved.toLocaleString()}</p>
          </div>
        </div>

        {/* Appointments and Calendar Section */}
        <div className="flex gap-6 mt-6">
          {/* Daily Appointments Table */}
          <div className="appointments-section w-1/2">
            <h2 className="text-xl font-semibold">
              Appointments on {selectedDate.toDateString()}
            </h2>
            {loadingAppointments ? (
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
                      <td colSpan="4" className="text-center">
                        No appointments found
                      </td>
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
              tileClassName={tileClassName} // Pass function to highlight dates
            />
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="filter-search-section mt-6">
          <h2 className="text-xl font-semibold">Filter and Search</h2>

          {/* Age Filter */}
          <div className="age-filter">
            <label htmlFor="ageFilter">Filter by Age:</label>
            <select
              id="ageFilter"
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
            >
              <option value="all">All Ages</option>
              <option value="60-65">60-65</option>
              <option value="66-70">66-70</option>
              <option value="71-75">71-75</option>
              <option value="76-80">76-80</option>
              <option value="81-85">81-85</option>
              <option value="85plus">85+</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="search-input mt-4">
            <label htmlFor="searchQuery">Search by Name, Barangay ID, or Health Issue:</label>
            <input
              type="text"
              id="searchQuery"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Users Table Section */}
        <div className="users-section mt-6">
          <h2 className="text-xl font-semibold">Users/Seniors</h2>
          {loadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Barangay Number</th>
                  <th>Age</th>
                  <th>Sex</th>
                  <th>Address</th>
                  <th>Health Issue</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>{user.barangay_id}</td>
                      <td>{user.age}</td>
                      <td>{user.sex}</td>
                      <td>{user.address}</td>
                      <td>{user.health_issue}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
