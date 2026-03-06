# 🍷 Weinregal-Verwaltung

Eine webbasierte Anwendung zur Verwaltung Ihres persönlichen Weinbestandes mit Bestandstracking, Bewertungen und Foto-Upload.

## Features

✨ **Funktionen:**
- 👥 Multi-User-System mit Authentifizierung
- 🍾 Umfassende Weinverwaltung (hinzufügen, bearbeiten, löschen)
- 🔍 Erweiterte Suchfunktion und Filter (Region, Farbe, Rebsorte, Jahrgang)
- 📸 Foto-Upload für Weinflasche
- ⭐ Bewertungen und Tasting Notes
- 📊 Bestands-Tracking (Anzahl Flaschen)
- 💰 Preis-Tracking
- 📝 Kaufs- und Verkaufshistorie

## Technologie-Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Datenbank:** PostgreSQL
- **Authentifizierung:** bcryptjs + Express Sessions
- **File Upload:** Multer

## Voraussetzungen

- [Node.js](https://nodejs.org/) (v14+)
- [PostgreSQL](https://www.postgresql.org/) (v12+)
- npm oder yarn

## Installation & Setup

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Datenbank erstellen

```bash
# PostgreSQL starten
# Datenbank und Benutzer erstellen:

psql -U postgres

CREATE DATABASE weinregal;
CREATE USER weinadmin WITH PASSWORD 'your_password';
ALTER ROLE weinadmin WITH SUPERUSER;

\c weinregal
\i database/schema.sql
```

### 3. Umgebungsvariablen konfigurieren

```bash
# .env.example zu .env kopieren und anpassen
cp .env.example .env
```

Dann bearbeiten Sie `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=weinregal
DB_USER=weinadmin
DB_PASSWORD=your_password
SERVER_PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
SESSION_SECRET=your_session_secret_here
```

### 4. Server starten

**Development (mit Autoreload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Der Server läuft dann unter: **http://localhost:3000**

## Projektstruktur

```
weinregal/
├── config/              # Datenbank-Konfiguration
├── routes/              # API-Routen
│   ├── auth.js         # Authentifizierung (Login, Register, Logout)
│   ├── wines.js        # Wein CRUD & Suche/Filter
│   └── users.js        # Benutzerprofile
├── middleware/          # Express-Middleware
├── public/              # Frontend-Assets
│   ├── css/
│   ├── js/
│   └── uploads/        # Fotos (wird erstellt)
├── views/               # HTML-Views (EJS)
│   ├── login.ejs
│   ├── wines.ejs
│   └── ...
├── database/            # SQL Schema
│   └── schema.sql
└── server.js            # Express App Einstieg
```

## API-Dokumentation

### Authentifizierung

- `POST /api/auth/register` - Neue Benutzer registrieren
- `POST /api/auth/login` - Anmelden
- `POST /api/auth/logout` - Abmelden
- `GET /api/auth/status` - Authentifizierungsstatus

### Weine

- `GET /api/wines/` - Alle Weine des Benutzers
- `GET /api/wines/:id` - Wein-Details
- `POST /api/wines/` - Neuen Wein hinzufügen (mit Foto-Upload)
- `PUT /api/wines/:id` - Wein bearbeiten
- `DELETE /api/wines/:id` - Wein löschen
- `GET /api/wines/search?q=name&color=rot&region=...` - Suchen & Filtern

### Benutzer

- `GET /api/users/profile` - Benutzerprofile abrufen
- `PUT /api/users/profile` - Profil aktualisieren
- `POST /api/users/change-password` - Passwort ändern

## Hosting auf Server

### Option 1: Heroku
```bash
heroku login
heroku create your-app-name
git push heroku main
```

### Option 2: DigitalOcean / Linode
1. Droplet mit Node.js/PostgreSQL erstellen
2. Repository klonen
3. `.env` mit Produktionswerten konfigurieren
4. Mit PM2 oder Systemd als Service starten

### Option 3: Selbstverwalteter Server (Linux)
```bash
# PM2 installieren (Process Manager)
npm install -g pm2

# App starten
pm2 start server.js --name "weinregal"
pm2 startup
pm2 save

# Nginx als Reverse Proxy einrichten...
```

## Entwicklung

### Einen neuen Benutzer testen
1. http://localhost:3000 öffnen
2. "Registrieren" Formular ausfüllen
3. Mit den Anmeldedaten anmelden
4. Weine hinzufügen und verwalten

### Datenbank Debugging
```bash
psql weinregal
SELECT * FROM users;
SELECT * FROM wines WHERE user_id = 1;
```

## Verbesserungen für Zukunft

- [ ] Bewertungssystem (1-5 Sterne)
- [ ] Erweiterte Kaufs- und Verkaufshistorie
- [ ] Weinempfehlungen basierend auf Bewertungen
- [ ] Export zu CSV/PDF
- [ ] Mobile App (React Native/Flutter)
- [ ] Docker-Container
- [ ] Unit Tests

## Lizenz

MIT - Kostenlos für persönlichen und kommerziellen Gebrauch.

## Support

Bei Fragen oder Problemen bitte ein Issue erstellen oder die Dokumentation überprüfen.

---

**Viel Spaß beim Verwalten Ihres Weinbestandes! 🍾**