import { SELECT_TONIC } from '../action-types';
import { getChordsInKey, getScaleForKey } from '../../lessons/chords';

const lessonTypes = ['Scales', 'Chords'];
const tonics = ['C', 'D', 'E', 'F', 'G', 'A', 'B']; // add accidentals
const defaultOctave = 4;
const scaleType = 'major';

export const initialState = {
  defaultOctave,
  tonic: 'C', // default
  tonics,
  lessonTypes,
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