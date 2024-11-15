// src/Home.js
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import "./Home.css"; // Import CSS file

function Home({ user }) {
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle button click and route to /location
  const goToLocation = () => {
    navigate("/location");
  };

  return (
    <div className="home-container">
      <h2>Welcome, {user.displayName}</h2>
      <button className="location-button" onClick={goToLocation}>
        Open Map
      </button>
    </div>
  );
}

export default Home;
