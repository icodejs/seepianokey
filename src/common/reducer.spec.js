import reducer from './reducer';
import * as types from './action-types';

describe('reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      selectedDeviceName: 'APC Key 25',
    });
  });

  it('should handle SELECT_MIDI_CONTROLLER', () => {
    const fakeMidiController = 'fake-controller';

    expect(reducer(undefined, {
      type: types.SELECT_MIDI_CONTROLLER,
      selectedDeviceName: fakeMidiController,
    })).toEqual({
      selectedDeviceName: fakeMidiController,
    });
  });

  it('should handle SELECT_NUMBER_OF_KEYBOARD_OCTAVES', () => {
    const fakeNumberOfOctaves = 'fake-controller';

    expect(reducer(undefined, {
      type: types.SELECT_NUMBER_OF_KEYBOARD_OCTAVES,
      numberOfKeyboardOctaves: fakeNumberOfOctaves,
    })).toEqual({
      numberOfKeyboardOctaves: fakeNumberOfOctaves,
      selectedDeviceName: 'APC Key 25',
    });
  });
});
