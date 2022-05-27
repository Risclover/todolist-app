export default class Storage {
    static saveProject(data) {
        localStorage.setItem('projects', JSON.stringify(data))
    }

    static getProject() {
        const project = Object.assign(
            new Project(),
            JSON.parse(localStorage.getItem('projects'));
        )
    }
}