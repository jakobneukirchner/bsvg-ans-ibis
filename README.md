# BSVG Ansagesystem

**Manuelles Ansagesystem für Straßenbahnen in Braunschweig**

Eine Progressive Web App (PWA) für mobile Endgeräte, die Straßenbahnfahrern ermöglicht, manuelle Ansagen für verschiedene Linien und Umläufe abzuspielen.

## 🌐 Live-URLs

**Haupt-App:** https://bsvg-ibis.netlify.app

**Fileserver (GitHub Raw):** https://raw.githubusercontent.com/jakobneukirchner/bsvg-ans-fileserver/main/public/

---

## 📱 Features

- ✅ **Mobile-First Design** - Optimiert für Smartphones und Tablets
- ✅ **Lazy Loading Audio** - Audiodateien werden erst beim Abspielen geladen
- ✅ **Recent Entries** - Letzte 5 Eingaben werden gespeichert
- ✅ **Dynamische Routen** - Unterstützt Regelrouten und Umleitungen
- ✅ **Touch-optimiert** - 44px+ Touch-Targets für mobile Bedienung
- ✅ **Offline-Ready** - LocalStorage für Session-Daten
- ✅ **BSVG Design System** - Offizielle Farben und Typografie
- ✅ **Zero Dependencies** - Vanilla JavaScript, HTML, CSS
- ✅ **GitHub Raw Content** - Immer verfügbar, kein Server nötig

---

## 🛤️ Tech Stack

| Komponente | Technologie |
|------------|-------------|
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| **Hosting** | Netlify |
| **Fileserver** | GitHub Raw Content |
| **Storage** | LocalStorage, SessionStorage |
| **Audio** | Web Audio API (Lazy Loading) |
| **Icons** | Custom SVG |
| **Dependencies** | None (Zero!) |

---

## 🚀 URLs

### Haupt-App

**Live:** https://bsvg-ibis.netlify.app

**Repository:** https://github.com/jakobneukirchner/bsvg-ans-ibis

### Fileserver (GitHub Raw)

**JSON-Dateien:**
```
https://raw.githubusercontent.com/jakobneukirchner/bsvg-ans-fileserver/main/public/lines.json
https://raw.githubusercontent.com/jakobneukirchner/bsvg-ans-fileserver/main/public/stops.json
https://raw.githubusercontent.com/jakobneukirchner/bsvg-ans-fileserver/main/public/cycles.json
https://raw.githubusercontent.com/jakobneukirchner/bsvg-ans-fileserver/main/public/audio-library.json
```

**Audio-Dateien:**
```
https://raw.githubusercontent.com/jakobneukirchner/bsvg-ans-fileserver/main/public/announcements/de/lines/line_3.mp3
```

**Repository:** https://github.com/jakobneukirchner/bsvg-ans-fileserver

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
| `3/10` | - | - | ❌ |
| `003/5` | - | - | ❌ |

---

## 🎵 Audio-System

### Lazy Loading Prinzip

Audiodateien werden **ERST beim Abspielen** geladen - nicht vorher!

### GitHub Raw als Quelle

Alle Daten werden direkt von GitHub Raw geladen:
- ✅ Immer verfügbar (99.9% Uptime)
- ✅ Kein separater Server nötig
- ✅ Automatische Updates bei Git Push
- ✅ Kostenlos und unbegrenzt

---

## 🎨 Design System

### BSVG Linienfarben

| Linie | Farbe | Hex-Code |
|-------|-------|----------|
| **1** | Grün | `#00843D` |
| **2** | Rot | `#E30613` |
| **3** | Blau | `#0066B3` |
| **5** | Orange | `#F39200` |
| **10** | Lila | `#9D2485` |

### Touch Targets

```css
--touch-target-min: 44px;         /* iOS/Android Minimum */
--touch-target-comfortable: 48px;  /* Bevorzugt */
```

---

## ⚙️ Konfiguration

### Production URLs

**File:** `public/js/config.js`

```javascript
const CONFIG = {
  // GitHub Raw (immer verfügbar)
  FILESERVER_URL: 'https://raw.githubusercontent.com/jakobneukirchner/bsvg-ans-fileserver/main/public',
  
  ENDPOINTS: {
    LINES: '/lines.json',
    STOPS: '/stops.json',
    CYCLES: '/cycles.json',
    AUDIO_LIBRARY: '/audio-library.json'
  }
};
```

---

## 🛠️ Lokale Entwicklung

```bash
git clone https://github.com/jakobneukirchner/bsvg-ans-ibis.git
cd bsvg-ans-ibis

python -m http.server 8000 --directory public
```

Im Browser:
```
http://localhost:8000
```

---

## 📁 Projektstruktur

```
bsvg-ans-ibis/
├── public/
│   ├── index.html           # Startseite - Eingabe
│   ├── announcements.html   # Ansage-Interface
│   ├── css/                 # Design System
│   ├── js/
│   │   ├── config.js        # → GitHub Raw URLs
│   │   ├── utils.js
│   │   ├── storage.js
│   │   ├── audio-player.js  # Lazy Loading Engine
│   │   ├── app.js
│   │   └── announcements.js
│   └── assets/icons/
├── netlify.toml
└── README.md
```

---

## ✅ Testing Checklist

### Funktional
- [ ] Eingabe-Validierung (LLL/UU Format)
- [ ] Recent Entries anzeigen
- [ ] JSON-Dateien laden von GitHub Raw
- [ ] Audio abspielen (Lazy Loading)
- [ ] Session Storage funktioniert

### Mobile
- [ ] Touch funktioniert
- [ ] Keyboard öffnet (numeric inputmode)
- [ ] Min. 44px Touch-Targets
- [ ] Kein ungewollter Zoom

### Browser
- [ ] Chrome Mobile (Android)
- [ ] Safari iOS
- [ ] Chrome Desktop
- [ ] Safari Desktop

---

## 🔗 Links

**Live-App:** https://bsvg-ibis.netlify.app

**Repositories:**
- Haupt-App: https://github.com/jakobneukirchner/bsvg-ans-ibis
- Fileserver: https://github.com/jakobneukirchner/bsvg-ans-fileserver

**Fileserver (GitHub Raw):**
- JSON: https://raw.githubusercontent.com/jakobneukirchner/bsvg-ans-fileserver/main/public/

---

## 🚀 Status

🟢 **Live & Production Ready**

- ✅ Deployed: https://bsvg-ibis.netlify.app
- ✅ Code vollständig
- ✅ Design-System implementiert
- ✅ Mobile-optimiert
- ✅ Lazy Loading Audio
- ✅ GitHub Raw als Datenquelle
- ✅ Zero Dependencies

---

**Made with ❤️ for BSVG Braunschweig**
