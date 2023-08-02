import ICON_MAP from './iconMap.js';
import notes, { addNote, archiveNote, deleteNote, editNote } from './createNote.js';

const DATE_FORMATTER = new Intl.DateTimeFormat();
const notesContainer = document.querySelector('#notes-container');
const summaryContainer = document.querySelector('#summary-container');
const noteRowTemplate = document.querySelector('#note-row-template');
const summaryRowTemplate = document.querySelector('#summary-row-template');
const noteForm = document.querySelector('#new-note-form');
const modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
const createNoteBtn = document.querySelector('#create-note');
const createBtn = document.querySelector('#add-note-btn');
const saveBtn = document.querySelector('#save-note-btn');

createNoteBtn.addEventListener('click', () => {
  cleanForm();
  createBtn.classList.remove('d-none');
  saveBtn.classList.add('d-none');
});

noteForm.addEventListener('submit', (e) => {
  const isSuccessful = addNote(e);
  if (isSuccessful) {
    renderNote(notes.at(-1));
    renderSummaryTable();
    cleanForm();
    modal.hide();
  }
});

saveBtn.addEventListener('click', (e) => {
  const isSuccessful = editNote(noteForm);
  if (isSuccessful) {
    cleanForm();
    renderNotes();
    renderSummaryTable();
    modal.hide();
  }
  saveBtn.classList.add('d-none');
});

function renderNotes() {
  notesContainer.innerHTML = '';
  notes.forEach((note, index) => renderNote(note, index));
  addEventListeners();
}

function renderNote(note, index, container = null, isCollapsed = false) {
  if (note.archived && !isCollapsed) return;
  console.log(note.content, index);

  const localContainer = container || notesContainer;

  const currIndex = index == null ? notes.length - 1 : index;
  const element = noteRowTemplate.content.cloneNode(true);
  const rowElement = element.querySelector('tr');
  console.log(note.content, currIndex);

  if (isCollapsed) {
    rowElement.setAttribute('id', note.category.replace(' ', '-'));
    rowElement.classList.add('collapse');
  }
  setValue('name', note.name, { parent: element });
  setValue('created', DATE_FORMATTER.format(note.created), { parent: element });
  setValue('content', note.content, { parent: element });
  setValue('category', note.category, { parent: element });
  setValue('dates', note.dates, { parent: element });
  element.querySelector('[data-icon]').src = getIconUrl(note.category);

  const btns = document.createElement('td');
  btns.innerHTML = `<div class="control-btns clickable">
  <button class="control-btns__btn edit"  data-index=${currIndex} >
    <img class="control-btns__img" src="icons/edit.svg" alt="edit"  data-index=${currIndex} /></button
  ><button class="control-btns__btn archive"  data-index=${currIndex} >
    <img class="control-btns__img" src="icons/archive.svg" alt="archive"  data-index=${currIndex} />
  </button>
  <button class="control-btns__btn delete"  data-index=${currIndex}>
    <img class="control-btns__img" src="icons/delete.svg" alt="delete"  data-index=${currIndex} />
  </button>
</div>`;

  addListeners(btns);

  rowElement.insertAdjacentElement('beforeend', btns);
  localContainer.append(element);
}

function addEventListeners() {
  const controlBtns = document.querySelectorAll('.clickable');
  controlBtns.forEach(addListeners);
}

function setValue(selector, value, { parent = document } = {}, isCollapsed = false) {
  const element = parent.querySelector(`[data-${selector}]`);
  element.textContent = value;
  isCollapsed && element.setAttribute('colspan', '2');
}

function getIconUrl(category) {
  return `./icons/${ICON_MAP.get(category)}.svg`;
}

function cleanForm() {
  noteForm.querySelectorAll('[data-input]').forEach((item) => {
    item.classList.remove('is-valid', 'is-invalid');
    item.value = '';
    item.checked = false;
  });
}

function editNoteListener(e) {
  const index = e.target.dataset.index;
  const note = notes[index];
  console.log(index);
  noteForm.setAttribute('data-index', index);
  noteForm.querySelector('[data-name-input]').value = note.name;

  noteForm.querySelector('[data-category-input]').value = note.category;
  noteForm.querySelector('[data-content-input]').value = note.content;
  noteForm.querySelector('[data-archive-input]').value = note.archive;
  saveBtn.classList.remove('d-none');
  createBtn.classList.add('d-none');
  modal.show();
}

function addListeners(btns) {
  const edits = btns.querySelector('.edit');
  const archives = btns.querySelector('.archive');
  const deletes = btns.querySelector('.delete');
  edits.addEventListener('click', editNoteListener);
  archives.addEventListener('click', archiveNoteListener);
  deletes.addEventListener('click', deleteNoteListener);
}

function archiveNoteListener(e) {
  e.preventDefault();
  e.stopPropagation();
  archiveNote(e.target.dataset.index);
  renderNotes();
  renderSummaryTable();
}

function deleteNoteListener(e) {
  e.preventDefault();
  e.stopPropagation();
  deleteNote(e.target.dataset.index);
  renderNotes();
  renderSummaryTable();
}

function prepareData(notes) {
  const summaryData = {};
  for (let i = 0; i < notes.length; i++) {
    const currNote = notes[i];
    if (!summaryData[currNote.category]) {
      summaryData[currNote.category] = { archived: 0, active: 0 };
    }
    currNote.archived
      ? (summaryData[currNote.category].archived += 1)
      : (summaryData[currNote.category].active += 1);
  }
  return summaryData;
}

function renderSummaryTable() {
  summaryContainer.innerHTML = '';
  const summaryData = prepareData(notes);

  for (let category in summaryData) {
    renderSummaryRow(category, summaryData[category]);
  }
}

function renderSummaryRow(category, data) {
  const element = summaryRowTemplate.content.cloneNode(true);
  setValue('category', category, { parent: element });
  setValue('archived', data.archived, { parent: element });
  setValue('active', data.active, { parent: element }, true);
  element.querySelector('[data-icon]').src = getIconUrl(category);
  element.querySelector('.category-container').setAttribute('colspan', '2');
  element
    .querySelector('[data-bs-target]')
    .setAttribute('data-bs-target', `#${category.replace(' ', '-')}`);
  summaryContainer.append(element);
  notes.forEach((note, index) => {
    if (note.category === category && note.archived) {
      renderNote(note, index, summaryContainer, true);
    }
  });
}

renderNotes();
renderSummaryTable();
