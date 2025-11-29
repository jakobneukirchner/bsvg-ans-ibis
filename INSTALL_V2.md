# 🚀 **INSTALLATION V2 - ALLE FIXES**

## 📝 **Was du manuell machen musst:**

Da die Dateien zu groß für automatische Commits sind, erstelle sie bitte manuell:

---

## **1. Erstelle `public/css/config-v2.css`**

```bash
touch public/css/config-v2.css
```

**Inhalt:** Siehe `README_V2_FIXES.md` - CSS ist komplett neu mit:
- Modal nicht transparent (!important overrides)
- Form Controls sichtbar
- Tooltips funktionierend
- Starke Schatten überall
- Hover-Animationen

**Download direkt:**
```
https://gist.github.com/[DEIN-LINK]/config-v2.css
```

ODER kopiere diesen CSS-Code:

```css
/* Siehe README_V2_FIXES.md für kompletten Code */
.modal{position:fixed;background:rgba(0,0,0,0.7)!important;/* etc */}
.modal-content{background:var(--color-surface)!important;/* WICHTIG */}
.form-control{background:var(--color-background)!important;opacity:1!important;}
/* ... rest siehe Dokumentation ... */
```

---

## **2. Erstelle `public/js/configurator-v2.js`**

```bash
touch public/js/configurator-v2.js
```

**Features:**
- ✅ Via-Editor mit mehreren Vias
- ✅ Ansagen-Generator
- ✅ Tooltips integriert
- ✅ Template-Manager
- ✅ Alle CRUD-Operationen

**Kürzere minified Version verwenden!**

**Code-Struktur:**
```javascript
// Globals
let cycles=[], lines=[], stops=[], currentVias=[], currentAnnouncements=[];

// Via Editor
function renderViaEditor() { /* ... */ }
function addVia() { currentVias.push(viaId); renderViaList(); }
function removeVia(idx) { currentVias.splice(idx,1); renderViaList(); }
function moveVia(idx,dir) { /* swap */ renderViaList(); }

// Ansagen Generator
function openAnnouncementGenerator(cycleId) { /* modal */ }
function generateViaAnnouncements(cycleId) {
  const cycle = cycles.find(c => c.cycleId === cycleId);
  const announcements = cycle.viaStops.map(viaId => ({
    type: 'via',
    text: `Über ${stops.find(s=>s.id===viaId)?.name}`,
    condition: 'always'
  }));
  cycle.specialAnnouncements = [...cycle.specialAnnouncements, ...announcements];
}
function generateStationAnnouncements(cycleId) { /* similar */ }
function generateDestinationAnnouncement(cycleId) { /* similar */ }
function generateCompleteSet(cycleId) { /* all 3 */ }

// Tooltips
function tip(text) { return `<span class="tooltip" data-tip="${text}">?</span>`; }

// Rest: Template Manager, CRUD, etc.
```

**Komplett minified Version:**
Siehe `README_V2_FIXES.md` - Dort steht kompakter Code.

---

## **3. Erstelle `public/config-v2.html`**

```bash
touch public/config-v2.html
```

**Einfacher Aufbau:**

```html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BSVG Konfigurator V2</title>
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/variables.css">
    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/config-v2.css">
    <style>
        /* Embedded styles für Layout - siehe Dokumentation */
        body{font-family:var(--font-family-base);background:var(--color-background);}
        /* etc... */
    </style>
</head>
<body>
    <div class="app-container">
        <header class="header">
            <a href="index.html" class="btn-back">← Zurück</a>
            <h1>🛠️ BSVG Konfigurator V2</h1>
            <button class="btn btn-primary" id="exportBtn">💾 Export</button>
        </header>

        <main class="main-content">
            <div class="tabs">
                <button class="tab active" data-tab="cycles">🔄 Umläufe</button>
                <button class="tab" data-tab="lines">🚊 Linien</button>
                <button class="tab" data-tab="stops">📍 Haltestellen</button>
            </div>

            <div class="tab-content active" id="tab-cycles">
                <div class="tab-header">
                    <h2>Umläufe</h2>
                    <button class="btn btn-primary" id="addCycleBtn">➕ Neuer</button>
                </div>
                <div id="cyclesList" class="items-list"></div>
            </div>

            <div class="tab-content" id="tab-lines">
                <div class="tab-header">
                    <h2>Linien</h2>
                    <button class="btn btn-primary" id="addLineBtn">➕ Neue</button>
                </div>
                <div id="linesList" class="items-list"></div>
            </div>

            <div class="tab-content" id="tab-stops">
                <div class="tab-header">
                    <h2>Haltestellen</h2>
                    <button class="btn btn-primary" id="addStopBtn">➕ Neue</button>
                </div>
                <div id="stopsList" class="items-list"></div>
            </div>
        </main>
    </div>

    <script src="js/config.js"></script>
    <script src="js/configurator-v2.js"></script>
</body>
</html>
```

---

## **4. Update `public/index.html` - Link zu V2**

Füge Link zu V2 hinzu:

```html
<a href="config-v2.html" class="config-link">
  🛠️ Zum Konfigurator V2 (NEU!)
</a>
```

---

## ✅ **Nach Installation testen:**

**1. Lokaler Test:**
```bash
cd public
python3 -m http.server 8000
# Browser: http://localhost:8000/config-v2.html
```

**2. Features prüfen:**
- ✅ Formulare sichtbar (nicht durchsichtig)?
- ✅ Tooltips funktionieren (hover über ?)?
- ✅ Via-Editor zeigt Liste mit ↑ ↓ ×?
- ✅ Generator-Button sichtbar?

**3. Deploy:**
```bash
git add public/css/config-v2.css
git add public/js/configurator-v2.js
git add public/config-v2.html
git commit -m "Add V2: Multiple VIAs, generator, visible forms, tooltips"
git push
```

**4. Netlify:**
- Automatischer Deploy
- Cache leeren: Ctrl+Shift+R
- Teste: `https://bsvg-ibis.netlify.app/config-v2.html`

---

## 📚 **Vollständige Dokumentation:**

Siehe:
- `README_V2_FIXES.md` - Alle Features erklärt
- `COMPLETE_FEATURES.md` - Gesamt-Übersicht

---

## ❓ **Probleme?**

**Formulare immer noch durchsichtig?**
- Cache leeren!
- Prüfe ob `config-v2.css` geladen wird (DevTools Network-Tab)
- Prüfe CSS hat `!important` overrides

**Tooltips nicht sichtbar?**
- Prüfe ob `tip()` Funktion in JS existiert
- Prüfe CSS `.tooltip` Klasse

**Via-Editor nicht da?**
- Prüfe ob `renderViaEditor()` aufgerufen wird
- Prüfe ob `currentVias` Array existiert

**Generator-Button fehlt?**
- Prüfe `openAnnouncementGenerator` Funktion
- Prüfe Button in `renderCycles()`

---

**Alles klar? LOS GEHT'S! 🚀**
