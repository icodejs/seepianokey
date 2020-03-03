import {
  SELECT_MIDI_CONTROLLER,
  SELECT_NUMBER_OF_KEYBOARD_OCTAVES,
  SET_WEB_MIDI_SUPPORTED,
  SELECT_TONIC,
  START_GAME,
  SELECT_CHORD_PROGRESSION,
  NOTES_PRESSED,
} from './action-types';

export const selectMidiController = ({ selectedDevice }) => ({
  type: SELECT_MIDI_CONTROLLER,
  selectedDevice,
});

export const selectNumberOfKeyboardOctaves = ({ numberOfKeyboardOctaves }) => ({
  type: SELECT_NUMBER_OF_KEYBOARD_OCTAVES,
  numberOfKeyboardOctaves,
});

export const setWebMidiSupported = ({ webMidiSupported }) => ({
  type: SET_WEB_MIDI_SUPPORTED,
  webMidiSupported,
});

export const selectTonic = ({ tonic }) => ({
  type: SELECT_TONIC,
  tonic,
});

export const selectChordProgression = ({ id }) => ({
  type: SELECT_CHORD_PROGRESSION,
  id,
});

export const startGame = ({
  tonic,
  selectedLessonType,
  selectedChordProgression,
  chords,
  numberOfNotesInChord,
}) => ({
  type: START_GAME,
  id: new Date().getTime(),
  tonic,
  selectedLessonType,
  selectedChordProgression,
  chords,
  numberOfNotesInChord,
});

// export const registerNotesPressed = ({ notes }) => ({
//   type: NOTES_PRESSED,
//   notes,
// });
