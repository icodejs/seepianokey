// Provide various ways to select the note you are interested in
// e.g. radio or drop down

import React, { Component } from 'react';
import { notes } from '../../config';

import './NoteSelector.scss';

class DeviceSelection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      noteSelected: '',
    };
  }


  handleNoteSelected = event => {
    const { value: noteSelected } = event.target;
    this.setState({ noteSelected });
    this.props.onNoteSelected(noteSelected);
  };

  render() {
    return (
      <form className="note-selector">
        <label>
          <select
            value={this.state.noteSelected}
            onChange={this.handleNoteSelected}
          >
            {notes.map(note => {
              return (
                <option key={note} value={note}>
                  {note}
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

