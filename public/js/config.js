/**
 * ===========================================
 * CONFIGURATION
 * Zentrale Konfiguration für BSVG Ansagesystem
 * ===========================================
 */

const CONFIG = {
  // Fileserver URL (Netlify oder lokal)
  FILESERVER_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : 'https://bsvg-ans-ibis.netlify.app',
  
  // JSON Endpunkte
  ENDPOINTS: {
    LINES: '/examples/lines.json',
    STOPS: '/examples/stops.json',
    CYCLES: '/examples/cycles.json',
    ANNOUNCEMENTS: '/examples/announcements.json',
    AUDIO_LIBRARY: '/examples/audio-library.json'
  },
  
  // LocalStorage Keys
  STORAGE_KEYS: {
    RECENT_ENTRIES: 'bsvg_recent_entries',
    CURRENT_CYCLE: 'bsvg_current_cycle',
    AUDIO_LIBRARY: 'bsvg_audio_library',
    USER_PREFERENCES: 'bsvg_user_preferences'
  },
  
  // Validierung
  VALIDATION: {
    INPUT_REGEX: /^\d{3}\/\d{2}$/,
    LINE_ID_LENGTH: 3,
    CYCLE_ID_LENGTH: 2
  },
  
  // UI Settings
  UI: {
    MAX_RECENT_ENTRIES: 5,
    LOADING_TIMEOUT: 10000, // 10 Sekunden
    DEBOUNCE_DELAY: 300
  },
  
  // Audio Settings
  AUDIO: {
    CACHE_ENABLED: true,
    PRELOAD_ENABLED: false, // LAZY LOADING!
    DEFAULT_VOLUME: 1.0,
    PLAYBACK_RATE: 1.0
  }
};

// Mache CONFIG global verfügbar
window.CONFIG = CONFIG;
