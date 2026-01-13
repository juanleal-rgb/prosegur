import React from 'react';

const StatsPanel = ({ stats }) => {
  if (!stats) {
    return (
      <div className="stats-panel">
        <h2>Estadísticas</h2>
        <div className="empty-state">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="stats-panel">
      <h2>Estadísticas</h2>
      
      <div className="stat-item">
        <span className="stat-label">Total de Incidencias</span>
        <span className="stat-value">{stats.total || 0}</span>
      </div>
      
      <div className="stat-item">
        <span className="stat-label">Últimos 7 días</span>
        <span className="stat-value">{stats.recent || 0}</span>
      </div>
      
      {stats.bySeverity && Object.keys(stats.bySeverity).length > 0 && (
        <div className="stat-item">
          <span className="stat-label">Por Severidad</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
            {Object.entries(stats.bySeverity).map(([severity, count]) => (
              <div key={severity} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>{severity}:</span>
                <span style={{ fontWeight: '600' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {stats.byLocation && stats.byLocation.length > 0 && (
        <div className="stat-item">
          <span className="stat-label">Top Ubicaciones</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
            {stats.byLocation.slice(0, 3).map((loc) => (
              <div key={loc.location_name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>{loc.location_name}:</span>
                <span style={{ fontWeight: '600' }}>{loc.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPanel;
