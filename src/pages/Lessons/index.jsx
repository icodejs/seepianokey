import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Lessons from './Lessons';
import * as actions from '../../common/actions';

const mapStateToProps = ({
  lesson: {
    chordProgressions,
    chords,
    defaultOctave,
    scales,
    selectedLessonType,
    tonic,
    tonics,
    selectChordProgression,
  },
}) => ({
  chordProgressions,
  chords,
  defaultOctave,
  scales,
  selectedLessonType,
  tonic,
  tonics,
  selectChordProgression,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Lessons);
