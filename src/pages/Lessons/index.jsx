import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Lessons from './Lessons';
import * as actions from '../../common/actions';

const mapStateToProps = ({
  selectedDevice,
  webMidiSupported,
  tonics,
  tonic,
  chords,
  chordProgressions,
}) => ({
  selectedDevice,
  webMidiSupported,
  tonics,
  tonic,
  chords,
  chordProgressions,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Lessons);
