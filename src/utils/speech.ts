/**
 * Universal Audio Pronunciation Service.
 * Supports:
 * - Native Web Speech API (synchronously triggered for iOS Safari & Android compliance)
 * - Server-side /api/tts MP3 audio stream (for high-fidelity desktop and cloud playback)
 * - Automatic mobile detection with user override option.
 */

export type AudioMode = 'auto' | 'native' | 'server';

class SpeechService {
  private currentAudio: HTMLAudioElement | null = null;
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private mode: AudioMode = 'auto';

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedMode = localStorage.getItem('linguaflash_audio_mode') as AudioMode;
        if (savedMode && ['auto', 'native', 'server'].includes(savedMode)) {
          this.mode = savedMode;
        }
      } catch {
        // ignore
      }

      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => this.loadVoices();
        }
      }
    }
  }

  public setMode(mode: AudioMode) {
    this.mode = mode;
    try {
      localStorage.setItem('linguaflash_audio_mode', mode);
    } catch {
      // ignore
    }
  }

  public getMode(): AudioMode {
    return this.mode;
  }

  private isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return /iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent) || navigator.maxTouchPoints > 1;
  }

  private loadVoices() {
    if (!this.synth) return;
    try {
      this.voices = this.synth.getVoices() || [];
    } catch {
      // safe fallback
    }
  }

  public cleanText(raw: string): string {
    return raw
      .replace(/\s*\/\s*/g, ', ')
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/\[[^\]]*\]/g, '')
      .replace(/[«»"]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Native Web Speech API (Synchronous trigger on click for mobile gestures)
   */
  public playViaWebSpeech(text: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.synth) {
        resolve(false);
        return;
      }

      try {
        this.stop();

        if (this.synth.paused) {
          this.synth.resume();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.92;

        if (this.voices.length === 0) {
          this.loadVoices();
        }

        const enVoice =
          this.voices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (v.name.includes('Samantha') ||
                v.name.includes('Daniel') ||
                v.name.includes('Google') ||
                v.name.includes('Natural') ||
                v.name.includes('Karen') ||
                v.name.includes('Moira'))
          ) ||
          this.voices.find((v) => v.lang.startsWith('en')) ||
          this.voices[0];

        if (enVoice) {
          utterance.voice = enVoice;
        }

        // Prevent Chromium GC bug
        if (typeof window !== 'undefined') {
          (window as unknown as { __lingua_speech_utt?: unknown }).__lingua_speech_utt = utterance;
        }

        let started = false;
        utterance.onstart = () => {
          started = true;
        };

        utterance.onend = () => {
          resolve(true);
        };

        utterance.onerror = () => {
          resolve(started);
        };

        // Synchronous call in current tick for iOS user gesture token
        this.synth.speak(utterance);

        if (this.synth.paused) {
          this.synth.resume();
        }
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Server MP3 audio element via /api/tts
   */
  public playViaAudioElement(text: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        this.stop();

        const encoded = encodeURIComponent(text.slice(0, 250));
        const audioUrl = `/api/tts?text=${encoded}`;
        const audio = new Audio(audioUrl);
        this.currentAudio = audio;

        let hasResolved = false;
        const cleanup = (success: boolean) => {
          if (!hasResolved) {
            hasResolved = true;
            if (this.currentAudio === audio) {
              this.currentAudio = null;
            }
            resolve(success);
          }
        };

        audio.onended = () => cleanup(true);
        audio.onerror = () => cleanup(false);

        const timer = setTimeout(() => {
          cleanup(true);
        }, 8000);

        audio
          .play()
          .then(() => {
            // Audio started playing
          })
          .catch(() => {
            clearTimeout(timer);
            cleanup(false);
          });
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Main speech playback method.
   */
  public async speak(text: string): Promise<void> {
    const cleaned = this.cleanText(text);
    if (!cleaned) return;

    const isMobile = this.isMobileDevice();
    const effectiveMode =
      this.mode === 'auto'
        ? (isMobile ? 'native' : 'server')
        : this.mode;

    if (effectiveMode === 'native') {
      // 1. Try native Web Speech first (ideal for mobile and silent mode bypass)
      const nativeOk = await this.playViaWebSpeech(cleaned);
      if (!nativeOk) {
        // Fallback to server audio if native failed
        await this.playViaAudioElement(cleaned);
      }
    } else {
      // 2. Try server MP3 audio first
      const serverOk = await this.playViaAudioElement(cleaned);
      if (!serverOk) {
        // Fallback to native Web Speech
        await this.playViaWebSpeech(cleaned);
      }
    }
  }

  public stop(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }

    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // ignore
      }
    }
  }
}

export const speech = new SpeechService();
