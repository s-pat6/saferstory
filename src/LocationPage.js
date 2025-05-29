// src/LocationPage.js
import React, { useEffect, useState, useCallback } from "react";
import { db } from "./firebase";
import { ref, push, set, update } from "firebase/database";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import "./LocationPage.css";

const GOOGLE_API_KEY = "AIzaSyBGeDv6MVSrDfuvcB58eUMglzxR4093h4g";
const LIBRARIES = ["places", "marker"];
const mapContainerStyle = {
  width: "960px",
  height: "600px",
  borderRadius: "12px",
  margin: "1rem 0"
};

function LocationPage() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [shareableUrl, setShareableUrl] = useState(null);
  const [locationId, setLocationId] = useState(
    localStorage.getItem("locationId")
  );

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries: LIBRARIES,
    version: "weekly"
  });

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
          {loadError && <p className="error-message">Error loading map</p>}
          {!isLoaded ? (
            <p className="location-text">Loading map...</p>
          ) : (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={{ lat: location.latitude, lng: location.longitude }}
              zoom={15}
              options={{
                disableDefaultUI: false,
                clickableIcons: true,
                scrollwheel: true,
                mapId: "YOUR_MAP_ID"
              }}
            >
              <MarkerF
                position={{ lat: location.latitude, lng: location.longitude }}
                title="Your Current Location"
              />
            </GoogleMap>
          )}
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
