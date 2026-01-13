const express = require('express');
const router = express.Router();
const db = require('../database');

// Webhook endpoint to receive incident data from workflow
router.post('/webhook', async (req, res) => {
  try {
    const { location_name, cause, description, severity, extracted_data, timestamp } = req.body;
    
    if (!location_name) {
      return res.status(400).json({ error: 'location_name is required' });
    }

    const database = db.getDb();
    
    // Find or create location
    return new Promise((resolve, reject) => {
      database.get(
        'SELECT id FROM locations WHERE name = ?',
        [location_name],
        (err, location) => {
          if (err) {
            console.error('Error finding location:', err);
            return res.status(500).json({ error: 'Database error' });
          }

          let locationId = location ? location.id : null;

          // Insert incident
          database.run(
            `INSERT INTO incidents (location_id, location_name, timestamp, cause, description, severity, extracted_data)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              locationId,
              location_name,
              timestamp || new Date().toISOString(),
              cause || null,
              description || null,
              severity || 'medium',
              extracted_data ? JSON.stringify(extracted_data) : null
            ],
            function(err) {
              if (err) {
                console.error('Error inserting incident:', err);
                return res.status(500).json({ error: 'Failed to save incident' });
              }

              res.json({
                success: true,
                incident_id: this.lastID,
                message: 'Incident saved successfully'
              });
            }
          );
        }
      );
    });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all incidents
router.get('/', (req, res) => {
  const database = db.getDb();
  
  database.all(
    `SELECT i.*, l.latitude, l.longitude, l.address
     FROM incidents i
     LEFT JOIN locations l ON i.location_id = l.id
     ORDER BY i.timestamp DESC`,
    [],
    (err, rows) => {
      if (err) {
        console.error('Error fetching incidents:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows.map(row => ({
        ...row,
        extracted_data: row.extracted_data ? JSON.parse(row.extracted_data) : null
      })));
    }
  );
});

// Get incidents by location
router.get('/location/:locationName', (req, res) => {
  const database = db.getDb();
  const locationName = req.params.locationName;
  
  database.all(
    `SELECT i.*, l.latitude, l.longitude, l.address
     FROM incidents i
     LEFT JOIN locations l ON i.location_id = l.id
     WHERE i.location_name = ?
     ORDER BY i.timestamp DESC`,
    [locationName],
    (err, rows) => {
      if (err) {
        console.error('Error fetching incidents by location:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows.map(row => ({
        ...row,
        extracted_data: row.extracted_data ? JSON.parse(row.extracted_data) : null
      })));
    }
  );
});

// Get all locations with incident counts
router.get('/locations', (req, res) => {
  const database = db.getDb();
  
  database.all(
    `SELECT l.*, 
            COUNT(i.id) as incident_count,
            MAX(i.timestamp) as last_incident
     FROM locations l
     LEFT JOIN incidents i ON l.id = i.location_id
     GROUP BY l.id
     ORDER BY l.name`,
    [],
    (err, rows) => {
      if (err) {
        console.error('Error fetching locations:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
    }
  );
});

// Get incident statistics
router.get('/stats', (req, res) => {
  const database = db.getDb();
  
  const stats = {};
  
  // Total incidents
  database.get('SELECT COUNT(*) as total FROM incidents', [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    stats.total = row.total;
    
    // Incidents by severity
    database.all(
      'SELECT severity, COUNT(*) as count FROM incidents GROUP BY severity',
      [],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        stats.bySeverity = rows.reduce((acc, row) => {
          acc[row.severity] = row.count;
          return acc;
        }, {});
        
        // Incidents by location
        database.all(
          `SELECT location_name, COUNT(*) as count 
           FROM incidents 
           GROUP BY location_name 
           ORDER BY count DESC`,
          [],
          (err, rows) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }
            stats.byLocation = rows;
            
            // Recent incidents (last 7 days)
            database.get(
              `SELECT COUNT(*) as count 
               FROM incidents 
               WHERE timestamp >= datetime('now', '-7 days')`,
              [],
              (err, row) => {
                if (err) {
                  return res.status(500).json({ error: 'Database error' });
                }
                stats.recent = row.count;
                res.json(stats);
              }
            );
          }
        );
      }
    );
  });
});

module.exports = router;
