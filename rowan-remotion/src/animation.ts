import {Easing, interpolate} from 'remotion';

export const VIDEO = {
  fps: 30,
  durationInFrames: 300,
  width: 1920,
  height: 1080,
} as const;

export const PALETTE = {
  midnight: '#060714',
  indigo: '#101332',
  violet: '#9a63ff',
  orchid: '#d978ff',
  cyan: '#86dcff',
  silver: '#eef2ff',
} as const;

export const CONFIG = {
  particleCount: 82,
  particleSeed: 728,
  cameraZoom: 0.08,
  breathingAmount: 0.012,
  glowStrength: 1,
  motionSpeed: 1,
} as const;

export type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  drift: number;
  phase: number;
  blur: number;
};

const mulberry32 = (seed: number) => {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
};

export const createParticles = (count: number, seed: number): Particle[] => {
  const next = mulberry32(seed);

  return Array.from({length: count}, (_, id) => ({
    id,
    x: next() * 100,
    y: next() * 100,
    size: 1.5 + next() * 6.5,
    opacity: 0.14 + next() * 0.66,
    speed: 0.08 + next() * 0.24,
    drift: -18 + next() * 36,
    phase: next() * Math.PI * 2,
    blur: next() > 0.68 ? 3 + next() * 7 : next() * 1.4,
  }));
};

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

export const sceneProgress = (frame: number) => ({
  fade: interpolate(frame, [0, 38, 280, 299], [0, 1, 1, 0.12], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  }),
  camera: interpolate(frame, [0, 299], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  }),
  staff: interpolate(frame, [58, 142], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  }),
  awaken: interpolate(frame, [145, 220], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  }),
  finale: interpolate(frame, [232, 259, 299], [0, 1, 0.18], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  }),
});

export const getVisualState = (frame: number) => {
  const progress = sceneProgress(frame);
  const breathing = Math.sin((frame / VIDEO.fps) * Math.PI * 0.72);

  return {
    ...progress,
    cameraScale: 1 + progress.camera * CONFIG.cameraZoom,
    cameraShiftX: Math.sin(progress.camera * Math.PI) * -18,
    breathingScale: 1 + breathing * CONFIG.breathingAmount,
    breathingOffsetY: Math.sin((frame / VIDEO.fps) * Math.PI * 0.72) * -5,
    crystalIntensity: progress.staff,
    pulseIntensity: progress.finale,
  };
};
