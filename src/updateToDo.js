import { saveToStorage } from "./storage";

const newProject = (projects, title) => {
  projects[title] = [];
  saveToStorage("projects", projects);
}

const deleteProject = (projects, currentProject) => {
    delete projects[currentProject]
    saveToStorage("projects", projects);
}

const addToList = (taskValues, projects, currentProject) => {
    projects[currentProject].push(taskValues);
    saveToStorage("projects", projects);
}
  
const deleteFromList = (id, projects, currentProject) => {
    projects[currentProject].splice(id, 1);
    saveToStorage("projects", projects);
}
  
const completedTask = (id, projects, currentProject) => {
    projects[currentProject][id].completed = true;
    console.log(projects);
    saveToStorage("projects", projects);
}

export {deleteFromList, addToList, completedTask,  newProject, deleteProject};