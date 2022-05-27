import todos from './todos';
import handlers from './handlers';
import projects from './projects';

const dom = (() => {
    document.addEventListener('DOMContentLoaded', function() {
        const todoList = document.querySelector('.todo-list');
        const todoInput = document.querySelector('.todo-input');
        todoInput.disabled = true;
        todoList.textContent = "Welcome! Create a new project or click 'All' to get started.";
        let list = JSON.parse(localStorage.getItem('projects'));
        
        const projectsList = document.getElementById('projects-nav');
        for(let item of list) {
            const num = projectsList.getElementsByTagName('li').length + 1;
            item.id = "project-" + num;
            projects.addProject(item.name, item.id, item.theme, item.icon, item.todos);
            const newLi = document.createElement('li');
            newLi.setAttribute('id', `project-${num}`)
            newLi.classList.add('project-nav-item');
            newLi.innerHTML =  `
                <div class="new-project" data-key="project-${num}">
                    <span id="project-title-${num}" data-key="project-${num}">${item.name}</span>
                </div>
            `;

            projectsList.appendChild(newLi);
            handlers.clickNav(newLi);
        }
        
    })

    function renderTodo(todo) {
        const item = document.querySelector(`[data-key='${todo.id}']`);

        if(todo.deleted) {
            item.remove();
            
            return;
        }
        const todoList = document.querySelector('.todo-list');
        const newLi = document.createElement('li');
        const isChecked = todo.checked ? 'done' : '';

        newLi.setAttribute('class', `total-todo ${isChecked}`)
        newLi.setAttribute('data-key', todo.id);
        newLi.innerHTML = `
        <div class="todo-item">
                <div class="checkbox">
                    <input type="checkbox" name="checkbox" id="${todo.id}">
                    <label for="${todo.id}" class="js-tick tick">
                </div>
                <div class="todo-main">
                    <span class="js-todo">${todo.name}</span>
                </div>
        </div>
        `;
        const rightSide = document.createElement('div');
        rightSide.classList.add('right-side');
        newLi.appendChild(rightSide);

 
        if(todo.important === false || todo.important === undefined) {
            rightSide.innerHTML = `
            <button class="bi bi-star star"></button>
            <button class="bi bi-trash js-delete"></button>
            <button class="bi bi-pencil-square js-edit"></button>
            `
        } else {
            rightSide.innerHTML = `
            <button class="bi bi-star-fill star"></button>
            <button class="bi bi-trash js-delete"></button>
            <button class="bi bi-pencil-square js-edit"></button>
            `
        }
        if(item) {
            todoList.replaceChild(newLi, item);
        } else {
            todoList.append(newLi);
        }
        localStorage.setItem('todos', JSON.stringify(todos.tasks));
        localStorage.setItem('projects', JSON.stringify(projects.projects));
    }

    function editTodo(ele, index) {
        const todoNotes = document.getElementById('todo-notes');
        const datePicker = document.getElementById('datepicker');
        const todoTitle = document.getElementById('todo-text');

        todoTitle.value = todos.tasks[index].name;
        datePicker.value = todos.tasks[index].date;
        todoNotes.value = todos.tasks[index].notes;

        $("#edit-todo-window").dialog({
            modal: true,
            buttons: [
                {
                    text: 'Save',
                    click: function() {
                        todos.tasks[index].name = todoTitle.value;
                        ele.parentElement.parentElement.parentElement.children[0].children[0].children[1].textContent = todoTitle.value;
                        $(this).dialog("close");
                        todos.tasks[index].date = datePicker.value;
                        todos.tasks[index].notes = todoNotes.value;
                        localStorage.setItem('todos', JSON.stringify(todos.tasks));
                        localStorage.setItem('projects', JSON.stringify(projects.projects));
                    }
                }
            ]
        });
    }
    

    function loadDefault() {
        const appTitle = document.getElementById('project-title');
        const todoList = document.querySelector('.todo-list');
        todoList.innerHTML = "";
        appTitle.textContent = "Tasks";
        projects.activeProject = "Tasks";
        console.log('Active project: ' + projects.activeProject);
        for(let item of projects.projects) {
            if(item.id === "project-0") {
                for(let todo of item.todos) {
                    renderTodo(todo);
                }
            }
        }
    }

    function createProjectNav(name) {
        const projectsList = document.getElementById('projects-nav');
        const newLi = document.createElement('li');
        const num = projectsList.getElementsByTagName('li').length + 1;
        newLi.setAttribute('id', `project-${num}`);
        newLi.classList.add('project-nav-item')
        newLi.innerHTML =
        `
        <div class="new-project" data-key="project-${num}">
            <span id="project-title-${num}" data-key="project-${num}"></span>
            <input type="text" id="project-input-${num}" data-key="project-${num}">
        </div>
        `;

        projectsList.appendChild(newLi);
        handlers.projectInput(num);
        handlers.clickNav(newLi);
    }


    function setProject(num, value) {
        const projectInput = document.getElementById(`project-input-${num}`)
        const projectTitle = document.getElementById(`project-title-${num}`);
        const appTitle = document.getElementById('project-title');
        const todoList = document.querySelector('.todo-list');

        todoList.innerHTML = "";
        projectTitle.textContent = value;
        projectInput.style.display = "none";
    
        projects.activeProject = value;
        appTitle.textContent = value;
        projects.addProject(appTitle.textContent, `project-${num}`);
        console.log("Active project: " + projects.activeProject);
    }

    function loadProject(project) {
        const appTitle = document.getElementById('project-title');
        const todoList = document.querySelector('.todo-list');
        todoList.innerHTML = "";
        appTitle.textContent = projects.activeProject;

        for(let item of projects.projects) {
            if(project.id === item.id) {
                for(let todo of item.todos) {
                    renderTodo(todo);
                    
                }

            }
        }
    }

    function loadAllTasks() {
        const todoList = document.querySelector('.todo-list');
        const projectTitle = document.querySelector('#project-title');

        projects.activeProject = "Tasks";
        projectTitle.innerHTML = "All";
        todoList.innerHTML = "";

        for(let task of todos.tasks){
            if(task.checked === false || task.checked === undefined) {
                renderTodo(task);
            } 
        }
    }

    function loadImportant() {
        const todoList = document.querySelector('.todo-list');
        const projectTitle = document.querySelector('#project-title');

        projectTitle.innerHTML = "Important";
        todoList.innerHTML = ""; 

        for(let task of todos.tasks) {
            if(task.important === true && (task.checked === false || task.checked === undefined)) {
                renderTodo(task);
            }
        }
    }

    function loadCompleted() {
        const todoList = document.querySelector('.todo-list');
        const projectTitle = document.querySelector('#project-title');

        projectTitle.innerHTML = "Completed";
        todoList.innerHTML = "";

        for(let task of todos.tasks) {
            if(task.checked === true) {
                renderTodo(task);
            }
        }
    }
    
    return {
        renderTodo,
        editTodo,
        loadDefault,
        createProjectNav,
        setProject,
        loadProject,
        loadAllTasks,
        loadImportant,
        loadCompleted,
    }
})();

export default dom;