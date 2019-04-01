import * as Scale from "tonal-scale";

export const scaleLesson = () => {
  const scaleBase = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const scaleForwards = [...scaleBase, scaleBase[0]];
  const scaleBackwards = [...scaleForwards].reverse();
  const scale = [...scaleForwards, ...scaleBackwards];
  const progress = [];

  return function fn(note) {
    const index = progress.length;
    const correct = scale[index] === note;

    if (correct) {
      progress.push(note);
    }

    const complete = scale.length === progress.length;

    return {
      scale,
      correct,
      progress,
      complete
    };
  };
};

// const lesson = scaleLesson();

// console.log(lesson('C'));
// console.log(lesson('E')); // wrong note
// console.log(lesson('D'));
// console.log(lesson('E'));
// console.log(lesson('F'));
// console.log(lesson('G'));
// console.log(lesson('A'));
// console.log(lesson('B'));
// console.log(lesson('C'));
// console.log(lesson('C'));
// console.log(lesson('B'));
// console.log(lesson('A'));
// console.log(lesson('G'));
// console.log(lesson('F'));
// console.log(lesson('E'));
// console.log(lesson('D'));
// console.log(lesson('D')); // wrong note
// console.log(lesson('C'));


/*
function chordLesson() {
  const chordsInKey = [['C', 'E', 'G'], ['G', 'A', 'C']];
  const progress = [];

  return notePressed => {
    const index = progress.length;

    let chord = progress[index];

    if (!chord) {
      chord = [notePressed];
    }

    if (chord.length < 3) {
      chord = [...chord, notePressed];
    }

    if (chord.length === 3) {
      const notes = chord;
      const correct = chordsInKey[index].every(
        (note, noteIndex) => note === notes[noteIndex],
      );

      if (!correct) {
        chord = [];
        return {};
      }

      chord = [...chord, notePressed];

      const complete = chordsInKey.length === progress.length;

      return {
        chordsInKey,
        correct,
        progress,
        complete,
      };
    }

    return {};
  };
}
*/


