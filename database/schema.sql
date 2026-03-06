-- Weinregal Verwaltung Database Schema (SQLite)

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  fullname TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Wines Table
CREATE TABLE IF NOT EXISTS wines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  region TEXT,
  vintage INTEGER,
  variety TEXT NOT NULL,
  color TEXT NOT NULL CHECK (color IN ('rot', 'weiß', 'rosé', 'schaumwein', 'süßwein', 'dessertwein')),
  tasting_notes TEXT,
  quantity INTEGER DEFAULT 1 CHECK (quantity >= 0),
  price DECIMAL(10, 2),
  photo_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Wine Ratings Table
CREATE TABLE IF NOT EXISTS wine_ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wine_id INTEGER NOT NULL REFERENCES wines(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  tasting_date DATE,
  comments TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(wine_id, user_id)
);

-- Purchase History Table
CREATE TABLE IF NOT EXISTS purchase_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wine_id INTEGER NOT NULL REFERENCES wines(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price_per_bottle DECIMAL(10, 2),
  purchase_date DATE NOT NULL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sale History Table
CREATE TABLE IF NOT EXISTS sale_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wine_id INTEGER NOT NULL REFERENCES wines(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  sale_price_per_bottle DECIMAL(10, 2),
  sale_date DATE NOT NULL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wines_user_id ON wines(user_id);
CREATE INDEX IF NOT EXISTS idx_wines_name ON wines(name);
CREATE INDEX IF NOT EXISTS idx_wines_region ON wines(region);
CREATE INDEX IF NOT EXISTS idx_wines_color ON wines(color);
CREATE INDEX IF NOT EXISTS idx_wine_ratings_wine_id ON wine_ratings(wine_id);
CREATE INDEX IF NOT EXISTS idx_wine_ratings_user_id ON wine_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_purchase_history_wine_id ON purchase_history(wine_id);
CREATE INDEX IF NOT EXISTS idx_sale_history_wine_id ON sale_history(wine_id);
