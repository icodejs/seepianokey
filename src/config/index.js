import { config } from 'dotenv';
import envalid from 'envalid';

config();

const { str } = envalid;

export const env = envalid.cleanEnv(process.env, {
  DEFAULT_CONTROLLER: str({ default: 'APC' }),
});

export default {
  notes: [
    'C',
    'C#-Db',
    'D',
    'D#-Eb',
    'E',
    'F',
    'F#-Gb',
    'G',
    'G#-Ab',
    'A',
    'A#-Bb',
    'B'
  ],
};
