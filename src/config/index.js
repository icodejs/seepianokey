import { config } from 'dotenv';
import envalid from 'envalid';
import { Scale, scale, transpose } from 'tonal';

config();

const { str } = envalid;

export const env = envalid.cleanEnv(process.env, {
  DEFAULT_CONTROLLER: str({ default: 'APC' }),
});

export const flatToSharp = (note) => {
  const notes = {
    'Db': 'C#',
    'Eb': 'D#',
    'Gb': 'F#',
    'Ab': 'G#',
    'Bb': 'A#',
  };
  return notes[note] || note;
};

export const notes = [
  'C',
  'C#',
  'Db',
  'D',
  'D#',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
  'Ab',
  'A',
  'A#',
  'Bb',
  'B'
];

export const flatNotes = notes.filter((n) =>
  n.indexOf('#') === -1);

export const sharpNotes = notes.filter((n) =>
  n.indexOf('b') === -1);

export const sharpToFlat = (note) => {
  const notes = {
    'C#': 'Db',
    'D#': 'Eb',
    'F#': 'Gb',
    'G#': 'Ab',
    'A#': 'Bb',
  };
  return notes[note] || note;
};

const modules = [
  {
    id: 'scales',
    title: 'Learn Scales',
    description: 'Pick a scale and practice.',
    level: '01',
    tasks: [
      {
        id: 'majorScales',
        title: 'Major Scales',
        lessons: notes.map((note, index) => ({
          title: `${flatToSharp(note)} Major Scale`,
          id: flatToSharp(note),
          lessonNumber: index + 1,
          sequence: Scale.notes(`${note} major`),
        }))
      },
      {
        id: 'minorScales',
        title: 'Minor Scales',
        // ...
      }
    ]
  }
]; // e.g. Scale training || Chord training || Timing || Find Key || Chord progression training

// console.log(Scale.names());
// console.log(modules);

