# BSVG Ansagesystem

**Manuelles Ansagesystem für Straßenbahnen in Braunschweig**

Eine Progressive Web App (PWA) für mobile Endgeräte, die Straßenbahnfahrern ermöglicht, manuelle Ansagen für verschiedene Linien und Umläufe abzuspielen.

## 🌐 Live-URLs

**Haupt-App:** [BEREIT FÜR DEPLOYMENT]

**Fileserver:** https://bsvg-ibis-fs.netlify.app

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
- ✅ **Fallback System** - GitHub Raw Content als Backup

---

## 🛤️ Tech Stack

| Komponente | Technologie |
|------------|-------------|
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| **Hosting** | Netlify |
| **Fileserver** | Netlify + GitHub Raw Fallback |
| **Storage** | LocalStorage, SessionStorage |
| **Audio** | Web Audio API (Lazy Loading) |
| **Icons** | Custom SVG |
| **Dependencies** | None (Zero!) |

---

## 🚀 Deployment auf Netlify

### Voraussetzungen

✅ **Fileserver bereits deployed:** https://bsvg-ibis-fs.netlify.app

### Haupt-App deployen

1. Gehe zu [netlify.com](https://www.netlify.com/)
2. "Add new site" → "Import existing project"
3. Wähle GitHub → `jakobneukirchner/bsvg-ans-ibis`
4. **Build Settings:**
   - Build command: (leer)
   - Publish directory: `public`
5. Deploy!

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

### Datenquellen

**Primär (Netlify):**
```
https://bsvg-ibis-fs.netlify.app/lines.json
https://bsvg-ibis-fs.netlify.app/audio-library.json
https://bsvg-ibis-fs.netlify.app/announcements/de/lines/line_3.mp3
```

**Fallback (GitHub Raw):**
```
https://raw.githubusercontent.com/jakobneukirchner/bsvg-ans-fileserver/main/public/lines.json
```

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
  // Production Fileserver
  FILESERVER_URL: 'https://bsvg-ibis-fs.netlify.app',
  
  // Fallback auf GitHub Raw
  FILESERVER_URL_FALLBACK: 'https://raw.githubusercontent.com/jakobneukirchner/bsvg-ans-fileserver/main/public',
  
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
│   │   ├── config.js        # → Production URLs
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
- [ ] JSON-Dateien laden von Fileserver
- [ ] Fallback zu GitHub Raw bei Fehler
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

**Repositories:**
- Haupt-App: https://github.com/jakobneukirchner/bsvg-ans-ibis
- Fileserver: https://github.com/jakobneukirchner/bsvg-ans-fileserver

**Live:**
- Fileserver: https://bsvg-ibis-fs.netlify.app
- Haupt-App: [Nach Deployment]

---

## 🚀 Status

🟢 **Production Ready**

- ✅ Code vollständig
- ✅ Design-System implementiert
- ✅ Mobile-optimiert
- ✅ Lazy Loading Audio
- ✅ Fallback-Mechanismus
- ✅ Zero Dependencies
- ✅ Fileserver deployed (https://bsvg-ibis-fs.netlify.app)
- ⏳ Haupt-App Deployment ausstehend

---

**Made with ❤️ for BSVG Braunschweig**
