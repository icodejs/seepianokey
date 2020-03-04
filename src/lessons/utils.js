/// ------ WHERE ARE THE TESTS? ------

import * as R from 'ramda';
import { chord } from '@tonaljs/chord';
import { majorKey, minorKey } from '@tonaljs/key';
import { scale } from '@tonaljs/scale';
import { notesAreEqual } from '../config';

const TRIAD_CHORD_LENGTH = 3;

export const getChordGuideNotes = ({
  chordProgression,
  chords,
  interval,
  octave,
}) => {
  if (interval >= TRIAD_CHORD_LENGTH) {
    return [];
  }

  const chordFound = chords.find(
    chord => chord.scaleDegree === chordProgression.numericIntervals[interval],
  );
  return chordFound ? chordFound.notes.map(key => key + octave) : [];
};

export const getChordsInKey = ({ tonic, scaleType, octave }) => {
  const tonicKey = octave ? `${tonic}${octave}` : tonic;
  const key = scaleType === 'major' ? majorKey(tonicKey) : minorKey(tonicKey);

  // We are only interested in triads for now, so remove references to seventh chords
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

export const getScaleForKey = ({ tonic, scaleType, octave = 4 }) => {
  const scaleData = scale(`${tonic}${octave} ${scaleType}`);
  return {
    ...scaleData,
    notes: [...scaleData.notes, `${tonic}${octave + 1}`], // Completes scale
  };
};

export const findChordMatch = ({
  chords,
  notesPressed,
  numberOfNotesInChord,
}) => {
  if (notesPressed.length !== numberOfNotesInChord) {
    return;
  }
  const noteNamesPressed = notesPressed.map(R.prop('name'));

  return chords.find(({ notes: chordNotes }) => {
    return chordNotes.every(chordNote => {
      return noteNamesPressed.some(noteNamePressed => {
        return notesAreEqual(chordNote, noteNamePressed);
      });
    });
  });
};
