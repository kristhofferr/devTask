const STORAGE_KEY = 'devtask_tasks';

let tasks = load();
let currentFilter = 'all';

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const statsText = document.getElementById('stats-text');
const clearDoneBtn = document.getElementById('clear-done');
const filterBtns = document.querySelectorAll('.filter-btn');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTask(text);
  input.value = '';
  input.focus();
});

clearDoneBtn.addEventListener('click', () => {
  tasks = tasks.filter((t) => !t.done);
  save();
  render();
});

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  });
});

function addTask(text) {
  tasks.unshift({ id: Date.now(), text, done: false });
  save();
  render();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) task.done = !task.done;
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  save();
  render();
}

function filtered() {
  if (currentFilter === 'pending') return tasks.filter((t) => !t.done);
  if (currentFilter === 'done') return tasks.filter((t) => t.done);
  return tasks;
}

function render() {
  const visible = filtered();
  list.innerHTML = '';

  if (visible.length === 0) {
    list.innerHTML = '<li class="empty-state">Nenhuma tarefa aqui.</li>';
  } else {
    visible.forEach((task) => {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.done ? ' done' : '');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-checkbox';
      checkbox.checked = task.done;
      checkbox.addEventListener('change', () => toggleTask(task.id));

      const span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = task.text;

      const del = document.createElement('button');
      del.className = 'delete-btn';
      del.textContent = '×';
      del.setAttribute('aria-label', 'Deletar tarefa');
      del.addEventListener('click', () => deleteTask(task.id));

      li.append(checkbox, span, del);
      list.appendChild(li);
    });
  }

  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  statsText.textContent = `${done} de ${total} concluída${total !== 1 ? 's' : ''}`;
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

render();
