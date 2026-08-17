import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {FinishGrade, FRANKY_ASSETS, GlitchBars, RGBGhosts} from './visuals';

const shots = [
  FRANKY_ASSETS.closeup,
  FRANKY_ASSETS.spell,
  FRANKY_ASSETS.float,
  FRANKY_ASSETS.original,
  FRANKY_ASSETS.spell,
  FRANKY_ASSETS.closeup,
];

export const RapidMontage: React.FC = () => {
  const frame = useCurrentFrame();
  const shotLength = frame < 72 ? 12 : 8;
  const shotIndex = Math.floor(frame / shotLength);
  const shotFrame = frame % shotLength;
  const src = shots[shotIndex % shots.length];
  const direction = shotIndex % 2 === 0 ? 1 : -1;
  return (
    <AbsoluteFill style={{backgroundColor: '#02050d', overflow: 'hidden'}}>
      <Img
        name="Rapid hero cut"
        src={src}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: shotIndex % 3 === 0 ? '50% 24%' : shotIndex % 3 === 1 ? '42% 50%' : '58% 50%',
          scale: interpolate(shotFrame, [0, shotLength - 1], [1.05, 1.28], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          translate: `${direction * interpolate(shotFrame, [0, shotLength - 1], [-32, 18], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}px ${interpolate(shotFrame, [0, shotLength - 1], [18, -24], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}px`,
          filter: shotIndex % 4 === 0 ? 'contrast(1.3) saturate(.8) hue-rotate(160deg)' : 'contrast(1.12) saturate(1.2)',
        }}
      />
      <RGBGhosts src={src} strength={35} />
      <GlitchBars src={src} intensity={1} />
      <AbsoluteFill
        style={{
          backgroundColor: shotIndex % 2 === 0 ? '#59fff1' : '#ffe071',
          opacity: Math.max(0, 1 - shotFrame / 2.1) * 0.62,
          mixBlendMode: 'screen',
        }}
      />
      <FinishGrade flash={0.3} />
    </AbsoluteFill>
  );
};
