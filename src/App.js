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
import Navbar from "./Navbar";
import "./App.css";

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
      <div className="app-container">
        <Routes>
          <Route path="/location" element={user ? <Map /> : <ErrorPage />} />
          <Route
            path="/sharelocation"
            element={user ? <LocationPage /> : <ErrorPage />}
          />
          <Route
            path="/location/:locationId"
            element={<LocationDisplayPage />}
          />
          <Route path="/" element={user ? <Home user={user} /> : <Login />} />
        </Routes>
        <Navbar user={user} />
      </div>
    </Router>
  );
}

export default App;
