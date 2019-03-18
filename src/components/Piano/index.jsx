// https://www.scales-chords.com/chord/piano/Bdim
import { chord } from "tonal-detect"
import React, { Component, Fragment } from 'react';
// import * as R from 'ramda';
import webmidi from 'webmidi';
import classNames from 'classnames';
import config, { env } from '../../config';
import './Piano.scss';

const createNoteId = event => event.note.name + event.note.octave;

const findControllerByName = (controllers, name) =>
  [...controllers]
    .find(controller => controller.name.toLowerCase().includes(name.toLowerCase()));

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
        const device = findControllerByName(webmidi.inputs, 'APC');
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
    const { notes } = this.state;

    if (!notes.length) {
      return;
    }

    const noteNames = notes.map(({ name }) => name);

    return (
      <div className="possible-chords">
        {`Possible Chords: ${chord(noteNames).join(', ')}`}
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
