'use strict';

const express = require('express');
const rateLimit = require('express-rate-limit');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'wein.db');

// Rate limiting – applied globally to all routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,                  // max 300 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Database setup
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS wines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    year INTEGER,
    grape TEXT,
    region TEXT,
    country TEXT,
    type TEXT NOT NULL DEFAULT 'Rotwein',
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    quantity INTEGER NOT NULL DEFAULT 1,
    price REAL,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Wines API ──────────────────────────────────────────────

// GET /api/wines – list all wines, optional search via ?q=
app.get('/api/wines', (req, res) => {
  const q = req.query.q ? `%${req.query.q}%` : null;
  const stmt = q
    ? db.prepare(
        `SELECT * FROM wines
         WHERE name LIKE ? OR grape LIKE ? OR region LIKE ? OR country LIKE ? OR notes LIKE ?
         ORDER BY name COLLATE NOCASE`
      )
    : db.prepare('SELECT * FROM wines ORDER BY name COLLATE NOCASE');

  const wines = q ? stmt.all(q, q, q, q, q) : stmt.all();
  res.json(wines);
});

// GET /api/wines/:id – single wine
app.get('/api/wines/:id', (req, res) => {
  const wine = db.prepare('SELECT * FROM wines WHERE id = ?').get(req.params.id);
  if (!wine) return res.status(404).json({ error: 'Wein nicht gefunden' });
  res.json(wine);
});

// POST /api/wines – create wine
app.post('/api/wines', (req, res) => {
  const { name, year, grape, region, country, type, rating, quantity, price, notes } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name ist erforderlich' });
  }
  const stmt = db.prepare(`
    INSERT INTO wines (name, year, grape, region, country, type, rating, quantity, price, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    name.trim(),
    year || null,
    grape ? grape.trim() : null,
    region ? region.trim() : null,
    country ? country.trim() : null,
    type || 'Rotwein',
    rating || null,
    quantity != null ? quantity : 1,
    price || null,
    notes ? notes.trim() : null
  );
  const newWine = db.prepare('SELECT * FROM wines WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newWine);
});

// PUT /api/wines/:id – update wine
app.put('/api/wines/:id', (req, res) => {
  const wine = db.prepare('SELECT * FROM wines WHERE id = ?').get(req.params.id);
  if (!wine) return res.status(404).json({ error: 'Wein nicht gefunden' });

  const { name, year, grape, region, country, type, rating, quantity, price, notes } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name ist erforderlich' });
  }
  db.prepare(`
    UPDATE wines SET name=?, year=?, grape=?, region=?, country=?, type=?, rating=?, quantity=?, price=?, notes=?
    WHERE id=?
  `).run(
    name.trim(),
    year || null,
    grape ? grape.trim() : null,
    region ? region.trim() : null,
    country ? country.trim() : null,
    type || 'Rotwein',
    rating || null,
    quantity != null ? quantity : 1,
    price || null,
    notes ? notes.trim() : null,
    req.params.id
  );
  res.json(db.prepare('SELECT * FROM wines WHERE id = ?').get(req.params.id));
});

// PATCH /api/wines/:id/quantity – adjust quantity (delta)
app.patch('/api/wines/:id/quantity', (req, res) => {
  const wine = db.prepare('SELECT * FROM wines WHERE id = ?').get(req.params.id);
  if (!wine) return res.status(404).json({ error: 'Wein nicht gefunden' });

  const delta = parseInt(req.body.delta, 10);
  if (isNaN(delta)) return res.status(400).json({ error: 'delta muss eine Zahl sein' });

  const newQty = Math.max(0, wine.quantity + delta);
  db.prepare('UPDATE wines SET quantity=? WHERE id=?').run(newQty, req.params.id);
  res.json(db.prepare('SELECT * FROM wines WHERE id = ?').get(req.params.id));
});

// DELETE /api/wines/:id – delete wine
app.delete('/api/wines/:id', (req, res) => {
  const wine = db.prepare('SELECT * FROM wines WHERE id = ?').get(req.params.id);
  if (!wine) return res.status(404).json({ error: 'Wein nicht gefunden' });
  db.prepare('DELETE FROM wines WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

// Serve frontend for all other routes (SPA fallback)
app.get('/{*path}', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Only start listening when this file is run directly (not required in tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Weinregal-App läuft auf http://localhost:${PORT}`);
  });
}

module.exports = app;
