import {
  SELECT_MIDI_CONTROLLER,
  SELECT_NUMBER_OF_KEYBOARD_OCTAVES,
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
