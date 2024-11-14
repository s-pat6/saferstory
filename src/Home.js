// src/Home.js// src/Home.js
import React from 'react';
import './Home.css';

function Home({ user }) {
  return (
    <div className="page-wrapper"> {/* Apply padding to the top of the entire page */}
      {/* Introduction Section */}
      <div className="section intro-section">
        <h3>Welcome to Safer Story</h3>
        <p>Safer Story is a platform dedicated to enhancing the safety of Austin's streets.</p>
      </div>

      {/* Mission Section */}
      <div className="section mission-section">
        <h3>Our Mission</h3>
        <p>Our mission is to keep Austin streets safe by leveraging technology to create safer walking routes and build a more secure community.</p>
      </div>

      {/* Current Features Section */}
      <div className="section features-section">
        <h3>Current Features</h3>
        <ul>
          <li>Location sharing with friends and family for added safety.</li>
          <li>Navigation enhanced by access to streetlight data to prioritize well-lit routes.</li>
        </ul>
      </div>

      {/* Future Features Section */}
      <div className="section future-features-section">
        <h3>Future Features</h3>
        <ul>
          <li>Safe Spot Partnerships: Collaborations with local businesses to offer safe places in emergencies.</li>
          <li>Community Reports: A platform for community-driven safety reports and updates.</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
