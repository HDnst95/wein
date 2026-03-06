const express = require('express');
const router = express.Router();
const db = require('../config/database');
const multer = require('multer');
const path = require('path');

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Authentifizierung erforderlich' });
  }
  next();
};

// Helper: Promise-Wrapper für DB-Operationen
const dbAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

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

// Multer Configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Nur Bilddateien sind erlaubt'));
  }
});

// Get all wines for user
router.get('/', requireAuth, async (req, res) => {
  try {
    const wines = await dbAll(
      'SELECT * FROM wines WHERE user_id = ? ORDER BY created_at DESC',
      [req.session.userId]
    );
    res.json(wines);
  } catch (error) {
    console.error('Get Wines Error:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Weine' });
  }
});

// Get single wine
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const wine = await dbGet(
      'SELECT * FROM wines WHERE id = ? AND user_id = ?',
      [req.params.id, req.session.userId]
    );

    if (!wine) {
      return res.status(404).json({ message: 'Wein nicht gefunden' });
    }

    res.json(wine);
  } catch (error) {
    console.error('Get Wine Detail Error:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen des Weins' });
  }
});

// Create wine
router.post('/', requireAuth, upload.single('photo'), async (req, res) => {
  try {
    const { name, region, vintage, variety, color, tasting_notes, quantity, price } = req.body;

    const result = await dbRun(
      `INSERT INTO wines 
       (user_id, name, region, vintage, variety, color, tasting_notes, quantity, price, photo_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.session.userId,
        name,
        region || null,
        vintage || null,
        variety,
        color,
        tasting_notes,
        quantity || 1,
        price || null,
        req.file ? `/uploads/${req.file.filename}` : null
      ]
    );

    const wine = await dbGet('SELECT * FROM wines WHERE id = ?', [result.id]);
    res.status(201).json(wine);
  } catch (error) {
    console.error('Create Wine Error:', error);
    res.status(500).json({ message: 'Fehler beim Erstellen des Weins' });
  }
});

// Update wine
router.put('/:id', requireAuth, upload.single('photo'), async (req, res) => {
  try {
    const { name, region, vintage, variety, color, tasting_notes, quantity, price } = req.body;
    
    let updateQuery = `UPDATE wines SET name = ?, region = ?, vintage = ?, variety = ?, color = ?, 
                       tasting_notes = ?, quantity = ?, price = ?`;
    const params = [name, region || null, vintage || null, variety, color, tasting_notes, quantity, price];

    if (req.file) {
      updateQuery += `, photo_url = ?`;
      params.push(`/uploads/${req.file.filename}`);
    }

    updateQuery += ` WHERE id = ? AND user_id = ?`;
    params.push(req.params.id, req.session.userId);

    const result = await dbRun(updateQuery, params);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Wein nicht gefunden' });
    }

    const wine = await dbGet('SELECT * FROM wines WHERE id = ?', [req.params.id]);
    res.json(wine);
  } catch (error) {
    console.error('Update Wine Error:', error);
    res.status(500).json({ message: 'Fehler beim Aktualisieren des Weins' });
  }
});

// Delete wine
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const result = await dbRun(
      'DELETE FROM wines WHERE id = ? AND user_id = ?',
      [req.params.id, req.session.userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Wein nicht gefunden' });
    }

    res.json({ message: 'Wein gelöscht' });
  } catch (error) {
    console.error('Delete Wine Error:', error);
    res.status(500).json({ message: 'Fehler beim Löschen des Weins' });
  }
});

// Search wines
router.get('/search', requireAuth, async (req, res) => {
  try {
    const { q, color, region, variety } = req.query;
    const params = [];
    let query = 'SELECT * FROM wines WHERE user_id = ?';
    params.push(req.session.userId);

    if (q) {
      query += ` AND (name LIKE ? OR region LIKE ?)`;
      params.push(`%${q}%`, `%${q}%`);
    }

    if (color) {
      query += ` AND color = ?`;
      params.push(color);
    }

    if (region) {
      query += ` AND region LIKE ?`;
      params.push(`%${region}%`);
    }

    if (variety) {
      query += ` AND variety LIKE ?`;
      params.push(`%${variety}%`);
    }

    query += ' ORDER BY created_at DESC';

    const wines = await dbAll(query, params);
    res.json(wines);
  } catch (error) {
    console.error('Search Wine Error:', error);
    res.status(500).json({ message: 'Fehler bei der Suche' });
  }
});

module.exports = router;
