import { chromatic } from '@tonaljs/range';
import {
  SELECT_TONIC,
  SELECT_CHORD_PROGRESSION,
  START_GAME,
  REGISTER_NOTE_PRESSED,
  REGISTER_NOTE_RELEASED,
} from '../action-types';
import { getChordsInKey, getScaleForKey } from '../../lessons/utils';
import { addNote, removeNote } from '../../utils/notes';

const tonics = chromatic(['C2', 'B2'], { sharps: false }).map(tonic =>
  tonic.replace(/(\d)/, ''),
);

const defaultTonic = 'C';
const defaultOctave = 4;
const defaultNumberOfNotesInChord = 3;
const defaultScaleType = 'major';
const defaultLessonType = 'chord';

export const initialState = {
  notesPressed: [],
  lessonInProgress: false,
  defaultOctave,
  defaultNumberOfNotesInChord,
  tonic: defaultTonic,
  tonics,
  selectedLessonType: defaultLessonType,
  chords: tonics.reduce((acc, tonic) => {
    acc[tonic] = getChordsInKey({
      tonic,
      scaleType: defaultScaleType,
    });
    return acc;
  }, {}),
  scales: tonics.reduce((acc, tonic) => {
    acc[tonic] = getScaleForKey({
      tonic,
      octave: defaultOctave,
      scaleType: defaultScaleType,
    });
    return acc;
  }, {}),
  chordProgressions: [
    {
      id: '2-5-1',
      name: '2-5-1',
      romanIntervals: ['II', 'V', 'I'],
      numericIntervals: [2, 5, 1],
      selected: true,
      chordsInProgression: 3,
    },
    {
      id: '1-4-5-5',
      name: '1-4-5-5',
      romanIntervals: ['I', 'IV', 'V', 'V'],
      numericIntervals: [1, 4, 5, 5],
      selected: false,
      chordsInProgression: 4,
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
            selected: progression.id === action.id,
          };
        }),
      };
    case START_GAME:
      return {
        ...state,
        lessonInProgress: true, // use logic to determine this
      };
    case REGISTER_NOTE_PRESSED:
      return {
        ...state,
        notesPressed: addNote(state.notesPressed)(action.note),
      };
    case REGISTER_NOTE_RELEASED:
      return {
        ...state,
        notesPressed: removeNote(state.notesPressed)(action.note),
      };
    default:
      return state;
  }
}

export default lesson;
