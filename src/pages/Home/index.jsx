import React, { Component } from 'react';
import webmidi from 'webmidi';
import { chord } from 'tonal-detect'
import * as Note from 'tonal-note'
import * as Scale from 'tonal-scale'


import Piano from '../../components/Piano';
import Display from '../../components/Display';
import DeviceSelection from '../../components/DeviceSelection';
import { addNote, removeNote } from '../../utils/notes';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      midiSupported: false,
      midiInputs: [],
      selectedInput: null,
      notesPressed: [],
      displayText: '',
    };
  }

  componentDidMount() {
    webmidi.enable(err => {
      if (err) {
        this.setState({ midiSupported: false });
      } else {
        this.setState({ midiSupported: true });
      }
    });
  }

  handleReceivedMidiInputs = midiInputs => {
    this.setState({
      midiInputs: [...this.state.midiInputs, ...midiInputs]
    });
  };

  handleDeviceSelection = selectedInput => {
    this.setState({ selectedInput });
  };

  handleOnNoteOn = (note) => {
    console.log('Note on', note);
    this.setState({
      notesPressed: addNote(this.state.notesPressed)(note),
    });
  }

  handleOnNoteOff = (note) => {
    console.log('Note off', note);
    this.setState({
      notesPressed: removeNote(this.state.notesPressed)(note.id),
    });
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

    const noteNames = notesPressed.map(({ name }) => name);
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

    const noteNames = notesPressed.map(({ name }) => name)

    const results = Note.names(' #').map(n => {
      return {
        name: `${n} major`,
        notes: Scale.notes(`${n} major`),
      }
    }).filter(s => {
      return noteNames.every(n => s.notes.includes(n));
    }).map(s => s.name);

    if (!results.length) {
      return;
    }

    return `Possible Scales: ${results.join(' | ')}`;
  }

  render() {
    if (!this.state.midiSupported) {
      return <div className='error'>WebMidi is not supported</div>;
    }

    const displayRows = [this.renderPossibleChords(), this.renderPossibleScale()];

    return (
      <div>
        <Display rows={displayRows} />
        <DeviceSelection
          midiInputs={this.state.midiInputs}
          onReceivedMidiInputs={this.handleReceivedMidiInputs}
          onDeviceSelection={this.handleDeviceSelection}
        />
        <Piano
          onNoteOn={this.handleOnNoteOn}
          onNoteOff={this.handleOnNoteOff}
          midiInputDevice={this.state.selectedInput}
          notesPressed={this.state.notesPressed}
        />
      </div>
    );
  }
}

export default Home;
