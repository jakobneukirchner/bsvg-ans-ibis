/**
 * ===========================================
 * STORAGE MODULE
 * LocalStorage Wrapper mit Session Support
 * ===========================================
 */

const Storage = {
  /**
   * Speichert Daten in LocalStorage
   * @param {string} key - Storage Key
   * @param {*} value - Zu speichernder Wert (wird als JSON serialisiert)
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('LocalStorage save failed:', error);
    }
  },
  
  /**
   * Liest Daten aus LocalStorage
   * @param {string} key - Storage Key
   * @returns {*|null} - Gespeicherter Wert oder null
   */
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('LocalStorage read failed:', error);
      return null;
    }
  },
  
  /**
   * Löscht Daten aus LocalStorage
   * @param {string} key - Storage Key
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('LocalStorage remove failed:', error);
    }
  },
  
  /**
   * Leert komplett LocalStorage
   */
  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('LocalStorage clear failed:', error);
    }
  },
  
  /**
   * Speichert Daten in SessionStorage (nur für aktuelle Session)
   * @param {string} key - Storage Key
   * @param {*} value - Zu speichernder Wert
   */
  setSession(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('SessionStorage save failed:', error);
    }
  },
  
  /**
   * Liest Daten aus SessionStorage
   * @param {string} key - Storage Key
   * @returns {*|null}
   */
  getSession(key) {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('SessionStorage read failed:', error);
      return null;
    }
  },
  
  /**
   * Fügt Recent Entry hinzu
   * @param {Object} entry - {lineId, cycleIdPadded, lineIdPadded, raw, timestamp}
   */
  addRecentEntry(entry) {
    const recent = this.get(CONFIG.STORAGE_KEYS.RECENT_ENTRIES) || [];
    
    // Entferne Duplikate
    const filtered = recent.filter(e => e.raw !== entry.raw);
    
    // Füge neuen Entry am Anfang hinzu
    filtered.unshift({
      ...entry,
      timestamp: Date.now()
    });
    
    // Limitiere auf MAX_RECENT_ENTRIES
    const limited = filtered.slice(0, CONFIG.UI.MAX_RECENT_ENTRIES);
    
    this.set(CONFIG.STORAGE_KEYS.RECENT_ENTRIES, limited);
  },
  
  /**
   * Liest Recent Entries
   * @returns {Array}
   */
  getRecentEntries() {
    return this.get(CONFIG.STORAGE_KEYS.RECENT_ENTRIES) || [];
  },
  
  /**
   * Speichert aktuellen Cycle
   * @param {Object} cycleData - Cycle-Daten
   */
  setCurrentCycle(cycleData) {
    this.setSession(CONFIG.STORAGE_KEYS.CURRENT_CYCLE, cycleData);
  },
  
  /**
   * Liest aktuellen Cycle
   * @returns {Object|null}
   */
  getCurrentCycle() {
    return this.getSession(CONFIG.STORAGE_KEYS.CURRENT_CYCLE);
  }
};

// Mache Storage global verfügbar
window.Storage = Storage;
