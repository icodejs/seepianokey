import reducer, { initialState } from './lesson';
// import * as types from '../action-types';

describe('reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
});
