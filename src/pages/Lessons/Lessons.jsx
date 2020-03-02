import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Piano from '../../components/Piano';
import Display from '../../components/Display';
import LessonSelector from '../../components/LessonSelector';
import { addNote, removeNote } from '../../utils/notes';
import { progressionTest } from '../../lessons/utils';

import './Lessons.scss';

const getChordGuideNotes = ({
  chordProgression,
  chordsInKey,
  interval,
  octave,
}) => {
  if (interval > 2) {
    return [];
  }

  const chordFound = chordsInKey.find(
    chord => chord.scaleDegree === chordProgression.numericIntervals[interval],
  );
  return chordFound ? chordFound.notes.map(key => key + octave) : [];
};

let currentProgressionTest = [];

class Lessons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notesPressed: [],
      displayText: '',
      showGuideNotes: true,
    };
  }

  handleTonicSelection = event => {
    const { value: tonic } = event.target;
    this.props.selectTonic({ tonic });
  };

  handleChordProgressionSelection = event => {
    const { value: selectedProgression } = event.target;
    this.props.selectChordProgression({ id: selectedProgression });
  };

  handleOnNoteOn = note => {
    // console.log('Note on', note);
    this.setState({
      notesPressed: addNote(this.state.notesPressed)(note),
    });
  };

  handleOnNoteOff = note => {
    // console.log('Note off', note);
    this.setState({
      notesPressed: removeNote(this.state.notesPressed)(note.id),
    });
  };

  handleNoteClick(noteClicked) {
    console.log('note mouse click', noteClicked);
  }

  handleStartGameClick = event => {
    event.preventDefault();
    const { tonic } = this.props;
    this.props.startGame({ tonic, lessonType: 'Chord' });
  };

  renderChordProgressionSelector = () => {
    const { chordProgressions } = this.props;
    const selectedChordProgression = chordProgressions.find(
      ({ selected }) => selected,
    ) || { id: -1 };

    return (
      <form className="chord-progression-selector">
        <label>
          <select
            value={selectedChordProgression.id}
            onChange={this.handleChordProgressionSelection}
          >
            <option value="-1">Choose progression</option>
            {chordProgressions.map(({ name, id }) => {
              return (
                <option key={id} value={id}>
                  {name}
                </option>
              );
            })}
          </select>
        </label>
      </form>
    );
  };

  renderChordTestInformation() {
    const { notesPressed } = this.state;
    const { tonic, chords, chordProgressions } = this.props;

    // NOTE: USE STATE TO HANDLE INSTRUCTION / PROGRESS
    const testResults = progressionTest(
      {
        notesPressed,
        tonic,
        lesson: chordProgressions[0],
        chordsInKey: chords[tonic],
        currentProgressionTest,
      },
      (matchedChord, completed) => {
        if (completed) {
          currentProgressionTest = [];
        }
        currentProgressionTest.push(matchedChord);
      },
    );

    return (
      <Fragment>
        <p>{testResults}</p>
      </Fragment>
    );
  }

  render() {
    const {
      tonic,
      tonics,
      scales,
      chords,
      chordProgressions,
      defaultOctave,
    } = this.props;
    const { notesPressed, showGuideNotes } = this.state;
    const displayRows = [this.renderChordTestInformation()];
    const scaleNotes = scales[tonic].notes;
    const chordNotes = getChordGuideNotes({
      chordProgression: chordProgressions[0],
      chordsInKey: chords[tonic],
      interval: currentProgressionTest.length,
      octave: defaultOctave,
    });

    return (
      <div className="Lessons">
        <div className="lesson-options">
          <LessonSelector
            lessons={tonics}
            onLessonSelection={this.handleTonicSelection}
            selectedValue={tonic}
          />
          {this.renderChordProgressionSelector()}
          <button type="button" onClick={this.handleStartGameClick}>
            Start Game
          </button>
        </div>

        <Display rows={displayRows} />

        <Piano
          onNoteOn={this.handleOnNoteOn}
          onNoteOff={this.handleOnNoteOff}
          notesPressed={notesPressed}
          guideNotes={
            showGuideNotes ? { scale: scaleNotes, chord: chordNotes } : null
          }
          onNoteClick={this.handleNoteClick}
        />
      </div>
    );
  }
}

Lessons.propTypes = {
  chords: PropTypes.object.isRequired,
  scales: PropTypes.object.isRequired,
  startGame: PropTypes.func.isRequired,
  selectChordProgression: PropTypes.func.isRequired,
  tonic: PropTypes.string.isRequired,
  tonics: PropTypes.array.isRequired,
  chordProgressions: PropTypes.array.isRequired,
  selectedLessonType: PropTypes.string,
};

Lessons.defaultProps = {
  selectedLessonType: 'Chord',
};

export default Lessons;
