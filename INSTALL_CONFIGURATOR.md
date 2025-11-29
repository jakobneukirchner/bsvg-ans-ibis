# 🛠️ Konfigurator Installation

## ⚠️ WICHTIG: Datei manuell erstellen

Die `configurator.js` Datei muss manuell erstellt werden, da sie zu groß für automatischen Upload ist.

---

## 📝 Schritt 1: Code kopieren

Kopiere den vollständigen Code aus:

**🔗 https://github.com/jakobneukirchner/bsvg-ans-ibis/blob/main/CONFIGURATOR_FULL.md**

---

## 💾 Schritt 2: Datei erstellen

### Option A: GitHub Web-Interface

1. Gehe zu: https://github.com/jakobneukirchner/bsvg-ans-ibis
2. Navigiere zu `public/js/`
3. Klicke "Add file" → "Create new file"
4. Dateiname: `configurator.js`
5. **Kopiere den GESAMTEN Code aus CONFIGURATOR_FULL.md**
6. Scroll runter, klicke "Commit new file"

### Option B: Git CLI

```bash
cd bsvg-ans-ibis/public/js/

# Erstelle Datei
nano configurator.js

# Kopiere Code aus CONFIGURATOR_FULL.md
# Paste (Strg+Shift+V)
# Speichern (Strg+X, Y, Enter)

git add configurator.js
git commit -m "Add full configurator"
git push origin main
```

### Option C: VS Code / Editor

1. Clone Repository lokal
2. Erstelle `public/js/configurator.js`
3. Kopiere Code aus CONFIGURATOR_FULL.md
4. Speichern
5. Git add, commit, push

---

## ✅ Schritt 3: Testen

```
https://bsvg-ibis.netlify.app/config.html
```

**Erwartetes Verhalten:**
1. Dialog erscheint: "Konfigurator starten"
2. Wähle "Aktuelle Konfiguration laden"
3. Alert: "Geladen: X Umläufe, Y Linien, Z Haltestellen"
4. Tabs funktionieren
5. "+ Neuer Umlauf" öffnet Modal

---

## 🐞 Troubleshooting

### "CONFIG is not defined"

**Problem:** config.js wird nicht geladen

**Lösung:**
```html
<!-- In config.html, VORHER: -->
<script src="js/config.js"></script>
<script src="js/configurator.js"></script>
```

### "showModal is not a function"

**Problem:** configurator.js nicht richtig geladen

**Lösung:** 
Prüfe ob `public/js/configurator.js` existiert und vollständig ist.

### Dialog erscheint nicht

**Problem:** JavaScript-Fehler

**Lösung:**
1. Öffne Browser DevTools (F12)
2. Tab "Console"
3. Fehler lesen
4. Prüfe ob Code vollständig kopiert wurde

---

## 📝 Dateien-Übersicht

```
public/
├── config.html          ✅ Aktualisiert
├── js/
│   ├── config.js        ✅ Vorhanden
│   ├── configurator.js  ⚠️ MANUELL ERSTELLEN
│   ├── utils.js         ✅ Vorhanden (optional)
│   └── storage.js       ✅ Vorhanden (optional)
└── css/
    ├── config.css       ✅ Vorhanden
    └── ...              ✅ Design System
```

---

## ✅ Status Prüfen

**Checklist:**

- [ ] `config.html` aktualisiert (bereits erledigt ✅)
- [ ] `configurator.js` erstellt (siehe oben)
- [ ] Browser-Test funktioniert
- [ ] Start-Dialog erscheint
- [ ] Daten laden funktioniert
- [ ] Umlauff erstellen funktioniert
- [ ] Export funktioniert

---

## 🚀 Nach Installation

1. **Öffne:** https://bsvg-ibis.netlify.app/config.html
2. **Wähle:** "Aktuelle Konfiguration laden"
3. **Erstelle** neuen Umlauf
4. **Exportiere** JSON
5. **Uploade** zu GitHub Fileserver
6. **Fertig!** 🎉

---

**Fragen?** Siehe:
- CONFIGURATOR_FULL.md - Vollständiger Code
- CONFIGURATOR.md - Nutzungsanleitung
