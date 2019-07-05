import {
  SELECT_MIDI_CONTROLLER,
  SELECT_NUMBER_OF_KEYBOARD_OCTAVES,
  SET_WEB_MIDI_SUPPORTED,
} from './action-types';

export const selectMidiController = ({ selectedDeviceName }) => ({
  type: SELECT_MIDI_CONTROLLER,
  selectedDeviceName,
});

export const selectNumberOfKeyboardOctaves = ({
  numberOfKeyboardOctaves
}) => ({
  type: SELECT_NUMBER_OF_KEYBOARD_OCTAVES,
  numberOfKeyboardOctaves,
})

export const setWebMidiSupported = ({
  webMidiSupported,
}) => ({
  type: SET_WEB_MIDI_SUPPORTED,
  webMidiSupported,
});
