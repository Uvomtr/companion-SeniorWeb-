import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./Events.css";

const API_URL = "http://localhost/senior/backend/events.php";

const Events = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState(""); // New organizer state
  const [loading, setLoading] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterDate, setFilterDate] = useState(""); // Date filter state

  useEffect(() => {
    // Check if a filterDate is set, otherwise default to today's date
    const formattedDate = filterDate || dateTime.toISOString().split("T")[0];
    const url = `${API_URL}?date=${formattedDate}`; // Filter by selected date

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.events)) {
          let sortedEvents = data.events;
          if (sortOrder === "asc") {
            sortedEvents = sortedEvents.sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
          } else {
            sortedEvents = sortedEvents.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));
          }
          setEvents(sortedEvents);
        } else {
          console.error("Failed to load events:", data.message || "No events found");
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, [dateTime, sortOrder, filterDate]); // Remove showAllEvents from dependencies

  const openModal = (event = null) => {
    setModalIsOpen(true);
    if (event) {
      setOrganizer(event.organizer);
      setEventTitle(event.event_title);
      setEventDescription(event.event_description);
      setDateTime(new Date(event.date_time));
      setLocation(event.location);
      setEditingEventId(event.id);
    } else {
      setOrganizer("");
      setEventTitle("");
      setEventDescription("");
      setDateTime(new Date());
      setLocation("");
      setEditingEventId(null);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setOrganizer("");
    setEventTitle("");
    setEventDescription("");
    setLocation("");
    setEditingEventId(null);
  };

  const validateInputs = () => {
    if (!organizer || !eventTitle || !eventDescription || !dateTime || !location) {
      alert("Please fill out all fields.");
      return false;
    }
    return true;
  };

  const saveEvent = () => {
    if (!validateInputs()) return;

    setLoading(true);
    const formattedDateTime = dateTime.toISOString().slice(0, 19).replace("T", " ");

    const newEvent = {
      id: editingEventId,
      organizer,
      event_title: eventTitle,
      event_description: eventDescription,
      date_time: formattedDateTime,
      location,
    };

    fetch(API_URL, {
      method: editingEventId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setEvents((prevEvents) =>
            editingEventId
              ? prevEvents.map((event) =>
                  event.id === editingEventId ? { ...newEvent, id: event.id } : event
                )
              : [...prevEvents, { ...newEvent, id: data.id }]
          );
          closeModal();
        } else {
          alert("Failed to save event: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error saving event:", error);
      })
      .finally(() => setLoading(false));
  };

  const deleteEvent = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setLoading(true);

      fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }), // Ensure ID is sent in the body
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
          } else {
            alert("Failed to delete event: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Error deleting event:", error);
        })
        .finally(() => setLoading(false));
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(new Date(date));
  };

  return (
    <div className="events-container">
      <div className="events-header">
        <h2>Events</h2>
        <button onClick={() => openModal()} className="add-event-button">Add Event</button>
      </div>

      <div className="filters">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)} // Only filter by date
        />
      </div>

      <div className="sort-options">
        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="asc">Sort Ascending</option>
          <option value="desc">Sort Descending</option>
        </select>
      </div>

      <table className="events-table">
        <thead>
          <tr>
            <th>Organizer</th>
            <th>Event Title</th>
            <th>Date and Time</th>
            <th>Description</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event) => (
              <tr key={event.id}>
                <td>{event.organizer}</td>
                <td>{event.event_title}</td>
                <td>{formatDate(event.date_time)}</td>
                <td>{event.event_description}</td>
                <td>{event.location}</td>
                <td>
                  <button className="edit-button" onClick={() => openModal(event)}>✏️</button>
                  <button className="delete-button" onClick={() => deleteEvent(event.id)}>🗑️</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-events">No events available</td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        <h2>{editingEventId ? "Edit Event" : "Add Event"}</h2>
        <input type="text" placeholder="Organizer Name" value={organizer} onChange={(e) => setOrganizer(e.target.value)} />
        <input type="text" placeholder="Event Title" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
        <input type="datetime-local" value={dateTime.toISOString().slice(0, 16)} onChange={(e) => setDateTime(new Date(e.target.value))} />
        <textarea placeholder="Event Description" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} rows="3"></textarea>
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <button onClick={saveEvent} className="save-button">{loading ? "Saving..." : "Save Event"}</button>
        <button onClick={closeModal} className="cancel-button">Cancel</button>
      </Modal>
    </div>
  );
};

export default Events;
