import React from 'react';
import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {EnergyRings, FinishGrade, FRANKY_ASSETS, FullBleedImage, SparkField} from './visuals';

export const FinaleScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: '#030611', overflow: 'hidden'}}>
      <FullBleedImage
        name="Final spell portrait"
        src={FRANKY_ASSETS.spell}
        scaleFrom={1.18}
        scaleTo={1.08}
        yFrom={-36}
        yTo={-10}
        filter="brightness(.82) contrast(1.14) saturate(1.02)"
      />
      <EnergyRings color="#8dfdf2" />
      <SparkField />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(3,5,16,.12), rgba(3,5,16,.84) 82%)'}} />
      <Interactive.Div
        name="Final title"
        style={{
          position: 'absolute',
          left: 92,
          bottom: 170,
          color: '#ffffff',
          fontFamily: 'Arial Black, Arial, sans-serif',
          fontSize: 96,
          fontWeight: 900,
          letterSpacing: 12,
          lineHeight: 0.9,
          textShadow: '0 0 24px rgba(93,255,238,.72)',
          opacity: interpolate(frame, [4, 16, 45, 59], [0, 1, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: `${interpolate(frame, [4, 16], [-80, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}px 0px`,
        }}
      >
        FRANKY<br /><span style={{fontSize: 34, letterSpacing: 18, color: '#83fff0'}}>SILENT ARCANA</span>
      </Interactive.Div>
      <FinishGrade flash={0.18} />
      <AbsoluteFill
        style={{
          backgroundColor: '#010208',
          opacity: interpolate(frame, [48, 59], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />
    </AbsoluteFill>
  );
};
