import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Navbar from "../components/Navbar";

const SeniorCare = ({ role, handleLogout }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [reservedSlots, setReservedSlots] = useState([]);

  const services = ["Health Check-up", "Free Medicine", "Massage", "Dental Check-up", "Eye Check-up"];
  const times = {
    "Health Check-up": ["9:00 AM", "1:00 PM", "3:00 PM"],
    "Free Medicine": ["10:00 AM", "2:00 PM", "4:00 PM"],
    "Massage": ["11:00 AM", "2:30 PM", "5:00 PM"],
    "Dental Check-up": ["9:30 AM", "12:00 PM", "3:30 PM"],
    "Eye Check-up": ["10:30 AM", "1:30 PM", "4:30 PM"],
  };

  useEffect(() => {
    fetchReservedSlots();
  }, []);

  // Fetch appointments from the server (for the logged-in user)
  const fetchReservedSlots = async () => {
    try {
      const response = await fetch("http://localhost/senior/backend/appointments.php", {
        method: "GET",
        credentials: "include", // Include cookies for session management
      });
      const data = await response.json();
      setReservedSlots(data.appointments || []);
    } catch (error) {
      console.error("Error fetching reserved slots:", error);
    }
  };

  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
    setAvailableTimes(times[e.target.value] || []);
  };

  const handleReservation = async () => {
    const newReservation = {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      status: "Pending Approval",
    };

    try {
      const response = await fetch("http://localhost/senior/backend/appointments.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReservation),
        credentials: "include", // Ensure session cookie is sent
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setReservedSlots([...reservedSlots, newReservation]);
        alert("Your reservation is confirmed. It is pending approval.");
        closeModal();
      } else {
        alert("Error in reservation: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error making reservation:", error);
    }
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedService("");
    setSelectedDate("");
    setSelectedTime("");
  };

  return (
    <div>
      <Navbar role={role} handleLogout={handleLogout} />
      <h4>SENIOR CARE</h4>
      <button onClick={openModal}>Reserve a Slot</button>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <label>Select a Service:</label>
        <select value={selectedService} onChange={handleServiceChange}>
          <option value="">Select a service</option>
          {services.map((service, index) => (
            <option key={index} value={service}>{service}</option>
          ))}
        </select>

        <label>Select a Date:</label>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />

        <label>Select a Time:</label>
        <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
          <option value="">Select a time</option>
          {availableTimes.map((time, index) => (
            <option key={index} value={time}>{time}</option>
          ))}
        </select>

        <button onClick={handleReservation}>Confirm Reservation</button>
        <button onClick={closeModal}>Close</button>
      </Modal>

      <div>
        <h2>Reserved Slots</h2>
        {reservedSlots.length > 0 ? (
          <ul>
            {reservedSlots.map((slot, index) => (
              <li key={index}>
                {slot.service} on {slot.date} at {slot.time} (Status: {slot.status})
              </li>
            ))}
          </ul>
        ) : (
          <p>No reserved slots.</p>
        )}
      </div>
    </div>
  );
};

export default SeniorCare;
