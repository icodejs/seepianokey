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
        selectMidiController: () => {},
        setWebMidiSupported: () => {},
        handleDeviceSelection: () => {},
        webMidiSupported: true,
        numberOfKeyboardOctaves: 4,
      };

      const component = renderer.create(<Piano {...props} />);

      component.root.instance.setState({
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
      });
      const json = component.toJSON();
      expect(json).toMatchSnapshot();
    });
  });
});
