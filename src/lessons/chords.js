import * as R from 'ramda';
import { chord } from '@tonaljs/chord';
import { majorKey, minorKey } from '@tonaljs/key';
import { fromRomanNumerals } from '@tonaljs/progression';

const TRIAD_CHORD_LENGTH = 3;

let currentProgressionTest = [];

export const getChordsInKey = ({ tonic, scale = 'major' }) => {
  const key = scale === 'major' ? majorKey(tonic) : minorKey(tonic);

  // We are only interested in triads so remove references to seventh chords for now
  return key.chords
    .map(chord => {
      const diminished7thChord = chord.includes('m7b5');
      if (diminished7thChord) {
        return chord.replace('m7b5', 'o');
      }
      return chord.replace('maj7', '').replace('7', '');
    })
    .map((name, index) => {
      return {
        scaleDegree: index + 1,
        ...chord(name),
      };
    });
};

const findChordMatch = ({
  chordsInKey,
  noteNames,
  numberOfNotesInChord = TRIAD_CHORD_LENGTH, // Only interested in triad chords for now
}) => {
  if (noteNames.length !== numberOfNotesInChord) {
    return;
  }

  return chordsInKey.find(({ notes }) => {
    return notes.every(key => {
      return noteNames.includes(key);
    });
  });
};

export const progressionTest = ({
  notesPressed,
  tonic,
  lesson,
  chordsInKey,
}) => {
  const noteNames = notesPressed.map(R.prop('name'));
  const matchedChord = findChordMatch({
    noteNames,
    chordsInKey,
  });

  if (!matchedChord) {
    return;
  }

  currentProgressionTest.push(matchedChord);

  const completed = currentProgressionTest.length === lesson.length;

  if (completed) {
    const attempt = currentProgressionTest.map(({ tonic }) => tonic);
    const answer = fromRomanNumerals(tonic, lesson);
    const correct = R.equals(attempt, answer);
    const attemptDetails = currentProgressionTest
      .map(({ name }) => name)
      .join(' => ');

    currentProgressionTest = [];

    return correct
      ? `PERFECT! Correct answer = ${attemptDetails}`
      : `Incorrect! Your answer = ${attemptDetails}. Correct answer = ${answer}`;
  }

  return `Chords left = ${3 - currentProgressionTest.length}`;
};
