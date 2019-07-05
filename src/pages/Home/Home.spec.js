import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const props = {
    selectMidiController: () => {},
    setWebMidiSupported: () => {},
    webMidiSupported: false,
  };

  ReactDOM.render(<Home {...props} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
