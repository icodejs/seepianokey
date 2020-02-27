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
    selectedDevice,
    selectedLessonType,
    tonic,
    tonics,
    webMidiSupported,
  },
}) => ({
  chordProgressions,
  chords,
  defaultOctave,
  lessonTypes,
  scales,
  selectedDevice,
  selectedLessonType,
  tonic,
  tonics,
  webMidiSupported,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Lessons);
