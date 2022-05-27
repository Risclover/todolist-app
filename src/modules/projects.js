import dom from "./dom";

const projects = (() => {
    class Project {
        constructor(name, id, theme, icon, todos) {
            this.name = name;
            this.id = id;
            this.theme = theme;
            this.icon = icon;
            this.todos = todos || [];
        }
    }

    let projects = [];
    let activeProject = "";

    function addProject(name, id, theme, icon, todos) {
        const newProject = new Project(name, id, theme, icon, todos);
        activeProject = newProject.name;
        projects.push(newProject);

        localStorage.setItem('projects', JSON.stringify(projects));
    }

    function addTodoToProject(todo) {
        const appTitle = document.getElementById('project-title');
        if(appTitle.textContent === 'All' || appTitle.textContent === 'Completed') {
            activeProject = 'Tasks';
        } else {
            activeProject = appTitle.textContent;
        }

        for(let item of projects) {
            if(item.name === activeProject) {

                item.todos.push(todo);
                console.log(item.name);
                console.log('Check em yo');
            }
        }
        localStorage.setItem('projects', JSON.stringify(projects));

    }

    return {
        projects,
        activeProject,
        addProject,
        addTodoToProject
    }
})();

export default projects;