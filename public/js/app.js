/**
 * ===========================================
 * APP.JS - STARTSEITE LOGIC
 * Linie/Umlauf-Eingabe und Validierung
 * ===========================================
 */

// DOM Elements
const lineInputForm = document.getElementById('lineInputForm');
const lineInput = document.getElementById('lineInput');
const inputError = document.getElementById('inputError');
const recentSection = document.getElementById('recentSection');
const recentEntries = document.getElementById('recentEntries');
const loadingIndicator = document.getElementById('loadingIndicator');

// State
let linesData = null;
let cyclesData = null;
let stopsData = null;
let audioLibraryData = null;

/**
 * Init App
 */
async function init() {
  // Lade JSON-Daten
  await loadJSONData();
  
  // Zeige Recent Entries
  renderRecentEntries();
  
  // Event Listeners
  lineInputForm.addEventListener('submit', handleFormSubmit);
  lineInput.addEventListener('input', handleInputChange);
}

/**
 * Lädt alle JSON-Daten
 */
async function loadJSONData() {
  try {
    showLoading();
    
    // Parallel laden
    const [lines, cycles, stops, audioLib] = await Promise.all([
      Utils.fetchJSON(`${CONFIG.FILESERVER_URL}${CONFIG.ENDPOINTS.LINES}`),
      Utils.fetchJSON(`${CONFIG.FILESERVER_URL}${CONFIG.ENDPOINTS.CYCLES}`),
      Utils.fetchJSON(`${CONFIG.FILESERVER_URL}${CONFIG.ENDPOINTS.STOPS}`),
      Utils.fetchJSON(`${CONFIG.FILESERVER_URL}${CONFIG.ENDPOINTS.AUDIO_LIBRARY}`)
    ]);
    
    linesData = lines;
    cyclesData = cycles;
    stopsData = stops;
    audioLibraryData = audioLib;
    
    // Speichere Audio Library in Session
    Storage.setSession('audioLib', audioLib);
    
    hideLoading();
  } catch (error) {
    hideLoading();
    Utils.showToast('Fehler beim Laden der Daten', 'error');
    console.error('Failed to load JSON data:', error);
  }
}

/**
 * Form Submit Handler
 */
async function handleFormSubmit(event) {
  event.preventDefault();
  
  const inputValue = lineInput.value.trim();
  
  // Parse Input
  const parsed = Utils.parseInput(inputValue);
  
  if (!parsed || !parsed.valid) {
    showInputError('Ungültiges Format. Bitte LLL/UU eingeben (z.B. 003/10)');
    return;
  }
  
  clearInputError();
  
  // Suche Cycle
  const cycleId = Utils.createCycleId(parsed.lineId, parsed.cycleIdPadded);
  const cycle = findCycle(cycleId);
  
  if (!cycle) {
    showInputError(`Linie ${parsed.lineId} / Umlauf ${parsed.cycleIdPadded} nicht gefunden`);
    return;
  }
  
  // Suche Line
  const line = findLine(parsed.lineId);
  
  if (!line) {
    showInputError(`Linie ${parsed.lineId} nicht gefunden`);
    return;
  }
  
  // Speichere Recent Entry
  Storage.addRecentEntry({
    lineId: parsed.lineId,
    cycleIdPadded: parsed.cycleIdPadded,
    lineIdPadded: parsed.lineIdPadded,
    raw: parsed.raw
  });
  
  // Speichere Cycle-Daten in Session
  Storage.setCurrentCycle({
    cycle,
    line,
    stops: stopsData.stops,
    parsed
  });
  
  // Weiterleitung zu Ansage-Interface
  window.location.href = '/announcements.html';
}

/**
 * Input Change Handler (Live-Validierung)
 */
function handleInputChange(event) {
  const value = event.target.value;
  
  // Auto-Insert Slash
  if (value.length === 3 && !value.includes('/')) {
    lineInput.value = value + '/';
  }
  
  // Clear Error wenn Input geändert wird
  if (inputError.textContent) {
    clearInputError();
  }
}

/**
 * Sucht Cycle nach ID
 */
function findCycle(cycleId) {
  if (!cyclesData || !cyclesData.cycles) return null;
  return cyclesData.cycles.find(c => c.cycleId === cycleId);
}

/**
 * Sucht Line nach ID
 */
function findLine(lineId) {
  if (!linesData || !linesData.lines) return null;
  return linesData.lines.find(l => l.id === lineId);
}

/**
 * Rendert Recent Entries
 */
function renderRecentEntries() {
  const recent = Storage.getRecentEntries();
  
  if (!recent || recent.length === 0) {
    recentSection.classList.add('hidden');
    return;
  }
  
  recentSection.classList.remove('hidden');
  recentEntries.innerHTML = '';
  
  recent.forEach(entry => {
    const item = createRecentItem(entry);
    recentEntries.appendChild(item);
  });
}

/**
 * Erstellt Recent Entry Element
 */
function createRecentItem(entry) {
  const item = document.createElement('div');
  item.className = 'recent-item';
  item.setAttribute('role', 'button');
  item.setAttribute('tabindex', '0');
  
  const text = document.createElement('div');
  text.className = 'recent-item__text';
  
  const title = document.createElement('div');
  title.className = 'recent-item__title';
  title.textContent = entry.raw;
  
  const subtitle = document.createElement('div');
  subtitle.className = 'recent-item__subtitle';
  subtitle.textContent = Utils.formatLineDisplay(entry.lineId, entry.cycleIdPadded);
  
  text.appendChild(title);
  text.appendChild(subtitle);
  
  const iconWrapper = document.createElement('div');
  iconWrapper.className = 'recent-item__icon';
  iconWrapper.innerHTML = `
    <span class="icon icon--md icon--primary">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </span>
  `;
  
  item.appendChild(text);
  item.appendChild(iconWrapper);
  
  // Click Handler
  item.addEventListener('click', () => {
    lineInput.value = entry.raw;
    lineInput.focus();
    handleFormSubmit(new Event('submit'));
  });
  
  // Keyboard Handler
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      item.click();
    }
  });
  
  return item;
}

/**
 * Zeigt Input-Fehler
 */
function showInputError(message) {
  inputError.textContent = message;
  inputError.classList.remove('hidden');
  lineInput.classList.add('form-input--error');
}

/**
 * Löscht Input-Fehler
 */
function clearInputError() {
  inputError.textContent = '';
  inputError.classList.add('hidden');
  lineInput.classList.remove('form-input--error');
}

/**
 * Zeigt Loading Indicator
 */
function showLoading() {
  loadingIndicator.classList.remove('hidden');
}

/**
 * Versteckt Loading Indicator
 */
function hideLoading() {
  loadingIndicator.classList.add('hidden');
}

// Init App when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
