import React, { useState, useEffect } from 'react';
import './App.css';
import MapView from './components/MapView';
import IncidentList from './components/IncidentList';
import StatsPanel from './components/StatsPanel';
import ReportGenerator from './components/ReportGenerator';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function App() {
  const [incidents, setIncidents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [incidentsRes, locationsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/incidents`),
        fetch(`${API_URL}/incidents/locations`),
        fetch(`${API_URL}/incidents/stats`)
      ]);

      const incidentsData = await incidentsRes.json();
      const locationsData = await locationsRes.json();
      const statsData = await statsRes.json();

      setIncidents(incidentsData);
      setLocations(locationsData);
      setStats(statsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleLocationSelect = (locationName) => {
    setSelectedLocation(locationName);
  };

  const filteredIncidents = selectedLocation
    ? incidents.filter(inc => inc.location_name === selectedLocation)
    : incidents;

  if (loading) {
    return <div className="loading">Cargando datos...</div>;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Prosegur - Sistema de Seguimiento de Incidencias</h1>
      </header>
      
      <div className="app-container">
        <div className="sidebar">
          <StatsPanel stats={stats} />
          <ReportGenerator 
            incidents={incidents}
            locations={locations}
            selectedLocation={selectedLocation}
          />
        </div>
        
        <div className="main-content">
          <MapView
            locations={locations}
            incidents={incidents}
            onLocationSelect={handleLocationSelect}
            selectedLocation={selectedLocation}
          />
          
          <IncidentList
            incidents={filteredIncidents}
            selectedLocation={selectedLocation}
            onClearSelection={() => setSelectedLocation(null)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
