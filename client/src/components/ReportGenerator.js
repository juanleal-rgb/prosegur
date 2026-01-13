import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const ReportGenerator = ({ incidents, locations, selectedLocation }) => {
  const [locationFilter, setLocationFilter] = useState(selectedLocation || '');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    setSummary('');
    
    try {
      const response = await axios.post(`${API_URL}/reports/summary`, {
        location_name: locationFilter || null,
        date_range: dateStart && dateEnd ? {
          start: dateStart,
          end: dateEnd
        } : null
      });
      
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary('Error al generar el resumen. Por favor, intente nuevamente.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleGeneratePDF = async () => {
    setLoadingPDF(true);
    
    try {
      const response = await axios.post(
        `${API_URL}/reports/pdf`,
        {
          location_name: locationFilter || null,
          date_range: dateStart && dateEnd ? {
            start: dateStart,
            end: dateEnd
          } : null,
          template: 'default'
        },
        {
          responseType: 'blob'
        }
      );
      
      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `informe-incidencias-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Por favor, intente nuevamente.');
    } finally {
      setLoadingPDF(false);
    }
  };

  return (
    <div className="report-generator">
      <h2>Generar Informes</h2>
      
      <div className="form-group">
        <label>Ubicación (opcional)</label>
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="">Todas las ubicaciones</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.name}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label>Fecha Inicio (opcional)</label>
        <input
          type="date"
          value={dateStart}
          onChange={(e) => setDateStart(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label>Fecha Fin (opcional)</label>
        <input
          type="date"
          value={dateEnd}
          onChange={(e) => setDateEnd(e.target.value)}
        />
      </div>
      
      <div className="button-group">
        <button
          className="btn btn-primary"
          onClick={handleGenerateSummary}
          disabled={loadingSummary}
        >
          {loadingSummary ? 'Generando...' : 'Generar Resumen'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleGeneratePDF}
          disabled={loadingPDF}
        >
          {loadingPDF ? 'Generando...' : 'Generar PDF'}
        </button>
      </div>
      
      {summary && (
        <div className="summary-display">
          <strong>Resumen:</strong>
          <br />
          {summary}
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
