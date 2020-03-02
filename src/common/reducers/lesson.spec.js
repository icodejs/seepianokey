import reducer, { initialState } from './lesson';
import * as types from '../action-types';

describe('reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle SELECT_CHORD_PROGRESSION', () => {
    const id = '2-5-1';
    const result = reducer(undefined, {
      type: types.SELECT_CHORD_PROGRESSION,
      id,
    }).chordProgressions.find(({ selected }) => selected);

    expect(result.id).toEqual('2-5-1');
  });
});
