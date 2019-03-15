// https://www.scales-chords.com/chord/piano/Bdim

import React, { Component, Fragment } from 'react';
import * as R from 'ramda';
import webmidi from 'webmidi';
import classNames from 'classnames';
import config from '../../config';
import './Piano.scss';

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

  renderNotesPressed() {
    return this.state.notes.map(({ name }, index) => (
      <div className="notes-pressed" key={index}>{name}</div>
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

    return (
      <div className="possible-chords">
        {`Possible Chords: ${R.take(3)(chordFound)}`}
      </div>
    );
  }

  renderPiano() {
    const octaves = 2;
    return [...Array(octaves)].map((o, index) => {
      const pianoOctave = index + 3;

      return (
        <ul key={`octave-${pianoOctave}`} className={`octave-${pianoOctave}`}>
          {[...Array(12)].map((k, index) => {
            const note = config.notes[index];
            const [sharp] = note.split('-');
            const selected = this.state.notes.find(({ name, octave }) => {
              return name === sharp && octave === pianoOctave;
            })

            return (
              <li
                key={`${note}_${pianoOctave}`}
                className={classNames(`${note}_${pianoOctave}`, { selected })}
              />
            );
          })}
        </ul>
      );
    });
  }

  render() {
    return (
      <Fragment>
        <div className="info">
          {this.renderPossibleChords()}
          {this.renderNotesPressed()}
        </div>
        <div className="piano">
          {this.renderPiano()}
        </div>
      </Fragment>
    );
  }
}

export default Piano;
