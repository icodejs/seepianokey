import React from 'react';
import renderer from 'react-test-renderer';

import DeviceSelection from './DeviceSelection';

describe('DeviceSelection', () => {
  describe('render', () => {
    it('should render component', () => {
      const props = {
        onReceivedMidiInputs: () => {},
        onDeviceSelection: () => {},
      };
      const json = renderer.create(<DeviceSelection {...props} />).toJSON();
      expect(json).toMatchSnapshot();
    });
  });
});
