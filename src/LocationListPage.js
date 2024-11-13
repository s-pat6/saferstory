// src/LocationListPage.js
import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, onValue } from 'firebase/database';

function LocationListPage() {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = () => {
      try {
        const locationRef = ref(db, "user_locations");
        onValue(locationRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const locationData = Object.keys(data).map(key => ({
              id: key,
              ...data[key]
            }));
            setLocations(locationData);
          } else {
            setLocations([]); // No data found
          }
        });
      } catch (err) {
        console.error("Error fetching locations:", err);
        setError("Failed to load locations.");
      }
    };

    fetchLocations();
  }, []);

  return (
    <div>
      <h2>Saved Locations</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {locations.length > 0 ? (
        <ul>
          {locations.map(location => (
            <li key={location.id}>
              <p>Latitude: {location.latitude}</p>
              <p>Longitude: {location.longitude}</p>
              <p>Timestamp: {new Date(location.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No locations found.</p>
      )}
    </div>
  );
}

export default LocationListPage;
