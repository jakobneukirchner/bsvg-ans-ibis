// VOLLSTÄNDIGER KONFIGURATOR - Alle Features
let cycles = [], lines = [], stops = [], audioLibrary = [], customTemplates = [];
let currentTab = 'cycles', currentAnnouncements = [];

// TEMPLATES (Vorlagen + Custom)
const DEFAULT_TEMPLATES = {
  connection: [
    { id: 't1', type: 'next_stop', text: 'Nächster Halt: {stop}', desc: 'Standard Haltestelle' },
    { id: 't2', type: 'via', text: 'Über {via}', desc: 'Via-Stop' },
    { id: 't3', type: 'terminus', text: 'Endstation {stop}', desc: 'Endhalt' }
  ],
  special: [
    { id: 't4', type: 'delay', text: 'Verspätung ca. {minutes} Minuten', desc: 'Verspätung' },
    { id: 't5', type: 'disruption', text: 'Umleitung über {via}', desc: 'Umleitung' },
    { id: 't6', type: 'closed', text: 'Haltestelle {stop} entfällt', desc: 'Ausfall' }
  ],
  info: [
    { id: 't7', type: 'connection', text: 'Anschluss zur Linie {line}', desc: 'Umstieg' },
    { id: 't8', type: 'service', text: 'Bitte beachten Sie: {info}', desc: 'Info' },
    { id: 't9', type: 'thank', text: 'Vielen Dank für Ihre Fahrt', desc: 'Danke' }
  ]
};

function getAllTemplates() {
  const all = [];
  Object.values(DEFAULT_TEMPLATES).forEach(cat => all.push(...cat));
  return [...all, ...customTemplates];
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  loadCustomTemplates();
  showStartDialog();
});

function loadCustomTemplates() {
  const saved = localStorage.getItem('bsvg_custom_templates');
  if (saved) customTemplates = JSON.parse(saved);
}

function saveCustomTemplates() {
  localStorage.setItem('bsvg_custom_templates', JSON.stringify(customTemplates));
}

function showStartDialog() {
  showModal(`
    <div style="text-align:center;padding:40px;">
      <h2>Konfigurator starten</h2>
      <p style="margin:20px 0;">Wähle eine Option:</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <button onclick="startEmpty()" class="btn btn-secondary" style="padding:15px 30px;">Leer starten</button>
        <button onclick="loadExisting()" class="btn btn-primary" style="padding:15px 30px;">Aktuelle laden</button>
        <button onclick="manageTemplates()" class="btn btn-secondary" style="padding:15px 30px;">Templates verwalten</button>
      </div>
    </div>
  `);
}

async function loadExisting() {
  closeModal();
  const base = CONFIG.FILESERVER_URL;
  try {
    const [l, s, c, a] = await Promise.all([
      fetch(base + '/lines.json').then(r => r.json()),
      fetch(base + '/stops.json').then(r => r.json()),
      fetch(base + '/cycles.json').then(r => r.json()),
      fetch(base + '/audio-library.json').then(r => r.json())
    ]);
    lines = l.lines || [];
    stops = s.stops || [];
    cycles = c.cycles || [];
    audioLibrary = a.audioFiles || [];
    alert('✅ Geladen: ' + lines.length + ' Linien, ' + stops.length + ' Stops, ' + cycles.length + ' Umläufe');
  } catch (e) {
    alert('❌ Fehler: ' + e.message);
    lines = []; stops = []; cycles = []; audioLibrary = [];
  }
  init();
}

function startEmpty() {
  closeModal();
  cycles = []; lines = []; stops = []; audioLibrary = [];
  alert('✅ Leere Konfiguration gestartet');
  init();
}

function init() {
  setupTabs();
  setupButtons();
  renderCurrentTab();
}

function setupTabs() {
  document.querySelectorAll('.tab').forEach(t => {
    t.addEventListener('click', () => {
      currentTab = t.dataset.tab;
      document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      document.getElementById('tab-' + currentTab).classList.add('active');
      renderCurrentTab();
    });
  });
}

function setupButtons() {
  const a = document.getElementById('addCycleBtn');
  const b = document.getElementById('addLineBtn');
  const c = document.getElementById('addStopBtn');
  const d = document.getElementById('exportBtn');
  if (a) a.addEventListener('click', () => openCycleModal());
  if (b) b.addEventListener('click', () => openLineModal());
  if (c) c.addEventListener('click', () => openStopModal());
  if (d) d.addEventListener('click', exportData);
}

function renderCurrentTab() {
  if (currentTab === 'cycles') renderCycles();
  if (currentTab === 'lines') renderLines();
  if (currentTab === 'stops') renderStops();
}

// ==================== TEMPLATES MANAGER ====================
function manageTemplates() {
  const templates = getAllTemplates();
  showModal(`
    <span class="close" onclick="closeModal()">×</span>
    <h2>📝 Template-Verwaltung</h2>
    <div style="margin-bottom:16px;">
      <button onclick="createTemplate()" class="btn btn-primary">+ Neues Template</button>
    </div>
    <div class="template-list">
      ${templates.map(t => `
        <div class="template-item">
          <div><strong>${t.desc}</strong><br><small>${t.text}</small></div>
          <div>
            ${t.id.startsWith('custom_') ? `
              <button onclick="editTemplate('${t.id}')" class="btn btn-sm btn-secondary">Edit</button>
              <button onclick="deleteTemplate('${t.id}')" class="btn btn-sm btn-secondary">Delete</button>
            ` : '<span style="color:var(--color-text-secondary);font-size:12px;">Standard</span>'}
          </div>
        </div>
      `).join('')}
    </div>
    <div style="margin-top:20px;text-align:center;">
      <button onclick="showStartDialog()" class="btn btn-secondary">Zurück</button>
    </div>
  `);
}

function createTemplate() {
  showModal(`
    <span class="close" onclick="closeModal()">×</span>
    <h2>Neues Template</h2>
    <label>Beschreibung ${tip('Kurzer Name für Template')}</label>
    <input id="tplDesc" placeholder="z.B. Baustelle"/>
    <label>Text ${tip('Ansagetext mit Platzhaltern: {stop}, {via}, {line}, etc.')}</label>
    <textarea id="tplText" placeholder="Wegen Bauarbeiten Umleitung über {via}"></textarea>
    <label>Typ ${tip('Kategorie des Templates')}</label>
    <input id="tplType" placeholder="z.B. construction"/>
    <div class="modal-buttons">
      <button onclick="manageTemplates()" class="btn btn-secondary">Abbrechen</button>
      <button onclick="saveTemplate()" class="btn btn-primary">Speichern</button>
    </div>
  `);
}

function saveTemplate(id = null) {
  const desc = document.getElementById('tplDesc').value.trim();
  const text = document.getElementById('tplText').value.trim();
  const type = document.getElementById('tplType').value.trim() || 'custom';
  
  if (!desc || !text) {
    alert('Beschreibung und Text erforderlich!');
    return;
  }
  
  if (id) {
    const idx = customTemplates.findIndex(t => t.id === id);
    if (idx !== -1) customTemplates[idx] = { id, type, text, desc };
  } else {
    customTemplates.push({ id: 'custom_' + Date.now(), type, text, desc });
  }
  
  saveCustomTemplates();
  alert('✅ Template gespeichert!');
  manageTemplates();
}

function editTemplate(id) {
  const tpl = customTemplates.find(t => t.id === id);
  if (!tpl) return;
  
  showModal(`
    <span class="close" onclick="closeModal()">×</span>
    <h2>Template bearbeiten</h2>
    <label>Beschreibung</label>
    <input id="tplDesc" value="${tpl.desc}"/>
    <label>Text</label>
    <textarea id="tplText">${tpl.text}</textarea>
    <label>Typ</label>
    <input id="tplType" value="${tpl.type}"/>
    <div class="modal-buttons">
      <button onclick="manageTemplates()" class="btn btn-secondary">Abbrechen</button>
      <button onclick="saveTemplate('${id}')" class="btn btn-primary">Speichern</button>
    </div>
  `);
}

function deleteTemplate(id) {
  if (confirm('Template löschen?')) {
    customTemplates = customTemplates.filter(t => t.id !== id);
    saveCustomTemplates();
    manageTemplates();
  }
}

// ==================== CYCLES - ERWEITERT ====================
function renderCycles() {
  const container = document.getElementById('cyclesList');
  if (!container) return;
  
  if (cycles.length === 0) {
    container.innerHTML = '<div class="empty-state">Keine Umläufe. Klicke auf + um einen zu erstellen.</div>';
    return;
  }
  
  container.innerHTML = cycles.map(c => {
    const line = lines.find(l => l.id === c.lineId);
    const announcements = c.specialAnnouncements || [];
    
    return `
      <div class="item-card cycle-card">
        <div class="item-info">
          <h3>${c.cycleId} - ${c.name}</h3>
          <p><strong>Linie:</strong> ${line ? line.name : c.lineId} | <strong>Typ:</strong> ${c.type}</p>
          <p><strong>Richtung:</strong> ${c.direction}</p>
          ${announcements.length > 0 ? `<p><strong>Sonderansagen:</strong> ${announcements.length}</p>` : ''}
        </div>
        <div class="item-actions-vertical">
          <button onclick="editCycle('${c.cycleId}')" class="btn btn-sm btn-secondary">✏️ Edit</button>
          <button onclick="deleteCycle('${c.cycleId}')" class="btn btn-sm btn-secondary">🗑️ Delete</button>
          <button onclick="controlCycle('${c.cycleId}')" class="btn btn-sm btn-primary">▶️ Steuern</button>
        </div>
      </div>
    `;
  }).join('');
}

function controlCycle(id) {
  const cycle = cycles.find(c => c.cycleId === id);
  if (!cycle) return;
  
  const line = lines.find(l => l.id === cycle.lineId);
  const announcements = cycle.specialAnnouncements || [];
  const route = cycle.route || [];
  
  showModal(`
    <span class="close" onclick="closeModal()">×</span>
    <h2>🚊 Umlauf steuern: ${cycle.cycleId}</h2>
    <div class="control-info">
      <p><strong>Linie:</strong> ${line ? line.name : cycle.lineId}</p>
      <p><strong>Ziel:</strong> ${cycle.direction}</p>
    </div>
    
    <div class="form-section">
      <div class="form-section-title">📍 Station vorschalten</div>
      <select id="skipToStop" class="form-control">
        <option value="">-- Station wählen --</option>
        ${stops.map(s => `<option value="${s.id}">${s.name} (${s.shortCode})</option>`).join('')}
      </select>
      <button onclick="skipToStation('${id}')" class="btn btn-primary" style="margin-top:8px;width:100%;">Zu Station springen</button>
    </div>
    
    <div class="form-section">
      <div class="form-section-title">⚠️ Sonderansage abspielen</div>
      <div class="announcement-quick-list">
        ${announcements.length === 0 ? '<p style="color:var(--color-text-secondary);font-style:italic;">Keine Sonderansagen definiert</p>' : announcements.map((a, i) => `
          <button onclick="playAnnouncement('${id}', ${i})" class="announcement-quick-btn">
            <span class="announcement-type">${a.type}</span>
            <span>${a.text}</span>
          </button>
        `).join('')}
      </div>
    </div>
    
    <div class="form-section">
      <div class="form-section-title">📢 Standard-Ansagen</div>
      <button onclick="playStandardAnnouncement('${id}', 'next_stop')" class="btn btn-secondary" style="width:100%;margin-bottom:8px;">Nächste Station ansagen</button>
      <button onclick="playStandardAnnouncement('${id}', 'destination')" class="btn btn-secondary" style="width:100%;">Ziel ansagen</button>
    </div>
  `);
}

function skipToStation(cycleId) {
  const stopId = document.getElementById('skipToStop').value;
  if (!stopId) {
    alert('Bitte Station wählen!');
    return;
  }
  
  const stop = stops.find(s => s.id === stopId);
  alert(`✅ Springe zu: ${stop ? stop.name : stopId}\n\n(Simulation - in echter App würde dies die aktuelle Station ändern)`);
  closeModal();
}

function playAnnouncement(cycleId, index) {
  const cycle = cycles.find(c => c.cycleId === cycleId);
  const announcement = cycle?.specialAnnouncements?.[index];
  if (!announcement) return;
  
  alert(`🔊 Spiele Ansage ab:\n\n"${announcement.text}"\n\n(Simulation - in echter App würde Audio abgespielt)`);
}

function playStandardAnnouncement(cycleId, type) {
  const cycle = cycles.find(c => c.cycleId === cycleId);
  if (!cycle) return;
  
  let text = '';
  if (type === 'next_stop') text = `Nächster Halt: ${cycle.direction}`;
  if (type === 'destination') text = `Fahrt Richtung ${cycle.direction}`;
  
  alert(`🔊 Spiele Ansage ab:\n\n"${text}"\n\n(Simulation)`);
}

function openCycleModal(id = null) {
  const c = id ? cycles.find(x => x.cycleId === id) : null;
  const ao = audioLibrary.filter(a => a.tags && a.tags.includes('destination')).map(a => 
    `<option value="${a.id}" ${c && c.destinationAudioId === a.id ? 'selected' : ''}>${a.id}</option>`
  ).join('');
  const lo = lines.map(l => 
    `<option value="${l.id}" ${c && c.lineId === l.id ? 'selected' : ''}>${l.name}</option>`
  ).join('');
  
  currentAnnouncements = c && c.specialAnnouncements ? [...c.specialAnnouncements] : [];
  
  showModal(`
    <span class="close" onclick="closeModal()">×</span>
    <h2>${c ? '✏️ Umlauf bearbeiten' : '➕ Neuer Umlauf'}</h2>
    
    <label>Umlauf-ID ${tip('Format: Linie_Nummer, z.B. 3_10')}</label>
    <input id="cycleId" value="${c ? c.cycleId : ''}" ${c ? 'readonly' : ''} placeholder="3_10" class="form-control"/>
    
    <label>Linie ${tip('Wähle die zugehörige Linie aus')}</label>
    <select id="lineId" class="form-control">${lo || '<option>Keine Linien vorhanden</option>'}</select>
    
    <label>Typ ${tip('Regelbetrieb oder Umleitung')}</label>
    <select id="type" class="form-control">
      <option value="regular" ${c && c.type === 'regular' ? 'selected' : ''}>Regelbetrieb</option>
      <option value="diversion" ${c && c.type === 'diversion' ? 'selected' : ''}>Umleitung</option>
    </select>
    
    <label>Name ${tip('Anzeigename, z.B. "Linie 3 nach Gliesmarode"')}</label>
    <input id="name" value="${c ? c.name : ''}" placeholder="Linie 3 nach Gliesmarode" class="form-control"/>
    
    <label>Richtung ${tip('Ziel/Endhaltestelle')}</label>
    <input id="direction" value="${c ? c.direction : ''}" placeholder="Gliesmarode" class="form-control"/>
    
    <label>Destination Audio ${tip('Ansage für Ziel')}</label>
    <select id="destinationAudioId" class="form-control">
      <option value="">-- Kein Audio --</option>
      ${ao}
    </select>
    
    <label>Via-Stops ${tip('Komma-getrennt: ERS-A, HBF')}</label>
    <input id="viaStops" value="${c && c.viaStops ? c.viaStops.join(', ') : ''}" placeholder="ERS-A, HBF" class="form-control"/>
    
    <label>Priority ${tip('1-10, höher = wichtiger')}</label>
    <input type="number" id="priority" value="${c ? c.priority : 1}" min="1" max="10" class="form-control"/>
    
    <div class="form-section">
      <div class="form-section-title">⚠️ Sonderansagen ${tip('Spezielle Durchsagen für diesen Umlauf')}</div>
      <div id="announcementsEditor"></div>
    </div>
    
    <div class="modal-buttons">
      <button onclick="closeModal()" class="btn btn-secondary">Abbrechen</button>
      <button onclick="saveCycle(${!!c})" class="btn btn-primary">💾 Speichern</button>
    </div>
  `);
  
  renderAnnouncementsEditor();
}

function renderAnnouncementsEditor() {
  const editor = document.getElementById('announcementsEditor');
  if (!editor) return;
  
  const templates = getAllTemplates();
  
  editor.innerHTML = `
    <div class="announcements-editor">
      <div class="announcement-templates">
        ${templates.map(t => `
          <button type="button" class="template-btn" onclick="addAnnouncement('${t.type}', '${t.text.replace(/'/g, "\\'")}')">
            <span class="template-btn-title">${t.desc}</span>
            <span class="template-btn-desc">${t.text}</span>
          </button>
        `).join('')}
      </div>
      <div class="announcement-list" id="announcementList"></div>
    </div>
  `;
  
  renderAnnouncementsList();
}

function renderAnnouncementsList() {
  const list = document.getElementById('announcementList');
  if (!list) return;
  
  list.innerHTML = currentAnnouncements.length === 0 
    ? '<div class="empty-announcements">Keine Sonderansagen - Klicke Template-Button zum Hinzufügen</div>'
    : currentAnnouncements.map((a, i) => `
        <div class="announcement-item">
          <div class="announcement-header">
            <span class="announcement-type">${a.type}</span>
            <button class="announcement-remove" onclick="removeAnnouncement(${i})">×</button>
          </div>
          <div class="announcement-content">${a.text}</div>
        </div>
      `).join('');
}

function addAnnouncement(type, text) {
  currentAnnouncements.push({ type, text, condition: 'always' });
  renderAnnouncementsList();
}

function removeAnnouncement(idx) {
  currentAnnouncements.splice(idx, 1);
  renderAnnouncementsList();
}

function saveCycle(isEdit) {
  const id = document.getElementById('cycleId').value.trim();
  if (!id) {
    alert('❌ ID fehlt!');
    return;
  }
  
  const data = {
    cycleId: id,
    paddedId: id.split('_')[1] ? id.split('_')[1].padStart(2, '0') : '01',
    lineId: document.getElementById('lineId').value,
    type: document.getElementById('type').value,
    name: document.getElementById('name').value.trim(),
    direction: document.getElementById('direction').value.trim(),
    destinationAudioId: document.getElementById('destinationAudioId').value,
    viaStops: document.getElementById('viaStops').value.trim().split(',').map(s => s.trim()).filter(Boolean),
    route: [],
    specialAnnouncements: currentAnnouncements,
    priority: parseInt(document.getElementById('priority').value) || 1
  };
  
  if (isEdit) {
    const idx = cycles.findIndex(c => c.cycleId === id);
    if (idx !== -1) cycles[idx] = data;
  } else {
    cycles.push(data);
  }
  
  closeModal();
  currentAnnouncements = [];
  renderCycles();
  alert('✅ Umlauf gespeichert!');
}

function deleteCycle(id) {
  if (confirm('Umlauf löschen?')) {
    cycles = cycles.filter(c => c.cycleId !== id);
    renderCycles();
  }
}

function editCycle(id) {
  openCycleModal(id);
}

// ==================== LINES ====================
function renderLines() {
  const container = document.getElementById('linesList');
  if (!container) return;
  
  if (lines.length === 0) {
    container.innerHTML = '<div class="empty-state">Keine Linien. Klicke auf + um eine zu erstellen.</div>';
    return;
  }
  
  container.innerHTML = lines.map(l => `
    <div class="item-card">
      <div class="item-info">
        <h3 style="color:${l.color}">${l.name}</h3>
        <p><strong>ID:</strong> ${l.id} | <strong>Display:</strong> ${l.displayName}</p>
      </div>
      <div class="item-actions">
        <button onclick="editLine('${l.id}')" class="btn btn-sm btn-secondary">✏️ Edit</button>
        <button onclick="deleteLine('${l.id}')" class="btn btn-sm btn-secondary">🗑️ Delete</button>
      </div>
    </div>
  `).join('');
}

function openLineModal(id = null) {
  const l = id ? lines.find(x => x.id === id) : null;
  const ao = audioLibrary.filter(a => a.tags && a.tags.includes('line')).map(a => 
    `<option value="${a.id}" ${l && l.audioId === a.id ? 'selected' : ''}>${a.id}</option>`
  ).join('');
  
  showModal(`
    <span class="close" onclick="closeModal()">×</span>
    <h2>${l ? '✏️ Linie bearbeiten' : '➕ Neue Linie'}</h2>
    
    <label>ID ${tip('Eindeutige Kennung, z.B. 3')}</label>
    <input id="lineId" value="${l ? l.id : ''}" ${l ? 'readonly' : ''} placeholder="3" class="form-control"/>
    
    <label>Padded ID ${tip('3-stellig mit führenden Nullen, z.B. 003')}</label>
    <input id="linePaddedId" value="${l ? l.paddedId : ''}" maxlength="3" placeholder="003" class="form-control"/>
    
    <label>Name ${tip('Voller Name der Linie')}</label>
    <input id="lineName" value="${l ? l.name : ''}" placeholder="Linie 3" class="form-control"/>
    
    <label>Display Name ${tip('Anzeigename auf Display')}</label>
    <input id="displayName" value="${l ? l.displayName : ''}" placeholder="3" class="form-control"/>
    
    <label>Farbe ${tip('Linienfarbe für Display')}</label>
    <input type="color" id="lineColor" value="${l ? l.color : '#0066B3'}" class="form-control"/>
    
    <label>Textfarbe ${tip('Farbe des Texts auf Linie')}</label>
    <input type="color" id="textColor" value="${l ? l.textColor : '#FFFFFF'}" class="form-control"/>
    
    <label>Typ ${tip('Fahrzeugtyp')}</label>
    <select id="lineType" class="form-control">
      <option value="tram" ${l && l.type === 'tram' ? 'selected' : ''}>Straßenbahn</option>
      <option value="bus" ${l && l.type === 'bus' ? 'selected' : ''}>Bus</option>
    </select>
    
    <label>Betreiber ${tip('Name des Verkehrsunternehmens')}</label>
    <input id="operator" value="${l ? l.operator : 'BSVG'}" class="form-control"/>
    
    <label>Audio ID ${tip('Lautsprecher-Ansage für Linie')}</label>
    <select id="lineAudioId" class="form-control">
      <option value="">-- Kein Audio --</option>
      ${ao}
    </select>
    
    <div class="modal-buttons">
      <button onclick="closeModal()" class="btn btn-secondary">Abbrechen</button>
      <button onclick="saveLine(${!!l})" class="btn btn-primary">💾 Speichern</button>
    </div>
  `);
}

function saveLine(isEdit) {
  const id = document.getElementById('lineId').value.trim();
  if (!id) {
    alert('❌ ID fehlt!');
    return;
  }
  
  const data = {
    id,
    paddedId: document.getElementById('linePaddedId').value.trim() || id.padStart(3, '0'),
    name: document.getElementById('lineName').value.trim(),
    displayName: document.getElementById('displayName').value.trim(),
    color: document.getElementById('lineColor').value,
    textColor: document.getElementById('textColor').value,
    type: document.getElementById('lineType').value,
    operator: document.getElementById('operator').value.trim(),
    audioId: document.getElementById('lineAudioId').value
  };
  
  if (isEdit) {
    const idx = lines.findIndex(l => l.id === id);
    if (idx !== -1) lines[idx] = data;
  } else {
    lines.push(data);
  }
  
  closeModal();
  renderLines();
  alert('✅ Linie gespeichert!');
}

function deleteLine(id) {
  if (confirm('Linie löschen?')) {
    lines = lines.filter(l => l.id !== id);
    renderLines();
  }
}

function editLine(id) {
  openLineModal(id);
}

// ==================== STOPS ====================
function renderStops() {
  const container = document.getElementById('stopsList');
  if (!container) return;
  
  if (stops.length === 0) {
    container.innerHTML = '<div class="empty-state">Keine Haltestellen. Klicke auf + um eine zu erstellen.</div>';
    return;
  }
  
  container.innerHTML = stops.map(s => `
    <div class="item-card">
      <div class="item-info">
        <h3>${s.name} (${s.shortCode})</h3>
        <p><strong>ID:</strong> ${s.id} | <strong>Typ:</strong> ${s.type}</p>
      </div>
      <div class="item-actions">
        <button onclick="editStop('${s.id}')" class="btn btn-sm btn-secondary">✏️ Edit</button>
        <button onclick="deleteStop('${s.id}')" class="btn btn-sm btn-secondary">🗑️ Delete</button>
      </div>
    </div>
  `).join('');
}

function openStopModal(id = null) {
  const s = id ? stops.find(x => x.id === id) : null;
  const ao = audioLibrary.filter(a => a.tags && (a.tags.includes('stop') || a.tags.includes('via'))).map(a => 
    `<option value="${a.id}" ${s && s.audioId === a.id ? 'selected' : ''}>${a.id}</option>`
  ).join('');
  
  showModal(`
    <span class="close" onclick="closeModal()">×</span>
    <h2>${s ? '✏️ Haltestelle bearbeiten' : '➕ Neue Haltestelle'}</h2>
    
    <label>ID ${tip('Eindeutige Kennung, z.B. bsvg_001')}</label>
    <input id="stopId" value="${s ? s.id : ''}" ${s ? 'readonly' : ''} placeholder="bsvg_001" class="form-control"/>
    
    <label>Name ${tip('Vollständiger Name der Haltestelle')}</label>
    <input id="stopName" value="${s ? s.name : ''}" placeholder="Hauptbahnhof" class="form-control"/>
    
    <label>Kurzcode ${tip('Abkürzung für Display, z.B. HBF')}</label>
    <input id="shortCode" value="${s ? s.shortCode : ''}" placeholder="HBF" maxlength="10" class="form-control"/>
    
    <label>Typ ${tip('Reguläre oder Ersatzhaltestelle')}</label>
    <select id="stopType" class="form-control">
      <option value="regular" ${s && s.type === 'regular' ? 'selected' : ''}>Regulär</option>
      <option value="ersatz" ${s && s.type === 'ersatz' ? 'selected' : ''}>Ersatz</option>
    </select>
    
    <label style="display:flex;align-items:center;gap:8px;">
      <input type="checkbox" id="isTemporary" ${s && s.isTemporary ? 'checked' : ''} style="width:auto;"/>
      Temporär ${tip('Nur zeitweise aktiv')}
    </label>
    
    <label>Audio ID ${tip('Lautsprecher-Ansage für Haltestelle')}</label>
    <select id="stopAudioId" class="form-control">
      <option value="">-- Kein Audio --</option>
      ${ao}
    </select>
    
    <div class="modal-buttons">
      <button onclick="closeModal()" class="btn btn-secondary">Abbrechen</button>
      <button onclick="saveStop(${!!s})" class="btn btn-primary">💾 Speichern</button>
    </div>
  `);
}

function saveStop(isEdit) {
  const id = document.getElementById('stopId').value.trim();
  if (!id) {
    alert('❌ ID fehlt!');
    return;
  }
  
  const data = {
    id,
    name: document.getElementById('stopName').value.trim(),
    shortCode: document.getElementById('shortCode').value.trim(),
    type: document.getElementById('stopType').value,
    isTemporary: document.getElementById('isTemporary').checked,
    audioId: document.getElementById('stopAudioId').value,
    lines: []
  };
  
  if (isEdit) {
    const idx = stops.findIndex(s => s.id === id);
    if (idx !== -1) stops[idx] = data;
  } else {
    stops.push(data);
  }
  
  closeModal();
  renderStops();
  alert('✅ Haltestelle gespeichert!');
}

function deleteStop(id) {
  if (confirm('Haltestelle löschen?')) {
    stops = stops.filter(s => s.id !== id);
    renderStops();
  }
}

function editStop(id) {
  openStopModal(id);
}

// ==================== UTILS ====================
function tip(text) {
  return `<span class="tooltip" data-tip="${text}">?</span>`;
}

function showModal(html) {
  let modal = document.getElementById('modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'modal';
    modal.innerHTML = '<div class="modal-content"></div>';
    document.body.appendChild(modal);
  }
  modal.querySelector('.modal-content').innerHTML = html;
  modal.classList.remove('hidden');
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.classList.add('hidden');
}

function exportData() {
  if (cycles.length === 0 && lines.length === 0 && stops.length === 0) {
    alert('❌ Keine Daten zum Exportieren!');
    return;
  }
  
  downloadJson(JSON.stringify({ cycles }, null, 2), 'cycles.json');
  downloadJson(JSON.stringify({ lines }, null, 2), 'lines.json');
  downloadJson(JSON.stringify({ stops }, null, 2), 'stops.json');
  alert('✅ 3 Dateien exportiert!');
}

function downloadJson(content, filename) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Globale Funktionen verfügbar machen
window.openCycleModal = openCycleModal;
window.saveCycle = saveCycle;
window.editCycle = editCycle;
window.deleteCycle = deleteCycle;
window.controlCycle = controlCycle;
window.skipToStation = skipToStation;
window.playAnnouncement = playAnnouncement;
window.playStandardAnnouncement = playStandardAnnouncement;
window.addAnnouncement = addAnnouncement;
window.removeAnnouncement = removeAnnouncement;

window.openLineModal = openLineModal;
window.saveLine = saveLine;
window.editLine = editLine;
window.deleteLine = deleteLine;

window.openStopModal = openStopModal;
window.saveStop = saveStop;
window.editStop = editStop;
window.deleteStop = deleteStop;

window.manageTemplates = manageTemplates;
window.createTemplate = createTemplate;
window.saveTemplate = saveTemplate;
window.editTemplate = editTemplate;
window.deleteTemplate = deleteTemplate;

window.loadExisting = loadExisting;
window.startEmpty = startEmpty;

console.log('✅ Full Configurator loaded');
