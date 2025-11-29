/**
 * ===========================================
 * CONFIGURATION
 * Zentrale Konfiguration für BSVG Ansagesystem
 * ===========================================
 */

const CONFIG = {
  // Fileserver URL - GitHub Raw (immer verfügbar)
  FILESERVER_URL: 'https://raw.githubusercontent.com/jakobneukirchner/bsvg-ans-fileserver/main/public',
  
  // JSON Endpunkte (relativ zu FILESERVER_URL)
  ENDPOINTS: {
    LINES: '/lines.json',
    STOPS: '/stops.json',
    CYCLES: '/cycles.json',
    AUDIO_LIBRARY: '/audio-library.json'
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
