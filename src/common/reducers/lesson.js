import { chromatic } from '@tonaljs/range';
import { SELECT_TONIC } from '../action-types';
import { getChordsInKey, getScaleForKey } from '../../lessons/chords';

const tonics = chromatic(['C2', 'B2'], { sharps: false }).map(tonic =>
  tonic.replace(/(\d)/, ''),
);

const defaultOctave = 4;
const scaleType = 'major';

export const initialState = {
  defaultOctave,
  tonic: 'C', // default
  tonics,
  selectedLessonType: '',
  chords: tonics.reduce((acc, tonic) => {
    acc[tonic] = getChordsInKey({
      tonic,
      // octave,
      scaleType,
    });
    return acc;
  }, {}),
  scales: tonics.reduce((acc, tonic) => {
    acc[tonic] = getScaleForKey({
      tonic,
      octave: defaultOctave,
      scaleType,
    });
    return acc;
  }, {}),
  chordProgressions: [
    {
      name: '2-5-1',
      romanIntervals: ['II', 'V', 'I'],
      numericIntervals: [2, 5, 1],
    },
    // ['I', 'IV', 'V', 'V'],
    // ['I', 'I', 'IV', 'V'],
    // ['I', 'IV', 'I', 'V'],
    // ['I', 'IV', 'V', 'IV'],
  ],
};

function lesson(state = initialState, action) {
  switch (action.type) {
    case SELECT_TONIC:
      return {
        ...state,
        tonic: action.tonic,
      };
    default:
      return state;
  }
}

export default lesson;
