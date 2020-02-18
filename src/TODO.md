# TODO List

1. For a given key, get the names of all chords
2. With that name get the notes of all chords
3. When keys are pressed check if key matches the chord we are interested in

## Phase 2

1. Find a list of common chord progressions
2. Parse them into a way that tonal can read
3. Create a list of chords required in each key
4. Write code that can determine if a group of notes plays each of the chords in progression, successfully.

## Phase 3

1. Assist user by showing each chord on keyboard or keys in scale (Use toggle for each helper option)
2. Selecting a tonic and progression should trigger an event that builds a lesson and stores it in state. This state should then be passed down and used by app, e.g. piano guide notes and progression test.
3. Put notes on keys
4. Buttons to choose chord progression
5. Help instructions

## Useful videos

- https://www.youtube.com/watch?v=vzujwexshe4
- https://www.youtube.com/watch?v=K2TaB527JB4
- https://www.youtube.com/watch?v=v9koZrHEDvI&t=2
- https://www.youtube.com/watch?v=OE8jNy3NoPI

## Useful Links

- https://www.8notes.com/resources/notefinders/piano_chords.asp
- https://cifkao.github.io/tonnetz-viz/
- https://danigb.github.io/tonal-app/#/C
- https://www.cs.hmc.edu/~keller/jazz/improvisor/Scales.html
- https://github.com/djipco/webmidi/blob/master/docs/latest/data.json#L973

This game will cycle through C chords and ask you to play them

```
Chord.names().map(c => console.log(
  `C: ${c}`,
  Chord.notes('C', c)
));
console.log('------------');
```

https://github.com/danigb/tonal/tree/master/extensions/key
Game to play all chords in the key of C
Also limit to progression using: `Key.chords("A major", [5, 4, 1]) // => ["E7", "DMaj7", AMaj7"]`

```
Key.chords('Db major').map(c => console.log(
  `Chords in C: ${c}`,
  Chord.notes(c)
));
console.log('============');
```

http://danigb.github.io/tonal/module-Detect.html#~chord

Given a collection of notes, find the chord name.
Use this to verify chord has been pressed correctly

http://danigb.github.io/tonal/module-Interval.html#~names

https://trello.com/c/Yu9jSm8X/5-midiaccess-web-apis-mdn#comment-5ce571a5284d1837556e7516

## Dump Snippets

```js
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
```
