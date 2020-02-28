import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Lessons from './Lessons';
import * as actions from '../../common/actions';

const mapStateToProps = ({
  lesson: {
    chordProgressions,
    chords,
    defaultOctave,
    lessonTypes,
    scales,
    selectedLessonType,
    tonic,
    tonics,
  },
}) => ({
  chordProgressions,
  chords,
  defaultOctave,
  lessonTypes,
  scales,
  selectedLessonType,
  tonic,
  tonics,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Lessons);
