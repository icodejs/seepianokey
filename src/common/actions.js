import {
  SELECT_MIDI_CONTROLLER,
  SELECT_NUMBER_OF_KEYBOARD_OCTAVES,
  SET_WEB_MIDI_SUPPORTED,
  SELECT_TONIC,
  START_GAME,
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

export const selectTonic = ({ tonic }) => {
  return {
    type: SELECT_TONIC,
    tonic,
  };
};

export const startGame = ({ tonic, gameType }) => ({
  type: START_GAME,
  id: new Date().getTime(),
  tonic,
  gameType,
});
