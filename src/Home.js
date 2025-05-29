// src/Home.js// src/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home({ user }) {
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle button click and route to /location
  const goToLocation = () => {
    navigate("/location");
  };

  return (
    <div className="home-container page-wrapper">
      {" "}
      {/* Apply padding to the top of the entire page */}
      {/* Introduction Section */}
      <div className="section intro-section">
        <h3>Welcome to Safer Story</h3>
        <p>
          Safer Story is a platform dedicated to enhancing the safety of
          Austin's streets.
        </p>
      </div>
      {/* Mission Section */}
      <div className="section mission-section">
        <h3>Our Mission</h3>
        <p>
          Our mission is to keep Austin streets safe by leveraging technology to
          create safer walking routes and build a more secure community.
        </p>
      </div>
      {/* Current Features Section */}
      <div className="section features-section">
        <h3>Current Features</h3>
        <ul>
          <li>Location sharing with friends and family for added safety.</li>
          <li>
            Navigation enhanced by access to streetlight data to prioritize
            well-lit routes.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
