import React, { Component } from 'react';
import PropTypes from 'prop-types';
import webmidi from 'webmidi';
import * as R from 'ramda';

import { chord, reduced } from '@tonaljs/chord';
import { majorKey } from '@tonaljs/key';

import Piano from '../../components/Piano';
import Display from '../../components/Display';
import DeviceSelection from '../../components/DeviceSelection';
import { addNote, removeNote } from '../../utils/notes';

import './Lessons.scss';

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
    const lessonKey = majorKey('C');
    const { notesPressed } = this.state;

    if (!notesPressed.length) {
      return;
    }

    const noteNames = notesPressed.map(R.prop('id'));

    const chordsInScale = lessonKey.chords.map(k => {
      const [a, b, c] = chord(k).notes;
      return {
        name: k,
        keys: [a, b, c],
      };
    });

    console.log('notesPressed', JSON.stringify(noteNames));
    console.log(chordsInScale);

    // if (!results.length) {
    //   return;
    // }

    // console.log(results);

    return 'hi there';
    // return `Possible Chords: ${results.join(' | ')}`;
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
