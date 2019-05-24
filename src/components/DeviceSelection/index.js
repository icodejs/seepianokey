import React, { Component } from 'react';
import webmidi from 'webmidi';

import './DeviceSelection.scss';

class DeviceSelection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDeviceName: 'APC Key 25'
    };
  }

  componentDidMount() {
    this.props.onReceivedMidiInputs([...webmidi.inputs]);
    this.setDevice(this.state.selectedDeviceName);
  }

  setDevice(selectedDeviceName) {
    const input = webmidi.getInputByName(selectedDeviceName);
    const output = webmidi.getOutputByName(selectedDeviceName);
    this.props.onDeviceSelection({ input, output });
  }

  handleDeviceSelection = event => {
    const { value: selectedDeviceName } = event.target;
    this.setState({ selectedDeviceName });
    this.setDevice(selectedDeviceName);

    // changing the midi device should remove listener from the prev device
  };

  render() {
    if (!this.props.midiInputs) {
      return <div className="device-selection">No Midi devices found.</div>;
    }

    return (
      <form className="device-selection">
        <label>
          <select
            value={this.state.selectedDeviceName}
            onChange={this.handleDeviceSelection}
          >
            <option value="-1">Choose device</option>
            {this.props.midiInputs.map(input => {
              return (
                <option key={input.id} value={input.name}>
                  {`${input.manufacturer} ${input.name}`}
                </option>
              );
            })}
          </select>
        </label>
      </form>
    );
  }
}

export default DeviceSelection;
