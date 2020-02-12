/// https://www.8notes.com/resources/notefinders/piano_chords.asp
/// https://cifkao.github.io/tonnetz-viz/
/// https://danigb.github.io/tonal-app/#/C
/// https://www.cs.hmc.edu/~keller/jazz/improvisor/Scales.html
/// https://github.com/djipco/webmidi/blob/master/docs/latest/data.json#L973

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import webmidi from 'webmidi';
import * as R from 'ramda';

// import { Chord } from "tonal";
import { chord } from 'tonal-detect';
import * as Note from 'tonal-note';
import * as Scale from 'tonal-scale';
// import * as Key from "tonal-key";

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
      selectedLesson: undefined,
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

  handleLessonSelection = event => {
    this.setState({
      selectedLesson: event.target.value,
    });
  };

  handleOnNoteOn = note => {
    console.log('Note on', note);
    this.setState({
      notesPressed: addNote(this.state.notesPressed)(note),
    });
  };

  handleOnNoteOff = note => {
    console.log('Note off', note);
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

  // renderLesson() {
  //   const { correct, progress, complete } = this.state.lesson;
  //   return (
  //     <div>
  //       <h3>C Scale Lesson</h3>
  //       <div>{complete ? 'Scale completed' : progress}</div>
  //       {/* !correct ? <div>Incorrect key</div> : null */}
  //     </div>
  //   );
  // }

  // renderNotesPressed() {
  //   return this.state.notes.map(({ name }, index) => (
  //     <div className='notes-pressed' key={index}>
  //       {name}
  //     </div>
  //   ));
  // }

  renderPossibleChords() {
    const { notesPressed } = this.state;

    if (!notesPressed.length) {
      return;
    }

    const noteNames = notesPressed.map(R.prop('id'));
    const results = chord(noteNames);

    if (!results.length) {
      return;
    }

    return `Possible Chords: ${results.join(' | ')}`;
  }

  renderPossibleScale() {
    const { notesPressed } = this.state;

    if (!notesPressed.length) {
      return;
    }

    const noteNames = notesPressed.map(R.prop('name'));

    const results = Note.names(' #')
      .map(n => {
        return {
          name: `${n} major`,
          notes: Scale.notes(`${n} major`),
        };
      })
      .filter(s => {
        return noteNames.every(n => s.notes.includes(n));
      })
      .map(R.prop('name'));

    if (!results.length) {
      return;
    }

    return `Possible Scales: ${results.join(' | ')}`;
  }

  renderLessonOptions() {
    const { midiInputs } = this.state;

    return (
      <div className="lesson-options">
        <DeviceSelection
          midiInputs={midiInputs}
          onDeviceSelection={this.handleDeviceSelection}
          selectedDevice={this.props.selectedDevice}
        />
        {/* <NoteSelector onNoteSelected={this.handleChordKeySelected} /> */}
      </div>
    );
  }

  render() {
    const { notesPressed } = this.state;

    if (!this.props.webMidiSupported) {
      return <div className="error">WebMidi is not supported</div>;
    }

    const displayRows = [
      this.renderPossibleChords(),
      this.renderPossibleScale(),
    ];

    // This game will cycle through C chords and ask you to play them
    // Chord.names().map(c => console.log(
    //   `C: ${c}`,
    //   Chord.notes('C', c)
    // ));
    // console.log('------------');

    // https://github.com/danigb/tonal/tree/master/extensions/key
    // Game to play all chords in the key of C
    // Also limit to progression using: Key.chords("A major", [5, 4, 1]) // => ["E7", "DMaj7", AMaj7"]
    // Key.chords('Db major').map(c => console.log(
    //   `Chords in C: ${c}`,
    //   Chord.notes(c)
    // ));
    // console.log('============');

    // http://danigb.github.io/tonal/module-Detect.html#~chord
    // Given a collection of notes, find the chord name.
    // Use this to verify chord has been pressed correctly

    // http://danigb.github.io/tonal/module-Interval.html#~names

    // https://trello.com/c/Yu9jSm8X/5-midiaccess-web-apis-mdn#comment-5ce571a5284d1837556e7516

    return (
      <div className="Lessons">
        {this.renderLessonOptions()}
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
