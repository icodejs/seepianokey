import { SELECT_MIDI_CONTROLLER } from './action-types';

export function selectMidiController(selectedDeviceName) {
  return {
    type: SELECT_MIDI_CONTROLLER,
    selectedDeviceName,
  };
}
