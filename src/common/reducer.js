import {
  SELECT_MIDI_CONTROLLER,
  SELECT_NUMBER_OF_KEYBOARD_OCTAVES,
  SET_WEB_MIDI_SUPPORTED,
  SELECTED_TONIC,
} from './action-types';

export const initialState = {
  selectedDevice: {
    name: '',
    input: null,
    output: null,
  },
  webMidiSupported: false,
  tonics: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
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
    case SELECTED_TONIC:
      return {
        ...state,
        tonic: action.tonic,
      };
    default:
      return state;
  }
}

export default seePianoKeyApp;
