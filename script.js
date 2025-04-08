document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const taskCount = document.getElementById('taskCount');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Initialize the app
    function init() {
        renderTasks();
        updateTaskCount();
        addTaskBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTask();
        });
        
        filterButtons.forEach(button => {
            button.addEventListener('click', filterTasks);
        });
        
        clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    }
    
    // Add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;
        
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        updateTaskCount();
        taskInput.value = '';
        taskInput.focus();
    }
    
    // Render tasks based on current filter
    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        
        let filteredTasks = tasks;
        if (filter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'list-group-item text-center text-muted';
            emptyMessage.textContent = 'No tasks found';
            taskList.appendChild(emptyMessage);
            return;
        }
        
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `list-group-item task-item ${task.completed ? 'completed' : ''}`;
            taskItem.dataset.id = task.id;
            
            taskItem.innerHTML = `
                <div class="form-check">
                    <input class="form-check-input task-checkbox" type="checkbox" ${task.completed ? 'checked' : ''}>
                </div>
                <div class="task-text">${task.text}</div>
                <div class="task-actions">
                    <button class="btn btn-sm btn-outline-danger delete-btn">Delete</button>
                </div>
            `;
            
            taskList.appendChild(taskItem);
        });
        
        // Add event listeners to checkboxes and delete buttons
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', toggleTaskStatus);
        });
        
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', deleteTask);
        });
    }
    
    // Toggle task completion status
    function toggleTaskStatus(e) {
        const taskId = parseInt(e.target.closest('.task-item').dataset.id);
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = e.target.checked;
            saveTasks();
            renderTasks(getActiveFilter());
            updateTaskCount();
        }
    }
    
    // Delete a task
    function deleteTask(e) {
        const taskId = parseInt(e.target.closest('.task-item').dataset.id);
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks(getActiveFilter());
        updateTaskCount();
    }
    
    // Filter tasks
    function filterTasks(e) {
        const filter = e.target.dataset.filter;
        
        filterButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        e.target.classList.add('active');
        renderTasks(filter);
    }
    
    // Get currently active filter
    function getActiveFilter() {
        const activeFilter = document.querySelector('.filter-btn.active');
        return activeFilter ? activeFilter.dataset.filter : 'all';
    }
    
    // Clear completed tasks
    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks(getActiveFilter());
        updateTaskCount();
    }
    
    // Update task counter
    function updateTaskCount() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${activeTasks} ${activeTasks === 1 ? 'task' : 'tasks'} left`;
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Initialize the app
    init();
});