import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {AscensionScene} from './AscensionScene';
import {CloseupScene} from './CloseupScene';
import {FinaleScene} from './FinaleScene';
import {IntroScene} from './IntroScene';
import {PowerScene} from './PowerScene';
import {RapidMontage} from './RapidMontage';

export const FrankyArcanaEdit: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#02040c'}}>
    <Sequence name="01 — Quiet reveal" from={0} durationInFrames={120}>
      <IntroScene />
    </Sequence>
    <Sequence name="02 — Silent closeup" from={120} durationInFrames={180}>
      <CloseupScene />
    </Sequence>
    <Sequence name="03 — Spell impact" from={300} durationInFrames={180}>
      <PowerScene />
    </Sequence>
    <Sequence name="04 — Ascension" from={480} durationInFrames={90}>
      <AscensionScene />
    </Sequence>
    <Sequence name="05 — Rapid montage" from={570} durationInFrames={60}>
      <RapidMontage />
    </Sequence>
    <Sequence name="06 — Finale" from={630} durationInFrames={60}>
      <FinaleScene />
    </Sequence>
    <Audio name="Original synth soundtrack" src={staticFile('franky/franky-edit-original.wav')} volume={0.86} />
  </AbsoluteFill>
);
