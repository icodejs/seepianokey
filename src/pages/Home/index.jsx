import React, { Component } from 'react';
import webmidi from 'webmidi';
import Piano from '../../components/Piano';
import Display from "../../components/Display";
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
  //     <div className="notes-pressed" key={index}>
  //       {name}
  //     </div>
  //   ));
  // }

  // renderPossibleChords() {
  //   const { notes } = this.state;

  //   if (!notes.length) {
  //     return;
  //   }

  //   const noteNames = notes.map(({ name }) => name);

  //   return (
  //     <div className="possible-chords">
  //       {`Possible Chords: ${chord(noteNames).join(', ')}`}
  //     </div>
  //   );
  // }

  render() {
    if (!this.state.midiSupported) {
      return <div className="error">WebMidi is not supported</div>;
    }

    return (
      <div>
        <Display />
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
