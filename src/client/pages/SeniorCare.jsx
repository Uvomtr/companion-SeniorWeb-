import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./SeniorCare.css";
import Navbar from "../components/Navbar";

const SeniorCare = ({ handleLogout }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [reservedSlots, setReservedSlots] = useState([]);
  const [remarks, setRemarks] = useState("");  // New state for remarks

  const [todayDate, setTodayDate] = useState(""); // State for today's date

  const services = ["Health Check-up", "Free Medicine", "Massage", "Dental Check-up", "Eye Check-up"];
  const times = {
    "Health Check-up": ["9:00 AM", "1:00 PM", "3:00 PM"],
    "Free Medicine": ["10:00 AM", "2:00 PM", "4:00 PM"],
    "Massage": ["11:00 AM", "2:30 PM", "5:00 PM"],
    "Dental Check-up": ["9:30 AM", "12:00 PM", "3:30 PM"],
    "Eye Check-up": ["10:30 AM", "1:30 PM", "4:30 PM"],
  };

  useEffect(() => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];  // Extracts only the date part
    setTodayDate(formattedDate);

    fetchReservedSlots();
  }, []);

  const fetchReservedSlots = async () => {
    try {
      const response = await fetch("http://localhost/senior/backend/appointments.php", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      
      // Filter out past appointments
      const filteredSlots = data.appointments.filter((slot) => slot.date >= todayDate);
      setReservedSlots(filteredSlots || []);
    } catch (error) {
      console.error("Error fetching reserved slots:", error);
    }
  };

  const handleServiceChange = (e) => {
    const service = e.target.value;
    setSelectedService(service);
    setAvailableTimes(times[service] || []);
  };

  const handleReservation = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      alert("Please select all fields before confirming.");
      return;
    }

    const newReservation = {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      remarks: remarks, // Include remarks in the reservation
      status: "Pending Approval",
    };

    try {
      const response = await fetch("http://localhost/senior/backend/appointments.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReservation),
        credentials: "include",
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

  const openModal = (content) => {
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedService("");
    setSelectedDate("");
    setSelectedTime("");
    setRemarks("");  // Reset remarks when closing modal
  };

  return (
    <div className="senior-care-container">
      <Navbar role="client" setSelectedService={setSelectedService} />

      <h4 className="section-title">SENIOR CARE</h4>
      <h2 className="section-appointment">Book an Appointment</h2>

      <ol className="instruction-list">
        <li><strong>Piliin ang Serbisyong Kailangan:</strong> Hanapin ang mga serbisyong pangkalusugan.</li>
        <li><strong>Pumili ng Araw at Oras ng Appointment:</strong> Piliin ang serbisyo at oras.</li>
        <li><strong>Kumpirmahin ang Appointment:</strong> Pindutin ang "Kumpirmahin".</li>
        <li><strong>Tandaan ang Detalye ng Appointment:</strong> Tingnan ang confirmation message.</li>
        <li><strong>Dumating sa Takdang Oras ng Appointment:</strong> Dumating sa tamang oras.</li>
      </ol>

      <p className="note"><strong>Paalala:</strong> May prayoridad kayo sa clinic.</p>

      <div className="button-container">
        <button className="secondary-button" onClick={() => openModal("reserveSlot")}>Reserve a Slot</button>
        <button className="secondary-button" onClick={() => openModal("viewReservedSlot")}>View Reserved Slot</button>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Reserve Slot Modal" className="modal">
        {modalContent === "reserveSlot" && (
          <>
            <h2>Reserve a Slot</h2>
            <label>Select a Service:</label>
            <select value={selectedService} onChange={handleServiceChange} className="select-box">
              <option value="">Select a service</option>
              {services.map((service, index) => (
                <option key={index} value={service}>{service}</option>
              ))}
            </select>
            <label>Select a Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
              min={todayDate}  // Set the minimum date to today
            />
            <label>Select a Time:</label>
            <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="select-box">
              <option value="">Select a time</option>
              {availableTimes.map((time, index) => (
                <option key={index} value={time}>{time}</option>
              ))}
            </select>
            <button className="confirm-btn" onClick={handleReservation}>Confirm Reservation</button>
          </>
        )}

        {modalContent === "viewReservedSlot" && (
          <>
            <h2>Your Reserved Slots</h2>
            <table className="reserved-slots-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {reservedSlots.map((slot, index) => (
                  <tr key={index}>
                    <td>{slot.service}</td>
                    <td>{slot.date}</td>
                    <td>{slot.time}</td>
                    <td>{slot.status}</td>
                    <td>{slot.remarks || "No remarks"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <button className="close-btn" onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default SeniorCare;
