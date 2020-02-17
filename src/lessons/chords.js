import * as R from 'ramda';
import { chord } from '@tonaljs/chord';
import { majorKey } from '@tonaljs/key';
import { fromRomanNumerals } from '@tonaljs/progression';

const TONICS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const TRIAD_CHORD_LENGTH = 3;
const commonChordProgressions = [
  ['II', 'V', 'I'],
  [('I', 'IV', 'V', 'V')],
  ['I', 'I', 'IV', 'V'],
  ['I', 'IV', 'I', 'V'],
  ['I', 'IV', 'V', 'IV'],
];

let currentProgressionTest = [];

const debug = notesPressed => {
  if (notesPressed.length === 0) {
    return;
  }
  // console.log(notesPressed);

  // const noteNames = notesPressed.map(R.prop('name'));
  const [tonic] = notesPressed;

  const key = majorKey(tonic);
  console.log('key:', key);

  // We are only interested in triads so remove references to seventh chords
  // const rawChords = key.chords.map(chord => {
  //   if (chord.includes('m7b5')) {
  //     return chord.replace('m7b5', 'o');
  //   }
  //   return chord.replace('maj7', '').replace('7', '');
  // });
  // console.log('rawChords', rawChords);

  // const chordsInScale = rawChords.map(name => {
  //   const [a, b, c] = chord(name).notes;
  //   return [a, b, c];
  // });
  // console.log('chordsInScale', chordsInScale);

  // const majorChordIntervals = chord('C##m7b5').intervals;
  // console.log('majorChordIntervals:', majorChordIntervals);

  // const chordNotes = majorChordIntervals.map(i => {
  //   return transpose('D#', i);
  // });
  // console.log('chordNotes:', chordNotes);
};

const getChordsInKey = ({ tonic }) => {
  const key = majorKey(tonic);

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
  numberOfNotesInChord = TRIAD_CHORD_LENGTH,
}) => {
  // Only interested in triad chords
  if (noteNames.length !== numberOfNotesInChord) {
    return;
  }

  return chordsInKey.find(({ notes }) => {
    return notes.every(key => {
      return noteNames.includes(key);
    });
  });
};

const chordExistsForTonic = ({ noteNames }) => {
  const chordsInKey = getChordsInKey({ tonic: TONICS[0] });
  // console.log('chordsInKey', chordsInKey);

  return findChordMatch({ chordsInKey, noteNames });
};

export const progressionTest = ({
  notesPressed,
  tonic = TONICS[0],
  lesson = commonChordProgressions[0],
}) => {
  const noteNames = notesPressed.map(R.prop('name'));
  const matchedChord = chordExistsForTonic({ noteNames });

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
