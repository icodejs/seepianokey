import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';

import Piano from '../../components/Piano';
import Display from '../../components/Display';
import LessonSelector from '../../components/LessonSelector';
import { getChordGuideNotes } from '../../lessons/utils';

import './Lessons.scss';

const getSelectedItem = items => items.find(({ selected }) => selected);
const gameInfo = game =>
  `${game.tonic} ${game.lessonType} ${
    game.progression.name
  } ${game.status.toUpperCase()}`;

class Lessons extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    this.props.registerNotePressed({
      note,
    });
  };

  handleOnNoteOff = note => {
    // console.log('Note off', note);
    this.props.registerNoteReleased({
      note,
    });
  };

  handleNoteClick(noteClicked) {
    console.log('note mouse click', noteClicked);
  }

  handleStartGameClick = event => {
    event.preventDefault();

    const {
      tonic,
      selectedLessonType,
      chordProgressions,
      startGame,
      chords,
      scales,
      defaultNumberOfNotesInChord,
    } = this.props;

    startGame({
      tonic,
      selectedLessonType,
      selectedChordProgression: getSelectedItem(chordProgressions),
      chords: chords[tonic],
      scale: scales[tonic],
      numberOfNotesInChord: defaultNumberOfNotesInChord,
    });
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
    const { games } = this.props;
    const [game = {}] = [...games].reverse();

    if (!games.length) {
      return;
    }

    return (
      <Fragment>
        <p>Current game: {gameInfo(game)}</p>
      </Fragment>
    );
  }

  renderGameInformation() {
    const { games } = this.props;
    return (
      <ul className="game-information">
        {games.map((game, index) => {
          return (
            <li key={game.id}>Game {`${index + 1}. ${gameInfo(game)}`}</li>
          );
        })}
      </ul>
    );
  }

  renderPiano() {
    const { showGuideNotes } = this.state;
    const { notesPressed, defaultOctave, games } = this.props;
    const [game = {}] = [...games].reverse();

    // move this logic to reducer
    const chordNotes = getChordGuideNotes({
      chordProgression: R.pathOr([], ['progression'], game),
      chords: R.pathOr([], ['chords'], game),
      interval: R.pathOr([], ['answers'], game).length,
      octave: defaultOctave,
    });

    return (
      <Piano
        onNoteOn={this.handleOnNoteOn}
        onNoteOff={this.handleOnNoteOff}
        notesPressed={notesPressed}
        guideNotes={
          showGuideNotes
            ? {
                scale: R.pathOr([], ['scale', 'notes'], game),
                chord: chordNotes,
              }
            : null
        }
        onNoteClick={this.handleNoteClick}
      />
    );
  }

  render() {
    const { tonic, tonics } = this.props;
    const displayRows = [this.renderChordTestInformation()];

    return (
      <div className="Lessons">
        <div className="lesson-options">
          <LessonSelector
            lessons={tonics}
            onLessonSelection={this.handleTonicSelection}
            selectedValue={tonic}
          />
          {this.renderChordProgressionSelector()}
          <button
            className="start-game"
            type="button"
            onClick={this.handleStartGameClick}
          >
            Start Game
          </button>
        </div>

        {this.renderGameInformation()}

        <Display rows={displayRows} />

        {this.renderPiano()}
      </div>
    );
  }
}

Lessons.propTypes = {
  chordProgressions: PropTypes.array.isRequired,
  chords: PropTypes.object.isRequired,
  defaultNumberOfNotesInChord: PropTypes.number.isRequired,
  registerNotePressed: PropTypes.func.isRequired,
  registerNoteReleased: PropTypes.func.isRequired,
  scales: PropTypes.object.isRequired,
  selectChordProgression: PropTypes.func.isRequired,
  selectedLessonType: PropTypes.string,
  startGame: PropTypes.func.isRequired,
  tonic: PropTypes.string.isRequired,
  tonics: PropTypes.array.isRequired,
  notesPressed: PropTypes.array.isRequired,
  lessonInProgress: PropTypes.bool.isRequired,
};

Lessons.defaultProps = {
  selectedLessonType: 'Chord',
};

export default Lessons;
