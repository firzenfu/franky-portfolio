import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EnergyRings, FinishGrade, FRANKY_ASSETS, FullBleedImage, GlitchBars, SparkField} from './visuals';

export const AscensionScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: '#03120e', overflow: 'hidden'}}>
      <FullBleedImage
        name="Floating full body"
        src={FRANKY_ASSETS.float}
        scaleFrom={1.14}
        scaleTo={0.96}
        yFrom={30}
        yTo={-20}
        filter="contrast(1.08) saturate(1.15) brightness(.92)"
      />
      <EnergyRings color="#bc72ff" />
      <SparkField />
      <GlitchBars src={FRANKY_ASSETS.float} intensity={0.62} />
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 50% 80%, rgba(88,255,212,.5), transparent 42%)',
          opacity: interpolate(frame, [0, 70, 120, 148], [0.25, 0.72, 0.32, 0.9], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          mixBlendMode: 'screen',
        }}
      />
      <FinishGrade flash={0.2} />
    </AbsoluteFill>
  );
};
