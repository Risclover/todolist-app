import handlers from './handlers';
import dom from './dom';
import projects from './projects';

const todos = (() => {
    class Task {
        constructor(name) {
            this.name = name;
            this.id = Date.now();
            this.notes = "";
            this.date = "";
        }
    }
    let tasks = JSON.parse(localStorage.getItem('todos')) || [];

    function addTodo(name, notes, date, important, checked) {
        const newTodo = new Task(name, notes, date, important, checked);
        tasks.push(newTodo);
        dom.renderTodo(newTodo);
        projects.addTodoToProject(newTodo);
        localStorage.setItem('todos', JSON.stringify(tasks));
    }

    function toggleDone(key) {
        const index = tasks.findIndex(item => item.id === Number(key));
    
        tasks[index].checked = !tasks[index].checked;
        dom.renderTodo(tasks[index]);
    }

    function deleteTodo(key) {
        console.log(key);
        const index = tasks.findIndex(item => item.id === Number(key));
        const todo = {
            deleted: true,
            ...tasks[index]
        };
        console.log(projects.activeProject);
        if(confirm("Are you sure you want to delete this todo item?")) {
            for(let project of projects.projects) {
                if(project.name === projects.activeProject) {
                    project.todos = project.todos.filter(item => item.id !== Number(key));
                    tasks = tasks.filter(item => item.id !== Number(key));
                    localStorage.setItem('projects', JSON.stringify(projects.projects));
                }
            }
            tasks = tasks.filter(item => item.id !== Number(key));
            localStorage.setItem('todos', JSON.stringify(tasks));
            dom.renderTodo(todo);
        }
    }



    return {
        tasks,
        addTodo,
        toggleDone,
        deleteTodo
    }

})();

export default todos;