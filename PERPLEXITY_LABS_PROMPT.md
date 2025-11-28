# VOLLSTÄNDIGER PRODUCTION-READY PROMPT FÜR PERPLEXITY LABS

**Repository-Name:** `bsvg-ans-ibis`  
**Deployment:** Netlify  
**Plattform:** Mobile-First, Progressive Web App (PWA-ready)

---

## PROJEKT-ÜBERSICHT

### Ziel
Ein manuelles Ansagesystem für Straßenbahnen in Braunschweig. Fahrer können über eine Web-App Linie und Umlauf eingeben und verschiedene Ansagen abspielen. Das System setzt Ansagen aus Audio-Schnipseln zusammen (ähnlich wie echte Straßenbahn-Durchsagen).

### Technologie-Stack
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Hosting:** Netlify
- **Dependencies:** Keine (zero dependencies)
- **Browser-Support:** Modern browsers (Chrome 90+, Safari 14+, Firefox 88+)
- **Mobile:** Touch-optimiert, iOS/Android PWA-ready

### Was das System NICHT macht
- ❌ Keine automatischen Ansagen (alles manuell)
- ❌ Keine LED-Anzeigen (nur Audio)
- ❌ Keine GPS/Koordinaten
- ❌ Kein Bus (nur Tram)
- ❌ Keine Fahrpläne/Zeitpläne

---

## REPOSITORY-STRUKTUR

```
bsvg-ans-ibis/
│
├── netlify.toml                       # Netlify-Konfiguration
├── README.md                          # Hauptdokumentation
├── package.json                       # NPM-Konfiguration (optional)
│
├── public/                            # Netlify Publish Directory
│   ├── index.html                    # Startseite - Linieneingabe
│   ├── announcements.html            # Ansage-Interface
│   │
│   ├── css/
│   │   ├── reset.css                 # CSS Reset
│   │   ├── variables.css             # Design-System Variablen
│   │   ├── base.css                  # Base Styles
│   │   ├── components.css            # Wiederverwendbare Komponenten
│   │   ├── index.css                 # Startseite Styles
│   │   └── announcements.css         # Ansage-Interface Styles
│   │
│   ├── js/
│   │   ├── config.js                 # Konfiguration (Fileserver URL)
│   │   ├── utils.js                  # Hilfsfunktionen
│   │   ├── storage.js                # LocalStorage Wrapper
│   │   ├── audio-player.js           # Audio-Player-Klasse (Lazy Loading)
│   │   ├── app.js                    # Startseite Logic
│   │   └── announcements.js          # Ansage-Interface Logic
│   │
│   ├── assets/
│   │   └── icons/                    # SVG Icons (kein Emoji-Fallback)
│   │       ├── play.svg
│   │       ├── arrow-right.svg
│   │       ├── arrow-left.svg
│   │       ├── tram.svg
│   │       ├── speaker.svg
│   │       ├── calendar.svg
│   │       └── settings.svg
│   │
│   └── _redirects                    # Netlify Redirects
│
├── docs/                              # Dokumentation
│   ├── 01-setup.md
│   ├── 02-deployment.md
│   ├── 03-json-structure.md
│   └── 04-api.md
│
└── examples/                          # JSON-Beispieldateien
    ├── lines.json
    ├── stops.json
    ├── cycles.json
    ├── announcements.json
    └── audio-library.json
```

---

## NETLIFY-KONFIGURATION

### netlify.toml

```toml
[build]
  publish = "public"
  command = "echo 'No build required - static site'"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[dev]
  command = "python -m http.server 8000 --directory public"
  port = 8000
  publish = "public"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/css/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/js/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### _redirects (in public/)

```
# Fallback für SPA-artiges Verhalten
/*    /index.html   200
```

### package.json (Optional)

```json
{
  "name": "bsvg-ans-ibis",
  "version": "1.0.0",
  "description": "BSVG Tram Announcement System",
  "scripts": {
    "dev": "python -m http.server 8000 --directory public",
    "deploy": "netlify deploy --prod"
  },
  "keywords": ["tram", "announcements", "bsvg", "braunschweig"],
  "author": "BSVG",
  "license": "MIT"
}
```

---

## DESIGN-SYSTEM (MOBILE-FIRST, OHNE EMOJIS)

### CSS Variables (public/css/variables.css)

```css
:root {
  /* ═══════════════════════════════════════════ */
  /* FARBEN */
  /* ═══════════════════════════════════════════ */
  
  /* Primärfarben (BSVG Grün) */
  --color-primary: #00843D;
  --color-primary-hover: #006930;
  --color-primary-active: #005024;
  --color-primary-light: rgba(0, 132, 61, 0.1);
  --color-primary-rgb: 0, 132, 61;
  
  /* Grauwerte */
  --color-dark: #1a1a1a;
  --color-dark-medium: #2d2d2d;
  --color-gray-900: #333333;
  --color-gray-700: #666666;
  --color-gray-500: #888888;
  --color-gray-300: #cccccc;
  --color-border: #e0e0e0;
  --color-bg-light: #f0f0f0;
  --color-bg-lighter: #f5f5f5;
  --color-bg-lightest: #f9f9f9;
  --color-white: #ffffff;
  
  /* Linienfarben Braunschweig */
  --line-1-color: #00843D;    /* Grün */
  --line-2-color: #E30613;    /* Rot */
  --line-3-color: #0066B3;    /* Blau */
  --line-5-color: #F39200;    /* Orange */
  --line-10-color: #9D2485;   /* Lila */
  
  /* Status */
  --color-success: #00843D;
  --color-error: #d32f2f;
  --color-warning: #f57c00;
  --color-info: #0288d1;
  
  /* ═══════════════════════════════════════════ */
  /* SCHATTEN (Mobile-optimiert - subtiler) */
  /* ═══════════════════════════════════════════ */
  --shadow-xs: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 16px rgba(0,0,0,0.1);
  --shadow-xl: 0 12px 24px rgba(0,0,0,0.12);
  --shadow-primary: 0 4px 12px rgba(0, 132, 61, 0.25);
  --shadow-primary-hover: 0 6px 16px rgba(0, 132, 61, 0.3);
  
  /* ═══════════════════════════════════════════ */
  /* BORDER RADIUS */
  /* ═══════════════════════════════════════════ */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-full: 9999px;
  
  /* ═══════════════════════════════════════════ */
  /* TRANSITIONS */
  /* ═══════════════════════════════════════════ */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.2s ease;
  --transition-slow: 0.3s ease;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  
  /* ═══════════════════════════════════════════ */
  /* SPACING (Mobile-optimiert) */
  /* ═══════════════════════════════════════════ */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  
  /* ═══════════════════════════════════════════ */
  /* TYPOGRAPHY (Responsive Base Sizes) */
  /* ═══════════════════════════════════════════ */
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Helvetica Neue', Arial, sans-serif;
  --font-family-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Courier New', monospace;
  
  /* Mobile Base Sizes */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 28px;
  --font-size-4xl: 32px;
  --font-size-5xl: 40px;
  --font-size-6xl: 48px;
  --font-size-7xl: 56px;
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  --line-height-tight: 1.2;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  
  --letter-spacing-tight: -0.02em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;
  
  /* ═══════════════════════════════════════════ */
  /* TOUCH TARGETS (Mobile) */
  /* ═══════════════════════════════════════════ */
  --touch-target-min: 44px;           /* iOS/Android Minimum */
  --touch-target-comfortable: 48px;
  
  /* ═══════════════════════════════════════════ */
  /* Z-INDEX */
  /* ═══════════════════════════════════════════ */
  --z-base: 0;
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal: 1050;
  --z-tooltip: 1070;
}

/* Desktop Typography Overrides */
@media (min-width: 768px) {
  :root {
    --font-size-4xl: 36px;
    --font-size-5xl: 48px;
    --font-size-6xl: 60px;
    --font-size-7xl: 72px;
  }
}
```

---

## WICHTIGSTE IMPLEMENTIERUNGS-ANFORDERUNGEN

### 1. Eingabeformat: LLL/UU

**KRITISCH:** Das System verwendet ein spezielles Format für Linie/Umlauf-Eingabe:

- **Format:** `LLL/UU`
  - `LLL` = 3-stellige Liniennummer MIT führenden Nullen
  - `UU` = 2-stellige Umlaufnummer MIT führenden Nullen

**Beispiele:**
```
003/10  →  Linie 3, Umlauf 10
001/05  →  Linie 1, Umlauf 5
010/25  →  Linie 10, Umlauf 25
```

**Regex:** `/^\d{3}\/\d{2}$/`

**Parsing-Logik:**
```javascript
function parseInput(input) {
  const trimmed = input.trim();
  
  if (!/^\d{3}\/\d{2}$/.test(trimmed)) {
    return null;
  }
  
  const [lineIdPadded, cycleIdPadded] = trimmed.split('/');
  const lineId = String(parseInt(lineIdPadded)); // Entfernt führende Nullen
  
  return {
    valid: true,
    lineIdPadded,      // "003" oder "010"
    lineId,            // "3" oder "10"
    cycleIdPadded,     // "10" oder "05"
    raw: trimmed
  };
}
```

### 2. Audio-Player mit Lazy Loading

**KRITISCH:** Audio-Dateien werden ERST beim Abspielen geladen, nicht vorher!

```javascript
class AudioPlayer {
  constructor() {
    this.isPlaying = false;
    this.currentPlaylist = [];
    this.currentIndex = 0;
    this.audioCache = new Map(); // Cache für bereits geladene Dateien
  }
  
  async playPlaylist(playlist, onComplete) {
    if (this.isPlaying) return;
    
    this.currentPlaylist = playlist;
    this.currentIndex = 0;
    this.isPlaying = true;
    
    showLoadingIndicator();
    
    try {
      await this.playNext();
      if (onComplete) onComplete();
    } finally {
      hideLoadingIndicator();
      this.isPlaying = false;
    }
  }
  
  async loadAudio(audioId) {
    // Check Cache first
    if (this.audioCache.has(audioId)) {
      return this.audioCache.get(audioId);
    }
    
    // Load from audio-library.json
    const audioLib = Storage.getSession('audioLib');
    const audioFile = audioLib.audioFiles.find(a => a.id === audioId);
    
    const audio = new Audio(audioFile.path);
    
    await new Promise((resolve, reject) => {
      audio.addEventListener('canplaythrough', resolve, { once: true });
      audio.addEventListener('error', reject, { once: true });
      audio.load();
    });
    
    // Cache it
    this.audioCache.set(audioId, audio);
    return audio;
  }
}
```

### 3. Mobile-First Design

**KRITISCH:** Alle Styles müssen mobile-first sein:

```css
/* Mobile Base (default) */
.btn-submit {
  font-size: var(--font-size-xl);
  padding: var(--space-4) var(--space-6);
  min-height: var(--touch-target-comfortable); /* 48px */
}

/* Desktop Enhancements */
@media (min-width: 768px) {
  .btn-submit {
    font-size: var(--font-size-3xl);
    padding: var(--space-6) var(--space-10);
  }
}
```

### 4. SVG Icons (KEINE Emojis!)

**KRITISCH:** Alle Icons müssen SVG sein, keine Emojis!

Beispiel Icon-Verwendung:
```html
<button class="btn-submit">
  <span class="btn-text">BESTÄTIGEN</span>
  <span class="icon icon--md icon--white">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  </span>
</button>
```

---

## JSON-STRUKTUR (VOLLSTÄNDIG)

### examples/lines.json

```json
{
  "lines": [
    {
      "id": "1",
      "paddedId": "001",
      "name": "Linie 1",
      "displayName": "1",
      "color": "#00843D",
      "textColor": "#FFFFFF",
      "type": "tram",
      "operator": "BSVG",
      "audioId": "line_1"
    },
    {
      "id": "3",
      "paddedId": "003",
      "name": "Linie 3",
      "displayName": "3",
      "color": "#0066B3",
      "textColor": "#FFFFFF",
      "type": "tram",
      "operator": "BSVG",
      "audioId": "line_3"
    },
    {
      "id": "10",
      "paddedId": "010",
      "name": "Linie 10",
      "displayName": "10",
      "color": "#9D2485",
      "textColor": "#FFFFFF",
      "type": "tram",
      "operator": "BSVG",
      "audioId": "line_10"
    }
  ]
}
```

### examples/stops.json

```json
{
  "stops": [
    {
      "id": "bsvg_001",
      "name": "Hauptbahnhof",
      "shortCode": "HBF",
      "type": "regular",
      "lines": ["1", "2", "3"],
      "isTemporary": false,
      "audioId": "stop_hauptbahnhof"
    },
    {
      "id": "bsvg_456",
      "name": "Ersatzhaltestelle Altewiekring",
      "shortCode": "ERS-A",
      "type": "ersatz",
      "lines": ["3"],
      "isTemporary": true,
      "audioId": "via_ersatz_awr",
      "validFrom": "2025-11-15",
      "validUntil": "2026-01-15"
    },
    {
      "id": "bsvg_003",
      "name": "Gliesmarode",
      "shortCode": "GLI",
      "type": "regular",
      "lines": ["3"],
      "isTemporary": false,
      "audioId": "dest_gliesmarode"
    }
  ]
}
```

### examples/cycles.json

```json
{
  "cycles": [
    {
      "cycleId": "003_10",
      "paddedId": "10",
      "lineId": "3",
      "type": "diversion",
      "name": "Linie 3 Umleitung Bauarbeiten AWR",
      "direction": "Gliesmarode",
      "destinationAudioId": "dest_gliesmarode",
      "viaStops": ["ERS-A"],
      "route": [
        {
          "stopId": "bsvg_001",
          "shortCode": "HBF"
        },
        {
          "stopId": "bsvg_456",
          "shortCode": "ERS-A"
        },
        {
          "stopId": "bsvg_003",
          "shortCode": "GLI"
        }
      ],
      "specialAnnouncements": [],
      "validFrom": "2025-11-15",
      "validUntil": "2026-01-15",
      "priority": 5
    }
  ]
}
```

**WICHTIG:** `viaStops` enthält Kürzel (z.B. `["ERS-A"]`), die zur Laufzeit in Audio-IDs aufgelöst werden!

### examples/audio-library.json

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
    },
    {
      "id": "line_3",
      "path": "announcements/de/lines/line_3.mp3",
      "duration": 0.8,
      "language": "de",
      "tags": ["line", "line_number"],
      "description": "der Linie 3"
    },
    {
      "id": "connector_nach",
      "path": "announcements/de/connectors/nach.mp3",
      "duration": 0.5,
      "language": "de",
      "tags": ["connector", "to"],
      "description": "nach"
    },
    {
      "id": "connector_ueber",
      "path": "announcements/de/connectors/ueber.mp3",
      "duration": 0.5,
      "language": "de",
      "tags": ["connector", "via_word"],
      "description": "über"
    },
    {
      "id": "conjunction_und",
      "path": "announcements/de/conjunctions/und.mp3",
      "duration": 0.4,
      "language": "de",
      "tags": ["conjunction", "and"],
      "description": "und"
    },
    {
      "id": "dest_gliesmarode",
      "path": "announcements/de/destinations/gliesmarode.mp3",
      "duration": 1.1,
      "language": "de",
      "tags": ["destination"],
      "description": "Gliesmarode"
    },
    {
      "id": "via_ersatz_awr",
      "path": "announcements/de/via/ersatz_awr.mp3",
      "duration": 2.8,
      "language": "de",
      "tags": ["via"],
      "description": "Ersatzhaltestelle Altewiekring"
    },
    {
      "id": "door_closing_chime",
      "path": "announcements/de/chimes/door_closing.mp3",
      "duration": 1.0,
      "language": "de",
      "tags": ["chime", "door"],
      "description": "Türschließton"
    }
  ]
}
```

---

## DEPLOYMENT AUF NETLIFY

### Schritt 1: Repository vorbereiten

Das Repository `bsvg-ans-ibis` ist bereits erstellt:
**https://github.com/jakobneukirchner/bsvg-ans-ibis**

### Schritt 2: Netlify Verbinden

1. Gehe zu **netlify.com**
2. "Add new site" → "Import an existing project"
3. Wähle **GitHub** → `bsvg-ans-ibis`
4. Build settings:
   - **Build command:** (leer lassen)
   - **Publish directory:** `public`
5. Deploy!

### Schritt 3: Environment Variables (Falls nötig)

Falls Fileserver-URL dynamisch:
```
FILESERVER_URL=https://your-fileserver.netlify.app
```

---

## TESTING CHECKLIST

### Funktional
- [ ] Eingabe-Validierung (LLL/UU Format)
- [ ] Recent Entries anzeigen
- [ ] Recent Entry auswählen
- [ ] JSON-Dateien laden (local fallback)
- [ ] Fehlerbehandlung (Linie/Umlauf nicht gefunden)
- [ ] Session Storage funktioniert
- [ ] Weiterleitung zu Ansage-Interface

### Mobile
- [ ] Touch funktioniert
- [ ] Keyboard öffnet richtig (numeric inputmode)
- [ ] Keine Zoom-Probleme
- [ ] Scroll smooth
- [ ] Keine Layout-Shifts
- [ ] Min. 44px Touch-Targets

### Browser
- [ ] Chrome Mobile (Android)
- [ ] Safari iOS
- [ ] Firefox Android
- [ ] Chrome Desktop
- [ ] Safari Desktop

---

## PRIORITÄTEN FÜR PERPLEXITY LABS

### Phase 1: Core Structure (HIGHEST PRIORITY)
1. Erstelle alle Ordner und Basis-Dateien
2. Implementiere `netlify.toml`
3. Erstelle `public/index.html` (Startseite)
4. Erstelle alle CSS-Dateien (variables.css, base.css, index.css)
5. Erstelle alle SVG Icons
6. Erstelle alle JSON-Beispieldateien

### Phase 2: JavaScript Logic
1. `config.js` - Konfiguration
2. `utils.js` - Hilfsfunktionen (KRITISCH: parseInput)
3. `storage.js` - LocalStorage Wrapper
4. `app.js` - Startseite Logic (Eingabe-Handling, loadCycle)
5. `audio-player.js` - Audio-Player mit Lazy Loading

### Phase 3: Ansage-Interface
1. `public/announcements.html`
2. `public/css/announcements.css`
3. `public/js/announcements.js`

### Phase 4: Polish & Testing
1. Responsive Design testen
2. Touch-Optimierungen
3. Accessibility (ARIA, Focus States)
4. README.md schreiben

---

**DIESER PROMPT IST VOLLSTÄNDIG UND PRODUCTION-READY FÜR PERPLEXITY LABS!**

Alle Dateien, Strukturen und Details sind spezifiziert. Labs kann direkt implementieren.
