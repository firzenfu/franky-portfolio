import React from 'react';
import {AbsoluteFill, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {FinishGrade, FRANKY_ASSETS, FullBleedImage, GlitchBars, RGBGhosts, SparkField} from './visuals';

export const CloseupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const shake = frame % 24 < 4 ? (frame % 2 === 0 ? 16 : -14) : 0;
  return (
    <AbsoluteFill style={{backgroundColor: '#041426', overflow: 'hidden'}}>
      <AbsoluteFill style={{translate: `${shake}px ${-shake * 0.35}px`}}>
        <FullBleedImage
          name="Silent closeup"
          src={FRANKY_ASSETS.closeup}
          scaleFrom={1.1}
          scaleTo={1.32}
          yFrom={0}
          yTo={-56}
          filter="contrast(1.1) saturate(1.12) brightness(.92)"
        />
        <RGBGhosts src={FRANKY_ASSETS.closeup} strength={22} />
        <GlitchBars src={FRANKY_ASSETS.closeup} intensity={0.72} />
      </AbsoluteFill>
      <SparkField />
      <Interactive.Div
        name="Closeup caption"
        style={{
          position: 'absolute',
          top: 170,
          left: 112,
          maxWidth: 760,
          padding: '12px 20px',
          color: '#f7fbff',
          backgroundColor: 'rgba(0,0,0,.74)',
          fontFamily: 'Arial, Microsoft JhengHei, sans-serif',
          fontSize: 43,
          fontWeight: 750,
          lineHeight: 1.42,
          letterSpacing: 2,
          opacity: interpolate(frame, [4, 14, 138, 162], [0, 1, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        沉默不是軟弱<br />是魔力聚集的瞬間
      </Interactive.Div>
      <FinishGrade flash={0.16} />
    </AbsoluteFill>
  );
};
