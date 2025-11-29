/**
 * CONFIGURATOR - Umlauf-Verwaltung
 */

let cycles = [];
let lines = [];
let stops = [];

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  setupTabs();
  renderCycles();
});

async function loadData() {
  try {
    const base = CONFIG.FILESERVER_URL;
    const [l, s, c] = await Promise.all([
      fetch(base + '/lines.json').then(r => r.json()),
      fetch(base + '/stops.json').then(r => r.json()),
      fetch(base + '/cycles.json').then(r => r.json())
    ]);
    lines = l.lines || [];
    stops = s.stops || [];
    cycles = c.cycles || [];
  } catch (e) {
    console.error('Load error:', e);
  }
}

function setupTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
      if (tab.dataset.tab === 'cycles') renderCycles();
      if (tab.dataset.tab === 'lines') renderLines();
      if (tab.dataset.tab === 'stops') renderStops();
    });
  });

  document.getElementById('addCycleBtn')?.addEventListener('click', () => openCycleModal());
  document.getElementById('exportBtn')?.addEventListener('click', exportData);
}

function renderCycles() {
  const container = document.getElementById('cyclesList');
  if (!container) return;
  container.innerHTML = cycles.map(c => `
    <div class="item-card">
      <h3>${c.cycleId} - ${c.name}</h3>
      <p>Linie ${c.lineId} nach ${c.direction}</p>
      <button onclick="editCycle('${c.cycleId}')">Edit</button>
      <button onclick="deleteCycle('${c.cycleId}')">Delete</button>
    </div>
  `).join('');
}

function renderLines() {
  const container = document.getElementById('linesList');
  if (!container) return;
  container.innerHTML = lines.map(l => `
    <div class="item-card">
      <h3 style="color:${l.color}">${l.name}</h3>
    </div>
  `).join('');
}

function renderStops() {
  const container = document.getElementById('stopsList');
  if (!container) return;
  container.innerHTML = stops.map(s => `
    <div class="item-card">
      <h3>${s.name}</h3>
      <p>${s.shortCode}</p>
    </div>
  `).join('');
}

function openCycleModal(id = null) {
  const c = id ? cycles.find(x => x.cycleId === id) : null;
  const html = `
    <h2>${c ? 'Edit' : 'New'} Cycle</h2>
    <input type="text" id="cycleId" value="${c?.cycleId || ''}" placeholder="Cycle ID" />
    <select id="lineId">${lines.map(l => `<option value="${l.id}" ${c?.lineId === l.id ? 'selected' : ''}>${l.name}</option>`).join('')}</select>
    <input type="text" id="name" value="${c?.name || ''}" placeholder="Name" />
    <input type="text" id="direction" value="${c?.direction || ''}" placeholder="Direction" />
    <button onclick="saveCycle(${!!c})">Save</button>
    <button onclick="closeModal()">Cancel</button>
  `;
  showModal(html);
}

function saveCycle(isEdit) {
  const id = document.getElementById('cycleId').value;
  const lineId = document.getElementById('lineId').value;
  const name = document.getElementById('name').value;
  const direction = document.getElementById('direction').value;
  
  const data = {
    cycleId: id,
    paddedId: id.split('_')[1] || '01',
    lineId,
    name,
    direction,
    type: 'regular',
    destinationAudioId: 'dest_' + direction.toLowerCase(),
    viaStops: [],
    route: [],
    specialAnnouncements: [],
    priority: 1
  };

  if (isEdit) {
    const idx = cycles.findIndex(c => c.cycleId === id);
    cycles[idx] = data;
  } else {
    cycles.push(data);
  }
  
  closeModal();
  renderCycles();
}

function deleteCycle(id) {
  if (confirm('Delete?')) {
    cycles = cycles.filter(c => c.cycleId !== id);
    renderCycles();
  }
}

function editCycle(id) {
  openCycleModal(id);
}

function showModal(html) {
  const modal = document.getElementById('modal');
  modal.querySelector('.modal-content').innerHTML = '<span class="close" onclick="closeModal()">×</span>' + html;
  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

function exportData() {
  downloadJson(JSON.stringify({ cycles }, null, 2), 'cycles.json');
  downloadJson(JSON.stringify({ lines }, null, 2), 'lines.json');
  downloadJson(JSON.stringify({ stops }, null, 2), 'stops.json');
  alert('Exported!');
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
