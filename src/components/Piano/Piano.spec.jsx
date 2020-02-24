import React from 'react';
import renderer from 'react-test-renderer';

import Piano from './Piano';

describe('Piano', () => {
  describe('render', () => {
    it('should render component', () => {
      const props = {
        onNoteOn: () => {},
        onNoteOff: () => {},
        selectNumberOfKeyboardOctaves: () => {},
        handleDeviceSelection: () => {},
        midiInputs: [
          {
            id: 'fake-id1',
            manufacturer: 'fake-manufacturer',
            name: 'fake-name',
            type: 'fake-type',
          },
          {
            id: 'fake-id2',
            manufacturer: 'fake-manufacturer',
            name: 'fake-name',
            type: 'fake-type',
          },
        ],
      };
      const json = renderer.create(<Piano {...props} />).toJSON();
      expect(json).toMatchSnapshot();
    });
  });
});
