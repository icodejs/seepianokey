import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { flatNotes, flatToSharp, octavesOptions } from '../../config';
import './Piano.scss';

class Piano extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceSet: false,
      keyboardKeys: 2,
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

  handleKeyboardKeysSelection = event => {
    const { value: keyboardKeys } = event.target;
    this.setState({ keyboardKeys: parseInt(keyboardKeys, 10) });
  };

  renderKeyboardKeysSelector() {
    const { keyboardKeys } = this.state;
    return (
      <form className="octave-selector">
        <label>
          <select
            value={keyboardKeys}
            onChange={this.handleKeyboardKeysSelection}
          >
            {octavesOptions.map(({ keys, octaves }) => {
              return (
                <option key={octaves} value={octaves}>
                  {`${keys}-key keyboard`}
                </option>
              );
            })}
          </select>
        </label>
      </form>
    )
  }

  renderNote = (pianoOctave) => (k, noteIndex) => {
    const { onNoteClick, notesPressed } = this.props;
    const note = flatNotes[noteIndex];
    const selected = notesPressed.find(({
      name,
      octave
    }) => {
      return name === flatToSharp(note) && octave === pianoOctave;
    });
    const noteId = `${note}_${pianoOctave}`;

    return (
      <li
        key={noteId}
        onClick={(e) => onNoteClick(noteId)}
        className={classNames(noteId, { selected })}
      />
    );
  }

  renderPiano() {
    const { keyboardKeys } = this.state;
    return [...Array(keyboardKeys)].map((o, index) => {
      const startingOctave = 3;
      const keysPerOctave = 12;
      const pianoOctave = index + startingOctave;

      return (
        <ul
          key={`octave-${pianoOctave}`}
          className={`octave-${pianoOctave}`}
        >
          {[...Array(keysPerOctave)].map(this.renderNote(pianoOctave))}
        </ul>
      );
    });
  }

  render() {
    return (
      <Fragment>
        {this.renderKeyboardKeysSelector()}
        <div className="piano">
          {this.renderPiano()}
        </div>
      </Fragment>
    );
  }
}

export default Piano;
