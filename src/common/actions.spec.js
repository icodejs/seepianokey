import * as actions from './actions';
import * as types from './action-types';

describe('actions', () => {
  describe('selectMidiController', () => {
    it('should select a midi device', () => {
      const selectedDevice = 'fake-device';
      const result = actions.selectMidiController({
        selectedDevice,
      });

      const expectedResult = {
        type: types.SELECT_MIDI_CONTROLLER,
        selectedDevice,
      };

      expect(result).toEqual(expectedResult);
    });
  });

  describe('selectNumberOfKeyboardOctaves', () => {
    it('should set the number of keyboard octaves state', () => {
      const numberOfKeyboardOctaves = 2;
      const result = actions.selectNumberOfKeyboardOctaves({
        numberOfKeyboardOctaves,
      });

      const expectedResult = {
        type: types.SELECT_NUMBER_OF_KEYBOARD_OCTAVES,
        numberOfKeyboardOctaves,
      };

      expect(result).toEqual(expectedResult);
    });
  });

  describe('setWebmidiSupport', () => {
    it('should set state relating to webmidi support', () => {
      const webMidiSupported = 2;
      const result = actions.setWebMidiSupported({
        webMidiSupported,
      });

      const expectedResult = {
        type: types.SET_WEB_MIDI_SUPPORTED,
        webMidiSupported,
      };

      expect(result).toEqual(expectedResult);
    });
  });

  describe('selectTonic', () => {
    it('should set selected tonic and retrieve tonic related data from tonal', () => {
      const tonic = 'C';
      const result = actions.selectTonic({
        tonic,
      });

      const expectedResult = {
        type: types.SELECT_TONIC,
        tonic,
      };

      expect(result).toEqual(expectedResult);
    });
  });

  describe('startGame', () => {
    it('should initialise a game with the base state', () => {
      const tonic = 'B';
      const gameType = 'Chord';

      const result = actions.startGame({
        tonic,
        gameType,
      });

      const expectedResult = {
        type: types.START_GAME,
        tonic,
        gameType,
      };

      expect(result).toMatchObject(expectedResult);
    });
  });
});
