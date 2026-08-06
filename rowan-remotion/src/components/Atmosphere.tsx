import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {CONFIG, createParticles, PALETTE} from '../animation';

export const Atmosphere: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = useMemo(
    () => createParticles(CONFIG.particleCount, CONFIG.particleSeed),
    [],
  );

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: PALETTE.midnight}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 48% 44%, rgba(89,64,157,.34) 0%, rgba(21,25,61,.8) 32%, rgba(6,7,20,1) 76%)',
        }}
      />

      {[0, 1, 2].map((fog) => (
        <div
          key={fog}
          style={{
            position: 'absolute',
            width: 900 + fog * 180,
            height: 380 + fog * 70,
            left: -130 + fog * 390,
            top: 590 - fog * 145,
            borderRadius: '50%',
            background:
              fog === 1
                ? 'rgba(113,69,188,.16)'
                : 'rgba(73,96,178,.12)',
            filter: `blur(${95 + fog * 28}px)`,
            opacity: interpolate(frame, [0, 55, 300], [0, 0.72, 0.48], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            translate: `${Math.sin(frame / (72 + fog * 18)) * (28 + fog * 8)}px ${Math.cos(frame / (91 + fog * 16)) * 13}px`,
            scale: 1 + Math.sin(frame / (85 + fog * 10)) * 0.05,
          }}
        />
      ))}

      {particles.map((particle) => {
        const travel = (frame * particle.speed * CONFIG.motionSpeed) % 118;
        const y = ((particle.y - travel + 118) % 118) - 9;
        const twinkle = 0.62 + Math.sin(frame / 17 + particle.phase) * 0.38;
        return (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${y}%`,
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              background: particle.id % 4 === 0 ? PALETTE.cyan : PALETTE.orchid,
              boxShadow: `0 0 ${particle.size * 3}px currentColor`,
              filter: `blur(${particle.blur}px)`,
              opacity: particle.opacity * twinkle,
              translate: `${Math.sin(frame / 31 + particle.phase) * particle.drift}px 0`,
            }}
          />
        );
      })}

      <AbsoluteFill
        style={{
          background:
            'linear-gradient(115deg, transparent 28%, rgba(153,116,255,.06) 50%, transparent 70%)',
          opacity: interpolate(frame, [135, 205], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          translate: `${interpolate(frame, [135, 230], [-260, 220], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}px 0`,
        }}
      />
    </AbsoluteFill>
  );
};
