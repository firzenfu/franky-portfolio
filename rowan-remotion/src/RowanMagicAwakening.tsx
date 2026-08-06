import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {getVisualState, VIDEO} from './animation';
import {Atmosphere} from './components/Atmosphere';
import {MagicEffects} from './components/MagicEffects';
import {RowanCharacter} from './components/RowanCharacter';

export const RowanMagicAwakening: React.FC = () => {
  const frame = useCurrentFrame();
  const visual = getVisualState(frame);
  const grainOffset = ((frame * 17) % 41) - 20;

  return (
    <AbsoluteFill style={{backgroundColor: '#060714', overflow: 'hidden'}}>
      <Sequence from={0} durationInFrames={VIDEO.durationInFrames}>
        <Atmosphere />
        <MagicEffects />
        <RowanCharacter />

        <AbsoluteFill
          style={{
            background: 'radial-gradient(ellipse at center, transparent 45%, rgba(1,2,10,.38) 76%, rgba(0,0,7,.82) 100%)',
          }}
        />
        <AbsoluteFill
          style={{
            opacity: 0.045,
            backgroundImage:
              'repeating-radial-gradient(circle at 25% 35%, rgba(255,255,255,.8) 0 0.6px, transparent 0.9px 3px)',
            backgroundSize: '5px 5px',
            translate: `${grainOffset}px ${-grainOffset * 0.6}px`,
            mixBlendMode: 'soft-light',
          }}
        />
        <AbsoluteFill style={{backgroundColor: '#03040c', opacity: 1 - visual.fade}} />
      </Sequence>
    </AbsoluteFill>
  );
};
