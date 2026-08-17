import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

export const FRANKY_ASSETS = {
  original: staticFile('franky/franky-avatar.jpg'),
  closeup: staticFile('franky/franky-closeup.png'),
  spell: staticFile('franky/franky-spell.png'),
  float: staticFile('franky/franky-float.png'),
};

const hash = (value: number) => {
  const x = Math.sin(value * 91.345 + 7.19) * 47453.5453;
  return x - Math.floor(x);
};

export const FullBleedImage: React.FC<{
  name: string;
  src: string;
  scaleFrom?: number;
  scaleTo?: number;
  xFrom?: number;
  xTo?: number;
  yFrom?: number;
  yTo?: number;
  filter?: string;
}> = ({name, src, scaleFrom = 1, scaleTo = 1.08, xFrom = 0, xTo = 0, yFrom = 0, yTo = 0, filter}) => {
  const frame = useCurrentFrame();
  return (
    <Img
      name={name}
      src={src}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        scale: interpolate(frame, [0, 180], [scaleFrom, scaleTo], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
        translate: `${interpolate(frame, [0, 180], [xFrom, xTo], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })}px ${interpolate(frame, [0, 180], [yFrom, yTo], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })}px`,
        filter,
      }}
    />
  );
};

export const RGBGhosts: React.FC<{src: string; strength?: number}> = ({src, strength = 18}) => {
  const frame = useCurrentFrame();
  const hit = Math.max(0, 1 - (frame % 24) / 5);
  return (
    <>
      <Img
        name="Cyan chromatic ghost"
        src={src}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: hit * 0.38,
          translate: `${strength * hit}px 0px`,
          filter: 'sepia(1) saturate(7) hue-rotate(128deg) brightness(1.3)',
          mixBlendMode: 'screen',
        }}
      />
      <Img
        name="Magenta chromatic ghost"
        src={src}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: hit * 0.3,
          translate: `${-strength * hit}px 0px`,
          filter: 'sepia(1) saturate(8) hue-rotate(270deg) brightness(1.2)',
          mixBlendMode: 'screen',
        }}
      />
    </>
  );
};

export const GlitchBars: React.FC<{src: string; intensity?: number}> = ({src, intensity = 1}) => {
  const frame = useCurrentFrame();
  const gate = frame % 19 < 5 || frame % 31 < 3 ? 1 : 0;
  return (
    <AbsoluteFill name="Pixel glitch strips" style={{opacity: gate * intensity, mixBlendMode: 'screen'}}>
      {Array.from({length: 14}, (_, index) => {
        const top = index * 7.2;
        const offset = (hash(frame * 3 + index * 27) - 0.5) * 170 * intensity;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: `${top}%`,
              left: 0,
              width: '100%',
              height: `${2.5 + hash(index * 8) * 5}%`,
              backgroundImage: `url(${src})`,
              backgroundPosition: `center ${-top * 10}px`,
              backgroundSize: '1080px 1920px',
              translate: `${offset}px 0px`,
              filter: index % 3 === 0 ? 'hue-rotate(120deg) saturate(1.8)' : 'contrast(1.2) brightness(1.15)',
              opacity: 0.58,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const EnergyRings: React.FC<{color?: string}> = ({color = '#65f8e8'}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Energy rings" style={{alignItems: 'center', justifyContent: 'center', mixBlendMode: 'screen'}}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            width: 620 + index * 210,
            height: 620 + index * 210,
            borderRadius: '50%',
            border: `${4 - index}px solid ${color}`,
            opacity: 0.22 + index * 0.08,
            scale: interpolate(frame, [0, 120], [0.65 + index * 0.05, 1.55 + index * 0.08], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            rotate: `${frame * (index % 2 === 0 ? 1.3 : -0.9) + index * 34}deg`,
            boxShadow: `0 0 34px ${color}, inset 0 0 24px ${color}`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

export const SparkField: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Magic sparks" style={{mixBlendMode: 'screen'}}>
      {Array.from({length: 72}, (_, index) => {
        const x = hash(index * 13) * 100;
        const baseY = hash(index * 31) * 112;
        const travel = (frame * (0.22 + hash(index * 19) * 0.72) + index * 17) % 125;
        const size = 2 + hash(index * 71) * 7;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${(baseY - travel + 125) % 125 - 12}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: index % 4 === 0 ? '#ffd45e' : index % 3 === 0 ? '#b96dff' : '#73fff0',
              opacity: 0.25 + hash(index * 41) * 0.68,
              boxShadow: '0 0 18px currentColor',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const FinishGrade: React.FC<{flash?: number}> = ({flash = 0}) => {
  const frame = useCurrentFrame();
  const beatFlash = Math.max(0, 1 - (frame % 12) / 2.6) * flash;
  return (
    <>
      <AbsoluteFill
        name="Cinematic vignette"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 42%, rgba(2,5,15,.28) 66%, rgba(1,2,9,.86) 100%)',
        }}
      />
      <AbsoluteFill
        name="Scanning texture"
        style={{
          opacity: 0.1,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 5px, rgba(255,255,255,.17) 6px 7px)',
          translate: `0px ${(frame * 2) % 14}px`,
          mixBlendMode: 'overlay',
        }}
      />
      <AbsoluteFill
        name="Beat flash"
        style={{backgroundColor: '#dfffff', opacity: beatFlash, mixBlendMode: 'screen'}}
      />
    </>
  );
};
