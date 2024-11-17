// src/LocationPage.js
import React, { useEffect, useState, useCallback } from "react";
import { db } from "./firebase";
import { ref, push, set, update } from "firebase/database";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./LocationPage.css";
import L from "leaflet"; // Explicitly import leaflet as L for icon creation
/* src/index.css or src/App.css */
import "leaflet/dist/leaflet.css";

// Set default Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationPage() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [shareableUrl, setShareableUrl] = useState(null);
  const [locationId, setLocationId] = useState(
    localStorage.getItem("locationId")
  );

  const updateLocationInDatabase = useCallback(
    (position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });

      if (locationId) {
        const locationRef = ref(db, `user_locations/${locationId}`);
        update(locationRef, {
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
        });
      }
    },
    [locationId]
  );

  useEffect(() => {
    const initializeLocationInDatabase = async (latitude, longitude) => {
      try {
        if (!locationId) {
          const newLocationRef = push(ref(db, "user_locations"));
          await set(newLocationRef, {
            latitude,
            longitude,
            timestamp: new Date().toISOString(),
          });

          const locId = newLocationRef.key;
          setLocationId(locId);
          localStorage.setItem("locationId", locId);
          setShareableUrl(`${window.location.origin}/location/${locId}`);
        } else {
          setShareableUrl(`${window.location.origin}/location/${locationId}`);
          navigator.geolocation.watchPosition(
            updateLocationInDatabase,
            (err) => {
              console.error("Error watching location:", err);
            }
          );
        }
      } catch (err) {
        console.error("Error initializing location in Realtime Database:", err);
        setError("Failed to initialize location. Please try again.");
      }
    };

    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            initializeLocationInDatabase(latitude, longitude);
          },
          (err) => {
            setError(
              "Location access denied. Please enable location permissions."
            );
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };

    fetchLocation();
  }, [locationId, updateLocationInDatabase]);

  const generateNewUrl = async () => {
    try {
      const newLocationRef = push(ref(db, "user_locations"));
      await set(newLocationRef, {
        latitude: location?.latitude,
        longitude: location?.longitude,
        timestamp: new Date().toISOString(),
      });

      const newLocId = newLocationRef.key;
      setLocationId(newLocId);
      localStorage.setItem("locationId", newLocId);
      setShareableUrl(`${window.location.origin}/location/${newLocId}`);
    } catch (err) {
      console.error("Error generating new URL:", err);
      setError("Failed to generate new URL.");
    }
  };

  return (
    <div className="lp-container">
      <h2 className="lp-h2">Location Page</h2>
      {location ? (
        <>
          <p className="location-text">
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </p>
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={13}
            style={{ height: "70%", width: "100%", margin: "1rem 0" }}
            dragging={true}
            zoomControl={true}
            scrollWheelZoom={true}
            doubleClickZoom={true}
            touchZoom={true}
          >
            <TileLayer
              url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <Marker position={[location.latitude, location.longitude]}>
              <Popup>Your Current Location</Popup>
            </Marker>
          </MapContainer>
        </>
      ) : (
        <p className="location-text">Loading location...</p>
      )}
      {shareableUrl && (
        <p className="shareable-url">
          Shareable URL: <a href={shareableUrl}>{shareableUrl}</a>
        </p>
      )}
      <button onClick={generateNewUrl} className="lp-button">
        Generate New URL
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default LocationPage;
