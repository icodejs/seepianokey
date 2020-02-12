# TODO List

1. For a given key, get the names of all chords
2. With that name get the notes of all chords
3. When keys are pressed check if key matches the chord we are interested in

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
