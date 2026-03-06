# Schnelleinstieg: Weinregal-Verwaltung

## 🚀 Erste Schritte

### Schritt 1: Abhängigkeiten installieren
```bash
git clone https://github.com/HDnst95/wein.git
cd wein
npm install
```

Dieser Befehl installiert alle erforderlichen Node.js-Module.

### Schritt 2: Konfigurationsdatei erstellen

```bash
# .env-Datei erstellen (kopieren Sie .env.example)
cp .env.example .env
```

Bearbeiten Sie die `.env` Datei:

```env
SERVER_PORT=3000
NODE_ENV=development
SESSION_SECRET=my-session-secret-123
```

**Wichtig:** Die SQLite-Datenbank wird beim ersten Start automatisch erstellt! Sie müssen NICHTS manuell initialisieren.

### Schritt 3: Server starten

**Für Entwicklung (mit automatischem Reload bei Änderungen):**
```bash
npm run dev
```

**Für Produktion:**
```bash
npm start
```

Der Server startet auf **http://localhost:3000**

### Schritt 4: Erste Anmeldung testen

1. Browser öffnen und `http://localhost:3000` aufrufen
2. Auf \"Jetzt registrieren\" klicken
3. Neuen Benutzer erstellen (z.B. Max Mustermann / max@example.com / passwort123)
4. Anmelden
5. Weine hinzufügen und verwalten 🍷

## 📁 Verzeichnisstruktur erklärt

```
wein/
├── config/
│   └── database.js           # SQLite-Verbindungskonfiguration
├── routes/
│   ├── auth.js               # Login/Register/Logout API
│   ├── wines.js              # Wein-CRUD & Suche/Filter
│   └── users.js              # Benutzerprofil-API
├── public/
│   ├── css/                  # Später: Custom CSS
│   ├── js/                   # Später: Custom JavaScript
│   └── uploads/              # Hochgeladene Weinbilder
├── views/
│   ├── login.ejs             # Login/Register-Seite
│   ├── wines.ejs             # Hauptseite - Wein-Dashboard
│   └── 404.ejs               # Fehlerseite
├── database/
│   └── schema.sql            # Datenbank-Schema (Tabellen)
├── weinregal.db              # SQLite Datenbank (wird automatisch erstellt)
├── server.js                 # Express-Applikation Hauptdatei
├── package.json              # Node.js-Abhängigkeiten
├── .env                      # Konfiguration (wird nicht getracked)
└── .env.example              # Konfigurationsvorlage
```

## 🛠 Häufige Probleme & Lösungen

### Problem: "EADDRINUSE" - Port 3000 wird bereits verwendet
**Lösung:** Wechseln Sie den Port:
```bash
# In .env ändern:
SERVER_PORT=3001
```

Oder stoppen Sie die andere Anwendung, die Port 3000 verwendet.

### Problem: "Cannot find module" - Module nicht gefunden
**Lösung:** Führen Sie `npm install` aus

### Problem: Datenbankdatei nicht erstellt
**Lösung:** Starten Sie den Server mit `npm run dev` - die Datenbank wird automatisch beim ersten Start erstellt

### Problem: Login funktioniert nicht
**Lösung:** 
1. Öffnen Sie F12 Developer Console (Browser)
2. Vergewissern Sie sich, dass Cookies aktiviert sind
3. Schauen Sie in der Console nach Fehlermeldungen
4. Stellen Sie sicher, dass der Server läuft (`http://localhost:3000` sollte zugänglich sein)

## 👨‍💼 Weitere Informationen

- **Express-Docs:** http://expressjs.com/
- **Node.js Docs:** https://nodejs.org/docs/
- **SQLite Docs:** https://www.sqlite.org/docs.html
- **DB Browser for SQLite:** https://sqlitebrowser.org/ (GUI zum Anschauen der Datenbank)

## ✏️ Nächste Schritte

1. **Weine verwalten:** Mehrere Weine hinzufügen und filtern
2. **Fotos hochladen:** Ein Foto zu einem Wein hinzufügen
3. **Suchfunktion testen:** Nach Region, Farbe oder Rebsorte filtern
4. **Profil bearbeiten:** Hauptmenü oben rechts → Profiländerungen vornehmen

---

**Viel Erfolg beim Aufbau Ihrer Weinregal-App!** 🍷✨
