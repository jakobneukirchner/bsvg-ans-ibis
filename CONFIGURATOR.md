# 🛠️ BSVG Konfigurator

## Zugriff auf den Konfigurator

### Option 1: Direkter Zugriff
```
https://bsvg-ibis.netlify.app/config.html
```

### Option 2: URL-Parameter (Coming Soon)
```
https://bsvg-ibis.netlify.app/?config
```

---

## 📝 Funktionen

### 1. Umläufe (Kurse) verwalten

**Neuen Umlauf erstellen:**
1. Öffne `config.html`
2. Tab "Umläufe" ist bereits aktiv
3. Klicke "+ Neuer Umlauf"
4. Fülle das Formular aus:
   - **Umlauf-ID**: z.B. `3_10` (Linie_Nummer)
   - **Linie**: Wähle aus Dropdown
   - **Typ**: `Regelbetrieb` oder `Umleitung`
   - **Name**: z.B. "Linie 3 nach Gliesmarode"
   - **Richtung**: z.B. "Gliesmarode"
   - **Ziel Audio-ID**: z.B. `dest_gliesmarode`
   - **Via-Stops**: Komma-getrennt, z.B. `ERS-A, HBF` (leer für Regelbetrieb)
5. Klicke "Erstellen"

**Umlauf bearbeiten:**
1. Klicke "Edit" bei einem bestehenden Umlauf
2. Ändere die Felder
3. Klicke "Save"

**Umlauf löschen:**
1. Klicke "Delete" bei einem Umlauf
2. Bestätige die Löschung

---

### 2. Linien verwalten

**Tab:** "Linien"

(Coming soon - aktuell nur Ansicht)

---

### 3. Haltestellen verwalten

**Tab:** "Haltestellen"

(Coming soon - aktuell nur Ansicht)

---

## 💾 Daten exportieren

**Export als JSON:**
1. Klicke "Export JSON" (oben rechts)
2. Drei Dateien werden heruntergeladen:
   - `cycles.json`
   - `lines.json`
   - `stops.json`

**Diese Dateien hochladen:**

### Via GitHub:
1. Gehe zu: https://github.com/jakobneukirchner/bsvg-ans-fileserver
2. Navigiere zu `public/`
3. Klicke bei der entsprechenden Datei auf "Edit" (✏️)
4. Ersetze den Inhalt mit deiner exportierten Datei
5. Commit!

### Via Git CLI:
```bash
cd bsvg-ans-fileserver

# Ersetze die Dateien
cp ~/Downloads/cycles.json public/
cp ~/Downloads/lines.json public/
cp ~/Downloads/stops.json public/

git add public/*.json
git commit -m "Update cycles, lines and stops"
git push origin main
```

→ **Änderungen sind sofort live via GitHub Raw!**

---

## 📝 Umlauf-Struktur

### Beispiel: Regelbetrieb

```json
{
  "cycleId": "3_05",
  "paddedId": "05",
  "lineId": "3",
  "type": "regular",
  "name": "Linie 3 nach Volkmarode",
  "direction": "Volkmarode",
  "destinationAudioId": "dest_volkmarode",
  "viaStops": [],
  "route": [],
  "specialAnnouncements": [],
  "priority": 1
}
```

### Beispiel: Umleitung

```json
{
  "cycleId": "3_10",
  "paddedId": "10",
  "lineId": "3",
  "type": "diversion",
  "name": "Linie 3 Umleitung Bauarbeiten AWR",
  "direction": "Gliesmarode",
  "destinationAudioId": "dest_gliesmarode",
  "viaStops": ["ERS-A"],
  "route": [
    {"stopId": "bsvg_001", "shortCode": "HBF", "order": 1},
    {"stopId": "bsvg_456", "shortCode": "ERS-A", "order": 2},
    {"stopId": "bsvg_003", "shortCode": "GLI", "order": 3}
  ],
  "specialAnnouncements": [],
  "validFrom": "2025-11-15",
  "validUntil": "2026-01-15",
  "priority": 5,
  "notes": "Umleitung wegen Bauarbeiten am Altewiekring"
}
```

---

## 💡 Tipps

### Umlauf-IDs

**Format:** `{LinieID}_{Nummer}`

**Beispiele:**
- `3_05` - Linie 3, Umlauf 05
- `3_10` - Linie 3, Umlauf 10
- `10_25` - Linie 10, Umlauf 25

### PaddedID

Wird automatisch generiert aus der Nummer nach dem Unterstrich.

**Beispiele:**
- `3_10` → `paddedId: "10"`
- `3_5` → `paddedId: "05"` (mit führender Null)

### Via-Stops

**Leer lassen** für Regelbetrieb.

**Mit Stops** für Umleitungen:
- Komma-getrennt: `ERS-A, HBF, RAT`
- Verwendet Haltestellen-Kürzel (Short Codes)

### Audio-IDs

**Konvention:**
- Ziele: `dest_{name}` (z.B. `dest_gliesmarode`)
- Via-Stops: `via_{name}` (z.B. `via_ersatz_awr`)
- Linien: `line_{nummer}` (z.B. `line_3`)

---

## ⚠️ Wichtige Hinweise

### Daten werden NICHT automatisch gespeichert

Der Konfigurator ist ein **Editor-Tool**, keine Datenbank!

**Workflow:**
1. Änderungen im Konfigurator machen
2. "Export JSON" klicken
3. JSON-Dateien in GitHub Repository hochladen
4. Änderungen sind live!

### Browser-Cache

Nach dem Upload neuer JSON-Dateien:
1. Haupt-App neu laden
2. Ggf. Cache leeren (Strg+Shift+R)

---

## 🔗 Links

**Konfigurator:** https://bsvg-ibis.netlify.app/config.html

**Haupt-App:** https://bsvg-ibis.netlify.app

**Fileserver:** https://github.com/jakobneukirchner/bsvg-ans-fileserver

**Repository:** https://github.com/jakobneukirchner/bsvg-ans-ibis

---

**Status:** 🟡 Beta - Grundfunktionen verfügbar
