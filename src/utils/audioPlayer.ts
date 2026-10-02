// Web Audio API ambient soothing gentle instrumental accompaniment for family/couple memory album
class AmbientAudioController {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timer: any = null;
  private gainNode: GainNode | null = null;

  public toggle(callback?: (playing: boolean) => void): boolean {
    if (this.isPlaying) {
      this.stop();
      if (callback) callback(false);
      return false;
    } else {
      this.start();
      if (callback) callback(true);
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  public start() {
    if (this.isPlaying) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.12, this.ctx.currentTime); // gentle, non-intrusive volume
      this.gainNode.connect(this.ctx.destination);

      this.isPlaying = true;
      this.playGentleChords();
    } catch (e) {
      console.warn('AudioContext not allowed yet without user interaction', e);
      this.isPlaying = false;
    }
  }

  private playGentleChords() {
    if (!this.ctx || !this.gainNode || !this.isPlaying) return;

    // Heartwarming pentatonic / romantic major progression in C Major / A Minor:
    // C, Em, F, G, Am (frequencies: C4=261.6, E4=329.6, G4=392.0, A4=440, B4=493.9, C5=523.2, E5=659.3, D4=293.7)
    const chords = [
      [261.63, 329.63, 392.0, 523.25], // C Major (C - E - G - C)
      [220.0, 261.63, 329.63, 440.0],  // A Minor (A - C - E - A)
      [174.61, 261.63, 329.63, 392.0], // Fmaj7 (F - C - E - G)
      [196.0, 246.94, 293.66, 392.0]   // G Major (G - B - D - G)
    ];

    let chordIdx = 0;

    const playNext = () => {
      if (!this.isPlaying || !this.ctx || !this.gainNode) return;

      const currentChord = chords[chordIdx];
      chordIdx = (chordIdx + 1) % chords.length;

      // Play soft arpeggio notes
      currentChord.forEach((freq, idx) => {
        const delay = idx * 0.45;
        this.playSoftNote(freq, this.ctx!.currentTime + delay, 3.2);
      });

      this.timer = setTimeout(playNext, 2800);
    };

    playNext();
  }

  private playSoftNote(freq: number, startTime: number, duration: number) {
    if (!this.ctx || !this.gainNode) return;

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = 'sine'; // warm, pure gentle bell/rhodes sound
    osc.frequency.setValueAtTime(freq, startTime);

    // Warm envelope: soft attack, sustained body, gentle fade out
    noteGain.gain.setValueAtTime(0.001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.15);
    noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {
        // ignore
      }
      this.ctx = null;
    }
  }
}

export const ambientMusic = new AmbientAudioController();
