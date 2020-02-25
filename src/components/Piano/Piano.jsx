import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { toMidi } from '@tonaljs/midi';

import DeviceSelection from '../../components/DeviceSelection';

import { getDevice, setDeviceOctaves } from '../../client/localStorage';
import { flatNotes, flatToSharp, octavesOptions } from '../../config';
import { addNote, removeNote, containsNote } from '../../utils/notes';
import './Piano.scss';

const KEYS_PER_OCTAVE = 12;

const createPianoKeyEvent = (note, pianoOctave) => {
  const id = note + pianoOctave;

  return {
    id,
    midiNote: toMidi(id),
    timestamp: new Date().getTime(),
    target: 'Mouse click',
    rawVelocity: 127,
    channel: 1,
    octave: pianoOctave,
    number: toMidi(id),
    name: note,
  };
};

const parseNote = event => ({
  id: event.note.name + event.note.octave,
  midiNote: event.note.number,
  rawVelocity: event.rawVelocity,
  timestamp: event.timestamp,
  target: event.target,
  channel: event.channel,
  ...event.note,
});

class Piano extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceSet: false,
      notesPressed: [],
    };
  }

  onNoteOn = e => {
    const note = parseNote(e);
    this.props.onNoteOn(note);
  };

  onNoteOff = e => {
    const note = parseNote(e);
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

      const { octaves } = getDevice();

      if (!octaves) {
        return;
      }

      this.props.selectNumberOfKeyboardOctaves({
        numberOfKeyboardOctaves: octaves,
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
    const { value: numberOfKeyboardOctaves } = event.target;
    const octaves = parseInt(numberOfKeyboardOctaves, 10);

    setDeviceOctaves(octaves);

    this.props.selectNumberOfKeyboardOctaves({
      numberOfKeyboardOctaves: octaves,
    });
  };

  handleNoteClicked = (note, pianoOctave) => e => {
    e.preventDefault();
    const event = createPianoKeyEvent(note, pianoOctave);
    this.toggleNote(event);
    this.props.onNoteClick(event);
  };

  toggleNote(note) {
    if (containsNote(this.state.notesPressed, note.id)) {
      this.props.onNoteOff(note);

      this.setState({
        notesPressed: removeNote(this.state.notesPressed)(note.id),
      });
    } else {
      this.props.onNoteOn(note);

      this.setState({
        notesPressed: addNote(this.state.notesPressed)(note),
      });
    }
  }

  renderKeyboardKeysSelector = () => (
    <form className="octave-selector">
      <label>
        <select
          value={this.props.numberOfKeyboardOctaves}
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
  );

  renderDeviceSelector = () => {
    const { midiInputs, handleDeviceSelection, selectedDevice } = this.props;
    return (
      <DeviceSelection
        {...{
          midiInputs,
          selectedDevice,
          onDeviceSelection: handleDeviceSelection,
        }}
      />
    );
  };

  renderNote = pianoOctave => (k, noteIndex) => {
    const { notesPressed, guideNotes } = this.props;
    const note = flatNotes[noteIndex];
    const id = `${note}_${pianoOctave}`;
    const selected = notesPressed.find(({ name, octave }) => {
      return flatToSharp(name) === flatToSharp(note) && octave === pianoOctave;
    });

    const scaleGuideNote = guideNotes.chord.find((n, i) => {
      const [noteName, noteOctave] = n.split(/(\d)/).filter(a => a);

      return (
        flatToSharp(noteName) === flatToSharp(note) &&
        parseInt(pianoOctave, 10) === parseInt(noteOctave, 10)
      );
    });

    return (
      <li
        key={id}
        onClick={this.handleNoteClicked(note, pianoOctave)}
        className={classNames(id, {
          selected,
          'scale-guide-note': scaleGuideNote,
        })}
      />
    );
  };

  renderPiano() {
    const { numberOfKeyboardOctaves } = this.props;
    const octavesOption = octavesOptions.find(
      ({ octaves }) => octaves === numberOfKeyboardOctaves,
    );

    return (
      <div className="piano">
        {[...Array(numberOfKeyboardOctaves)].map((o, index) => {
          const pianoOctave = index + octavesOption.startingOctave;

          return (
            <ul
              key={`octave-${pianoOctave}`}
              className={`octave-${pianoOctave}`}
            >
              {[...Array(KEYS_PER_OCTAVE)].map(this.renderNote(pianoOctave))}
            </ul>
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <Fragment>
        {this.renderDeviceSelector()}
        {this.renderKeyboardKeysSelector()}
        {this.renderPiano()}
      </Fragment>
    );
  }
}

Piano.propTypes = {
  onNoteOn: PropTypes.func.isRequired,
  onNoteOff: PropTypes.func.isRequired,
  numberOfKeyboardOctaves: PropTypes.number.isRequired,
  selectNumberOfKeyboardOctaves: PropTypes.func.isRequired,
  onNoteClick: PropTypes.func,
  midiInputDevice: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  notesPressed: PropTypes.arrayOf(PropTypes.object),
  guideNotes: PropTypes.shape({
    scale: PropTypes.array,
    chord: PropTypes.array,
  }),
};

Piano.defaultProps = {
  notesPressed: [],
  guideNotes: { scale: [], chord: [] },
  numberOfKeyboardOctaves: 2,
  onNoteClick: () => {},
};

export default Piano;
