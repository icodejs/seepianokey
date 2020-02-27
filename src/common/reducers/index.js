import { combineReducers } from 'redux';
import lesson from './lesson';
import game from './game';

export default combineReducers({
  lesson,
  game,
});
