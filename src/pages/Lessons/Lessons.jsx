import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import webmidi from 'webmidi';
import * as R from 'ramda';

import { chord, transpose } from '@tonaljs/chord';
import { majorKey } from '@tonaljs/key';
import { toRomanNumerals, fromRomanNumerals } from '@tonaljs/progression';

import Piano from '../../components/Piano';
import Display from '../../components/Display';
import DeviceSelection from '../../components/DeviceSelection';
import { addNote, removeNote } from '../../utils/notes';

import './Lessons.scss';

const TONIC = 'C';
const RELATIVE_KEY = 'major';
const CHORD_LENGTH = 3;

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

const getChordsInKey = ({ tonic, chordLength = CHORD_LENGTH }) => {
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
  chordLength = CHORD_LENGTH,
}) => {
  // Only interested in triad chords
  if (noteNames.length !== chordLength) {
    return;
  }

  return chordsInKey.find(({ notes }) => {
    return notes.every(key => {
      return noteNames.includes(key);
    });
  });
};

const progressionTest = ({
  currentChord,
  tonic = TONIC,
  progressionLength = 3,
  lesson = ['II', 'V', 'I'], // 2-5-1
}) => {
  currentProgressionTest.push(currentChord);

  if (currentProgressionTest.length === progressionLength) {
    console.log('currentProgressionTest', currentProgressionTest);

    const attempt = currentProgressionTest.map(({ tonic }) => tonic);
    const answer = fromRomanNumerals(tonic, lesson);
    const attemptDetails = currentProgressionTest
      .map(({ name }) => name)
      .join(' => ');

    currentProgressionTest = [];

    return R.equals(attempt, answer)
      ? `Correct answer = ${attemptDetails}`
      : `Incorrect! Your answer = ${attemptDetails}. Correct answer = ${answer}`;
  }

  return `Chords left = ${3 - currentProgressionTest.length}`;
};

class Lessons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      midiInputs: [],
      notesPressed: [],
      displayText: '',
      selectedChordKey: 'C',
    };
  }

  componentDidMount() {
    webmidi.enable(err => {
      if (!err) {
        this.props.setWebMidiSupported({ webMidiSupported: true });

        this.setState({
          midiInputs: [...webmidi.inputs],
        });
      }
    });
  }

  handleDeviceSelection = ({ selectedDevice }) => {
    this.props.selectMidiController({ selectedDevice });
    this.setState({ selectedDevice });
  };

  handleOnNoteOn = note => {
    // console.log('Note on', note);
    this.setState({
      notesPressed: addNote(this.state.notesPressed)(note),
    });
  };

  handleOnNoteOff = note => {
    // console.log('Note off', note);
    this.setState({
      notesPressed: removeNote(this.state.notesPressed)(note.id),
    });
  };

  handleChordKeySelected = selectedChordKey => {
    this.setState({
      selectedChordKey,
    });
  };

  handleNoteClick(noteClicked) {
    console.log(noteClicked);
  }

  renderPossibleChords() {
    const { notesPressed } = this.state;
    const noteNames = notesPressed.map(R.prop('name'));
    const chordsInKey = getChordsInKey({ tonic: TONIC });
    const matchedChord = findChordMatch({ chordsInKey, noteNames });

    if (!matchedChord) {
      return;
    }

    // NOTE USE STATE TO HANDLE INSTRUCTION / PROGRESS
    const testResults = progressionTest({ currentChord: matchedChord });

    return (
      <Fragment>
        <p>{`Chord matched: ${matchedChord.name} - ${matchedChord.notes}`}</p>
        <p>{testResults}</p>
      </Fragment>
    );
  }

  render() {
    const { notesPressed, midiInputs } = this.state;

    if (!this.props.webMidiSupported) {
      return <div className="error">WebMidi is not supported</div>;
    }

    const displayRows = [this.renderPossibleChords()];

    return (
      <div className="Lessons">
        <div className="lesson-options">
          <DeviceSelection
            midiInputs={midiInputs}
            onDeviceSelection={this.handleDeviceSelection}
            selectedDevice={this.props.selectedDevice}
          />
        </div>

        <Display rows={displayRows} />

        <Piano
          onNoteOn={this.handleOnNoteOn}
          onNoteOff={this.handleOnNoteOff}
          midiInputDevice={this.props.selectedDevice.input}
          notesPressed={notesPressed}
          onNoteClick={this.handleNoteClick}
        />
      </div>
    );
  }
}

Lessons.propTypes = {
  selectMidiController: PropTypes.func.isRequired,
  setWebMidiSupported: PropTypes.func.isRequired,
  webMidiSupported: PropTypes.bool.isRequired,
  selectedDevice: PropTypes.object,
};

Lessons.defaultProps = {
  selectedDevice: {},
};

export default Lessons;
