# PostgreSQL unter Windows einrichten

## Installation

1. **Download:** Gehen Sie auf https://www.postgresql.org/download/windows/
2. **Installer ausführen:** `postgresql-15-x64-installer.exe` (oder neuere Version)
3. **Installation durchführen:**
   - Installation directory: `C:\Program Files\PostgreSQL\15`
   - Port: `5432` (Standard)
   - Passwort für `postgres` User setzen (z.B. `postgres123`)
   - Locale: `German, Germany` oder `English, USA`

4. **Installation abschließen** - PostgreSQL ist jetzt als Windows-Service installiert

## PostgreSQL starten/stoppen

### Method 1: Services verwalten
- `Services.msc` öffnen
- "postgresql-x64-15" finden und starten/stoppen

### Method 2: Kommandozeile
```bash
# Windows Administrator-Terminal öffnen
# Service starten
net start postgresql-x64-15

# Service stoppen
net stop postgresql-x64-15
```

## Datenbank aufsetzen

### Method 1: pgAdmin GUI (einfach)
1. pgAdmin öffnen (wird mit PostgreSQL installiert)
2. Rechtsklick auf "Servers" → "Register" → "Server"
3. Name: `Local`, Host: `localhost`, Port: `5432`, Username: `postgres`
4. Tools → Query Tool → SQL ausführen:

```sql
CREATE DATABASE weinregal;
CREATE USER weinadmin WITH PASSWORD 'postgres123';
ALTER ROLE weinadmin WITH SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE weinregal TO weinadmin;
```

5. Neue Datenbank auswählen (`weinregal`)
6. Query Tool → `database/schema.sql` Datei ausführen

### Method 2: psql Kommandozeile (schneller)
```bash
# CMD oder PowerShell öffnen
cd d:\projekte_web\wein

# Mit postgres User verbinden
psql -U postgres -h localhost

# Dann diese Befehle ausführen:
CREATE DATABASE weinregal;
CREATE USER weinadmin WITH PASSWORD 'postgres123';
ALTER ROLE weinadmin WITH SUPERUSER;
\c weinregal
\i database/schema.sql
\q
```

Oder in einer Zeile:
```bash
psql -U postgres -h localhost -c "CREATE DATABASE weinregal;"
psql -U postgres -h localhost -c "CREATE USER weinadmin WITH PASSWORD 'postgres123';"
psql -U postgres -h localhost -d weinregal -f database/schema.sql
```

## Umgebungsvariable PATH (optional, für bessere Zugänglichkeit)

Wenn `psql` Befehl nicht erkannt wird:

1. Systemumgebungsvariablen öffnen:
   - Win+R → `sysdm.cpl`
   - "Umgebungsvariablen" Button
   
2. "PATH" Variable bearbeiten
3. Neuen Pfad hinzufügen: `C:\Program Files\PostgreSQL\15\bin`

Dann können Sie `psql` von überall aufrufen.

## Verbindung testen

```bash
psql -U weinadmin -h localhost -d weinregal
```

Wenn Sie prompt `weinregal=>` sehen, funktioniert's! ✅

Zum Beenden: `\q`

## Backup erstellen

```bash
# Backup der gesamten Datenbank
pg_dump -U weinadmin -h localhost weinregal > backup.sql

# Backup wiederherstellen
psql -U weinadmin -h localhost -d weinregal < backup.sql
```

---

**Damit sollte PostgreSQL unter Windows vollständig eingerichtet sein!** 🎉
