// Tiny synthesized sound kit for Play mode: no audio files, everything comes from the Web Audio API.
const STORAGE_KEY = 'portfolio-game-muted';

export const readMuted = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch (error) {
    return false;
  }
};

export const saveMuted = (muted) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
  } catch (error) {
    // storage unavailable: the choice just won't persist
  }
};

const createGameAudio = (initiallyMuted = false) => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  const ctx = new AudioCtx();
  const master = ctx.createGain();
  master.gain.value = initiallyMuted ? 0 : 0.7;
  master.connect(ctx.destination);

  // Engine: a detuned saw pair through a low-pass, pitch and loudness follow the car's speed.
  const engineGain = ctx.createGain();
  engineGain.gain.value = 0;
  const engineFilter = ctx.createBiquadFilter();
  engineFilter.type = 'lowpass';
  engineFilter.frequency.value = 400;
  engineFilter.connect(engineGain);
  engineGain.connect(master);
  const engineOscs = [0, 7].map((detune) => {
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 52;
    osc.detune.value = detune;
    osc.connect(engineFilter);
    osc.start();
    return osc;
  });

  const tone = (freq, start, length, { type = 'sine', gain = 0.18, slideTo } = {}) => {
    const t0 = ctx.currentTime + start;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + length);
    amp.gain.setValueAtTime(0.0001, t0);
    amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + length);
    osc.connect(amp);
    amp.connect(master);
    osc.start(t0);
    osc.stop(t0 + length + 0.05);
  };

  const noiseBuffer = (() => {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    return buffer;
  })();

  let lastThump = 0;

  return {
    resume: () => ctx.state === 'suspended' && ctx.resume(),

    setMuted: (muted) => {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(muted ? 0 : 0.7, ctx.currentTime + 0.1);
    },

    // speed01: 0..1 of top speed
    engine: (speed01) => {
      const now = ctx.currentTime;
      const rpm = 52 + speed01 * 88;
      engineOscs.forEach((osc) => osc.frequency.setTargetAtTime(rpm, now, 0.08));
      engineFilter.frequency.setTargetAtTime(260 + speed01 * 700, now, 0.1);
      engineGain.gain.setTargetAtTime(0.025 + speed01 * 0.07, now, 0.1);
    },

    chime: () => {
      [523.25, 659.25, 783.99].forEach((freq, i) => tone(freq, i * 0.09, 0.5, { type: 'triangle', gain: 0.16 }));
    },

    fanfare: () => {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => tone(freq, i * 0.13, 0.7, { type: 'triangle', gain: 0.2 }));
      tone(1318.5, 0.55, 1.1, { type: 'sine', gain: 0.14 });
    },

    thump: (strength = 1) => {
      const now = ctx.currentTime;
      if (now - lastThump < 0.25) return;
      lastThump = now;
      tone(120, 0, 0.22, { type: 'sine', gain: 0.3 * strength, slideTo: 45 });
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;
      const amp = ctx.createGain();
      amp.gain.setValueAtTime(0.25 * strength, now);
      amp.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      src.connect(filter);
      filter.connect(amp);
      amp.connect(master);
      src.start(now);
      src.stop(now + 0.2);
    },

    coin: () => {
      tone(988, 0, 0.12, { type: 'square', gain: 0.06 });
      tone(1319, 0.08, 0.22, { type: 'square', gain: 0.06 });
    },

    blip: () => tone(880, 0, 0.12, { type: 'square', gain: 0.07, slideTo: 1320 }),

    dispose: () => {
      engineOscs.forEach((osc) => osc.stop());
      ctx.close();
    },
  };
};

export default createGameAudio;
