import todos from './todos';
import dom from './dom';
import projects from './projects';

const handlers = (() => {
    const todoInput = document.querySelector('.todo-input');
    const submitBtn = document.getElementById('submit');
    const listBox = document.querySelector('.todo-list');
    const newProject = document.querySelector('.new-project');
    const allTodos = document.getElementById('all-todos');
    const importantTodos = document.getElementById('important-todos');
    const completedTodos = document.getElementById('completed-todos');
    const appTitle = document.querySelector('#project-title');

    appTitle.addEventListener('click', function() {
        let oldName = appTitle.textContent;
        const newInput = document.createElement('input');
        const navItems = document.querySelectorAll('.project-nav-item');
        const headerBox = document.querySelector('.header-title');

        if(appTitle.textContent === 'Todo List' || appTitle.textContent === 'All' || appTitle.textContent === 'Completed' || appTitle.textContent === 'Important') {
            return false;
        }
        newInput.setAttribute('type', 'text');
        newInput.value = appTitle.textContent;
        appTitle.style.display = 'none';
        headerBox.appendChild(newInput);
        newInput.focus();
        newInput.addEventListener('keydown', function(e) {
            if(e.key === "Enter") {
                if(newInput.value !== "") {
                    newInput.style.display = 'none';
                    appTitle.textContent = newInput.value;
                    for(let project of projects.projects) {
                        if(project.name === projects.activeProject) {
                            project.name = newInput.value;
                        }
                        navItems.forEach(item => {
                            if(item.id === project.id) {
                                item.children[0].children[0].textContent = project.name;
                            }
                        })
                    }
                    appTitle.style.display = "block";
                    projects.activeProject = appTitle.textContent;
                    localStorage.setItem('projects', JSON.stringify(projects.projects))
                } else {
                    newInput.style.display = "none";
                    appTitle.textContent = oldName;
                    appTitle.style.display = "block";
                }
            }
        })

        newInput.addEventListener('blur', function() {
            if(newInput.value !== ''){
                newInput.style.display = 'none';
                appTitle.textContent = newInput.value;
                for(let project of projects.projects) {
                    if(project.name === projects.activeProject) {
                        project.name = newInput.value;
                    }
                    navItems.forEach(item => {
                        if(item.id === project.id) {
                            item.children[0].children[0].textContent = project.name;
                        }
                    })
                }
                projects.activeProject = appTitle.textContent;
                localStorage.setItem('projects', JSON.stringify(projects.projects))
            } else {
                newInput.style.display = "none";
                appTitle.textContent = oldName;
            }
            appTitle.style.display = "block";
        })
    })


    document.addEventListener('click', function() {
        const todoInput = document.querySelector('.todo-input');
        const appTitle = document.querySelector('#project-title');
        if(appTitle.textContent === 'Completed' || appTitle.textContent === 'Important') {
            todoInput.disabled = true;
        } else {
            todoInput.disabled = false;
        }

    })

    allTodos.addEventListener('click', dom.loadAllTasks);
    importantTodos.addEventListener('click', dom.loadImportant);
    completedTodos.addEventListener('click', dom.loadCompleted);
    newProject.addEventListener('click', dom.createProjectNav);

    submitBtn.addEventListener('click', function() {
        if(todoInput.value !== "") {
            todos.addTodo(todoInput.value);
            todoInput.value = "";
            todoInput.focus();
        } else {
            alert("ERROR: Can't be blank.")
        }
    });

    todoInput.addEventListener('keydown', function(e) {
        if(e.key === 'Enter') {
            if(todoInput.value !== "") {
                todos.addTodo(todoInput.value);
                todoInput.value = "";
                todoInput.focus();
            } else {
                alert("ERROR: Can't be blank")
            }
        }
    })

    listBox.addEventListener('click', event => {
        if(event.target.classList.contains('js-tick')) {
            const itemKey = event.target.parentElement.parentElement.parentElement.dataset.key;
            todos.toggleDone(itemKey);
        }

        if(event.target.classList.contains('star')) {
            const itemKey = event.target.parentElement.parentElement.dataset.key;
            const index = todos.tasks.findIndex(item => item.id === Number (itemKey));
            if(todos.tasks[index].important === false || todos.tasks[index].important === undefined) {
                todos.tasks[index].important = true;
                for(let project of projects.projects) {
                    for(let todo of project.todos) {
                        if(todo.id === todos.tasks[index].id) {
                            todo.important = true;
                        }
                    }
                }
                event.target.classList.add('bi-star-fill');
                event.target.classList.remove('bi-star');
            } else {
                todos.tasks[index].important = false;
                for(let project of projects.projects) {
                    for(let todo of project.todos) {
                        if(todo.id === todos.tasks[index].id) {
                            todo.important = false;
                        }
                    }
                }
                event.target.classList.remove('bi-star-fill');
                event.target.classList.add('bi-star');
            }
            localStorage.setItem('todos', JSON.stringify(todos.tasks));
            localStorage.setItem('projects', JSON.stringify(projects.projects));
            dom.renderTodo(todos.tasks[index]);
        }

        if(event.target.classList.contains('js-edit')) {
            const itemKey = event.target.parentElement.parentElement.dataset.key;
            const index = todos.tasks.findIndex(item => item.id === Number (itemKey));
            console.log("Hi!");
            dom.editTodo(event.target, index);
        }

        if(event.target.classList.contains('js-delete')) {
            const itemKey = event.target.parentElement.parentElement.dataset.key;
            const index = todos.tasks.findIndex(item => item.id === Number(itemKey));
            const todo = {
                deleted: true,
                ...todos.tasks[index]
            }
            if(todos.tasks[index].deleted === true || todos.tasks[index].deleted === undefined) {
                for(let project of projects.projects) {
                    for(let todo of project.todos) {
                        if(todo.id === todos.tasks[index].id) {
                            todo.deleted = true;
                            project.todos = project.todos.filter(item => item.id !== Number(itemKey));
                            const todo2 = {
                                deleted: true,
                                ...project.todos
                            }
                            localStorage.setItem('projects', JSON.stringify(projects.projects));
                            dom.renderTodo(todo2);
                        }
                    }
                }
            }
            todos.tasks = todos.tasks.filter(item => item.id !== Number(itemKey));
            dom.renderTodo(todo);
        }

        if(event.target.classList.contains('js-todo')) {
            const itemKey = event.target.parentElement.parentElement.parentElement.dataset.key;
            const index = todos.tasks.findIndex(item => item.id === Number(itemKey));
            const newInput = document.createElement('input');
            newInput.setAttribute('type', 'text');
            newInput.classList.add('todo-new');
            event.target.parentElement.appendChild(newInput);
            newInput.focus();
            newInput.value = event.target.textContent;
            event.target.style.display = "none";
            
            newInput.addEventListener('keydown', function(e) {
                if(e.key === 'Enter') {
                    if(newInput.value === "") {
                        alert("ERROR: Can't submit a blank task.")
                    } else {
                        newInput.style.display = "none";
                        event.target.style.display = "inline-block";
                        event.target.textContent = newInput.value;
                        todos.tasks[index].name = newInput.value;
                        for(let item of projects.projects) {
                            for(let todo of item.todos) {
                                if(todo.id === todos.tasks[index].id) {
                                    todo.name = newInput.value;
                                    localStorage.setItem('projects', JSON.stringify(projects.projects));
                                }
                            }
                        }
                        localStorage.setItem('todos', JSON.stringify(todos.tasks));
                    }                    
                }
            })

            newInput.addEventListener('blur', function() {
                newInput.style.display = 'none';
                event.target.style.display = "inline-block";
                if(newInput.value !== '') {
                    event.target.textContent = newInput.value;
                }
            })

        }

        if(event.target.classList.contains('total-todo')) {
            console.log("Totally")
            const itemKey = event.target.dataset.key;
            const index = todos.tasks.findIndex(item => item.id === Number(itemKey));
            const newInput = document.createElement('input');
            newInput.setAttribute('type', 'text');
            newInput.classList.add('todo-new');
            event.target.children[0].children[1].appendChild(newInput);
            newInput.focus();
            newInput.value = event.target.children[0].children[1].children[0].textContent;
            event.target.children[0].children[1].children[0].style.display = "none";
            
            newInput.addEventListener('keydown', function(e) {
                if(e.key === 'Enter') {
                    if(newInput.value === "") {
                        alert("ERROR: Can't submit a blank task.")
                    } else {
                        newInput.style.display = "none";
                        event.target.children[0].children[1].children[0].style.display = "inline-block";
                        event.target.children[0].children[1].children[0].textContent = newInput.value;
                        todos.tasks[index].name = newInput.value;
                        for(let item of projects.projects) {
                            for(let todo of item.todos) {
                                if(todo.id === todos.tasks[index].id) {
                                    todo.name = newInput.value;
                                    localStorage.setItem('projects', JSON.stringify(projects.projects));
                                }
                            }
                        }
                        localStorage.setItem('todos', JSON.stringify(todos.tasks));
                    }                    
                }
            })

            newInput.addEventListener('blur', function() {
                newInput.style.display = 'none';
                event.target.children[0].children[1].children[0].style.display = "inline-block";
                if(newInput.value !== '') {
                    event.target.children[0].children[1].children[0].textContent = newInput.value;
                }
            })

        }
    });

    function projectInput(num) {
        const todoInput = document.querySelector('.todo-input');
        const projectInput = document.getElementById(`project-input-${num}`)
        projectInput.focus();
        projectInput.addEventListener('keydown', function(e) {
            if(e.key === "Enter") {
                todoInput.disabled = false;
                if(projectInput.value === "") {
                    alert("ERROR: Blank titles not allowed.")
                } else {
                    dom.setProject(num, projectInput.value);
                }
            }
        })

    }

    function clickNav(ele) {
        ele.addEventListener('click', function() {
            projects.activeProject = ele.children[0].children[0].textContent;
            dom.loadProject(ele);
        })
    }

    return {
        projectInput,
        clickNav
    }
})();

export default handlers;