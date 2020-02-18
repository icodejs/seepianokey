import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import webmidi from 'webmidi';

import Piano from '../../components/Piano';
import Display from '../../components/Display';
import DeviceSelection from '../../components/DeviceSelection';
import LessonSelector from '../../components/LessonSelector';
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
      selectedProgression: [],
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
  };

  handleTonicSelection = event => {
    const { value: tonic } = event.target;
    this.props.selectTonic({ tonic });
  };

  handleChordProgressionSelection = event => {
    const { value: selectedProgression } = event.target;
    this.setState({ selectedProgression });
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

  handleNoteClick(noteClicked) {
    console.log('note mouse click', noteClicked);
  }

  renderChordTestInformation() {
    const { notesPressed } = this.state;
    const { tonic, chords, chordProgressions } = this.props;

    // NOTE USE STATE TO HANDLE INSTRUCTION / PROGRESS
    const testResults = progressionTest({
      notesPressed,
      tonic,
      lesson: chordProgressions[0],
      chordsInKey: chords[tonic],
    });

    return (
      <Fragment>
        <p>{testResults}</p>
      </Fragment>
    );
  }

  render() {
    const {
      tonic,
      tonics,
      selectedDevice,
      chordProgressions,
      webMidiSupported,
    } = this.props;
    const { notesPressed, midiInputs, selectedProgression } = this.state;

    if (!webMidiSupported) {
      return <div className="error">WebMidi is not supported</div>;
    }

    const displayRows = [this.renderChordTestInformation()];

    return (
      <div className="Lessons">
        <div className="lesson-options">
          <DeviceSelection
            midiInputs={midiInputs}
            onDeviceSelection={this.handleDeviceSelection}
            selectedDevice={selectedDevice}
          />
          <LessonSelector
            lessons={tonics}
            onLessonSelection={this.handleTonicSelection}
            selectedValue={tonic}
          />
          <LessonSelector
            lessons={chordProgressions}
            onLessonSelection={this.handleChordProgressionSelection}
            selectedValue={JSON.stringify(selectedProgression)}
          />
        </div>

        <Display rows={displayRows} />

        <Piano
          onNoteOn={this.handleOnNoteOn}
          onNoteOff={this.handleOnNoteOff}
          midiInputDevice={selectedDevice.input}
          notesPressed={notesPressed}
          guideNotes={[]}
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
