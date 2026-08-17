import {readFile} from 'node:fs/promises';
import {parseMedia} from '@remotion/media-parser';

const data = await readFile('out/franky-arcana-edit.mp4');
const metadata = await parseMedia({
  src: new Blob([data], {type: 'video/mp4'}),
  fields: {
    dimensions: true,
    durationInSeconds: true,
    fps: true,
    videoCodec: true,
    audioCodec: true,
    numberOfAudioChannels: true,
    sampleRate: true,
    container: true,
    size: true,
  },
  acknowledgeRemotionLicense: true,
});
console.log(JSON.stringify(metadata, null, 2));
