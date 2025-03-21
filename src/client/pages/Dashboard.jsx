import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import SeniorCare from "./SeniorCare";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Dashboard.css";

// Import images properly from src/assets/images/
import doctorImage from "./images/doctor.png";
import arrowIcon from "./images/arrow.png";
import officialBoy from "./images/boy.png";
import officialGirl from "./images/girl.png";
import  chat from "./images/chat.png"
import  emergency from "./images/emergency.png"
const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  const services = [
    {
      name: "Health Check Up",
      description:
        "Health check-ups are routine medical examinations aimed at evaluating overall well-being, identifying potential health issues early, and managing any existing conditions effectively. These assessments often include physical evaluations, diagnostic tests, and consultations to ensure proper preventive care and treatment planning.",
      image: doctorImage,
    },
    {
      name: "Medicine",
      description:
        "Medicine encompasses the diagnosis, treatment, and prevention of diseases through prescribed medications tailored to manage specific health conditions. This involves careful assessment, appropriate drug selection, and patient education to ensure effective outcomes and minimize side effects, promoting overall health and recovery.",
      image: emergency,
    },
    {
      name: "Eye Check Up",
      description:
        "Eye checkups are specialized evaluations focused on assessing vision and detecting eyerelated issues, such as refractive errors or diseases like glaucoma. These examinations include vision tests, eye pressure checks, and consultations to ensure optimal eye health and corrective solutions if necessary.",
      image: chat,
    },
    {
      name: "Dental Check Up",
      description:
        "Dental checkups are comprehensive oral health assessments designed to maintain healthy teeth and gums, prevent cavities, and identify dental problems early. These visits typically include cleaning, examinations, and advice on oral hygiene practices to ensure long-term dental care.",
      image: chat,
    },
    {
      name: "Xray Examination",
      description:
        "Xray checkups are diagnostic imaging procedures that provide detailed views of bones and internal organs to detect injuries, fractures, or underlying health conditions. This noninvasive process aids in accurate diagnosis and treatment planning for a wide range of medical concerns.",
      image: chat,
    },
    {
      name: "Massage Therapy",
      description:
        "Massage therapy is a therapeutic practice aimed at relieving muscle tension, reducing stress, and improving circulation through targeted manipulation of soft tissues. This treatment fosters relaxation, alleviates discomfort, and supports physical and mental wellbeing in a holistic manner.",
      image: chat,
    },
  ];

  
  // Fetch Events from Backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost/senior/backend/events.php");
        if (!response.ok) {
          console.error("HTTP Error:", response.status);
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        console.log("Fetched Events:", data); // Debugging
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  // Filter events for the selected date
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date_time).toDateString();
    return eventDate === date.toDateString();
  });

  return (
    <div className="dashboard">
      <Navbar role="client" />

      {/* Hero Section */}
      <section className="homepage">
        <div className="home-contents">
          <div className="home-header">
            <p className="home-subheader">companiON</p>
            <h1 className="home-title">Senior Care Services</h1>
            <p className="home-description">
              Maalaga, makatao, at angkop na serbisyo upang matulungan ang
              nakatatanda na mamuhay nang komportable, ligtas, at may dignidad.
            </p>
          </div>
        </div>
        <div className="facebook-box">
          <iframe
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FBarangay-Gen-T-De-Leon-61550950657692&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
            width="500"
            height="500"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          ></iframe>
        </div>
      </section>

      {/* Senior Care Section */}
      <section className="section">
        <h2>Senior Care</h2>
        <SeniorCare />
      </section>

      {/* Medical Services Section */}
      <section className="service-section">
        <div className="service-header">
          <p className="service-subheader">SERVICE</p>
          <h1 className="service-title">Our Medical Services</h1>
        </div>
        <div className="service-content">
          <div className="service-image">
            <img src={doctorImage} alt="Doctor" />
          </div>
          <div className="service-details">
            <div className="service-texts">
              <h2 className="service-name">{services[currentServiceIndex].name}</h2>
              <button
                className="service-icon"
                onClick={() =>
                  setCurrentServiceIndex((prev) => (prev + 1) % services.length)
                }
              >
                <img src={arrowIcon} alt="Next Service" />
              </button>
              <p className="service-description">
                {services[currentServiceIndex].description}
              </p>
            </div>
            <button className="service-book-button">
              <Link to="/senior-care" className="book-link">Book</Link>
            </button>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="events-section">
        <div className="events-header">
          <p className="events-subheader">EVENTS</p>
          <h1 className="events-title">Our Important Events</h1>
        </div>
        <div className="events-container">
          <div className="calendar-container">
            <Calendar onChange={setDate} value={date} locale="en-US" />
          </div>
          <div className="events-list">
            <h3>Events on {date.toDateString()}</h3>
            {filteredEvents.length > 0 ? (
              <ul>
                {filteredEvents.map((event) => (
                  <li key={event.id}>
                    <strong>{event.event_title}</strong> - {event.event_description}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No events for this date. Try selecting another date.</p>
            )}
          </div>
        </div>
      </section>

      {/* Barangay Officials Section */}
      <section className="barangay-officials-section">
        <div className="officials-header">
          <p className="officials-subheader">OFFICIALS</p>
          <h1 className="officials-title">Our Barangay Officials</h1>
        </div>
        <div className="officials-grid">
          {[
            { name: "Ferrer, Rizalino", position: "Punong Barangay" },
            { name: "Matos, Rica", position: "Kagawad" },
            { name: "De Gula, Susan", position: "Kagawad" },
            { name: "Dela Cruz, Zella", position: "Kagawad" },
            { name: "Moises, Beltran", position: "Kagawad" },
            { name: "Bernardino, Bogie", position: "Kagawad" },
            { name: "Edgardo, Dizon", position: "Kagawad" },
            { name: "Colibao, Shennel", position: "Kagawad" },
          ].map((official, index) => (
            <div className="official-card" key={index}>
              <img
                src={index % 2 === 0 ? officialBoy : officialGirl}
                alt="Barangay Official"
                className="official-image"
              />
              <p className="official-name">{official.name}</p>
              <p className="official-position">{official.position}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
