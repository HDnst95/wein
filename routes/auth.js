const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Helper: Promise-Wrapper für DB-Operationen
const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullname } = req.body;

    if (!email || !password || !fullname) {
      return res.status(400).json({ message: 'Alle Felder sind erforderlich' });
    }

    // Check if user exists
    const userExists = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (userExists) {
      return res.status(400).json({ message: 'E-Mail-Adresse wird bereits verwendet' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await dbRun(
      'INSERT INTO users (email, password, fullname) VALUES (?, ?, ?)',
      [email, hashedPassword, fullname]
    );

    const user = await dbGet('SELECT id, email, fullname FROM users WHERE id = ?', [result.id]);

    req.session.userId = user.id;
    res.status(201).json({ 
      message: 'Benutzer erfolgreich erstellt',
      user: user
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Registrierungsfehler', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'E-Mail und Passwort sind erforderlich' });
    }

    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!user) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }

    req.session.userId = user.id;
    res.json({ 
      message: 'Anmeldung erfolgreich',
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Anmeldefehler', error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Abmeldungsfehler' });
    }
    res.json({ message: 'Erfolgreich abgemeldet' });
  });
});

// Check Auth Status
router.get('/status', (req, res) => {
  if (req.session.userId) {
    res.json({ authenticated: true, userId: req.session.userId });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;
