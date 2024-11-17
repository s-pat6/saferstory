import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { auth } from "./firebase";
import "./Navbar.css";
import { FaHome, FaMapMarkerAlt, FaShare } from "react-icons/fa";
import { MdAccountCircle, MdNoAccounts } from "react-icons/md";
export default function Navbar({ user, signOut }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <button onClick={() => navigate("/")} className="navbar-button">
        <FaHome />
      </button>
      <button onClick={() => navigate("/location")} className="navbar-button">
        <FaMapMarkerAlt />
      </button>
      <button
        onClick={() => navigate("/sharelocation")}
        className="navbar-button"
      >
        <FaShare />
      </button>
      {user ? (
        <button onClick={signOut} className="navbar-button">
          <MdNoAccounts />
        </button>
      ) : (
        <button onClick={() => auth.signOut()} className="navbar-button">
          <MdAccountCircle />
        </button>
      )}
    </nav>
  );
}
