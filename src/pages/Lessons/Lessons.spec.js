import React from 'react';
import ReactDOM from 'react-dom';
import Lessons from './Lessons';

describe('Lessons', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    const props = {
      selectMidiController: () => {},
      setWebMidiSupported: () => {},
      webMidiSupported: false,
    };

    ReactDOM.render(<Lessons {...props} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
