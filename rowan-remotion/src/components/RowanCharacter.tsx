import React from 'react';
import {Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CONFIG, getVisualState, PALETTE} from '../animation';

export const RowanCharacter: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const visual = getVisualState(frame);
  const settle = spring({frame, fps, config: {damping: 180, stiffness: 35, mass: 1.4}});
  const entranceY = interpolate(settle, [0, 1], [28, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const highlightX = interpolate(frame, [150, 215], [-90, 125], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 48,
        width: 1040,
        translate: `calc(-50% + ${visual.cameraShiftX}px) ${entranceY + visual.breathingOffsetY}px`,
        scale: visual.cameraScale * visual.breathingScale,
        transformOrigin: '50% 48%',
        opacity: visual.fade,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '12% 9% 7%',
          borderRadius: '45%',
          background: 'rgba(110,72,211,.2)',
          filter: 'blur(65px)',
          opacity: 0.35 + visual.crystalIntensity * 0.28,
          scale: 0.98 + Math.sin(frame / 24) * 0.025,
        }}
      />

      <Img
        src={staticFile('rowan.png')}
        style={{
          position: 'relative',
          width: '100%',
          height: 'auto',
          display: 'block',
          filter: `drop-shadow(0 34px 38px rgba(0,0,0,.48)) drop-shadow(0 0 ${12 + visual.crystalIntensity * 18}px rgba(138,95,255,.28))`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: '11.8%',
          top: '-2.8%',
          width: 94,
          height: 94,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,255,255,${0.3 + visual.crystalIntensity * 0.7}) 0 5%, rgba(218,126,255,${0.32 + visual.crystalIntensity * 0.48}) 18%, rgba(147,81,255,.22) 43%, transparent 70%)`,
          boxShadow: `0 0 ${34 + visual.crystalIntensity * 72}px ${12 + visual.pulseIntensity * 20}px rgba(174,102,255,${0.18 + visual.crystalIntensity * 0.42})`,
          filter: `blur(${2.5 - visual.crystalIntensity * 1.2}px)`,
          opacity: 0.1 + visual.crystalIntensity * 0.9,
          scale: 0.82 + visual.crystalIntensity * 0.23 + visual.pulseIntensity * 0.18,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: '42%',
          top: '28.6%',
          width: 154,
          height: 32,
          borderRadius: '50%',
          background: `linear-gradient(90deg, transparent, ${PALETTE.silver}, ${PALETTE.orchid}, transparent)`,
          filter: 'blur(7px)',
          opacity: visual.awaken * 0.26,
          translate: `${highlightX}px 0`,
          mixBlendMode: 'screen',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: '13.9%',
          top: '1.2%',
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: '#fff',
          filter: `blur(${3 + (1 - visual.crystalIntensity) * 4}px)`,
          opacity: visual.crystalIntensity * CONFIG.glowStrength,
          boxShadow: '0 0 24px 8px #f1c6ff, 0 0 58px 18px #985fff',
        }}
      />
    </div>
  );
};
