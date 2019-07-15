import React, { Component } from 'react';
import PropTypes from 'prop-types';
import webmidi from 'webmidi';

import './DeviceSelection.scss';

class DeviceSelection extends Component {
  handleDeviceSelection = event => {
    const { value: name } = event.target;
    const input = webmidi.getInputByName(name);
    const output = webmidi.getOutputByName(name);

    this.props.onDeviceSelection({ selectedDevice: { input, output, name } });
    // changing the midi device should remove listener from the prev device
  };

  render() {
    const { midiInputs } = this.props;

    if (midiInputs && midiInputs.length === 0) {
      return <div className="device-selection">No Midi devices found.</div>;
    }

    return (
      <form className="device-selection">
        <label>
          <select
            value={this.props.selectedDevice.name}
            onChange={this.handleDeviceSelection}
          >
            <option value="-1">Choose device</option>
            {this.props.midiInputs.map(({ id, manufacturer, name }) => {
              return (
                <option key={id} value={name}>
                  {`${manufacturer} ${name}`}
                </option>
              );
            })}
          </select>
        </label>
      </form>
    );
  }
}

DeviceSelection.propTypes = {
  onDeviceSelection: PropTypes.func.isRequired,
  selectedDevice: PropTypes.object,
  midiInputs: PropTypes.array,
};

DeviceSelection.defaultProps = {
  midiInputs: [],
  selectedDevice: {},
};

export default DeviceSelection;
