import {
  SELECT_MIDI_CONTROLLER,
  SELECT_NUMBER_OF_KEYBOARD_OCTAVES,
  SET_WEB_MIDI_SUPPORTED,
} from '../action-types';

export const initialState = {
  selectedDevice: {
    name: '',
    input: null,
    output: null,
  },
  webMidiSupported: false,
  numberOfKeyboardOctaves: 2,
};

function lesson(state = initialState, action) {
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
    default:
      return state;
  }
}

export default lesson;
