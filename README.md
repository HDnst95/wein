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
- **Datenbank:** SQLite3 (dateibasiert, keine externe DB nötig)
- **Authentifizierung:** bcryptjs + Express Sessions
- **File Upload:** Multer
- **Environment:** dotenv für Konfiguration

## Voraussetzungen

- [Node.js](https://nodejs.org/) (v14+)
- npm oder yarn
- (Keine externe Datenbank nötig - SQLite wird automatisch erstellt)

## Installation & Setup

### 1. Repository klonen und Abhängigkeiten installieren

```bash
git clone https://github.com/HDnst95/wein.git
cd wein
npm install
```

### 2. Umgebungsvariablen konfigurieren

```bash
# .env.example zu .env kopieren und anpassen
cp .env.example .env
```

Dann bearbeiten Sie `.env`:
```
SERVER_PORT=3000
NODE_ENV=development
SESSION_SECRET=your_session_secret_here
```

**Hinweis:** Die SQLite-Datenbank (`weinregal.db`) wird beim ersten Start automatisch erstellt und mit dem Schema initialisiert.

### 3. Server starten

**Development (mit Autoreload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Der Server läuft dann unter: **http://localhost:3000**

## Schnelleinstieg (5 Minuten)

```bash
npm install
cp .env.example .env
npm run dev
```

Browser öffnen → `http://localhost:3000` → Registrieren → Wein hinzufügen 🍷

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

### Option 2: DigitalOcean / Linode / AWS
1. Droplet mit Node.js erstellen
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
2. "Jetzt registrieren" klicken
3. Vollständiger Name, E-Mail und Passwort eingeben
4. Mit den Anmeldedaten anmelden
5. Weine hinzufügen und verwalten

### Datenbank Debugging
Die SQLite-Datenbank wird als `weinregal.db` im Projektroot gespeichert. Mit einem Tool wie [DB Browser for SQLite](https://sqlitebrowser.org/) können Sie die Daten direkt ansehen und bearbeiten.

## Roadmap für zukünftige Versionen

**v1.1.0** (geplant)
- [ ] Bewertungssystem (1-5 Sterne) UI
- [ ] Kaufs- und Verkaufshistorie Tracking UI
- [ ] Erweiterte Filter und Sortieroptionen
- [ ] Single-Page App mit schnelleren Übergängen

**v1.2.0+**
- [ ] Weinempfehlungen basierend auf Bewertungen
- [ ] Export zu CSV/PDF
- [ ] Statistiken und Dashboards (Wertentwicklung, Top-bewertete Weine)
- [ ] Dark Mode
- [ ] Docker-Container
- [ ] Unit & Integration Tests
- [ ] Mobile-optimierte Version
- [ ] REST API Dokumentation (Swagger/OpenAPI)

## Lizenz

MIT - Kostenlos für persönlichen und kommerziellen Gebrauch.

## Support

Bei Fragen oder Problemen bitte ein Issue erstellen oder die Dokumentation überprüfen.

---

**Viel Spaß beim Verwalten Ihres Weinbestandes! 🍾**