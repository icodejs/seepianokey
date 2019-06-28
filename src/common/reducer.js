import { SELECT_MIDI_CONTROLLER } from './action-types';

const initialState = {
  selectedDeviceName: 'APC Key 25',
};

function seePianoKeyApp(state = initialState, action) {
  switch (action.type) {
    case SELECT_MIDI_CONTROLLER:
      return {
        ...state,
        selectedDeviceName: action.selectedDeviceName
      };
    default:
      return state;
  }
}

export default seePianoKeyApp;
