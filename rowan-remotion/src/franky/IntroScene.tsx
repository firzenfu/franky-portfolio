import React from 'react';
import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {FinishGrade, FRANKY_ASSETS, FullBleedImage, SparkField} from './visuals';

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: '#040817', overflow: 'hidden'}}>
      <FullBleedImage
        name="Original portrait - slow reveal"
        src={FRANKY_ASSETS.original}
        scaleFrom={1.18}
        scaleTo={1.04}
        yFrom={90}
        yTo={-40}
        filter="brightness(.58) saturate(.7) contrast(1.18) hue-rotate(8deg)"
      />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(2,8,23,.62), transparent 34%, rgba(2,3,12,.58))'}} />
      <SparkField />
      <Interactive.Div
        name="Intro subtitle"
        style={{
          position: 'absolute',
          top: 166,
          left: 110,
          padding: '14px 22px',
          color: '#f5fbff',
          backgroundColor: 'rgba(0,0,0,.72)',
          fontFamily: 'Arial, Microsoft JhengHei, sans-serif',
          fontSize: 46,
          fontWeight: 700,
          letterSpacing: 3,
          opacity: interpolate(frame, [34, 52, 102, 118], [0, 1, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: `${interpolate(frame, [34, 52], [-42, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}px 0px`,
        }}
      >
        月光下，魔法沒有聲音
      </Interactive.Div>
      <FinishGrade />
      <AbsoluteFill
        style={{
          backgroundColor: '#02040d',
          opacity: interpolate(frame, [0, 24, 112, 119], [1, 0, 0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />
    </AbsoluteFill>
  );
};
