import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  CircleF,
  DirectionsRenderer,
} from "@react-google-maps/api";
import "./Map.css";

const MIN_DISTANCE = 100; // Define a minimum distance in meters
const GOOGLE_API_KEY = "AIzaSyBGeDv6MVSrDfuvcB58eUMglzxR4093h4g";
const LIBRARIES = ["places", "marker"]; // Keep as a regular array
const MAP_ID = "YOUR_MAP_ID"; // Replace with your actual Map ID from Google Cloud Console

const mapContainerStyle = {
  width: "1200px",
  height: "800px",
};
const center = {
  lat: 30.285,
  lng: -97.7335,
};

const mapOptions = {
  mapId: MAP_ID,
  disableDefaultUI: false,
  clickableIcons: true,
  scrollwheel: true,
};

function InputAutocomplete({ label, placeholder, onPlaceSelected }) {
  const autocompleteRef = useRef(null);
  const initializedRef = useRef(false);
  const inputId = label.toLowerCase().replace(" ", "-");
  const containerRef = useRef(null);

  useEffect(() => {
    const initializeAutocomplete = () => {
      if (initializedRef.current) return;
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        console.error('Google Maps Places API not loaded');
        return;
      }
      try {
        const autocompleteElement = containerRef.current;
        if (!autocompleteElement) return;
        // Create the PlaceAutocompleteElement instance
        const placeAutocomplete = new window.google.maps.places.PlaceAutocompleteElement();
        // Add place_changed event listener
        placeAutocomplete.addEventListener('place_changed', () => {
          const place = placeAutocomplete.getPlace();
          if (place && place.geometry) {
            const details = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              address: place.formatted_address || place.name
            };
            onPlaceSelected(details);
          }
        });
        autocompleteRef.current = placeAutocomplete;
        initializedRef.current = true;
      } catch (error) {
        console.error('Error initializing Places Autocomplete:', error);
      }
    };
    if (window.google && window.google.maps) {
      initializeAutocomplete();
    } else {
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMaps);
          initializeAutocomplete();
        }
      }, 100);
    }
    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
      initializedRef.current = false;
    };
  }, [onPlaceSelected]);

  return (
    <div className="input-container">
      <label htmlFor={inputId}>{label}</label>
      <gmp-place-autocomplete
        id={inputId}
        country="us"
        ref={containerRef}
      ></gmp-place-autocomplete>
    </div>
  );
}

function createMarkerElement(color, heading = null) {
  const container = document.createElement('div');
  container.style.width = '24px';
  container.style.height = '24px';
  container.style.position = 'relative';
  
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.style.position = 'absolute';
  svg.style.top = '0';
  svg.style.left = '0';
  
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z");
  path.setAttribute("fill", color);
  path.setAttribute("stroke", color);
  path.setAttribute("stroke-width", "2");
  
  svg.appendChild(path);
  container.appendChild(svg);
  
  if (heading !== null) {
    container.style.transform = `rotate(${heading}deg)`;
  }
  
  return container;
}

function Map() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [following, setFollowing] = useState(false);
  const [heading, setHeading] = useState(null);
  const [streetlights, setStreetlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef();
  const markersRef = useRef({});
  const [map, setMap] = useState(null);
  const previousHeading = useRef(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, []);

  // Fetch streetlights from MongoDB
  useEffect(() => {
    const fetchStreetlights = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/streetlights');
        if (!response.ok) {
          throw new Error('Failed to fetch streetlights');
        }
        const data = await response.json();
        setStreetlights(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching streetlights:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStreetlights();
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries: LIBRARIES,
    version: "weekly"
  });

  // Fetch user's current location and heading on component mount
  useEffect(() => {
    // Watch user's position with high frequency
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, heading: newHeading } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });

        // Update heading only if significant change detected
        if (
          newHeading !== null &&
          Math.abs(newHeading - previousHeading.current) > 2
        ) {
          setHeading(newHeading);
          previousHeading.current = newHeading;
        }
      },
      (error) => console.error("Error getting user location:", error),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    // Continuously update heading with device orientation
    const handleDeviceOrientation = (event) => {
      const { alpha } = event;
      if (alpha !== null) setHeading(alpha);
    };
    window.addEventListener("deviceorientation", handleDeviceOrientation);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, []);

  useEffect(() => {
    if (window.google && window.google.maps && map) {
      // Clean up existing markers
      Object.values(markersRef.current).forEach(marker => {
        marker.map = null;
      });
      markersRef.current = {};

      // Create new markers
      if (currentLocation) {
        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          map,
          position: currentLocation,
          content: createMarkerElement("#4285F4", heading),
          title: "Current Location"
        });
        markersRef.current.currentLocation = marker;
      }

      if (origin) {
        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          map,
          position: origin,
          content: createMarkerElement("#34A853"),
          title: "Origin"
        });
        markersRef.current.origin = marker;
      }

      if (destination) {
        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          map,
          position: destination,
          content: createMarkerElement("#EA4335"),
          title: "Destination"
        });
        markersRef.current.destination = marker;
      }
    }
  }, [currentLocation, origin, destination, heading, map]);

  const handlePlaceSelect = (details, type) => {
    if (type === "origin") {
      setOrigin(details);
    } else if (type === "destination") {
      setDestination(details);
    }

    if (origin && destination) {
      calculateRoute();
    }
  };

  const calculateRoute = () => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
          const route = result.routes[0].legs[0];
          setDistance(route.distance.text);
          setDuration(route.duration.text);
        }
      }
    );
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        ref={mapRef}
        options={mapOptions}
      >
        {!loading && !error && streetlights.map((streetlight) => (
          <CircleF
            key={streetlight._id}
            center={{ lat: streetlight.latitude, lng: streetlight.longitude }}
            radius={50}
            options={{
              fillColor: "#FFD700",
              fillOpacity: 0.2,
              strokeColor: "#FFD700",
              strokeOpacity: 0,
              strokeWeight: 0,
            }}
          />
        ))}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      <div className="search-container">
        <InputAutocomplete
          label="Origin"
          placeholder=""
          onPlaceSelected={(details) => handlePlaceSelect(details, "origin")}
        />
        <InputAutocomplete
          label="Destination"
          placeholder=""
          onPlaceSelected={(details) => handlePlaceSelect(details, "destination")}
        />
        <button onClick={calculateRoute} className="map-button">
          Get Directions
        </button>
        {distance && duration && (
          <div>
            <p>Distance: {distance}</p>
            <p>Duration: {duration}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Map;
