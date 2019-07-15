import reducer, { initialState } from './reducer';
import * as types from './action-types';

describe('reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle SELECT_MIDI_CONTROLLER', () => {
    const fakeDevice = {
      name: 'fake-midi-controller-name',
      input: 'fake-midi-controller-input',
      output: 'fake-midi-controller-output',
    };

    expect(
      reducer(undefined, {
        type: types.SELECT_MIDI_CONTROLLER,
        selectedDevice: fakeDevice,
      }),
    ).toEqual({
      ...initialState,
      selectedDevice: fakeDevice,
    });
  });

  it('should handle SELECT_NUMBER_OF_KEYBOARD_OCTAVES', () => {
    const fakeNumberOfOctaves = 'fake-controller';

    expect(
      reducer(undefined, {
        type: types.SELECT_NUMBER_OF_KEYBOARD_OCTAVES,
        numberOfKeyboardOctaves: fakeNumberOfOctaves,
      }),
    ).toEqual({
      ...initialState,
      numberOfKeyboardOctaves: fakeNumberOfOctaves,
    });
  });

  it('should handle SET_WEB_MIDI_SUPPORTED', () => {
    expect(
      reducer(undefined, {
        type: types.SET_WEB_MIDI_SUPPORTED,
        webMidiSupported: true,
      }),
    ).toEqual({
      ...initialState,
      webMidiSupported: true,
    });
  });
});
