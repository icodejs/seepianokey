import React, { Component } from 'react';
import scalesLesson from '../../lessons/scales';

export default class Scales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLesson: scalesLesson(),
      completed: false,
    };
  }

  render() {
    const { notes } = this.props;
    const lastNotePressed = notes.reverse().map(({ name }) => name)[0];

    return (
      <div>{lastNotePressed}</div>
    );
  }
}
