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
    // notesPressed,
  },
}) => ({
  chordProgressions,
  chords,
  defaultOctave,
  defaultNumberOfNotesInChord,
  scales,
  selectedLessonType,
  tonic,
  tonics,
  // notesPressed,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Lessons);
