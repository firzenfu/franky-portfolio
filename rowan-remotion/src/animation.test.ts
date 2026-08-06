import {describe, expect, it} from 'vitest';
import {createParticles, getVisualState, sceneProgress, VIDEO} from './animation';

describe('deterministic animation model', () => {
  it('returns identical particles for the same seed', () => {
    expect(createParticles(4, 728)).toEqual(createParticles(4, 728));
  });

  it('returns different particles for different seeds', () => {
    expect(createParticles(4, 728)).not.toEqual(createParticles(4, 729));
  });

  it('uses the requested delivery format', () => {
    expect(VIDEO).toMatchObject({fps: 30, durationInFrames: 300, width: 1920, height: 1080});
  });

  it('fades in at the opening and fades down at the final frame', () => {
    expect(sceneProgress(0).fade).toBe(0);
    expect(sceneProgress(60).fade).toBe(1);
    expect(sceneProgress(299).fade).toBeLessThan(1);
  });

  it('holds progress values inside safe ranges', () => {
    for (const frame of [0, 60, 150, 240, 299]) {
      const state = sceneProgress(frame);
      expect(state.camera).toBeGreaterThanOrEqual(0);
      expect(state.camera).toBeLessThanOrEqual(1);
      expect(state.staff).toBeGreaterThanOrEqual(0);
      expect(state.staff).toBeLessThanOrEqual(1);
      expect(state.finale).toBeGreaterThanOrEqual(0);
      expect(state.finale).toBeLessThanOrEqual(1);
    }
  });

  it('keeps camera and breathing motion restrained', () => {
    const opening = getVisualState(0);
    const middle = getVisualState(150);
    const ending = getVisualState(299);

    expect(opening.cameraScale).toBe(1);
    expect(ending.cameraScale).toBeCloseTo(1.08, 4);
    expect(Math.abs(middle.breathingScale - 1)).toBeLessThanOrEqual(0.02);
  });

  it('activates the crystal after the opening beat', () => {
    expect(getVisualState(30).crystalIntensity).toBe(0);
    expect(getVisualState(150).crystalIntensity).toBeGreaterThan(0.9);
    expect(getVisualState(259).pulseIntensity).toBe(1);
  });
});
