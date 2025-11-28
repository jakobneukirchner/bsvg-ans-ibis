/**
 * ===========================================
 * AUDIO PLAYER MODULE
 * Lazy Loading Audio Engine mit Cache
 * ===========================================
 */

class AudioPlayer {
  constructor() {
    this.isPlaying = false;
    this.currentPlaylist = [];
    this.currentIndex = 0;
    this.audioCache = new Map(); // Cache für bereits geladene Audio-Dateien
    this.currentAudio = null;
    this.volume = CONFIG.AUDIO.DEFAULT_VOLUME;
    this.playbackRate = CONFIG.AUDIO.PLAYBACK_RATE;
  }
  
  /**
   * Spielt eine Playlist ab (Lazy Loading!)
   * @param {Array} playlist - Array von Audio-IDs
   * @param {Function} onComplete - Callback wenn Playlist fertig
   * @param {Function} onProgress - Callback für Progress (optional)
   */
  async playPlaylist(playlist, onComplete, onProgress) {
    if (this.isPlaying) {
      console.warn('AudioPlayer: Already playing, stopping current playlist');
      this.stop();
    }
    
    if (!playlist || playlist.length === 0) {
      console.error('AudioPlayer: Empty playlist');
      return;
    }
    
    this.currentPlaylist = playlist;
    this.currentIndex = 0;
    this.isPlaying = true;
    
    console.log('AudioPlayer: Starting playlist:', playlist);
    
    try {
      // Spiele alle Audios nacheinander ab
      for (let i = 0; i < playlist.length; i++) {
        if (!this.isPlaying) {
          console.log('AudioPlayer: Playback stopped by user');
          break;
        }
        
        this.currentIndex = i;
        const audioId = playlist[i];
        
        console.log(`AudioPlayer: Playing ${i + 1}/${playlist.length} - ${audioId}`);
        
        // Progress Callback
        if (onProgress) {
          onProgress(i + 1, playlist.length, audioId);
        }
        
        // Lade und spiele Audio (LAZY LOADING!)
        await this.playAudioById(audioId);
      }
      
      console.log('AudioPlayer: Playlist complete');
      
      // Complete Callback
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('AudioPlayer: Playback error:', error);
      Utils.showToast('Fehler beim Abspielen', 'error');
    } finally {
      this.isPlaying = false;
      this.currentPlaylist = [];
      this.currentIndex = 0;
    }
  }
  
  /**
   * KRITISCH: Lädt Audio ERST beim Abspielen (Lazy Loading)
   * @param {string} audioId - Audio-ID aus audio-library.json
   */
  async playAudioById(audioId) {
    try {
      // Lade Audio (aus Cache oder neu)
      const audio = await this.loadAudio(audioId);
      
      // Setze Einstellungen
      audio.volume = this.volume;
      audio.playbackRate = this.playbackRate;
      
      // Speichere Current Audio
      this.currentAudio = audio;
      
      // Spiele ab und warte bis fertig
      await this.playAudio(audio);
      
    } catch (error) {
      console.error(`AudioPlayer: Failed to play ${audioId}:`, error);
      throw error;
    }
  }
  
  /**
   * Lädt Audio-Datei (mit Cache)
   * @param {string} audioId - Audio-ID
   * @returns {Promise<HTMLAudioElement>}
   */
  async loadAudio(audioId) {
    // Check Cache first
    if (CONFIG.AUDIO.CACHE_ENABLED && this.audioCache.has(audioId)) {
      console.log(`AudioPlayer: Loading ${audioId} from cache`);
      return this.audioCache.get(audioId);
    }
    
    console.log(`AudioPlayer: Loading ${audioId} from server`);
    
    // Lade Audio Library aus Session
    const audioLib = Storage.getSession('audioLib');
    
    if (!audioLib || !audioLib.audioFiles) {
      throw new Error('Audio library not loaded');
    }
    
    // Finde Audio-Datei
    const audioFile = audioLib.audioFiles.find(a => a.id === audioId);
    
    if (!audioFile) {
      throw new Error(`Audio file not found: ${audioId}`);
    }
    
    // Erstelle Audio Element
    const audio = new Audio();
    const audioPath = `${CONFIG.FILESERVER_URL}/${audioFile.path}`;
    
    audio.src = audioPath;
    audio.preload = 'auto';
    
    // Warte bis Audio geladen ist
    await new Promise((resolve, reject) => {
      audio.addEventListener('canplaythrough', resolve, { once: true });
      audio.addEventListener('error', reject, { once: true });
      
      // Timeout nach 10 Sekunden
      setTimeout(() => reject(new Error('Audio load timeout')), CONFIG.UI.LOADING_TIMEOUT);
      
      audio.load();
    });
    
    // Cache Audio
    if (CONFIG.AUDIO.CACHE_ENABLED) {
      this.audioCache.set(audioId, audio);
    }
    
    return audio;
  }
  
  /**
   * Spielt Audio ab und wartet bis fertig
   * @param {HTMLAudioElement} audio
   * @returns {Promise<void>}
   */
  playAudio(audio) {
    return new Promise((resolve, reject) => {
      audio.addEventListener('ended', resolve, { once: true });
      audio.addEventListener('error', reject, { once: true });
      
      audio.play().catch(reject);
    });
  }
  
  /**
   * Stoppt Wiedergabe
   */
  stop() {
    this.isPlaying = false;
    
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    
    console.log('AudioPlayer: Stopped');
  }
  
  /**
   * Setzt Lautstärke (0.0 - 1.0)
   * @param {number} volume
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
    }
  }
  
  /**
   * Setzt Playback Rate (0.5 - 2.0)
   * @param {number} rate
   */
  setPlaybackRate(rate) {
    this.playbackRate = Math.max(0.5, Math.min(2, rate));
    
    if (this.currentAudio) {
      this.currentAudio.playbackRate = this.playbackRate;
    }
  }
  
  /**
   * Leert Cache
   */
  clearCache() {
    this.audioCache.clear();
    console.log('AudioPlayer: Cache cleared');
  }
  
  /**
   * Gibt Cache-Status zurück
   * @returns {Object}
   */
  getCacheStatus() {
    return {
      size: this.audioCache.size,
      entries: Array.from(this.audioCache.keys())
    };
  }
}

// Erstelle globale Instanz
window.audioPlayer = new AudioPlayer();
