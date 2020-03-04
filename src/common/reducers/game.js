import * as R from 'ramda';
import { fromRomanNumerals } from '@tonaljs/progression';
import {
  START_GAME,
  REGISTER_NOTE_PRESSED,
  REGISTER_NOTE_RELEASED,
} from '../action-types';
import { addNote, removeNote } from '../../utils/notes';
import { findChordMatch } from '../../lessons/utils';

const gameTemplate = {
  id: null,
  lessonType: null, // chords|scales
  tonic: null, // C,C#, D
  progression: null,
  correctAnswers: [], // array of arrays with all correct chords
  answers: [], // list of correct chords played
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

const getStatus = ({ completed, answersAreCorrect }) => {
  console.log('completed, answersAreCorrect ', completed, answersAreCorrect);

  if (answersAreCorrect) {
    return 'success';
  }

  if (completed) {
    return 'failure';
  }

  return 'in-progress';
};

const gameCompleted = ({ state, game }) => {
  return state.answers.length === game.progression.chordsInProgression;
};

const checkAnswer = ({ answers, correctAnswers, completed }) => {
  if (!completed) {
    return false;
  }

  const attempt = answers.map(({ tonic }) => tonic);
  const correct = R.equals(attempt, correctAnswers);
  return correct;
};

export const initialState = {
  notesPressed: [],
  games: [],
};

function game(state = initialState, action) {
  switch (action.type) {
    case START_GAME:
      const progression = R.omit(['selected'], action.selectedChordProgression);
      const { id, tonic, selectedLessonType, chords } = action;

      return {
        ...state,
        games: [
          ...state.games,
          {
            ...gameTemplate,
            id: id,
            tonic: tonic,
            lessonType: selectedLessonType,
            chords: chords,
            progression,
            correctAnswers: fromRomanNumerals(
              action.tonic,
              progression.romanIntervals,
            ),
          },
        ],
      };
    case REGISTER_NOTE_PRESSED: {
      const notesPressed = addNote(state.notesPressed)(action.note);
      const [game = {}] = [...state.games].reverse();

      // time for a new game to be created
      if (!game.id || game.status === 'success' || game.status === 'failure') {
        return state;
      }

      const matchedChord = findChordMatch({
        notesPressed: notesPressed,
        chordsInKey: game.chords,
        numberOfNotesInChord: game.numberOfNotesInChord,
      });

      if (!matchedChord) {
        return {
          ...state,
          notesPressed,
        };
      }

      const answers = [...game.answers, matchedChord];
      const newGameState = {
        ...game,
        answers,
      };

      const completed = gameCompleted({ state: newGameState, game });

      const answersAreCorrect = checkAnswer({
        correctAnswers: game.correctAnswers,
        answers,
        completed,
      });

      return {
        ...state,
        notesPressed,
        games: state.games.map(g => {
          if (g.id !== newGameState.id) {
            return g;
          }

          return {
            ...newGameState,
            status: getStatus({ completed, answersAreCorrect }),
          };
        }),
      };
    }
    case REGISTER_NOTE_RELEASED: {
      const notesPressed = removeNote(state.notesPressed)(action.note);

      return {
        ...state,
        notesPressed,
      };
    }
    default:
      return state;
  }
}

export default game;
