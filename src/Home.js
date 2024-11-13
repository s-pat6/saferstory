// src/Home.js
import React from 'react';

function Home({ user }) {
  return (
    <div>
      <h2>Welcome, {user.displayName}</h2>
    </div>
  );
}

export default Home;
