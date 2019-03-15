import React from 'react';
import webmidi from 'webmidi';

const midiTest = () => {
  webmidi.enable(function(err) {
    if (err) {
      console.log('WebMidi could not be enabled.', err);
    } else {

      const [device] = webmidi.inputs;
      const { id, name } = device;
      const input = webmidi.getInputByName(name);

      input.addListener('noteon', "all",
        function (e) {
          console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
          console.log(e.timestamp);
        }
      );

      input.addListener('noteoff', 'all', function(e) {
        console.log("Received 'noteoff' message (" + e.note.name + e.note.octave + ").");
        console.log(e.timestamp);
      });
    }
  });
}

export default () => {
  midiTest();
  return (
    <div>Home code</div>
  )
};
