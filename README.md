# 🍷 Weinregal

Eine einfache Webanwendung zur Verwaltung des eigenen Weinregals – lokal oder auf einem Server betreibbar.

![Screenshot der Weinregal-App](https://github.com/user-attachments/assets/1e006fd9-e5b7-4be0-8a45-49a7d18dd800)

## Features

- **Weine erfassen** – Name, Jahrgang, Typ, Rebsorte, Region, Land, Preis, Bewertung (★) und Notizen
- **Wein-Typen** – Rotwein, Weißwein, Rosé, Sekt, Dessertwein
- **Flaschenzähler** – Anzahl direkt auf der Karte erhöhen/verringern
- **Suche** – Volltextsuche über Name, Rebsorte, Region, Land und Notizen
- **Typ-Filter** – schnell nach Weintyp filtern
- **Statistik** – Gesamtanzahl Flaschen und Verteilung je Typ
- **Bearbeiten & Löschen** mit Bestätigungsdialog

## Technischer Stack

| Schicht   | Technologie                         |
|-----------|-------------------------------------|
| Backend   | Node.js · Express 5                 |
| Datenbank | SQLite via `better-sqlite3`         |
| Frontend  | Vanilla HTML / CSS / JavaScript     |

## Quickstart

```bash
# Abhängigkeiten installieren
npm install

# Server starten (Standard-Port: 3000)
npm start
```

Dann im Browser: **http://localhost:3000**

### Umgebungsvariablen

| Variable  | Standard      | Beschreibung                           |
|-----------|---------------|----------------------------------------|
| `PORT`    | `3000`        | HTTP-Port                              |
| `DB_PATH` | `./wein.db`   | Pfad zur SQLite-Datenbankdatei         |

## Tests ausführen

```bash
node --test test/
```

## API-Übersicht

| Methode | Pfad                          | Beschreibung              |
|---------|-------------------------------|---------------------------|
| GET     | `/api/wines`                  | Alle Weine (opt. `?q=`)   |
| GET     | `/api/wines/:id`              | Einzelner Wein            |
| POST    | `/api/wines`                  | Neuen Wein anlegen        |
| PUT     | `/api/wines/:id`              | Wein aktualisieren        |
| PATCH   | `/api/wines/:id/quantity`     | Anzahl anpassen (`delta`) |
| DELETE  | `/api/wines/:id`              | Wein löschen              |
