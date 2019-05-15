import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { flatNotes, flatToSharp } from '../../config';
import './Piano.scss';

class Piano extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceSet: false
    };
  }

  parseNote(event) {
    return {
      id: event.note.name + event.note.octave,
      midiNote: event.note.number,
      rawVelocity: event.rawVelocity,
      ...event.note
    };
  }

  onNoteOn = e => {
    const note = this.parseNote(e);
    this.props.onNoteOn(note);
  };

  onNoteOff = e => {
    const note = this.parseNote(e);
    this.props.onNoteOff(note);
  };

  componentDidUpdate() {
    const { midiInputDevice } = this.props;
    const { deviceSet } = this.state;

    if (midiInputDevice && !deviceSet) {
      this.setState({ deviceSet: true }, () => {
        midiInputDevice.addListener('noteon', 'all', this.onNoteOn);
        midiInputDevice.addListener('noteoff', 'all', this.onNoteOff);
      });
    }
  }

  componentWillUnmount() {
    const { midiInputDevice } = this.props;

    if (midiInputDevice) {
      midiInputDevice.removeListener('noteon', 'all', this.onNoteOn);
      midiInputDevice.removeListener('noteoff', 'all', this.onNoteOff);
    }
  }

  renderPiano() {
    const octaves = 2;
    return [...Array(octaves)].map((o, index) => {
      const pianoOctave = index + 3;

      return (
        <ul key={`octave-${pianoOctave}`} className={`octave-${pianoOctave}`}>
          {[...Array(12)].map((k, noteIndex) => {
            const note = flatNotes[noteIndex];

            const selected = this.props.notesPressed.find(({ name, octave }) => {
              return name === flatToSharp(note) && octave === pianoOctave;
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
        <div className="piano">{this.renderPiano()}</div>
      </Fragment>
    );
  }
}

export default Piano;
