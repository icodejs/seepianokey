import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Home from './Home';
import * as actions from '../../common/actions'

const mapStateToProps = ({ selectedDeviceName, webMidiSupported }) => ({
  selectedDeviceName,
  webMidiSupported,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
