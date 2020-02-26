import { flatToSharp, flatNotes, sharpNotes, notesAreEqual } from './index';

describe('flatToSharp', () => {
  it('convert flat notes to sharp notes', () => {
    const result = flatToSharp('Db');
    const expected = 'C#';
    expect(result).toBe(expected);
  });

  it('returns note if neither sharp or flat', () => {
    const result = flatToSharp('D');
    const expected = 'D';
    expect(result).toBe(expected);
  });
});

describe('flatNotes', () => {
  it('all notes including flat notes', () => {
    const expected = [
      'C',
      'Db',
      'D',
      'Eb',
      'E',
      'F',
      'Gb',
      'G',
      'Ab',
      'A',
      'Bb',
      'B',
    ];
    expect(flatNotes).toEqual(expect.arrayContaining(expected));
  });
});

describe('sharpNotes', () => {
  it('all notes including flat notes', () => {
    const expected = [
      'C',
      'C#',
      'D',
      'D#',
      'E',
      'F',
      'F#',
      'G',
      'G#',
      'A',
      'A#',
      'B',
    ];
    expect(sharpNotes).toEqual(expect.arrayContaining(expected));
  });
});

describe('notesAreEqual', () => {
  it('should compare note and convert flat to sharps and sharps to flat', () => {
    expect(notesAreEqual('C#', 'Db')).toBeTruthy();
    expect(notesAreEqual('D#', 'Eb')).toBeTruthy();
    expect(notesAreEqual('F#', 'Gb')).toBeTruthy();
    expect(notesAreEqual('A#', 'Bb')).toBeTruthy();
    expect(notesAreEqual('C', 'C')).toBeTruthy();
    expect(notesAreEqual('D', 'D')).toBeTruthy();
    expect(notesAreEqual('E', 'E')).toBeTruthy();
    expect(notesAreEqual('F', 'F')).toBeTruthy();
    expect(notesAreEqual('G', 'G')).toBeTruthy();
    expect(notesAreEqual('A', 'A')).toBeTruthy();
    expect(notesAreEqual('B', 'B')).toBeTruthy();
  });
});
