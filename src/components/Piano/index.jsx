// https://www.scales-chords.com/chord/piano/Bdim
import { chord } from "tonal-detect"
import React, { Component, Fragment } from 'react';
// import * as R from 'ramda';
import webmidi from 'webmidi';
import classNames from 'classnames';
import { scaleLesson } from '../../lessons/c-major';
import { env, notes } from '../../config';
import './Piano.scss';

const cScaleLesson = scaleLesson();
const createNoteId = event => event.note.name + event.note.octave;

const findControllerByName = (controllers, name) =>
  [...controllers]
    .find(controller => controller.name.toLowerCase().includes(name.toLowerCase()));

class Piano extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      lesson: {}
    };
  }

  componentDidMount() {
    this.setupMidi();
  }

  onNoteOn = e => {
    const note = {
      id: createNoteId(e),
      midiNote: e.note.number,
      rawVelocity: e.rawVelocity,
      ...e.note
    };

    this.setState({
      notes: [...this.state.notes, note].sort(
        (a, b) => a.midiNote - b.midiNote
      ),
      lesson: cScaleLesson(note.name)
    });
  };

  onNoteOff = e => {
    const noteId = createNoteId(e);
    this.setState({
      notes: this.state.notes.filter(({ id }) => id !== noteId)
    });
  };

  setupKeyListeners(input) {
    input.addListener('noteon', 'all', this.onNoteOn);
    input.addListener('noteoff', 'all', this.onNoteOff);
  }

  setupMidi() {
    webmidi.enable(err => {
      if (err) {
        console.log('WebMidi could not be enabled.', err);
      } else {
        const device = findControllerByName(
          webmidi.inputs,
          env.DEFAULT_CONTROLLER
        );

        if (!device) {
          return console.log('No MIDI device found.');
        }

        const { name } = device;
        const input = webmidi.getInputByName(name);
        this.setupKeyListeners(input);
      }
    });
  }

  renderLesson() {
    const { correct, progress, complete } = this.state.lesson;
    return (
      <div>
        <h3>C Scale Lesson</h3>
        <div>{complete ? 'Scale completed' : progress}</div>
        {/* !correct ? <div>Incorrect key</div> : null */}
      </div>
    );
  }

  renderNotesPressed() {
    return this.state.notes.map(({ name }, index) => (
      <div className="notes-pressed" key={index}>
        {name}
      </div>
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
            const note = notes[index];
            const selected = this.state.notes.find(({ name, octave }) => {
              return name === note && octave === pianoOctave;
            });

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
          {this.renderLesson()}
        </div>
        <div className="piano">{this.renderPiano()}</div>
      </Fragment>
    );
  }
}

export default Piano;
