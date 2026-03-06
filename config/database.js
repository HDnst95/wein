const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// SQLite Datenbank Pfad
const dbPath = path.join(__dirname, '..', 'weinregal.db');

// Datenbank öffnen oder erstellen
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Fehler beim Öffnen der SQLite-Datenbank:', err);
  } else {
    console.log('SQLite-Datenbank initialisiert:', dbPath);
    initializeSchema();
  }
});

// Foreign Keys aktivieren
db.run('PRAGMA foreign_keys = ON');

// Schema initialisieren
function initializeSchema() {
  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Teile das Schema in einzelne Statements auf
  const statements = schema.split(';').filter(stmt => stmt.trim());
  
  // Führe jeden Statement in Serie aus
  const runStatements = (index) => {
    if (index >= statements.length) {
      console.log('✅ Datenbank-Schema erfolgreich initialisiert');
      return;
    }
    
    const stmt = statements[index].trim();
    if (stmt) {
      db.run(stmt, (err) => {
        if (err && !err.message.includes('already exists')) {
          console.error('Schema-Fehler:', err.message);
        }
        runStatements(index + 1);
      });
    } else {
      runStatements(index + 1);
    }
  };
  
  runStatements(0);
}

module.exports = db;

