import React from 'react';
import {Composition} from 'remotion';
import {VIDEO} from './animation';
import {FrankyArcanaEdit} from './franky/FrankyArcanaEdit';
import {RowanMagicAwakening} from './RowanMagicAwakening';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="FrankyArcanaEdit"
      component={FrankyArcanaEdit}
      durationInFrames={690}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="RowanMagicAwakening"
      component={RowanMagicAwakening}
      durationInFrames={VIDEO.durationInFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
  </>
);
