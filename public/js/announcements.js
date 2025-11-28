/**
 * ===========================================
 * ANNOUNCEMENTS.JS
 * Ansage-Interface Logic
 * ===========================================
 */

// DOM Elements
const backButton = document.getElementById('backButton');
const lineBadge = document.getElementById('lineBadge');
const headerTitle = document.getElementById('headerTitle');
const headerSubtitle = document.getElementById('headerSubtitle');
const playMainAnnouncement = document.getElementById('playMainAnnouncement');
const playlistPreview = document.getElementById('playlistPreview');
const playlistItems = document.getElementById('playlistItems');
const playbackProgress = document.getElementById('playbackProgress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const routeInfo = document.getElementById('routeInfo');
const cycleInfoSection = document.getElementById('cycleInfoSection');
const cycleType = document.getElementById('cycleType');
const cycleValidity = document.getElementById('cycleValidity');
const cycleNotes = document.getElementById('cycleNotes');
const loadingOverlay = document.getElementById('loadingOverlay');

// State
let currentCycleData = null;
let playlist = [];

/**
 * Init Announcements Page
 */
function init() {
  // Lade Cycle-Daten aus Session
  currentCycleData = Storage.getCurrentCycle();
  
  if (!currentCycleData) {
    Utils.showToast('Keine Daten vorhanden', 'error');
    setTimeout(() => window.location.href = '/', 2000);
    return;
  }
  
  // Render UI
  renderHeader();
  renderRoute();
  renderCycleInfo();
  
  // Erstelle Playlist
  createPlaylist();
  
  // Event Listeners
  backButton.addEventListener('click', handleBackButton);
  playMainAnnouncement.addEventListener('click', handlePlayAnnouncement);
}

/**
 * Rendert Header mit Linie und Ziel
 */
function renderHeader() {
  const { cycle, line, parsed } = currentCycleData;
  
  // Line Badge
  lineBadge.querySelector('.line-badge__number').textContent = line.displayName;
  lineBadge.style.backgroundColor = line.color;
  
  // Title
  headerTitle.textContent = Utils.formatLineDisplay(parsed.lineId, parsed.cycleIdPadded);
  
  // Subtitle
  const typeLabel = cycle.type === 'diversion' ? 'Umleitung' : 'Regelbetrieb';
  headerSubtitle.textContent = `${typeLabel} nach ${cycle.direction}`;
}

/**
 * Rendert Route-Info
 */
function renderRoute() {
  const { cycle } = currentCycleData;
  
  routeInfo.innerHTML = '';
  
  if (!cycle.route || cycle.route.length === 0) {
    routeInfo.innerHTML = '<p class="text-gray">Keine Route definiert</p>';
    return;
  }
  
  cycle.route.forEach((stop, index) => {
    const stopElement = createRouteStopElement(stop, index + 1);
    routeInfo.appendChild(stopElement);
  });
}

/**
 * Erstellt Route-Stop Element
 */
function createRouteStopElement(stop, order) {
  const { stops } = currentCycleData;
  
  // Finde Stop-Details
  const stopDetails = stops.find(s => s.id === stop.stopId);
  const stopName = stopDetails ? stopDetails.name : stop.shortCode;
  
  const element = document.createElement('div');
  element.className = 'route-stop';
  element.innerHTML = `
    <div class="route-stop__order">${order}</div>
    <div class="route-stop__name">${stopName}</div>
    <div class="route-stop__code">${stop.shortCode}</div>
  `;
  
  return element;
}

/**
 * Rendert Cycle Info (falls relevant)
 */
function renderCycleInfo() {
  const { cycle } = currentCycleData;
  
  // Zeige nur für spezielle Typen (Umleitung, etc.)
  if (cycle.type === 'regular' && !cycle.notes) {
    cycleInfoSection.classList.add('hidden');
    return;
  }
  
  cycleInfoSection.classList.remove('hidden');
  
  // Type Badge
  cycleType.textContent = cycle.type === 'diversion' ? 'Umleitung' : 'Regelbetrieb';
  cycleType.className = cycle.type === 'diversion' ? 'info-value badge badge--warning' : 'info-value badge badge--success';
  
  // Validity
  if (cycle.validFrom && cycle.validUntil) {
    const from = new Date(cycle.validFrom).toLocaleDateString('de-DE');
    const until = new Date(cycle.validUntil).toLocaleDateString('de-DE');
    cycleValidity.textContent = `${from} - ${until}`;
  } else {
    cycleValidity.textContent = 'Unbegrenzt';
  }
  
  // Notes
  if (cycle.notes) {
    cycleNotes.textContent = cycle.notes;
  } else {
    cycleNotes.style.display = 'none';
  }
}

/**
 * Erstellt Ansage-Playlist
 */
function createPlaylist() {
  const { cycle, line, stops } = currentCycleData;
  
  // Nutze Utils.createAnnouncementPlaylist
  playlist = Utils.createAnnouncementPlaylist(cycle, line, stops);
  
  console.log('Playlist created:', playlist);
  
  // Render Playlist Preview
  renderPlaylistPreview();
}

/**
 * Rendert Playlist-Vorschau
 */
function renderPlaylistPreview() {
  playlistItems.innerHTML = '';
  
  const audioLib = Storage.getSession('audioLib');
  
  playlist.forEach((audioId, index) => {
    const audioFile = audioLib.audioFiles.find(a => a.id === audioId);
    const description = audioFile ? audioFile.description : audioId;
    
    const item = document.createElement('div');
    item.className = 'playlist-item';
    item.dataset.index = index;
    item.innerHTML = `
      <div class="playlist-item__number">${index + 1}</div>
      <div class="playlist-item__text">${description}</div>
    `;
    
    playlistItems.appendChild(item);
  });
}

/**
 * Spielt Hauptansage ab
 */
async function handlePlayAnnouncement() {
  if (playlist.length === 0) {
    Utils.showToast('Keine Playlist vorhanden', 'error');
    return;
  }
  
  // Disable Button
  playMainAnnouncement.disabled = true;
  playMainAnnouncement.textContent = 'WIRD ABGESPIELT...';
  
  // Show Progress
  playbackProgress.classList.remove('hidden');
  
  try {
    // Spiele Playlist mit audioPlayer ab
    await window.audioPlayer.playPlaylist(
      playlist,
      handlePlaybackComplete,
      handlePlaybackProgress
    );
  } catch (error) {
    console.error('Playback error:', error);
    Utils.showToast('Fehler beim Abspielen', 'error');
    handlePlaybackComplete();
  }
}

/**
 * Progress Callback
 */
function handlePlaybackProgress(current, total, audioId) {
  const percent = (current / total) * 100;
  progressFill.style.width = `${percent}%`;
  progressText.textContent = `Spiele ${current} von ${total}...`;
  
  // Highlight Current Item in Playlist
  const items = playlistItems.querySelectorAll('.playlist-item');
  items.forEach((item, index) => {
    if (index === current - 1) {
      item.classList.add('playlist-item--active');
    } else {
      item.classList.remove('playlist-item--active');
    }
  });
}

/**
 * Complete Callback
 */
function handlePlaybackComplete() {
  // Enable Button
  playMainAnnouncement.disabled = false;
  playMainAnnouncement.innerHTML = `
    <span class="icon icon--lg icon--white">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    </span>
    <span class="btn-text">HAUPTANSAGE ABSPIELEN</span>
  `;
  
  // Reset Progress
  progressFill.style.width = '0%';
  progressText.textContent = 'Bereit';
  
  // Hide Progress after 2s
  setTimeout(() => {
    playbackProgress.classList.add('hidden');
  }, 2000);
  
  // Remove Active Highlights
  const items = playlistItems.querySelectorAll('.playlist-item');
  items.forEach(item => item.classList.remove('playlist-item--active'));
  
  Utils.showToast('Ansage abgeschlossen', 'success');
}

/**
 * Back Button Handler
 */
function handleBackButton() {
  window.location.href = '/';
}

/**
 * Shows Loading
 */
function showLoading() {
  loadingOverlay.classList.remove('hidden');
}

/**
 * Hides Loading
 */
function hideLoading() {
  loadingOverlay.classList.add('hidden');
}

// Init when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
