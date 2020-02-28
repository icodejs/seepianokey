import { combineReducers } from 'redux';
import lesson from './lesson';
import game from './game';
import app from './app';

export default combineReducers({
  lesson,
  game,
  app,
});
