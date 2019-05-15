import { flatToSharp, flatNotes, sharpNotes } from './index';

describe('flatToSharp', () => {
  it('convert flat notes to sharp notes', () => {
    const result = flatToSharp('Db')
    const expected = 'C#';
    expect(result).toBe(expected);
  });

  it('returns note if neither sharp or flat', () => {
    const result = flatToSharp('D')
    const expected = 'D';
    expect(result).toBe(expected);
  });
});

describe('flatNotes', () => {
  it('all notes including flat notes', () => {
    const expected = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    expect(flatNotes).toEqual(expect.arrayContaining(expected));
  });
});

describe('sharpNotes', () => {
  it('all notes including flat notes', () => {
    const expected = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    expect(sharpNotes).toEqual(expect.arrayContaining(expected));
  });
});
