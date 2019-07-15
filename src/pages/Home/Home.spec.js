import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';

describe('Home', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    const props = {};
    ReactDOM.render(<Home {...props} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
