import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EnergyRings, FinishGrade, FRANKY_ASSETS, FullBleedImage, GlitchBars, RGBGhosts, SparkField} from './visuals';

export const PowerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const bass = Math.max(0, 1 - (frame % 12) / 5);
  const shakeX = bass * (frame % 2 === 0 ? 14 : -14);
  return (
    <AbsoluteFill style={{backgroundColor: '#031318', overflow: 'hidden'}}>
      <AbsoluteFill style={{translate: `${shakeX}px ${bass * -7}px`, scale: 1 + bass * 0.018}}>
        <FullBleedImage
          name="Spell casting action"
          src={FRANKY_ASSETS.spell}
          scaleFrom={1.04}
          scaleTo={1.25}
          xFrom={-20}
          xTo={28}
          yFrom={28}
          yTo={-60}
          filter="contrast(1.12) saturate(1.18) brightness(.96)"
        />
        <RGBGhosts src={FRANKY_ASSETS.spell} strength={28} />
        <GlitchBars src={FRANKY_ASSETS.spell} intensity={0.85} />
      </AbsoluteFill>
      <EnergyRings color="#67fff1" />
      <SparkField />
      <AbsoluteFill
        style={{
          background: 'linear-gradient(120deg, rgba(0,255,226,.24), transparent 42%, rgba(255,201,64,.28))',
          opacity: interpolate(frame, [0, 24, 150, 179], [1, 0.18, 0.18, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          mixBlendMode: 'screen',
        }}
      />
      <FinishGrade flash={0.24} />
    </AbsoluteFill>
  );
};
