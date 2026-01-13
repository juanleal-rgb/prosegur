import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = ({ locations, incidents, onLocationSelect, selectedLocation }) => {
  // Calculate center point (Madrid default)
  const center = [40.4168, -3.7038];

  // Count incidents per location
  const getIncidentCount = (locationName) => {
    return incidents.filter(inc => inc.location_name === locationName).length;
  };

  // Get severity color based on incident count
  const getColor = (count) => {
    if (count === 0) return 'green';
    if (count < 3) return 'yellow';
    if (count < 6) return 'orange';
    return 'red';
  };

  return (
    <div className="map-container">
      <h2>Mapa de Ubicaciones</h2>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => {
          if (!location.latitude || !location.longitude) return null;
          
          const incidentCount = getIncidentCount(location.name);
          const color = getColor(incidentCount);
          const isSelected = selectedLocation === location.name;

          return (
            <CircleMarker
              key={location.id}
              center={[location.latitude, location.longitude]}
              radius={isSelected ? 15 : 10}
              pathOptions={{
                color: isSelected ? '#667eea' : color,
                fillColor: isSelected ? '#667eea' : color,
                fillOpacity: 0.6,
                weight: isSelected ? 3 : 2
              }}
              eventHandlers={{
                click: () => onLocationSelect(location.name)
              }}
            >
              <Popup>
                <div>
                  <strong>{location.name}</strong>
                  <br />
                  {location.address && <span>{location.address}</span>}
                  <br />
                  <span style={{ color: color, fontWeight: 'bold' }}>
                    {incidentCount} {incidentCount === 1 ? 'incidencia' : 'incidencias'}
                  </span>
                  {location.last_incident && (
                    <>
                      <br />
                      <small>
                        Última: {new Date(location.last_incident).toLocaleDateString('es-ES')}
                      </small>
                    </>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
