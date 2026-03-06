# Schnelleinstieg: Weinregal-Verwaltung

## 🚀 Erste Schritte

### Schritt 1: Abhängigkeiten installieren
```bash
npm install
```

Dieser Befehl installiert alle erforderlichen Node.js-Module.

### Schritt 2: PostgreSQL Datenbank einrichten

Öffnen Sie ein Terminal/Console und verbinden Sie sich mit PostgreSQL:

```bash
psql -U postgres -h localhost
```

Führen Sie dann folgende Befehle aus:

```sql
CREATE DATABASE weinregal;
CREATE USER weinadmin WITH PASSWORD 'postgres123';
ALTER ROLE weinadmin WITH SUPERUSER;
\c weinregal
\i database/schema.sql
\q
```

Oder schneller: Navigieren Sie zum Projektordner und führen aus:
```bash
psql -U postgres -d weinregal -f database/schema.sql
```

### Schritt 3: Konfigurationsdatei erstellen

```bash
# .env-Datei erstellen (kopieren Sie .env.example)
cp .env.example .env
```

Bearbeiten Sie die `.env` Datei mit Ihren Datenbank-Zugangsdaten:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=weinregal
DB_USER=weinadmin
DB_PASSWORD=postgres123
SERVER_PORT=3000
NODE_ENV=development
JWT_SECRET=my-secret-key-123
SESSION_SECRET=session-secret-456
```

### Schritt 4: Server starten

**Für Entwicklung (mit automatischem Reload bei Änderungen):**
```bash
npm run dev
```

**Für Produktion:**
```bash
npm start
```

Der Server startet auf **http://localhost:3000**

### Schritt 5: Erste Anmeldung testen

1. Browser öffnen und `http://localhost:3000` aufrufen
2. Auf "Registrieren" klicken
3. Neuen Benutzer erstellen (z.B. Max Mustermann / max@example.com / password123)
4. Anmelden
5. Weine hinzufügen und verwalten 🍷

## 📁 Verzeichnisstruktur erklärt

```
wein/
├── config/
│   └── database.js          # PostgreSQL-Verbindungskonfiguration
├── routes/
│   ├── auth.js              # Login/Register/Logout API
│   ├── wines.js             # Wein-CRUD & Suche
│   └── users.js             # Benutzerprofil-API
├── public/
│   ├── css/                 # Später: Custom CSS
│   ├── js/                  # Später: Custom JavaScript
│   └── uploads/             # Hochgeladene Weinbilder
├── views/
│   ├── login.ejs            # Login/Register-Seite
│   ├── wines.ejs            # Hauptseite -Wein-Dashboard
│   └── 404.ejs              # Fehlerseite
├── database/
│   └── schema.sql           # Datenbank-Schema (Tabellen)
├── server.js                # Express-Applikation Hauptdatei
├── package.json             # Node.js-Abhängigkeiten
└── .env                     # Konfiguration (wird nicht getracked)
```

## 🛠 Häufige Probleme & Lösungen

### Problem: "ECONNREFUSED" - PostgreSQL läuft nicht
**Lösung:** Stellen Sie sicher, dass PostgreSQL läuft:
```bash
# Windows
# Prüfen Sie die Windows Services oder starten Sie PostgreSQL Installer

# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Problem: "password authentication failed"
**Lösung:** Überprüfen Sie die Datenbankanmeldedaten in der `.env` Datei

### Problem: 404 - Module nicht gefunden
**Lösung:** Führen Sie `npm install` aus

### Problem: Port 3000 wird bereits verwendet
**Lösung:** Ändern Sie `SERVER_PORT` in der `.env` oder stoppen Sie die andere Anwendung

## 🧪 Manuelles Testen der API (Optional)

Mit `curl` oder [Postman](https://www.postman.com/) können Sie die API testen:

```bash
# Benutzer registrieren
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","fullname":"Test User"}'

# Anmelden
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'
```

## 📦 Nächste Schritte / Erweiterungen

1. **Weitere UI-Verbesserungen:** Responsive Design, dunkler Modus
2. **Bewertungssystem:** 1-5 Sterne, Kommentare
3. **Kaufs-/Verkaufshistorie:** Chronik von Käufen und Verkäufen
4. **Statistiken:** Grafiken, Insights über Ihre Sammlung
5. **PDF-Export:** Drucken Ihrer Weinkliste
6. **Sharing:** Teilen Sie Ihre Sammlung mit Freunden
7. **Mobile App:** React Native oder Flutter Mobilversion

## 📞 Support & Dokumentation

- **Offizielle Express-Docs:** http://expressjs.com/
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Node.js Docs:** https://nodejs.org/docs/

---

**Viel Erfolg beim Aufbau Ihrer Weinregal-App!** 🍷✨
