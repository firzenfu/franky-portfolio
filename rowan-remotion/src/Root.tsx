import React from 'react';
import {Composition} from 'remotion';
import {VIDEO} from './animation';
import {RowanMagicAwakening} from './RowanMagicAwakening';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="RowanMagicAwakening"
    component={RowanMagicAwakening}
    durationInFrames={VIDEO.durationInFrames}
    fps={VIDEO.fps}
    width={VIDEO.width}
    height={VIDEO.height}
  />
);
