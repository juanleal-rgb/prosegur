const express = require('express');
const router = express.Router();
const db = require('../database');
const { generateSummary, generatePDFReport } = require('../services/llmService');

// Generate AI summary of incidents
router.post('/summary', async (req, res) => {
  try {
    const { location_name, date_range } = req.body;
    const database = db.getDb();
    
    let query = 'SELECT * FROM incidents WHERE 1=1';
    const params = [];
    
    if (location_name) {
      query += ' AND location_name = ?';
      params.push(location_name);
    }
    
    if (date_range && date_range.start && date_range.end) {
      query += ' AND timestamp BETWEEN ? AND ?';
      params.push(date_range.start, date_range.end);
    }
    
    query += ' ORDER BY timestamp DESC';
    
    database.all(query, params, async (err, incidents) => {
      if (err) {
        console.error('Error fetching incidents for summary:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (incidents.length === 0) {
        return res.json({ summary: 'No incidents found for the selected criteria.' });
      }
      
      try {
        const summary = await generateSummary(incidents);
        res.json({ summary });
      } catch (llmError) {
        console.error('Error generating summary:', llmError);
        res.status(500).json({ error: 'Failed to generate summary' });
      }
    });
  } catch (error) {
    console.error('Summary generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate PDF report
router.post('/pdf', async (req, res) => {
  try {
    const { location_name, date_range, template } = req.body;
    const database = db.getDb();
    
    let query = 'SELECT * FROM incidents WHERE 1=1';
    const params = [];
    
    if (location_name) {
      query += ' AND location_name = ?';
      params.push(location_name);
    }
    
    if (date_range && date_range.start && date_range.end) {
      query += ' AND timestamp BETWEEN ? AND ?';
      params.push(date_range.start, date_range.end);
    }
    
    query += ' ORDER BY timestamp DESC';
    
    database.all(query, params, async (err, incidents) => {
      if (err) {
        console.error('Error fetching incidents for PDF:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      try {
        const pdfBuffer = await generatePDFReport(incidents, template);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=incident-report.pdf');
        res.send(pdfBuffer);
      } catch (pdfError) {
        console.error('Error generating PDF:', pdfError);
        res.status(500).json({ error: 'Failed to generate PDF report' });
      }
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
