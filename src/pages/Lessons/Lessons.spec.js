import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Lessons from './Lessons';

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('Lessons', () => {
  it('renders without crashing', () => {
    const props = {
      startGame: () => {},
      selectChordProgression: () => {},
      registerNotesPressed: () => {},
      defaultNumberOfNotesInChord: 1000,
      notesPressed: [],
      chords: {
        C: [],
      },
      scales: { C: { notes: [] } },
      tonic: 'C',
      tonics: [],
      chordProgressions: [
        {
          id: '2-5-1',
          name: '2-5-1',
          romanIntervals: ['II', 'V', 'I'],
          numericIntervals: [2, 5, 1],
        },
      ],
    };
    const initialState = {
      app: {
        numberOfKeyboardOctaves: 2,
        selectedDevice: {},
        webMidiSupported: true,
      },
    };
    const store = mockStore(initialState);
    const div = document.createElement('div');

    ReactDOM.render(
      <Provider store={store}>
        <Lessons {...props} />
      </Provider>,
      div,
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
