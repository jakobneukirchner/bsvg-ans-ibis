/**
 * VOLLSTÄNDIGER KONFIGURATOR
 * Start-Dialog + CRUD für Cycles, Lines, Stops
 */

let cycles = [];
let lines = [];
let stops = [];
let audioLibrary = [];
let currentTab = 'cycles';

// ===========================================
// INIT
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
  showStartDialog();
});

function showStartDialog() {
  const html = `
    <div style="text-align:center;padding:40px;">
      <h2>Konfigurator starten</h2>
      <p>Wähle eine Option:</p>
      <button onclick="loadExisting()" style="margin:10px;padding:15px 30px;">Aktuelle Konfiguration laden</button>
      <button onclick="startEmpty()" style="margin:10px;padding:15px 30px;">Leere Konfiguration</button>
    </div>
  `;
  showModal(html);
}

async function loadExisting() {
  closeModal();
  try {
    const base = CONFIG.FILESERVER_URL;
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
    alert('Geladen: ' + cycles.length + ' Umläufe, ' + lines.length + ' Linien, ' + stops.length + ' Haltestellen');
  } catch (e) {
    alert('Fehler: ' + e.message);
    lines = [];
    stops = [];
    cycles = [];
    audioLibrary = [];
  }
  init();
}

function startEmpty() {
  closeModal();
  cycles = [];
  lines = [];
  stops = [];
  audioLibrary = [];
  alert('Leere Konfiguration gestartet');
  init();
}

function init() {
  setupTabs();
  renderCurrentTab();
}

function setupTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentTab = tab.dataset.tab;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + currentTab).classList.add('active');
      renderCurrentTab();
    });
  });

  document.getElementById('addCycleBtn')?.addEventListener('click', () => openCycleModal());
  document.getElementById('addLineBtn')?.addEventListener('click', () => openLineModal());
  document.getElementById('addStopBtn')?.addEventListener('click', () => openStopModal());
  document.getElementById('exportBtn')?.addEventListener('click', exportData);
}

function renderCurrentTab() {
  if (currentTab === 'cycles') renderCycles();
  if (currentTab === 'lines') renderLines();
  if (currentTab === 'stops') renderStops();
}

// ===========================================
// CYCLES - Vollständig
// ===========================================

function renderCycles() {
  const container = document.getElementById('cyclesList');
  if (!container) return;
  container.innerHTML = cycles.map(c => `
    <div class="item-card">
      <h3>${c.cycleId} - ${c.name}</h3>
      <p><b>Linie:</b> ${c.lineId} | <b>Typ:</b> ${c.type} | <b>Richtung:</b> ${c.direction}</p>
      <p><b>Audio-ID:</b> ${c.destinationAudioId}</p>
      ${c.viaStops?.length > 0 ? `<p><b>Via:</b> ${c.viaStops.join(', ')}</p>` : ''}
      <button onclick="editCycle('${c.cycleId}')">Edit</button>
      <button onclick="deleteCycle('${c.cycleId}')">Delete</button>
    </div>
  `).join('');
}

function openCycleModal(id = null) {
  const c = id ? cycles.find(x => x.cycleId === id) : null;
  const audioOptions = audioLibrary.filter(a => a.tags?.includes('destination')).map(a => 
    `<option value="${a.id}" ${c?.destinationAudioId === a.id ? 'selected' : ''}>${a.id} - ${a.description}</option>`
  ).join('');
  
  const html = `
    <h2>${c ? 'Umlauf bearbeiten' : 'Neuer Umlauf'}</h2>
    <label>Cycle ID:</label><input id="cycleId" value="${c?.cycleId || ''}" ${c ? 'readonly' : ''}/>
    <label>Padded ID:</label><input id="paddedId" value="${c?.paddedId || ''}"/>
    <label>Line ID:</label>
    <select id="lineId">${lines.map(l => `<option value="${l.id}" ${c?.lineId === l.id ? 'selected' : ''}>${l.name}</option>`).join('')}</select>
    <label>Type:</label>
    <select id="type"><option value="regular" ${c?.type === 'regular' ? 'selected' : ''}>Regular</option><option value="diversion" ${c?.type === 'diversion' ? 'selected' : ''}>Diversion</option></select>
    <label>Name:</label><input id="name" value="${c?.name || ''}"/>
    <label>Direction:</label><input id="direction" value="${c?.direction || ''}"/>
    <label>Destination Audio ID:</label><select id="destinationAudioId"><option value="">--</option>${audioOptions}</select>
    <label>Via Stops (comma):</label><input id="viaStops" value="${c?.viaStops?.join(', ') || ''}"/>
    <label>Route (JSON):</label><textarea id="route" rows="3">${JSON.stringify(c?.route || [], null, 2)}</textarea>
    <label>Priority (1-10):</label><input type="number" id="priority" value="${c?.priority || 1}" min="1" max="10"/>
    <label>Valid From:</label><input type="date" id="validFrom" value="${c?.validFrom || ''}"/>
    <label>Valid Until:</label><input type="date" id="validUntil" value="${c?.validUntil || ''}"/>
    <label>Notes:</label><textarea id="notes" rows="2">${c?.notes || ''}</textarea>
    <button onclick="saveCycle(${!!c})">Save</button>
    <button onclick="closeModal()">Cancel</button>
  `;
  showModal(html);
}

function saveCycle(isEdit) {
  const id = document.getElementById('cycleId').value.trim();
  const data = {
    cycleId: id,
    paddedId: document.getElementById('paddedId').value.trim() || id.split('_')[1]?.padStart(2, '0') || '01',
    lineId: document.getElementById('lineId').value,
    type: document.getElementById('type').value,
    name: document.getElementById('name').value.trim(),
    direction: document.getElementById('direction').value.trim(),
    destinationAudioId: document.getElementById('destinationAudioId').value,
    viaStops: document.getElementById('viaStops').value.trim().split(',').map(s => s.trim()).filter(Boolean),
    route: JSON.parse(document.getElementById('route').value.trim() || '[]'),
    specialAnnouncements: [],
    priority: parseInt(document.getElementById('priority').value)
  };
  
  const vf = document.getElementById('validFrom').value;
  const vu = document.getElementById('validUntil').value;
  const n = document.getElementById('notes').value.trim();
  if (vf) data.validFrom = vf;
  if (vu) data.validUntil = vu;
  if (n) data.notes = n;

  if (isEdit) {
    const idx = cycles.findIndex(c => c.cycleId === id);
    cycles[idx] = data;
  } else {
    cycles.push(data);
  }
  
  closeModal();
  renderCycles();
  alert('Gespeichert!');
}

function deleteCycle(id) {
  if (confirm('Delete ' + id + '?')) {
    cycles = cycles.filter(c => c.cycleId !== id);
    renderCycles();
  }
}

function editCycle(id) {
  openCycleModal(id);
}

// ===========================================
// LINES - Vollständig
// ===========================================

function renderLines() {
  const container = document.getElementById('linesList');
  if (!container) return;
  container.innerHTML = lines.map(l => `
    <div class="item-card">
      <h3 style="color:${l.color}">${l.name} (${l.displayName})</h3>
      <p><b>ID:</b> ${l.id} | <b>Padded:</b> ${l.paddedId} | <b>Audio:</b> ${l.audioId}</p>
      <button onclick="editLine('${l.id}')">Edit</button>
      <button onclick="deleteLine('${l.id}')">Delete</button>
    </div>
  `).join('');
}

function openLineModal(id = null) {
  const l = id ? lines.find(x => x.id === id) : null;
  const audioOptions = audioLibrary.filter(a => a.tags?.includes('line')).map(a => 
    `<option value="${a.id}" ${l?.audioId === a.id ? 'selected' : ''}>${a.id} - ${a.description}</option>`
  ).join('');
  
  const html = `
    <h2>${l ? 'Linie bearbeiten' : 'Neue Linie'}</h2>
    <label>ID:</label><input id="lineId" value="${l?.id || ''}" ${l ? 'readonly' : ''}/>
    <label>Padded ID (3-stellig):</label><input id="linePaddedId" value="${l?.paddedId || ''}" maxlength="3"/>
    <label>Name:</label><input id="lineName" value="${l?.name || ''}"/>
    <label>Display Name:</label><input id="displayName" value="${l?.displayName || ''}"/>
    <label>Farbe:</label><input type="color" id="lineColor" value="${l?.color || '#0066B3'}"/>
    <label>Text Farbe:</label><input type="color" id="textColor" value="${l?.textColor || '#FFFFFF'}"/>
    <label>Type:</label><select id="lineType"><option value="tram" ${l?.type === 'tram' ? 'selected' : ''}>Tram</option><option value="bus" ${l?.type === 'bus' ? 'selected' : ''}>Bus</option></select>
    <label>Operator:</label><input id="operator" value="${l?.operator || 'BSVG'}"/>
    <label>Audio ID:</label><select id="lineAudioId"><option value="">--</option>${audioOptions}</select>
    <button onclick="saveLine(${!!l})">Save</button>
    <button onclick="closeModal()">Cancel</button>
  `;
  showModal(html);
}

function saveLine(isEdit) {
  const id = document.getElementById('lineId').value.trim();
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
    lines[idx] = data;
  } else {
    lines.push(data);
  }
  
  closeModal();
  renderLines();
  alert('Gespeichert!');
}

function deleteLine(id) {
  if (confirm('Delete ' + id + '?')) {
    lines = lines.filter(l => l.id !== id);
    renderLines();
  }
}

function editLine(id) {
  openLineModal(id);
}

// ===========================================
// STOPS - Vollständig
// ===========================================

function renderStops() {
  const container = document.getElementById('stopsList');
  if (!container) return;
  container.innerHTML = stops.map(s => `
    <div class="item-card">
      <h3>${s.name} (${s.shortCode})</h3>
      <p><b>ID:</b> ${s.id} | <b>Audio:</b> ${s.audioId}</p>
      <p><b>Temporär:</b> ${s.isTemporary ? 'Ja' : 'Nein'}</p>
      <button onclick="editStop('${s.id}')">Edit</button>
      <button onclick="deleteStop('${s.id}')">Delete</button>
    </div>
  `).join('');
}

function openStopModal(id = null) {
  const s = id ? stops.find(x => x.id === id) : null;
  const audioOptions = audioLibrary.filter(a => a.tags?.includes('stop') || a.tags?.includes('via')).map(a => 
    `<option value="${a.id}" ${s?.audioId === a.id ? 'selected' : ''}>${a.id} - ${a.description}</option>`
  ).join('');
  
  const html = `
    <h2>${s ? 'Haltestelle bearbeiten' : 'Neue Haltestelle'}</h2>
    <label>ID:</label><input id="stopId" value="${s?.id || ''}" ${s ? 'readonly' : ''}/>
    <label>Name:</label><input id="stopName" value="${s?.name || ''}"/>
    <label>Short Code:</label><input id="shortCode" value="${s?.shortCode || ''}"/>
    <label>Type:</label><select id="stopType"><option value="regular" ${s?.type === 'regular' ? 'selected' : ''}>Regular</option><option value="ersatz" ${s?.type === 'ersatz' ? 'selected' : ''}>Ersatz</option></select>
    <label>Temporär:</label><input type="checkbox" id="isTemporary" ${s?.isTemporary ? 'checked' : ''}/>
    <label>Audio ID:</label><select id="stopAudioId"><option value="">--</option>${audioOptions}</select>
    <label>Valid From:</label><input type="date" id="stopValidFrom" value="${s?.validFrom || ''}"/>
    <label>Valid Until:</label><input type="date" id="stopValidUntil" value="${s?.validUntil || ''}"/>
    <label>Reason:</label><input id="reason" value="${s?.reason || ''}"/>
    <button onclick="saveStop(${!!s})">Save</button>
    <button onclick="closeModal()">Cancel</button>
  `;
  showModal(html);
}

function saveStop(isEdit) {
  const id = document.getElementById('stopId').value.trim();
  const data = {
    id,
    name: document.getElementById('stopName').value.trim(),
    shortCode: document.getElementById('shortCode').value.trim(),
    type: document.getElementById('stopType').value,
    isTemporary: document.getElementById('isTemporary').checked,
    audioId: document.getElementById('stopAudioId').value,
    lines: []
  };
  
  const vf = document.getElementById('stopValidFrom').value;
  const vu = document.getElementById('stopValidUntil').value;
  const r = document.getElementById('reason').value.trim();
  if (vf) data.validFrom = vf;
  if (vu) data.validUntil = vu;
  if (r) data.reason = r;

  if (isEdit) {
    const idx = stops.findIndex(s => s.id === id);
    stops[idx] = data;
  } else {
    stops.push(data);
  }
  
  closeModal();
  renderStops();
  alert('Gespeichert!');
}

function deleteStop(id) {
  if (confirm('Delete ' + id + '?')) {
    stops = stops.filter(s => s.id !== id);
    renderStops();
  }
}

function editStop(id) {
  openStopModal(id);
}

// ===========================================
// MODAL
// ===========================================

function showModal(html) {
  let modal = document.getElementById('modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'modal';
    modal.innerHTML = '<div class="modal-content"></div>';
    document.body.appendChild(modal);
  }
  modal.querySelector('.modal-content').innerHTML = '<span class="close" onclick="closeModal()" style="float:right;cursor:pointer;font-size:30px;">×</span>' + html;
  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal')?.classList.add('hidden');
}

// ===========================================
// EXPORT
// ===========================================

function exportData() {
  downloadJson(JSON.stringify({ cycles }, null, 2), 'cycles.json');
  downloadJson(JSON.stringify({ lines }, null, 2), 'lines.json');
  downloadJson(JSON.stringify({ stops }, null, 2), 'stops.json');
  alert('Exportiert!');
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
