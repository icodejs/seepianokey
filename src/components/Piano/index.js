import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Piano from './Piano';
import * as actions from '../../common/actions';

const mapStateToProps = ({
  app: { numberOfKeyboardOctaves, selectedDevice, webMidiSupported },
}) => ({
  numberOfKeyboardOctaves,
  selectedDevice,
  webMidiSupported,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Piano);
