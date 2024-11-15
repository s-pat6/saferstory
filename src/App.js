// src/App.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { auth } from "./firebase";
import Login from "./Login";
import Home from "./Home";
import LocationPage from "./LocationPage";
import LocationDisplayPage from "./LocationDisplayPage"; // Import the new display component
import Map from "./Map";
import ErrorPage from "./ErrorPage"; // Import the new ErrorPage component

function Navbar({ user }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <button onClick={() => navigate("/")} className="navbar-button">
        Home
      </button>
      <button onClick={() => navigate("/location")} className="navbar-button">
        Location
      </button>
      {user ? (
        <button onClick={() => auth.signOut()} className="navbar-button">
          Logout
        </button>
      ) : (
        <button onClick={() => navigate("/")} className="navbar-button">
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

        <div className="container">
          <Routes>
            {/* Authenticated route for LocationPage */}
            <Route path="/location" element={user ? <Map /> : <ErrorPage />} />

            {/* Public route for LocationDisplayPage */}
            <Route
              path="/location/:locationId"
              element={<LocationDisplayPage />}
            />

            {/* Authenticated route for Home */}
            <Route path="/" element={user ? <Home user={user} /> : <Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
