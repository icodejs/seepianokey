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
      };
      const json = renderer.create(<Piano {...props} />).toJSON();
      expect(json).toMatchSnapshot();
    });
  });
});
