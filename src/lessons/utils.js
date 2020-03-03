import * as R from 'ramda';
import { chord } from '@tonaljs/chord';
import { majorKey, minorKey } from '@tonaljs/key';
import { scale } from '@tonaljs/scale';

const TRIAD_CHORD_LENGTH = 3;

export const getChordGuideNotes = ({
  chordProgression,
  chordsInKey,
  interval,
  octave,
}) => {
  if (interval > 2) {
    return [];
  }

  const chordFound = chordsInKey.find(
    chord => chord.scaleDegree === chordProgression.numericIntervals[interval],
  );
  return chordFound ? chordFound.notes.map(key => key + octave) : [];
};

export const getChordsInKey = ({ tonic, scaleType, octave }) => {
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

export const getScaleForKey = ({ tonic, scaleType, octave = 4 }) => {
  const scaleData = scale(`${tonic}${octave} ${scaleType}`);
  return {
    ...scaleData,
    notes: [...scaleData.notes, `${tonic}${octave + 1}`], // Completes scale
  };
};

export const findChordMatch = ({
  chordsInKey,
  notesPressed,
  numberOfNotesInChord = TRIAD_CHORD_LENGTH, // Only interested in triad chords for now
}) => {
  if (notesPressed.length !== numberOfNotesInChord) {
    return;
  }
  const noteNames = notesPressed.map(R.prop('name'));

  return chordsInKey.find(({ notes }) => {
    return notes.every(note => {
      return noteNames.includes(note);
    });
  });
};
