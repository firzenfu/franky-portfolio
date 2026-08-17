import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';

const sampleRate = 48_000;
const duration = 23;
const channels = 2;
const frames = Math.floor(sampleRate * duration);
const pcm = Buffer.alloc(frames * channels * 2);
const bpm = 152;
const beat = 60 / bpm;

const fract = (value) => value - Math.floor(value);
const noise = (index) => fract(Math.sin(index * 12.9898 + 78.233) * 43758.5453) * 2 - 1;
const softClip = (value) => Math.tanh(value * 1.35) / Math.tanh(1.35);
const pulse = (time, start, decay) => (time >= start ? Math.exp(-(time - start) * decay) : 0);

for (let i = 0; i < frames; i++) {
  const t = i / sampleRate;
  const intro = Math.min(1, t / 1.8) * Math.min(1, (4.15 - t) / 0.65);
  let left =
    Math.sin(Math.PI * 2 * 55 * t) * 0.085 * Math.max(0, intro) +
    Math.sin(Math.PI * 2 * 82.5 * t + Math.sin(t * 0.9)) * 0.045 * Math.max(0, intro);
  let right =
    Math.sin(Math.PI * 2 * 55 * t + 0.08) * 0.085 * Math.max(0, intro) +
    Math.sin(Math.PI * 2 * 110 * t + 0.4) * 0.035 * Math.max(0, intro);

  const chimeEnv = pulse(t, 1.15, 1.8) + pulse(t, 2.55, 2.1) * 0.7;
  left += Math.sin(Math.PI * 2 * 660 * t) * 0.045 * chimeEnv;
  right += Math.sin(Math.PI * 2 * 990 * t + 0.4) * 0.04 * chimeEnv;

  if (t > 3.25 && t < 4.05) {
    const rise = (t - 3.25) / 0.8;
    left += noise(i) * rise * rise * 0.11;
    right += noise(i + 91) * rise * rise * 0.11;
  }

  if (t >= 4) {
    const musicTime = t - 4;
    const beatIndex = Math.floor(musicTime / beat);
    const beatPhase = musicTime - beatIndex * beat;
    const eighth = beat / 2;
    const eighthIndex = Math.floor(musicTime / eighth);
    const eighthPhase = musicTime - eighthIndex * eighth;
    const sixteenth = beat / 4;
    const sixteenthIndex = Math.floor(musicTime / sixteenth);
    const sixteenthPhase = musicTime - sixteenthIndex * sixteenth;

    const kickEnv = Math.exp(-beatPhase * 18);
    const kickFreq = 46 + 72 * Math.exp(-beatPhase * 32);
    const kick = Math.sin(Math.PI * 2 * kickFreq * beatPhase) * kickEnv * 0.52;

    const snareHit = beatIndex % 4 === 2 || beatIndex % 4 === 3;
    const snareEnv = snareHit ? Math.exp(-beatPhase * 22) : 0;
    const snare = (noise(i * 3) * 0.3 + Math.sin(Math.PI * 2 * 190 * beatPhase) * 0.16) * snareEnv;

    const hatEnv = Math.exp(-eighthPhase * 70);
    const hat = (noise(i * 11) - noise(i * 5) * 0.45) * hatEnv * (eighthIndex % 2 ? 0.08 : 0.12);

    const bassNotes = [46.25, 46.25, 51.91, 41.2, 46.25, 61.74, 51.91, 41.2];
    const bassFreq = bassNotes[beatIndex % bassNotes.length];
    const bass =
      (Math.sin(Math.PI * 2 * bassFreq * musicTime) +
        Math.sin(Math.PI * 2 * bassFreq * 2 * musicTime) * 0.28) *
      Math.min(1, beatPhase * 45) *
      Math.exp(-beatPhase * 1.25) *
      0.23;

    const arpNotes = [220, 261.63, 311.13, 369.99, 311.13, 261.63, 415.3, 369.99];
    const arpFreq = arpNotes[sixteenthIndex % arpNotes.length];
    const arpEnv = Math.exp(-sixteenthPhase * 28);
    const arp =
      (Math.sin(Math.PI * 2 * arpFreq * musicTime) +
        Math.sin(Math.PI * 2 * arpFreq * 2.01 * musicTime) * 0.35) *
      arpEnv *
      0.055;

    let impact = 0;
    for (const impactTime of [4, 8, 12, 16, 20]) {
      const env = pulse(t, impactTime, 4.4);
      impact += (Math.sin(Math.PI * 2 * 34 * (t - impactTime)) * 0.24 + noise(i + impactTime * 100) * 0.07) * env;
    }

    const stereoMove = Math.sin(musicTime * 0.7) * 0.12;
    left += kick + snare * 0.9 + hat * (1 - stereoMove) + bass + arp * 0.9 + impact;
    right += kick + snare * 1.04 + hat * (1 + stereoMove) + bass + arp * 1.08 + impact;
  }

  const masterFade = Math.min(1, t / 0.45) * Math.min(1, (duration - t) / 0.7);
  left = softClip(left * Math.max(0, masterFade) * 1.1) * 0.86;
  right = softClip(right * Math.max(0, masterFade) * 1.1) * 0.86;

  pcm.writeInt16LE(Math.round(left * 32767), i * 4);
  pcm.writeInt16LE(Math.round(right * 32767), i * 4 + 2);
}

const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + pcm.length, 4);
header.write('WAVE', 8);
header.write('fmt ', 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(channels, 22);
header.writeUInt32LE(sampleRate, 24);
header.writeUInt32LE(sampleRate * channels * 2, 28);
header.writeUInt16LE(channels * 2, 32);
header.writeUInt16LE(16, 34);
header.write('data', 36);
header.writeUInt32LE(pcm.length, 40);

const output = resolve('public/franky/franky-edit-original.wav');
mkdirSync(dirname(output), {recursive: true});
writeFileSync(output, Buffer.concat([header, pcm]));
console.log(output);
