import { config } from 'dotenv';
import envalid from 'envalid';

config();

const { str } = envalid;

export const env = envalid.cleanEnv(process.env, {
  DEFAULT_CONTROLLER: str({ default: 'APC' }),
});

export const octavesOptions = [
  {
    keys: 25,
    octaves: 2,
    startingOctave: 3,
  },
  {
    keys: 49,
    octaves: 4,
    startingOctave: 2,
  },
  {
    keys: 61,
    octaves: 5,
    startingOctave: 2,
  },
  {
    keys: 76,
    octaves: 6,
    startingOctave: 1,
  },
  {
    keys: 88,
    octaves: 7,
    startingOctave: 1,
  },
];

export const allNotes = [
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
  'B',
];

export const notes = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
];

export const flatNotes = allNotes.filter(n => n.indexOf('#') === -1);

export const sharpNotes = allNotes.filter(n => n.indexOf('b') === -1);

export const sharpToFlat = note => {
  const notes = {
    'C#': 'Db',
    'D#': 'Eb',
    'F#': 'Gb',
    'G#': 'Ab',
    'A#': 'Bb',
  };
  return notes[note] || note;
};

export const flatToSharp = note => {
  const notes = {
    Db: 'C#',
    Eb: 'D#',
    Gb: 'F#',
    Ab: 'G#',
    Bb: 'A#',
  };
  return notes[note] || note;
};

export const notesAreEqual = (note1, note2, checkOctave = false) => {
  const [note1Name, note1Octave] = note1.split(/(\d)/).filter(a => a);
  const [note2Name, note2Octave] = note2.split(/(\d)/).filter(a => a);

  return (
    (flatToSharp(note1Name) === flatToSharp(note2Name) ||
      sharpToFlat(note1Name) === sharpToFlat(note2Name)) &&
    (checkOctave ? note1Octave === note2Octave : true)
  );
};
