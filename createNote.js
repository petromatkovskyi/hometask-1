import getRandomId from './getRandomId.js';

const notes = [
  {
    name: 'Shopping',
    category: 'Task',
    content: 'Buy a milk',
    created: new Date('2022-5-3'),
    noteId: getRandomId(),
    archived: false,
    dates: '',
  },
  {
    name: 'Shower',
    category: 'Task',
    content: 'Take a shower',
    created: new Date('2023-5-7'),
    noteId: getRandomId(),
    archived: false,
    dates: '',
  },
  {
    name: 'Appointment',
    category: 'Random Thought',
    content: 'Some another content on content 3',
    created: new Date('2021-5-16'),
    noteId: getRandomId(),
    archived: true,
    dates: '',
  },
  {
    name: 'Appointment',
    category: 'Task',
    content: 'I have to go to the dentist on 5-3-2024',
    created: new Date('2021-5-25'),
    noteId: getRandomId(),
    archived: false,
    dates: '5-3-2024',
  },
  {
    name: 'Appointment',
    category: 'Random Thought',
    content: 'Some another content on content 4',
    created: new Date('2021-5-25'),
    noteId: getRandomId(),
    archived: false,
    dates: '',
  },
  {
    name: 'New type of car',
    category: 'Idea',
    content: 'Create car with coal engine',
    created: new Date('2021-5-25'),
    noteId: getRandomId(),
    archived: true,
    dates: '',
  },
  {
    name: 'Another life',
    category: 'Random Thought',
    content: 'Is there anything beyond the Earth?',
    created: new Date('2023-5-25'),
    noteId: getRandomId(),
    archived: true,
    dates: '',
  },
];

const DATE_REGEX =
  /((\d{4})(\/|-|.)(\d{1,2})(\/|-|.)(\d{1,2}))?((\d{1,2})(\/|-|.)(\d{1,2})(\/|-|.)(\d{4}))?/gm;

export function addNote(e) {
  e.preventDefault();
  const needsValidate = Array.from(e.target.querySelectorAll('.needs-validation'));
  const noteData = Array.from(e.target);
  const isFormValid = needsValidate.reduce(
    (isValid, item) => (checkIsValid(item) ? isValid : false),
    true
  );

  if (isFormValid) {
    const datesStr = needsValidate[1].value
      .match(DATE_REGEX)
      .filter((item) => !!item)
      .join(', ');
    const note = {
      name: noteData[0].value,
      content: noteData[1].value,
      category: noteData[2].value,
      dates: datesStr,
      created: new Date(),
      noteId: getRandomId(),
      archived: noteData[3].checked,
    };
    console.log(note);
    notes.push(note);
    return true;
  }
  return false;
}

export function editNote(noteForm) {
  const index = noteForm.dataset.index;
  const prevNote = { ...notes[index] };
  let editedNoteFields;
  const needsValidate = Array.from(noteForm.querySelectorAll('.needs-validation'));
  const noteData = Array.from(noteForm.querySelectorAll('[data-input]'));
  const isFormValid = needsValidate.reduce(
    (isValid, item) => (checkIsValid(item) ? isValid : false),
    true
  );

  if (isFormValid) {
    const datesStr = needsValidate[1].value
      .match(DATE_REGEX)
      .filter((item) => !!item)
      .join(', ');

    editedNoteFields = {
      name: noteData[0].value,
      content: noteData[1].value,
      category: noteData[2].value,
      dates: datesStr,
      archived: noteData[3].checked,
    };
  }

  notes.splice(index, 1, { ...prevNote, ...editedNoteFields });

  return true;
}

export function archiveNote(index) {
  console.log(index);
  notes[index].archived = !notes[index].archived;
}

export function deleteNote(index) {
  notes.splice(index, 1);
}

function checkIsValid(item) {
  if (item.value) {
    item.classList.remove('is-invalid');

    item.classList.add('is-valid');
    return true;
  }
  item.classList.remove('is-valid');
  item.classList.add('is-invalid');
  return false;
}

export default notes;
