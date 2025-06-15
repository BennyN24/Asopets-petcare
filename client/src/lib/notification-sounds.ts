// Cute notification sounds using Web Audio API
export class NotificationSounds {
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
    }
  }

  private async playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  async playGentleChime() {
    // Gentle ascending chime for normal reminders
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => this.playTone(notes[i], 0.3), i * 200);
    }
  }

  async playUrgentAlert() {
    // More attention-grabbing for urgent reminders
    const notes = [880, 1174.66, 880, 1174.66]; // A5, D6 pattern
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => this.playTone(notes[i], 0.2, 'triangle'), i * 150);
    }
  }

  async playCompletionSound() {
    // Happy completion sound
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => this.playTone(notes[i], 0.25), i * 100);
    }
  }

  async playSnoozeSound() {
    // Gentle descending tone for snooze
    const notes = [783.99, 659.25, 523.25]; // G5, E5, C5
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => this.playTone(notes[i], 0.3), i * 150);
    }
  }
}

export const notificationSounds = new NotificationSounds();