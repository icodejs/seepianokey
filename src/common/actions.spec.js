import * as actions from './actions';
import * as types from './action-types';

describe('actions', () => {
  describe('selectMidiController', () => {
    it('should select a midi controller available', () => {
      const selectedDeviceName = 'fake-controller';
      const result = actions.selectMidiController({
        selectedDeviceName,
      });

      const expectedResult = {
        type: types.SELECT_MIDI_CONTROLLER,
        selectedDeviceName,
      }

      expect(result).toEqual(expectedResult);
    })
  });

  describe('selectNumberOfKeyboardOctaves', () => {
    it('should set the number of keyboard octaves state', () => {
      const numberOfKeyboardOctaves = 2;
      const result = actions.selectNumberOfKeyboardOctaves({
        numberOfKeyboardOctaves,
      })

      const expectedResult = {
        type: types.SELECT_NUMBER_OF_KEYBOARD_OCTAVES,
        numberOfKeyboardOctaves,
      }

      expect(result).toEqual(expectedResult);
    })
  });

  describe("setWebmidiSupport", () => {
    it("should set state relating to webmidi support", () => {
      const webMidiSupported = 2;
      const result = actions.setWebMidiSupported({
        webMidiSupported
      });

      const expectedResult = {
        type: types.SET_WEB_MIDI_SUPPORTED,
        webMidiSupported
      };

      expect(result).toEqual(expectedResult);
    });
  });
});
