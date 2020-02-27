import { START_GAME } from '../action-types';

export const initialState = {
  id: null,
  gameType: null, // chords|scales
  tonic: null, // C,C#, D
  progression: null,
  answers: [], // array of arrays with all chords
  current: [], // chords that need to be played next
  status: 'idle', // in-progress, idle, success, failure
  // text will use template string to add custom info
  question: `Play the {progression-here} chord progression.`,
  idleText: 'Press start to begin.',
  inProgressText: 'Please enter next chord',
  successText: 'Brilliant. You have enter chord progression correctly',
  errorText: 'Incorrect. One or more chords was incorrect. Please try again.',
  helpText: 'If you need help, you can switch on not guide.',
  loadingText: 'Loading...',
};

function game(state = initialState, action) {
  switch (action.type) {
    case START_GAME:
      return {
        ...state,
        id: action.id,
        tonic: action.tonic,
        gameType: action.gameType,
      };
    default:
      return state;
  }
}

export default game;
