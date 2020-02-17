import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import webmidi from 'webmidi';

import Piano from '../../components/Piano';
import Display from '../../components/Display';
import DeviceSelection from '../../components/DeviceSelection';
import { addNote, removeNote } from '../../utils/notes';
import { progressionTest } from '../../lessons/chords';

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
    const { notesPressed } = this.state;

    // NOTE USE STATE TO HANDLE INSTRUCTION / PROGRESS
    const testResults = progressionTest({ notesPressed, tonic: 'D' });

    return (
      <Fragment>
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
