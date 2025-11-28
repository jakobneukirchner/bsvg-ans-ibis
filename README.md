# BSVG Ansagesystem

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-BADGE-ID/deploy-status)](https://app.netlify.com/sites/bsvg-ans-ibis/deploys)

**Manuelles Ansagesystem für Straßenbahnen in Braunschweig**

Eine Progressive Web App (PWA) für mobile Endgeräte, die Straßenbahnfahrern ermöglicht, manuelle Ansagen für verschiedene Linien und Umläufe abzuspielen.

## 📱 Features

- ✅ **Mobile-First Design** - Optimiert für Smartphones und Tablets
- ✅ **Lazy Loading Audio** - Audiodateien werden erst beim Abspielen geladen
- ✅ **Recent Entries** - Letzte 5 Eingaben werden gespeichert
- ✅ **Dynamische Routen** - Unterstützt Regelrouten und Umleitungen
- ✅ **Touch-optimiert** - 44px+ Touch-Targets für mobile Bedienung
- ✅ **Offline-Ready** - LocalStorage für Session-Daten
- ✅ **BSVG Design System** - Offizielle Farben und Typografie
- ✅ **Zero Dependencies** - Vanilla JavaScript, HTML, CSS

---

## 🛤️ Tech Stack

| Komponente | Technologie |
|------------|-------------|
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| **Hosting** | Netlify |
| **Storage** | LocalStorage, SessionStorage |
| **Audio** | Web Audio API |
| **Icons** | Custom SVG |
| **Dependencies** | None (Zero!) |

---

## 📁 Projektstruktur

```
bsvg-ans-ibis/
├── netlify.toml              # Netlify-Konfiguration
├── package.json              # NPM-Konfiguration
├── README.md                 # Diese Datei
├── public/                   # Publish Directory
│   ├── index.html           # Startseite - Eingabe
│   ├── announcements.html   # Ansage-Interface
│   ├── _redirects           # Netlify Redirects
│   ├── css/
│   │   ├── reset.css        # CSS Reset
│   │   ├── variables.css    # Design-System Variablen
│   │   ├── base.css         # Base Styles
│   │   ├── components.css   # Buttons, Cards, Forms
│   │   ├── index.css        # Startseite Styles
│   │   └── announcements.css # Ansage-Styles
│   ├── js/
│   │   ├── config.js        # Konfiguration
│   │   ├── utils.js         # Hilfsfunktionen
│   │   ├── storage.js       # LocalStorage Wrapper
│   │   ├── audio-player.js  # Audio-Engine (Lazy Loading)
│   │   ├── app.js           # Startseite Logic
│   │   └── announcements.js # Ansage-Logic
│   └── assets/
│       └── icons/           # SVG Icons
├── examples/                 # JSON-Beispieldateien
│   ├── lines.json
│   ├── stops.json
│   ├── cycles.json
│   └── audio-library.json
└── docs/                     # Dokumentation
```

---

## 🚀 Deployment auf Netlify

### 1. Repository vorbereiten

Dieses Repository ist bereits bereit für Netlify!

### 2. Netlify verbinden

1. Gehe zu [netlify.com](https://www.netlify.com/)
2. Klicke auf **"Add new site"** → **"Import an existing project"**
3. Wähle **GitHub** und verbinde `jakobneukirchner/bsvg-ans-ibis`
4. **Build Settings:**
   - **Build command:** (leer lassen)
   - **Publish directory:** `public`
5. **Deploy!**

### 3. Domain konfigurieren (Optional)

Nach dem Deployment:
- Site Settings → Domain Management
- Custom Domain hinzufügen (z.B. `bsvg-ans.netlify.app`)

---

## 📝 Eingabeformat: LLL/UU

**KRITISCH:** Das System verwendet ein spezielles Format:

```
LLL = 3-stellige Liniennummer MIT führenden Nullen
UU  = 2-stellige Umlaufnummer MIT führenden Nullen
```

### Beispiele:

| Eingabe | Linie | Umlauf | Gültig |
|---------|-------|--------|--------|
| `003/10` | 3 | 10 | ✅ |
| `001/05` | 1 | 5 | ✅ |
| `010/25` | 10 | 25 | ✅ |
| `3/10` | - | - | ❌ (Fehlt führende Nullen) |
| `003/5` | - | - | ❌ (Umlauf muss 2-stellig sein) |

### Regex:
```javascript
/^\d{3}\/\d{2}$/
```

---

## 🎵 Audio-System

### Lazy Loading Prinzip

**KRITISCH:** Audiodateien werden **ERST beim Abspielen** geladen!

```javascript
// ❌ FALSCH - Preloading
const audio = new Audio('file.mp3');
audio.load(); // Sofort laden

// ✅ RICHTIG - Lazy Loading
class AudioPlayer {
  async playPlaylist(playlist) {
    for (const audioId of playlist) {
      const audio = await this.loadAudio(audioId); // Erst jetzt laden!
      await this.playAudio(audio);
    }
  }
}
```

### Audio-Library Struktur

```json
{
  "audioFiles": [
    {
      "id": "intro_tram",
      "path": "announcements/de/intro_tram.mp3",
      "duration": 2.5,
      "language": "de",
      "tags": ["intro", "system"],
      "description": "Dies ist eine Straßenbahn"
    }
  ]
}
```

### Playlist-Beispiel

Für **Linie 3 nach Gliesmarode über Ersatzhaltestelle**:

```javascript
[
  'intro_tram',            // "Dies ist eine Straßenbahn"
  'line_3',                // "der Linie 3"
  'connector_nach',        // "nach"
  'dest_gliesmarode',      // "Gliesmarode"
  'connector_ueber',       // "über"
  'via_ersatz_awr'         // "Ersatzhaltestelle Altewiekring"
]
```

---

## 🎨 Design System

### Farben

| Typ | Variable | Wert | Verwendung |
|-----|----------|------|------------|
| **Primär** | `--color-primary` | `#00843D` | BSVG Grün (Buttons, Badges) |
| **Linie 1** | `--line-1-color` | `#00843D` | Grün |
| **Linie 2** | `--line-2-color` | `#E30613` | Rot |
| **Linie 3** | `--line-3-color` | `#0066B3` | Blau |
| **Linie 5** | `--line-5-color` | `#F39200` | Orange |
| **Linie 10** | `--line-10-color` | `#9D2485` | Lila |

### Typography

```css
/* Mobile Base Sizes */
--font-size-base: 16px;
--font-size-xl: 20px;
--font-size-2xl: 24px;
--font-size-3xl: 28px;
--font-size-4xl: 32px;

/* Desktop (768px+) */
--font-size-4xl: 36px;
--font-size-5xl: 48px;
```

### Touch Targets

```css
--touch-target-min: 44px;         /* iOS/Android Minimum */
--touch-target-comfortable: 48px;  /* Bevorzugt */
```

---

## 💾 JSON-Datenstruktur

### lines.json

```json
{
  "lines": [
    {
      "id": "3",
      "paddedId": "003",
      "name": "Linie 3",
      "displayName": "3",
      "color": "#0066B3",
      "audioId": "line_3"
    }
  ]
}
```

### cycles.json

```json
{
  "cycles": [
    {
      "cycleId": "3_10",
      "paddedId": "10",
      "lineId": "3",
      "type": "diversion",
      "direction": "Gliesmarode",
      "destinationAudioId": "dest_gliesmarode",
      "viaStops": ["ERS-A"],
      "route": [
        {"stopId": "bsvg_001", "shortCode": "HBF", "order": 1},
        {"stopId": "bsvg_456", "shortCode": "ERS-A", "order": 2}
      ]
    }
  ]
}
```

**WICHTIG:** `viaStops` enthält Kürzel (z.B. `["ERS-A"]`), die zur Laufzeit in Audio-IDs aufgelöst werden!

---

## ⚙️ Konfiguration

### config.js

```javascript
const CONFIG = {
  FILESERVER_URL: 'https://bsvg-ans-ibis.netlify.app',
  
  ENDPOINTS: {
    LINES: '/examples/lines.json',
    STOPS: '/examples/stops.json',
    CYCLES: '/examples/cycles.json',
    AUDIO_LIBRARY: '/examples/audio-library.json'
  },
  
  VALIDATION: {
    INPUT_REGEX: /^\d{3}\/\d{2}$/
  },
  
  UI: {
    MAX_RECENT_ENTRIES: 5
  },
  
  AUDIO: {
    CACHE_ENABLED: true,
    PRELOAD_ENABLED: false  // LAZY LOADING!
  }
};
```

---

## 🛠️ Lokale Entwicklung

### Voraussetzungen

- Python 3.x (für lokalen Server)
- Moderner Browser (Chrome 90+, Safari 14+, Firefox 88+)

### Server starten

```bash
# Klone Repository
git clone https://github.com/jakobneukirchner/bsvg-ans-ibis.git
cd bsvg-ans-ibis

# Starte lokalen Server
python -m http.server 8000 --directory public

# Oder mit NPM
npm run dev
```

### Im Browser öffnen

```
http://localhost:8000
```

---

## ✅ Testing Checklist

### Funktional
- [ ] Eingabe-Validierung (LLL/UU Format)
- [ ] Recent Entries anzeigen und auswählen
- [ ] JSON-Dateien laden
- [ ] Fehlerbehandlung (Linie/Umlauf nicht gefunden)
- [ ] Session Storage funktioniert
- [ ] Weiterleitung zu Ansage-Interface
- [ ] Audio-Playlist erstellen
- [ ] Audio abspielen (Lazy Loading)

### Mobile
- [ ] Touch funktioniert
- [ ] Keyboard öffnet richtig (numeric inputmode)
- [ ] Keine Zoom-Probleme
- [ ] Min. 44px Touch-Targets
- [ ] Scroll smooth

### Browser
- [ ] Chrome Mobile (Android)
- [ ] Safari iOS
- [ ] Firefox Android
- [ ] Chrome Desktop
- [ ] Safari Desktop

---

## 📚 Weitere Dokumentation

Dokumentationsdateien (geplant):
- `docs/01-setup.md` - Setup & Installation
- `docs/02-deployment.md` - Deployment Guide
- `docs/03-json-structure.md` - JSON-Strukturen
- `docs/04-api.md` - JavaScript API

---

## 👥 Mitwirken

Beiträge sind willkommen!

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

---

## 📝 Lizenz

MIT License - siehe `LICENSE` Datei

---

## 📧 Kontakt

**Projekt-Link:** [https://github.com/jakobneukirchner/bsvg-ans-ibis](https://github.com/jakobneukirchner/bsvg-ans-ibis)

**Live-Demo:** [https://bsvg-ans-ibis.netlify.app](https://bsvg-ans-ibis.netlify.app) (nach Deployment)

---

## 🚀 Roadmap

- [ ] PWA Manifest & Service Worker
- [ ] Offline Audio Caching
- [ ] QR-Code Scanner für schnelle Eingabe
- [ ] Dark Mode
- [ ] Multi-Language Support (EN)
- [ ] Audio-Dateien Upload-Interface
- [ ] Admin-Panel für JSON-Verwaltung

---

**Made with ❤️ for BSVG Braunschweig**
