export class SoundManager {
  private audioContext: AudioContext | null = null;
  private bgMusicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicEnabled: boolean = false; // Set musicEnabled to false by default to disable background music
  private sfxEnabled: boolean = true;
  private currentOscillator: OscillatorNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.bgMusicGain = this.audioContext.createGain();
      this.bgMusicGain.connect(this.audioContext.destination);
      this.bgMusicGain.gain.value = 0.15;

      this.sfxGain = this.audioContext.createGain();
      this.sfxGain.connect(this.audioContext.destination);
      this.sfxGain.gain.value = 0.3;
    }
  }

  playBackgroundMusic() {
    if (!this.audioContext || !this.bgMusicGain || !this.musicEnabled) return;

    if (this.currentOscillator) {
      this.currentOscillator.stop();
    }

    const now = this.audioContext.currentTime;
    
    const osc1 = this.audioContext.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 220;
    osc1.connect(this.bgMusicGain);
    osc1.start(now);
    
    const osc2 = this.audioContext.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 330;
    osc2.connect(this.bgMusicGain);
    osc2.start(now);

    const osc3 = this.audioContext.createOscillator();
    osc3.type = 'triangle';
    osc3.frequency.value = 165;
    osc3.connect(this.bgMusicGain);
    osc3.start(now);

    this.currentOscillator = osc1;
  }

  stopBackgroundMusic() {
    if (this.currentOscillator) {
      this.currentOscillator.stop();
      this.currentOscillator = null;
    }
  }

  playSoundEffect(type: string) {
    if (!this.audioContext || !this.sfxGain || !this.sfxEnabled) return;

    const now = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    osc.connect(gainNode);
    gainNode.connect(this.sfxGain);

    switch (type) {
      case 'plant':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;

      case 'clean':
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;

      case 'extinguish':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
        gainNode.gain.setValueAtTime(0.25, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;

      case 'animal':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.setValueAtTime(700, now + 0.05);
        osc.frequency.setValueAtTime(500, now + 0.1);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;

      case 'water':
      case 'collect':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.exponentialRampToValueAtTime(1500, now + 0.1);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;

      case 'chop':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;

      case 'dig':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.setValueAtTime(120, now + 0.05);
        osc.frequency.setValueAtTime(100, now + 0.1);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;

      case 'mission_complete':
        [0, 0.1, 0.2].forEach((time, i) => {
          const noteOsc = this.audioContext!.createOscillator();
          const noteGain = this.audioContext!.createGain();
          noteOsc.connect(noteGain);
          noteGain.connect(this.sfxGain!);
          noteOsc.type = 'sine';
          noteOsc.frequency.value = 523 * (1 + i * 0.25);
          noteGain.gain.setValueAtTime(0.3, now + time);
          noteGain.gain.exponentialRampToValueAtTime(0.01, now + time + 0.3);
          noteOsc.start(now + time);
          noteOsc.stop(now + time + 0.3);
        });
        break;

      case 'victory':
        [0, 0.15, 0.3, 0.45].forEach((time, i) => {
          const noteOsc = this.audioContext!.createOscillator();
          const noteGain = this.audioContext!.createGain();
          noteOsc.connect(noteGain);
          noteGain.connect(this.sfxGain!);
          noteOsc.type = 'square';
          noteOsc.frequency.value = [523, 659, 784, 1047][i];
          noteGain.gain.setValueAtTime(0.4, now + time);
          noteGain.gain.exponentialRampToValueAtTime(0.01, now + time + 0.4);
          noteOsc.start(now + time);
          noteOsc.stop(now + time + 0.4);
        });
        break;

      case 'defeat':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.5);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;

      default:
        osc.type = 'sine';
        osc.frequency.value = 440;
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    }
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (!this.musicEnabled) {
      this.stopBackgroundMusic();
    } else {
      this.playBackgroundMusic();
    }
    return this.musicEnabled;
  }

  toggleSFX() {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }

  getMusicEnabled() {
    return this.musicEnabled;
  }

  getSFXEnabled() {
    return this.sfxEnabled;
  }
}
