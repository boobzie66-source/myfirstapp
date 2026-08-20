
const taskForm = document.getElementById('taskForm');
const input = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const emptyState = document.getElementById('emptyState');
const clearCompleted = document.getElementById('clearCompleted');
const filterButtons = document.querySelectorAll('[data-filter]');

let tasks = JSON.parse(localStorage.getItem('todoTasks') || '[]');
let currentFilter = 'all';

function saveTasks() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

function updateTaskSummary() {
    const count = tasks.filter((task) => !task.completed).length;
    taskCount.textContent = `${count} ${count === 1 ? 'task' : 'tasks'} left`;
}

function renderTasks() {
    taskList.replaceChildren();

    const visibleTasks = tasks.filter((task) => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    visibleTasks.forEach((task) => {
        const item = document.createElement('li');
        item.className = `task-item${task.completed ? ' completed' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', `Mark ${task.text} complete`);
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const text = document.createElement('span');
        text.className = 'task-text';
        text.textContent = task.text;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.type = 'button';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            tasks = tasks.filter((candidate) => candidate.id !== task.id);
            saveTasks();
            renderTasks();
        });

        item.append(checkbox, text, deleteButton);
        taskList.appendChild(item);
    });

    emptyState.hidden = visibleTasks.length > 0;
    updateTaskSummary();
}

function addTask() {
    const task = input.value.trim();

    if (task === '') return;

    tasks.push({
        id: Date.now().toString(),
        text: task,
        completed: false
    });
    saveTasks();
    renderTasks();
    input.value = '';
    input.focus();
}

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addTask();
});

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        currentFilter = button.dataset.filter;
        filterButtons.forEach((filterButton) => filterButton.classList.remove('active'));
        button.classList.add('active');
        renderTasks();
    });
});

clearCompleted.addEventListener('click', () => {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks();
});

renderTasks();

