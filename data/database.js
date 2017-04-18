export class Note {}
export class User {}

const mockUserID = 'AG';

const viewer = new User();
viewer.id = mockUserID;
viewer.name = 'AG';
const users = {
  [mockUserID]: viewer,
};

const notes = {};
const notesByUser = {
  [mockUserID]: [],
};
let nextNoteId = 0;
addNote('Remember to add a first entry', 1492338693);
addNote('Have to add another entry here', 1492511494);

export function addNote(message, created) {
  const note = new Note();
  note.id = `${nextNoteId++}`;
  note.message = message;
  note.created = created;
  notes[note.id] = note;
  notesByUser[mockUserID].push(note.id);
  return note.id;
}

export function getNote(id) {
  return notes[id];
}

export function getNotes() {
  return notesByUser[mockUserID].map(id => notes[id]);
}

export function getUser(id) {
  return users[id];
}

export function getViewer() {
  return getUser(mockUserID);
}

export function deleteNote(id) {
  const noteIndex = notesByUser[mockUserID].indexOf(id);
  if (noteIndex !== -1) {
    notesByUser[mockUserID].splice(noteIndex, 1);
  }
  delete notes[id];
}

export function editNote(id, message) {
  const note = getNote(id);
  note.message = message;
}
