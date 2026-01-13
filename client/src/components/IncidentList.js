import React from 'react';

const IncidentList = ({ incidents, selectedLocation, onClearSelection }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityBadge = (severity) => {
    const severityLower = severity?.toLowerCase() || 'medium';
    const badgeClass = `badge-${severityLower}`;
    return <span className={`stat-badge ${badgeClass}`}>{severity || 'N/A'}</span>;
  };

  return (
    <div className="incident-list">
      <h2>
        Incidencias
        {selectedLocation && (
          <span>
            - {selectedLocation}
            <span className="clear-filter" onClick={onClearSelection}>
              {' '}(limpiar filtro)
            </span>
          </span>
        )}
      </h2>
      
      {incidents.length === 0 ? (
        <div className="empty-state">
          No hay incidencias registradas{selectedLocation ? ' para esta ubicación' : ''}.
        </div>
      ) : (
        incidents.map((incident) => (
          <div key={incident.id} className="incident-item">
            <div className="incident-header">
              <span className="incident-location">{incident.location_name}</span>
              <span className="incident-date">{formatDate(incident.timestamp)}</span>
            </div>
            
            <div className="incident-details">
              {incident.cause && (
                <div className="incident-detail">
                  <strong>Causa:</strong> {incident.cause}
                </div>
              )}
              {incident.description && (
                <div className="incident-detail">
                  <strong>Descripción:</strong> {incident.description}
                </div>
              )}
              <div className="incident-detail">
                <strong>Severidad:</strong> {getSeverityBadge(incident.severity)}
              </div>
              {incident.status && (
                <div className="incident-detail">
                  <strong>Estado:</strong> {incident.status}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default IncidentList;
