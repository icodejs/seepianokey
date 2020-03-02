import { chromatic } from '@tonaljs/range';
import { SELECT_TONIC, SELECT_CHORD_PROGRESSION } from '../action-types';
import { getChordsInKey, getScaleForKey } from '../../lessons/utils';

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
      id: '2-5-1',
      name: '2-5-1',
      romanIntervals: ['II', 'V', 'I'],
      numericIntervals: [2, 5, 1],
      selected: false,
    },
    {
      id: '1-4-5-5',
      name: '1-4-5-5',
      romanIntervals: ['I', 'IV', 'V', 'V'],
      numericIntervals: [1, 4, 5, 5],
      selected: false,
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
    case SELECT_CHORD_PROGRESSION:
      return {
        ...state,
        chordProgressions: state.chordProgressions.map(progression => {
          return {
            ...progression,
            selected: progression.id === action.id ? true : false,
          };
        }),
      };
    default:
      return state;
  }
}

export default lesson;
