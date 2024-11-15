// src/LocationDisplayPage.js
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Set up default Leaflet icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationDisplayPage() {
  const { locationId } = useParams(); // Get the location ID from the URL
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create a reference to the specific location ID in the database
    const locationRef = ref(db, `user_locations/${locationId}`);
    const unsubscribe = onValue(
      locationRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setLocation(data);
        } else {
          setError("Location not found.");
        }
      },
      (err) => {
        console.error("Error fetching location:", err);
        setError("Failed to load location.");
      }
    );

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [locationId]);

  return (
    <div>
      {console.log("the map")}
      <h2>Current Location</h2>
      {location ? (
        <>
          <p>
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </p>
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={15}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[location.latitude, location.longitude]}>
              <Popup>Your Current Location</Popup>
            </Marker>
          </MapContainer>
        </>
      ) : (
        <p>Loading location...</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LocationDisplayPage;
