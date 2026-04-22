
const input = document.getElementById('todo-input');
const addbtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');
const search = document.getElementById('search');
const counter = document.getElementById('counter');
const empty = document.getElementById('empty');
const filters = document.querySelectorAll('[data-filter]');
const themeBtn = document.getElementById('theme-toggle');


let todos = JSON.parse(localStorage.getItem('todo')) || [];
let currentFilter = 'all';
let searchText = "";


function savetodo() {
  localStorage.setItem('todo', JSON.stringify(todos));
}


function createTodoNode(item, index) {
  const li = document.createElement('li');

  if (item.completed) li.classList.add("completed");

  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = item.completed;

  checkbox.onchange = () => {
    item.completed = checkbox.checked;
    render();
    savetodo();
  };

  
  const span = document.createElement('span');
  span.textContent = item.text;

  span.ondblclick = () => {
    const inputEdit = document.createElement('input');
    inputEdit.value = item.text;

    inputEdit.onblur = () => {
      item.text = inputEdit.value;
      render();
      savetodo();
    };

    li.replaceChild(inputEdit, span);
    inputEdit.focus();
  };

  
  const del = document.createElement('button');
  del.textContent = "DELETE";

  del.onclick = () => {
    todos.splice(index, 1);
    render();
    savetodo();
  };

  li.append(checkbox, span, del);
  return li;
}

function render() {
  list.innerHTML = '';

  let filtered = todos.filter(t => {
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    return true;
  });

  filtered = filtered.filter(t =>
    t.text.toLowerCase().includes(searchText.toLowerCase())
  );

  filtered.forEach((item, index) => {
    list.appendChild(createTodoNode(item, index));
  });

  
  const done = todos.filter(t => t.completed).length;
  counter.textContent = `${done} / ${todos.length} completed`;


  empty.style.display = todos.length === 0 ? 'block' : 'none';
}


function addtodo() {
  if (!input.value.trim()) return;

  todos.push({ text: input.value, completed: false });
  input.value = '';
  render();
  savetodo();
}

addbtn.onclick = addtodo;

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') addtodo();
});

search.oninput = e => {
  searchText = e.target.value;
  render();
};

filters.forEach(btn => {
  btn.onclick = () => {
    currentFilter = btn.dataset.filter;
    render();
  };
});


themeBtn.onclick = () => {
  document.body.classList.toggle('dark');
};

render();