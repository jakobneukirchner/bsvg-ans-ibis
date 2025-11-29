// ENHANCED ANNOUNCEMENTS - Mit Station vorschalten, Sonderansagen, dynamischen Platzhaltern

let currentCycle = null;
let currentLine = null;
let allStops = [];
let audioLibrary = [];
let currentStationIndex = 0;
let isPlaying = false;

// INIT
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const lineId = urlParams.get('line');
  const cycleId = urlParams.get('cycle');
  
  if (!lineId || !cycleId) {
    alert('❌ Keine Linie/Umlauf angegeben!');
    window.location.href = '/index.html';
    return;
  }
  
  await loadData(lineId, cycleId);
  renderInterface();
  setupControls();
});

async function loadData(lineId, cycleId) {
  const base = CONFIG.FILESERVER_URL;
  try {
    const [linesRes, cyclesRes, stopsRes, audioRes] = await Promise.all([
      fetch(base + '/lines.json'),
      fetch(base + '/cycles.json'),
      fetch(base + '/stops.json'),
      fetch(base + '/audio-library.json')
    ]);
    
    const linesData = await linesRes.json();
    const cyclesData = await cyclesRes.json();
    const stopsData = await stopsRes.json();
    const audioData = await audioRes.json();
    
    currentLine = linesData.lines.find(l => l.paddedId === lineId);
    currentCycle = cyclesData.cycles.find(c => c.cycleId === lineId + '_' + cycleId);
    allStops = stopsData.stops;
    audioLibrary = audioData.audioFiles || [];
    
    if (!currentLine || !currentCycle) {
      throw new Error('Linie/Umlauf nicht gefunden');
    }
  } catch (e) {
    alert('❌ Fehler beim Laden: ' + e.message);
    window.location.href = '/index.html';
  }
}

function renderInterface() {
  // Header
  document.getElementById('lineBadge').innerHTML = `<span class="line-badge__number">${currentLine.displayName}</span>`;
  document.getElementById('lineBadge').style.backgroundColor = currentLine.color;
  document.getElementById('lineBadge').style.color = currentLine.textColor;
  document.getElementById('headerTitle').textContent = `${currentLine.name} / Umlauf ${currentCycle.paddedId}`;
  document.getElementById('headerSubtitle').textContent = `${currentCycle.type === 'diversion' ? 'Umleitung' : 'Regelbetrieb'} nach ${currentCycle.direction}`;
  
  // Route
  renderRoute();
  
  // Steuerungs-Sektion hinzufügen
  addControlSection();
  
  // Sonderansagen-Sektion hinzufügen
  addSpecialAnnouncementsSection();
}

function addControlSection() {
  const container = document.querySelector('.announcement-container');
  const section = document.createElement('section');
  section.className = 'control-section';
  section.innerHTML = `
    <div class="control-card">
      <h2 class="section-title">
        <span class="icon icon--md icon--primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </span>
        <span>Steuerung</span>
      </h2>
      
      <div class="control-group">
        <label class="control-label">📍 Station vorschalten:</label>
        <div style="display:flex;gap:8px;">
          <select id="stationSelect" class="form-control" style="flex:1;">
            <option value="">-- Station wählen --</option>
            ${allStops.map(s => `<option value="${s.id}">${s.name} (${s.shortCode})</option>`).join('')}
          </select>
          <button onclick="skipToStation()" class="btn btn--primary">Springen</button>
        </div>
      </div>
      
      <div class="control-group">
        <label class="control-label">📢 Standard-Ansagen:</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button onclick="announceNextStop()" class="btn btn--secondary btn--sm">Nächste Station</button>
          <button onclick="announceDestination()" class="btn btn--secondary btn--sm">Ziel</button>
          <button onclick="announceVia()" class="btn btn--secondary btn--sm">Via-Stops</button>
        </div>
      </div>
    </div>
  `;
  
  container.insertBefore(section, document.querySelector('.route-section'));
}

function addSpecialAnnouncementsSection() {
  if (!currentCycle.specialAnnouncements || currentCycle.specialAnnouncements.length === 0) return;
  
  const container = document.querySelector('.announcement-container');
  const section = document.createElement('section');
  section.className = 'special-announcements-section';
  
  const dynamicAnnouncements = currentCycle.specialAnnouncements.filter(a => 
    a.text.includes('{') && a.text.includes('}')
  );
  const staticAnnouncements = currentCycle.specialAnnouncements.filter(a => 
    !a.text.includes('{') || !a.text.includes('}')
  );
  
  let html = `
    <div class="special-card">
      <h2 class="section-title">
        <span class="icon icon--md icon--primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </span>
        <span>Sonderansagen</span>
      </h2>
  `;
  
  if (dynamicAnnouncements.length > 0) {
    html += `
      <div class="announcement-group">
        <h3 class="group-title">⚡ Dynamische Ansagen</h3>
        <p class="group-hint">Diese Ansagen können automatisch ausgefüllt werden:</p>
        <div class="announcement-list">
    `;
    
    dynamicAnnouncements.forEach((ann, i) => {
      const placeholders = extractPlaceholders(ann.text);
      html += `
        <div class="announcement-item dynamic">
          <div class="announcement-content">
            <span class="announcement-type">${ann.type}</span>
            <span class="announcement-text">${ann.text}</span>
            ${placeholders.length > 0 ? `<span class="announcement-placeholders">(${placeholders.join(', ')})</span>` : ''}
          </div>
          <button onclick="playDynamicAnnouncement(${i})" class="btn btn--primary btn--sm">▶️ Ausfüllen & Abspielen</button>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
  }
  
  if (staticAnnouncements.length > 0) {
    html += `
      <div class="announcement-group">
        <h3 class="group-title">📣 Statische Ansagen</h3>
        <div class="announcement-list">
    `;
    
    staticAnnouncements.forEach((ann, i) => {
      html += `
        <div class="announcement-item">
          <div class="announcement-content">
            <span class="announcement-type">${ann.type}</span>
            <span class="announcement-text">${ann.text}</span>
          </div>
          <button onclick="playStaticAnnouncement('${ann.text.replace(/'/g, "\\'")}')" class="btn btn--primary btn--sm">▶️ Abspielen</button>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
  }
  
  html += `</div>`;
  section.innerHTML = html;
  
  container.insertBefore(section, document.querySelector('.route-section'));
}

function extractPlaceholders(text) {
  const matches = text.match(/\{([^}]+)\}/g);
  if (!matches) return [];
  return matches.map(m => m.replace(/[{}]/g, ''));
}

function fillPlaceholders(text) {
  let filled = text;
  
  // Ersetze Platzhalter
  filled = filled.replace(/\{line\}/g, currentLine.displayName);
  filled = filled.replace(/\{lineName\}/g, currentLine.name);
  filled = filled.replace(/\{destination\}/g, currentCycle.direction);
  filled = filled.replace(/\{direction\}/g, currentCycle.direction);
  
  // Via-Stops
  if (currentCycle.viaStops && currentCycle.viaStops.length > 0) {
    const viaNames = currentCycle.viaStops.map(viaId => {
      const stop = allStops.find(s => s.id === viaId);
      return stop ? stop.name : viaId;
    });
    filled = filled.replace(/\{via\}/g, viaNames.join(', '));
  }
  
  // Aktuelle Station
  if (currentStationIndex < currentCycle.route.length) {
    const stopId = currentCycle.route[currentStationIndex];
    const stop = allStops.find(s => s.id === stopId);
    filled = filled.replace(/\{stop\}/g, stop ? stop.name : stopId);
    filled = filled.replace(/\{currentStop\}/g, stop ? stop.name : stopId);
  }
  
  // Nächste Station
  if (currentStationIndex + 1 < currentCycle.route.length) {
    const nextStopId = currentCycle.route[currentStationIndex + 1];
    const nextStop = allStops.find(s => s.id === nextStopId);
    filled = filled.replace(/\{nextStop\}/g, nextStop ? nextStop.name : nextStopId);
  }
  
  // Weitere dynamische Werte
  filled = filled.replace(/\{operator\}/g, currentLine.operator || 'BSVG');
  filled = filled.replace(/\{type\}/g, currentCycle.type === 'diversion' ? 'Umleitung' : 'Regelbetrieb');
  
  return filled;
}

function renderRoute() {
  const container = document.getElementById('routeInfo');
  if (!currentCycle.route || currentCycle.route.length === 0) {
    container.innerHTML = '<p class="empty-state">Keine Route definiert</p>';
    return;
  }
  
  container.innerHTML = currentCycle.route.map((stopId, i) => {
    const stop = allStops.find(s => s.id === stopId);
    return `
      <div class="route-stop ${i === currentStationIndex ? 'current' : ''}">
        <div class="route-stop-marker"></div>
        <div class="route-stop-info">
          <span class="route-stop-name">${stop ? stop.name : stopId}</span>
          <span class="route-stop-code">${stop ? stop.shortCode : ''}</span>
        </div>
      </div>
    `;
  }).join('');
}

function setupControls() {
  document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = '/index.html';
  });
}

// STEUERUNGS-FUNKTIONEN
function skipToStation() {
  const select = document.getElementById('stationSelect');
  const stopId = select.value;
  
  if (!stopId) {
    alert('❌ Bitte Station wählen!');
    return;
  }
  
  const index = currentCycle.route.indexOf(stopId);
  if (index === -1) {
    alert('❌ Station nicht in Route!');
    return;
  }
  
  currentStationIndex = index;
  renderRoute();
  
  const stop = allStops.find(s => s.id === stopId);
  alert(`✅ Vorgeschaltet zu: ${stop ? stop.name : stopId}`);
}

function announceNextStop() {
  if (currentStationIndex >= currentCycle.route.length) {
    alert('❌ Keine weitere Station!');
    return;
  }
  
  const stopId = currentCycle.route[currentStationIndex];
  const stop = allStops.find(s => s.id === stopId);
  const text = `Nächster Halt: ${stop ? stop.name : stopId}`;
  
  playAnnouncementText(text);
}

function announceDestination() {
  const text = `Fahrt Richtung ${currentCycle.direction}`;
  playAnnouncementText(text);
}

function announceVia() {
  if (!currentCycle.viaStops || currentCycle.viaStops.length === 0) {
    alert('❌ Keine Via-Stops!');
    return;
  }
  
  const viaNames = currentCycle.viaStops.map(viaId => {
    const stop = allStops.find(s => s.id === viaId);
    return stop ? stop.name : viaId;
  });
  
  const text = `Über ${viaNames.join(', ')}`;
  playAnnouncementText(text);
}

function playDynamicAnnouncement(index) {
  const dynamicAnnouncements = currentCycle.specialAnnouncements.filter(a => 
    a.text.includes('{') && a.text.includes('}')
  );
  
  if (index >= dynamicAnnouncements.length) return;
  
  const announcement = dynamicAnnouncements[index];
  const filledText = fillPlaceholders(announcement.text);
  
  playAnnouncementText(filledText);
}

function playStaticAnnouncement(text) {
  playAnnouncementText(text);
}

function playAnnouncementText(text) {
  // Simulation - In echter App würde hier Audio abgespielt
  console.log('🔊 Spiele Ansage:', text);
  alert(`🔊 Ansage:\n\n"${text}"\n\n(In der echten App würde jetzt Audio abgespielt werden)`);
}

// GLOBAL
window.skipToStation = skipToStation;
window.announceNextStop = announceNextStop;
window.announceDestination = announceDestination;
window.announceVia = announceVia;
window.playDynamicAnnouncement = playDynamicAnnouncement;
window.playStaticAnnouncement = playStaticAnnouncement;

console.log('✅ Enhanced Announcements loaded');
