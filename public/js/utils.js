/**
 * ===========================================
 * UTILITY FUNCTIONS
 * Hilfsfunktionen für Parsing, Validierung, etc.
 * ===========================================
 */

const Utils = {
  /**
   * KRITISCH: Parst Linie/Umlauf im Format LLL/UU
   * @param {string} input - z.B. "003/10" oder "010/05"
   * @returns {Object|null} - {valid, lineIdPadded, lineId, cycleIdPadded, raw}
   */
  parseInput(input) {
    const trimmed = input.trim();
    
    // Validierung: Muss exakt LLL/UU sein
    if (!CONFIG.VALIDATION.INPUT_REGEX.test(trimmed)) {
      return null;
    }
    
    const [lineIdPadded, cycleIdPadded] = trimmed.split('/');
    
    // Entferne führende Nullen für lineId (aber nicht für cycleId!)
    const lineId = String(parseInt(lineIdPadded, 10));
    
    return {
      valid: true,
      lineIdPadded,      // "003" oder "010"
      lineId,            // "3" oder "10"
      cycleIdPadded,     // "10" oder "05"
      raw: trimmed       // "003/10"
    };
  },
  
  /**
   * Formatiert Linie/Umlauf für Anzeige
   * @param {string} lineId - z.B. "3" oder "10"
   * @param {string} cycleId - z.B. "10" oder "05"
   * @returns {string} - z.B. "Linie 3 / Umlauf 10"
   */
  formatLineDisplay(lineId, cycleId) {
    return `Linie ${lineId} / Umlauf ${cycleId}`;
  },
  
  /**
   * Erstellt eindeutige Cycle-ID (Format: lineId_cycleIdPadded)
   * @param {string} lineId - z.B. "3"
   * @param {string} cycleIdPadded - z.B. "10"
   * @returns {string} - z.B. "3_10"
   */
  createCycleId(lineId, cycleIdPadded) {
    return `${lineId}_${cycleIdPadded}`;
  },
  
  /**
   * Debounce-Funktion (für Performance)
   * @param {Function} func - Funktion zum Debounce
   * @param {number} delay - Verzögerung in ms
   * @returns {Function}
   */
  debounce(func, delay = CONFIG.UI.DEBOUNCE_DELAY) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  },
  
  /**
   * Fetcht JSON von URL mit Error Handling
   * @param {string} url - URL zum Fetchen
   * @returns {Promise<Object>}
   */
  async fetchJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error);
      throw error;
    }
  },
  
  /**
   * Zeigt temporäre Toast-Nachricht
   * @param {string} message - Nachrichtentext
   * @param {string} type - 'success' | 'error' | 'warning' | 'info'
   * @param {number} duration - Anzeigedauer in ms
   */
  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: var(--space-6);
      left: 50%;
      transform: translateX(-50%);
      padding: var(--space-3) var(--space-5);
      background-color: var(--color-dark);
      color: var(--color-white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      z-index: var(--z-tooltip);
      animation: slideUp 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideDown 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },
  
  /**
   * Löst StopShortCode (z.B. "ERS-A") zu Audio-ID auf
   * @param {string} shortCode - z.B. "ERS-A"
   * @param {Array} stops - Alle Stops aus stops.json
   * @returns {string|null} - Audio-ID oder null
   */
  resolveStopAudioId(shortCode, stops) {
    const stop = stops.find(s => s.shortCode === shortCode);
    return stop ? stop.audioId : null;
  },
  
  /**
   * Erstellt Ansage-Playlist aus Cycle-Daten
   * @param {Object} cycle - Cycle-Daten
   * @param {Object} line - Linie-Daten
   * @param {Array} stops - Alle Stops
   * @returns {Array} - Array von Audio-IDs
   */
  createAnnouncementPlaylist(cycle, line, stops) {
    const playlist = [];
    
    // 1. Intro: "Dies ist eine Straßenbahn"
    playlist.push('intro_tram');
    
    // 2. Linie: "der Linie 3"
    playlist.push(line.audioId);
    
    // 3. Connector: "nach"
    playlist.push('connector_nach');
    
    // 4. Ziel: "Gliesmarode"
    playlist.push(cycle.destinationAudioId);
    
    // 5. Via-Stops (falls vorhanden)
    if (cycle.viaStops && cycle.viaStops.length > 0) {
      playlist.push('connector_ueber');
      
      cycle.viaStops.forEach((shortCode, index) => {
        const audioId = this.resolveStopAudioId(shortCode, stops);
        if (audioId) {
          playlist.push(audioId);
          
          // "und" zwischen Stops
          if (index < cycle.viaStops.length - 1) {
            playlist.push('conjunction_und');
          }
        }
      });
    }
    
    return playlist;
  }
};

// Mache Utils global verfügbar
window.Utils = Utils;
