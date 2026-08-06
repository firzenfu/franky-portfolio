import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {getVisualState, PALETTE} from '../animation';

const RuneCircle: React.FC<{size: number; opacity: number; direction: number}> = ({
  size,
  opacity,
  direction,
}) => {
  const frame = useCurrentFrame();
  return (
    <svg
      viewBox="0 0 400 400"
      style={{
        position: 'absolute',
        width: size,
        height: size,
        left: '50%',
        top: '51%',
        translate: '-50% -50%',
        rotate: `${direction * (frame * 0.075)}deg`,
        opacity,
        filter: 'drop-shadow(0 0 12px rgba(170,116,255,.7))',
      }}
    >
      <circle cx="200" cy="200" r="174" fill="none" stroke={PALETTE.violet} strokeWidth="1.1" strokeDasharray="7 15" />
      <circle cx="200" cy="200" r="142" fill="none" stroke={PALETTE.cyan} strokeWidth="0.6" strokeDasharray="2 10" />
      <path d="M200 38 L340 281 L60 281 Z" fill="none" stroke={PALETTE.orchid} strokeWidth="0.7" />
      <path d="M200 362 L60 119 L340 119 Z" fill="none" stroke={PALETTE.cyan} strokeWidth="0.5" opacity=".75" />
    </svg>
  );
};

export const MagicEffects: React.FC = () => {
  const frame = useCurrentFrame();
  const visual = getVisualState(frame);
  const runeOpacity = interpolate(frame, [145, 190, 238, 280], [0, 0.23, 0.23, 0.06], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dash = 1100 - frame * 2.1;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <RuneCircle size={880} opacity={runeOpacity} direction={1} />
      <RuneCircle size={710} opacity={runeOpacity * 0.62} direction={-1} />

      <svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible'}}>
        <defs>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="ribbonGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={PALETTE.cyan} stopOpacity="0" />
            <stop offset=".45" stopColor={PALETTE.violet} stopOpacity=".9" />
            <stop offset=".74" stopColor={PALETTE.orchid} stopOpacity=".76" />
            <stop offset="1" stopColor={PALETTE.cyan} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M315 750 C510 940 805 892 1028 720 C1235 560 1370 370 1650 420"
          fill="none"
          stroke="url(#ribbonGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="310 790"
          strokeDashoffset={dash}
          opacity={visual.awaken * 0.72}
          filter="url(#softGlow)"
        />
        <path
          d="M390 430 C620 270 810 355 1010 500 C1205 645 1430 746 1638 605"
          fill="none"
          stroke="url(#ribbonGradient)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="220 880"
          strokeDashoffset={-dash * 0.82}
          opacity={visual.awaken * 0.48}
          filter="url(#softGlow)"
        />
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 510,
          top: -35,
          width: 150,
          height: 150,
          border: '3px solid rgba(219,150,255,.88)',
          borderRadius: '50%',
          opacity: visual.pulseIntensity * 0.75,
          scale: interpolate(visual.pulseIntensity, [0, 1], [0.4, 2.5]),
          filter: 'drop-shadow(0 0 20px rgba(173,104,255,.72))',
        }}
      />

      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 33% 13%, rgba(220,147,255,${visual.pulseIntensity * 0.28}) 0%, transparent 28%)`,
          opacity: visual.fade,
        }}
      />
    </AbsoluteFill>
  );
};
