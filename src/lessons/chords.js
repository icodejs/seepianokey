import * as R from 'ramda';
import { chord } from '@tonaljs/chord';
import { majorKey, minorKey } from '@tonaljs/key';
import { fromRomanNumerals } from '@tonaljs/progression';
import { scale } from '@tonaljs/scale';

const TRIAD_CHORD_LENGTH = 3;

export const getChordsInKey = ({ tonic, scaleType = 'major', octave }) => {
  const tonicKey = octave ? `${tonic}${octave}` : tonic;
  const key = scaleType === 'major' ? majorKey(tonicKey) : minorKey(tonicKey);

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

export const getScaleForKey = ({ tonic, scaleType = 'major', octave = 4 }) =>
  scale(`${tonic}${octave} ${scaleType}`);

const findChordMatch = ({
  chordsInKey,
  noteNames,
  numberOfNotesInChord = TRIAD_CHORD_LENGTH, // Only interested in triad chords for now
}) => {
  if (noteNames.length !== numberOfNotesInChord) {
    return;
  }

  return chordsInKey.find(({ notes }) => {
    return notes.every(note => {
      return noteNames.includes(note);
    });
  });
};

export const progressionTest = (
  { notesPressed, tonic, lesson, chordsInKey, currentProgressionTest },
  callback,
) => {
  const noteNames = notesPressed.map(R.prop('name'));
  const matchedChord = findChordMatch({
    noteNames,
    chordsInKey,
  });

  if (!matchedChord) {
    return;
  }

  const completed =
    currentProgressionTest.length === lesson.romanIntervals.length;

  callback(matchedChord, completed);

  if (completed) {
    const attempt = currentProgressionTest.map(({ tonic }) => tonic);
    const answer = fromRomanNumerals(tonic, lesson.romanIntervals);
    const correct = R.equals(attempt, answer);
    const attemptDetails = currentProgressionTest
      .map(({ name }) => name)
      .join(' => ');

    return correct
      ? `PERFECT! Correct answer = ${attemptDetails}`
      : `Incorrect! Your answer = ${attemptDetails}. Correct answer = ${answer}`;
  }

  return `Chords left = ${3 - currentProgressionTest.length}`;
};
