import React, { Component } from 'react';
import PropTypes from 'prop-types';
import webmidi from 'webmidi';
import * as R from 'ramda';

import { chord, transpose } from '@tonaljs/chord';
import { majorKey } from '@tonaljs/key';
import { entries } from '@tonaljs/chord-dictionary';

import Piano from '../../components/Piano';
import Display from '../../components/Display';
import DeviceSelection from '../../components/DeviceSelection';
import { addNote, removeNote } from '../../utils/notes';

import './Lessons.scss';

const TONIC = 'C';
const RELATIVE_KEY = 'major';
const CHORD_LENGTH = 3;

const debug = notesPressed => {
  if (notesPressed.length === 0) {
    return;
  }
  // console.log(notesPressed);

  // const noteNames = notesPressed.map(R.prop('name'));
  const [tonic] = notesPressed;

  const key = majorKey(tonic);
  console.log('key:', key.chords[6]);

  const rawChords = key.chords.map(chord => {
    if (chord.includes('m7b5')) {
      return chord.replace('m7b5', 'o');
    }
    return chord.replace('maj7', '').replace('7', '');
  });
  console.log('rawChords', rawChords);

  const chordsInScale = rawChords.map(name => {
    const [a, b, c] = chord(name).notes;
    return [a, b, c];
  });
  console.log('chordsInScale', chordsInScale);

  // const majorChordIntervals = chord('C##m7b5').intervals;
  // console.log('majorChordIntervals:', majorChordIntervals);

  // const chordNotes = majorChordIntervals.map(i => {
  //   return transpose('D#', i);
  // });
  // console.log('chordNotes:', chordNotes);
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

    const key = majorKey(TONIC);
    const majorChordIntervals = chord(RELATIVE_KEY).intervals;

    if (notesPressed.length === 0) {
      return;
    }

    return debug(notesPressed);

    const noteNames = notesPressed.map(R.prop('name'));

    const chordsInScale = key.chords.map(name => {
      const [a, b, c] = chord(name).notes;
      return [a, b, c];
    });

    const chordNotes = majorChordIntervals.map(i => {
      return transpose(this.state.selectedChordKey, i);
    });

    const possibleChords = entries()
      .filter(({ intervals }) => intervals.length === CHORD_LENGTH)
      .map(chordType => chordType.name)
      .filter(chordType => chordType);

    console.log(majorChordIntervals);
    console.log(chordNotes);
    console.log(possibleChords);

    const chordMatch = chordsInScale.some(keys => {
      return keys.every(key => {
        return noteNames.includes(key);
      });
    });

    if (!chordMatch) {
      return;
    }

    return `Chord match: ${JSON.stringify(noteNames)}`;
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
