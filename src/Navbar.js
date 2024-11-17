import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import "./Navbar.css";
import { FaHome, FaMapMarkerAlt, FaShare } from "react-icons/fa";
import { MdAccountCircle, MdNoAccounts } from "react-icons/md";

export default function Navbar({ user }) {
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
        <button
          onClick={() => auth.signOut()} // Use auth.signOut() directly here
          className="navbar-button"
        >
          <MdNoAccounts />
        </button>
      ) : (
        <button onClick={() => navigate("/login")} className="navbar-button">
          <MdAccountCircle />
        </button>
      )}
    </nav>
  );
}
