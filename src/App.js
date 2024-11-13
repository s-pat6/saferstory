// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth } from './firebase';
import Login from './Login';
import Home from './Home';
import LocationPage from './LocationPage';
import LocationDisplayPage from './LocationDisplayPage'; // Import the new display component

function Navbar({ user }) {
  return (
    <nav className="navbar">
      <button onClick={() => (window.location.href = "/")} className="navbar-button">
        Home
      </button>
      <button onClick={() => (window.location.href = "/location")} className="navbar-button">
        Location
      </button>
      {user ? (
        <button onClick={() => auth.signOut()} className="navbar-button">
          Logout
        </button>
      ) : (
        <button onClick={() => (window.location.href = "/login")} className="navbar-button">
          Login
        </button>
      )}
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <Router>
      <div className="App">

        <Navbar user={user} />
        
        <Routes>
          {/* Home route that requires authentication */}
          <Route 
            path="/" 
            element={user ? <Home user={user} /> : <Login />} 
          />

          {/* Routes accessible without authentication */}
          <Route path="/location" element={<LocationPage />} />
          <Route path="/location/:locationId" element={<LocationDisplayPage />} /> {/* New route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
