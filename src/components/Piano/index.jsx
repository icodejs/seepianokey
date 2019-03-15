import React, { Component, Fragment } from 'react';
import webmidi from 'webmidi';

class Piano extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: []
    };
  }

  componentDidMount() {
    this.setupMidi();
  }

  setupMidi() {
    webmidi.enable((err) => {
      if (err) {
        console.log('WebMidi could not be enabled.', err);
      } else {

        const [device] = webmidi.inputs;
        const { name } = device;
        const input = webmidi.getInputByName(name);

        input.addListener('noteon', 'all', (e) => {
          const noteId = e.note.name + e.note.octave;
          this.setState({
            notes: [...this.state.notes, { name: noteId }]
          });
        });

        input.addListener('noteoff', 'all', (e) => {
          const noteId = e.note.name + e.note.octave;
          this.setState({
            notes: this.state.notes.filter(({ name }) => name !== noteId)
          });
        });
      }
    });
  }

  renderNotes() {
    return this.state.notes.map(({ name }, index) => (
      <p key={index}>{name}</p>
    ));
  }

  render() {
    return <Fragment>{this.renderNotes()}</Fragment>;
  }
}

export default Piano;
