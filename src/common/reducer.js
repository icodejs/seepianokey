import {
  SELECT_MIDI_CONTROLLER,
  SELECT_NUMBER_OF_KEYBOARD_OCTAVES,
  SET_WEB_MIDI_SUPPORTED,
  SELECT_TONIC,
} from './action-types';

import { getChordsInKey } from '../lessons/chords';

const tonics = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const initialState = {
  selectedDevice: {
    name: '',
    input: null,
    output: null,
  },
  webMidiSupported: false,
  tonic: 'C',
  tonics,
  chords: tonics.reduce((acc, tonic) => {
    acc[tonic] = getChordsInKey({ tonic });
    return acc;
  }, {}),
  chordProgressions: [
    ['II', 'V', 'I'],
    ['I', 'IV', 'V', 'V'],
    ['I', 'I', 'IV', 'V'],
    ['I', 'IV', 'I', 'V'],
    ['I', 'IV', 'V', 'IV'],
  ],
};

function seePianoKeyApp(state = initialState, action) {
  switch (action.type) {
    case SELECT_MIDI_CONTROLLER:
      return {
        ...state,
        selectedDevice: action.selectedDevice,
      };
    case SELECT_NUMBER_OF_KEYBOARD_OCTAVES:
      return {
        ...state,
        numberOfKeyboardOctaves: action.numberOfKeyboardOctaves,
      };
    case SET_WEB_MIDI_SUPPORTED:
      return {
        ...state,
        webMidiSupported: action.webMidiSupported,
      };
    case SELECT_TONIC:
      return {
        ...state,
        tonic: action.tonic,
      };
    default:
      return state;
  }
}

export default seePianoKeyApp;
