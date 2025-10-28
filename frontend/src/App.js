import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { formatDistanceToNow } from "date-fns";
import "./App.css";

const earthquakeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/483/483361.png",
  iconSize: [25, 25],
});

function App() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [filteredQuakes, setFilteredQuakes] = useState([]);
  const [minMagnitude, setMinMagnitude] = useState(0);

  // Fetch live earthquake data
  useEffect(() => {
    fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson")
      .then((res) => res.json())
      .then((data) => {
        setEarthquakes(data.features);
        setFilteredQuakes(data.features);
      })
      .catch((err) => console.error(err));
  }, []);

  // Filter logic
  useEffect(() => {
    const filtered = earthquakes.filter((q) => q.properties.mag >= minMagnitude);
    setFilteredQuakes(filtered);
  }, [minMagnitude, earthquakes]);

  return (
    <div>
      {/* Header */}
      <header style={{ background: "#002b5c", color: "white", padding: "10px", textAlign: "center" }}>
        <h2>🌍 Earthquake Visualizer (Live)</h2>
      </header>

      {/* Filter Bar */}
      <div style={{
        background: "#ffcccb",
        padding: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
      }}>
        <label style={{ fontWeight: "bold" }}>Filter by Magnitude:</label>
        <select
          value={minMagnitude}
          onChange={(e) => setMinMagnitude(Number(e.target.value))}
          style={{
            padding: "5px",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        >
          <option value={0}>All (≥0)</option>
          <option value={2}>≥2.0</option>
          <option value={3}>≥3.0</option>
          <option value={4}>≥4.0</option>
          <option value={5}>≥5.0</option>
          <option value={6}>≥6.0</option>
        </select>
      </div>

      {/* Map */}
      <MapContainer
        center={[20.5937, 78.9629]} // India center
        zoom={5}
        style={{ height: "85vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {filteredQuakes.map((quake) => (
          <Marker
            key={quake.id}
            position={[
              quake.geometry.coordinates[1],
              quake.geometry.coordinates[0],
            ]}
            icon={earthquakeIcon}
          >
            <Popup>
              <strong>Magnitude:</strong> {quake.properties.mag} <br />
              <strong>Place:</strong> {quake.properties.place} <br />
              <strong>Time:</strong>{" "}
              {formatDistanceToNow(new Date(quake.properties.time))} ago
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;




      