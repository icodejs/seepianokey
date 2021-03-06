export const addNote = notes => note =>
  [...notes, note].sort((a, b) => a.midiNote - b.midiNote);

export const removeNote = notes => ({ id }) =>
  notes.filter(({ id: noteId }) => noteId !== id);

export const containsNote = (notes, id) =>
  notes.some(({ id: noteId }) => noteId === id);
