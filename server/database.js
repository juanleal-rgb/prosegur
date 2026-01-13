const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'incidents.db');

let db = null;

const init = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database');
      createTables().then(resolve).catch(reject);
    });
  });
};

const createTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Locations table
      db.run(`CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT,
        latitude REAL,
        longitude REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('Error creating locations table:', err);
          reject(err);
          return;
        }
      });

      // Incidents table
      db.run(`CREATE TABLE IF NOT EXISTS incidents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        location_id INTEGER,
        location_name TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        cause TEXT,
        description TEXT,
        severity TEXT,
        status TEXT DEFAULT 'open',
        extracted_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (location_id) REFERENCES locations(id)
      )`, (err) => {
        if (err) {
          console.error('Error creating incidents table:', err);
          reject(err);
          return;
        }
      });

      // Insert sample locations (Zara stores)
      db.run(`INSERT OR IGNORE INTO locations (name, address, latitude, longitude) VALUES
        ('Zara Centro', 'Calle Gran Vía 28, Madrid', 40.4168, -3.7038),
        ('Zara Norte', 'Calle Serrano 45, Madrid', 40.4300, -3.6800),
        ('Zara Sur', 'Avenida de la Paz 12, Madrid', 40.4000, -3.7200),
        ('Zara Este', 'Calle Alcalá 120, Madrid', 40.4200, -3.6600),
        ('Zara Oeste', 'Calle Princesa 50, Madrid', 40.4300, -3.7100)
      `, (err) => {
        if (err) {
          console.error('Error inserting sample locations:', err);
        }
        resolve();
      });
    });
  });
};

const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized. Call init() first.');
  }
  return db;
};

const close = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database connection closed');
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
};

module.exports = {
  init,
  getDb,
  close
};
