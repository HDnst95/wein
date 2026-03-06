const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// View Engine Setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/wines', require('./routes/wines'));
app.use('/api/users', require('./routes/users'));

// Root Route
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/wines');
  } else {
    res.redirect('/login');
  }
});

// Login Page
app.get('/login', (req, res) => {
  res.render('login');
});

// Wines Dashboard
app.get('/wines', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  res.render('wines');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render('404');
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Ein Fehler ist aufgetreten',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🍷 Weinregal-Verwaltung läuft auf http://localhost:${PORT}`);
});
