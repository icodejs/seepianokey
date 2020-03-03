import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Lessons from './Lessons';
import * as actions from '../../common/actions';

const mapStateToProps = ({
  lesson: {
    chordProgressions,
    chords,
    defaultOctave,
    defaultNumberOfNotesInChord,
    scales,
    selectedLessonType,
    tonic,
    tonics,
    notesPressed,
    lessonInProgress,
  },
  game: { games },
}) => ({
  chordProgressions,
  chords,
  defaultOctave,
  defaultNumberOfNotesInChord,
  scales,
  selectedLessonType,
  tonic,
  tonics,
  notesPressed,
  lessonInProgress,
  games,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Lessons);
