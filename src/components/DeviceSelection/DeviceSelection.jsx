import React, { Component } from 'react';
import PropTypes from 'prop-types';
import webmidi from 'webmidi';

import './DeviceSelection.scss';

class DeviceSelection extends Component {
  componentDidMount() {
    this.props.onReceivedMidiInputs([...webmidi.inputs]);
  }

  handleDeviceSelection = event => {
    const { value: selectedDeviceName } = event.target;
    const input = webmidi.getInputByName(selectedDeviceName);
    const output = webmidi.getOutputByName(selectedDeviceName);

    this.props.onDeviceSelection({ input, output, selectedDeviceName });

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
            value={this.props.selectedDeviceName}
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
  onReceivedMidiInputs: PropTypes.func.isRequired,
  onDeviceSelection: PropTypes.func.isRequired,
  midiInputs: PropTypes.array,
};

DeviceSelection.defaultProps = {
  midiInputs: [],
};

export default DeviceSelection;
