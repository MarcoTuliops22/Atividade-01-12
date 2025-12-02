document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const pendingTasksCounter = document.getElementById('pending-tasks-counter');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';


    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        let pendingCount = 0;

        tasks.forEach(task => {
            if (!task.completed) {
                pendingCount++;
            }

            
            if (currentFilter === 'pending' && task.completed) return;
            if (currentFilter === 'completed' && !task.completed) return;

            const li = document.createElement('li');
            li.className = `todo-item ${task.completed ? 'completed' : 'pending'}`;
            li.dataset.id = task.id;

            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleComplete(${task.id})">
                <span>${task.text}</span>
                <button class="edit-btn" onclick="editTask(${task.id})">Editar</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Excluir</button>
            `;
            taskList.appendChild(li);
        });

        pendingTasksCounter.textContent = `${pendingCount} tarefa${pendingCount === 1 ? '' : 's'} pendente${pendingCount === 1 ? '' : 's'}`;
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (text === '') return;

        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        taskInput.focus();
    }

    window.toggleComplete = function(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    };

    window.editTask = function(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            const newText = prompt('Editar tarefa:', task.text);
            if (newText !== null && newText.trim() !== '') {
                task.text = newText.trim();
                saveTasks();
                renderTasks();
            }
        }
    };

    window.deleteTask = function(id) {
        const itemElement = document.querySelector(`[data-id="${id}"]`);
        if (itemElement) {
            itemElement.classList.add('remove');
            setTimeout(() => {
                tasks = tasks.filter(t => t.id !== id);
                saveTasks();
                renderTasks();
            }, 500); 
        }
    };

    window.clearCompletedTasks = function() {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
    };



    window.filterTasks = function(filterType) {
        currentFilter = filterType;

        document.querySelectorAll('.filters button').forEach(button => {
            button.classList.remove('active');
        });
        document.getElementById(`filter-${filterType}`).classList.add('active');
        renderTasks();
    };

    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    renderTasks();
});


