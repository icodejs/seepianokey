import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import webmidi from 'webmidi';
import classNames from 'classnames';
import { toMidi } from '@tonaljs/midi';

import DeviceSelection from '../../components/DeviceSelection';

import { getDevice, setDeviceOctaves } from '../../client/localStorage';
import { flatNotes, octavesOptions, notesAreEqual } from '../../config';
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
      midiInputs: [],
    };
  }

  componentDidMount() {
    webmidi.enable(err => {
      if (!err) {
        this.props.setWebMidiSupported({ webMidiSupported: true });

        this.setState({
          midiInputs: [...webmidi.inputs],
        });
      }
    });
  }

  componentDidUpdate() {
    const { deviceSet } = this.state;
    const { selectedDevice } = this.props;
    const { input: midiInputDevice } = selectedDevice;

    if (midiInputDevice && !deviceSet) {
      this.setState({ deviceSet: true }, () => {
        midiInputDevice.addListener('noteon', 'all', this.handleNoteOn);
        midiInputDevice.addListener('noteoff', 'all', this.handleNoteOff);
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
    const { selectedDevice } = this.props;
    const { input: midiInputDevice } = selectedDevice;

    if (midiInputDevice) {
      midiInputDevice.removeListener('noteon', 'all', this.handleNoteOn);
      midiInputDevice.removeListener('noteoff', 'all', this.handleNoteOff);
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

  handleDeviceSelection = ({ selectedDevice }) => {
    this.props.selectMidiController({ selectedDevice });
  };

  handleNoteOn = e => {
    const note = parseNote(e);
    this.props.onNoteOn(note);
  };

  handleNoteOff = e => {
    const note = parseNote(e);
    this.props.onNoteOff(note);
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
    const { selectedDevice } = this.props;
    const { midiInputs } = this.state;
    return (
      <DeviceSelection
        {...{
          midiInputs,
          selectedDevice,
          onDeviceSelection: this.handleDeviceSelection,
        }}
      />
    );
  };

  renderNote = pianoOctave => (k, noteIndex) => {
    const { notesPressed, guideNotes } = this.props;
    const note = flatNotes[noteIndex];
    const id = `${note}_${pianoOctave}`;
    const selected = notesPressed.find(({ name, octave }) => {
      return notesAreEqual(name, note) && octave === pianoOctave;
    });

    const scaleGuideNote = guideNotes.scale.find((n, i) => {
      const [noteName, noteOctave] = n.split(/(\d)/).filter(a => a);

      return (
        notesAreEqual(noteName, note) &&
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
    if (!this.props.webMidiSupported) {
      return <div className="error">WebMidi is not supported</div>;
    }

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
  selectedDevice: PropTypes.object,
  selectedLessonType: PropTypes.string,
  selectMidiController: PropTypes.func.isRequired,
  setWebMidiSupported: PropTypes.func.isRequired,
  webMidiSupported: PropTypes.bool.isRequired,
};

Piano.defaultProps = {
  notesPressed: [],
  guideNotes: { scale: [], chord: [] },
  onNoteClick: () => {},
  selectedDevice: {},
};

export default Piano;
