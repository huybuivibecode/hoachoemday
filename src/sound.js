// Audio synthesis using Web Audio API (0 external assets, 0 loading latency)
let audioCtx = null;
let bgmInterval = null;
let isMuted = true;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play a gentle music box / harp note
export function playNote(freq, duration = 1.2, volume = 0.15) {
  const ctx = getAudioContext();
  if (!ctx || isMuted) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Warm bell/kalimba tone with gentle harmonics
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio errors gracefully
  }
}

// Gentle crystal chime for special actions
export function playChime() {
  if (isMuted) return;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playNote(freq, 1.8, 0.12);
    }, idx * 120);
  });
}

// Soft tap / petal flutter sound
export function playPluck() {
  if (isMuted) return;
  const scale = [523.25, 587.33, 659.25, 783.99, 880.0];
  const freq = scale[Math.floor(Math.random() * scale.length)];
  playNote(freq, 0.8, 0.08);
}

// Soothing romantic music box arpeggio pattern
const bgmNotes = [
  523.25, 659.25, 783.99, 1046.5, // C - E - G - C
  440.00, 523.25, 659.25, 880.00, // A - C - E - A
  349.23, 440.00, 523.25, 698.46, // F - A - C - F
  392.00, 493.88, 587.33, 783.99, // G - B - D - G
];

export function toggleMusic(callback) {
  const ctx = getAudioContext();
  if (!ctx) return false;

  isMuted = !isMuted;

  if (isMuted) {
    if (bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
  } else {
    let step = 0;
    playChime();
    bgmInterval = setInterval(() => {
      if (!isMuted) {
        const freq = bgmNotes[step % bgmNotes.length];
        playNote(freq, 2.0, 0.08);
        step++;
      }
    }, 600);
  }

  if (callback) callback(!isMuted);
  return !isMuted;
}

export function getMusicState() {
  return !isMuted;
}
