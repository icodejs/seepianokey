import React, { Component, Fragment } from 'react';
import * as R from 'ramda';
import webmidi from 'webmidi';
import config from '../../config';

const createNoteId = event => event.note.name + event.note.octave;

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
          this.setState({
            notes: [
              ...this.state.notes,
              {
                id: createNoteId(e),
                midiNote: e.note.number,
                rawVelocity: e.rawVelocity,
                ...e.note,
              }
            ].sort((a, b) => a.midiNote - b.midiNote)
          });
        });

        input.addListener('noteoff', 'all', (e) => {
          const noteId = createNoteId(e);
          this.setState({
            notes: this.state.notes.filter(({ id }) => id !== noteId)
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

  renderPossibleChords() {
    if (!this.state.notes.length) {
      return;
    }

    const chordFound = Object
      .keys(config.chords.majorChords)
      .filter(key => {
        const chord = config.chords.majorChords[key];
        return this.state.notes.every(({ name }) => chord.includes(name));
      }
    );

    return <div>{`Possible Chords: ${R.take(3)(chordFound)}`}</div>;
  }

  render() {
    return (
      <Fragment>
        {this.renderPossibleChords()}
        {this.renderNotes()}
      </Fragment>
    );
  }
}

export default Piano;
