import {parseISO , differenceInCalendarDays} from "date-fns";
import {loadFromStorage} from "./storage.js";
import {addToList, deleteFromList, completedTask, newProject, deleteProject} from "./updateToDo.js";


const loadProjects = (today) => {
    const submitTask = (e) => {
        e.preventDefault();
        const taskArea = document.querySelector(".taskArea");
        const taskValues = newTask();
        let sortedTasks;

        if (taskValues.taskText === "" || taskValues.taskText.trim().length === 0) {
            alert("cannot enter empty task");
            return;
        } else if (taskArea.firstChild) {
            clearTaskDisplay();
        }
        addToList(taskValues, projects, currentProject);
        sortedTasks = sortTaskList(projects[currentProject]);
        sortedTasks.forEach((taskObj, index) => renderTask(taskObj, index));
    };
    
    const newTask = () => {
        const inputTask = document.querySelector("#task").value;
        const dueDate = document.querySelector("#dueDate").value;
        const taskPriority = document.querySelector("#priority").value;
      
        return {
          taskText: inputTask,
          date: dueDate,
          priority: taskPriority,
          completed: false
        };
    };

    const renderContent = (projects, key) => {
        const contentDiv = document.querySelector(".content");
        const taskAreaDiv = document.createElement("div");
        let currentTasks;
        taskAreaDiv.classList.add("taskArea");
        
        if (!(key in projects)) {
            return;
        } else {
            currentTasks = sortTaskList(projects[key]);
        }
        contentDiv.appendChild(renderContentHeader(currentProject));
        contentDiv.appendChild(taskAreaDiv);
        currentTasks.forEach((task, index) => renderTask(task, index));
    };
    
    const renderContentHeader = (currentProject) => {
        const headerDiv = document.createElement("div");
        const h2Div = document.createElement("div");
        const btnsDiv = document.createElement("div");
        const h2 = document.createElement("h2");
        const button = document.createElement("button");

        headerDiv.classList.add("header");
        h2.id = "currentProject";
        h2.innerText = currentProject;

        btnsDiv.classList.add("projectBtns");
        btnsDiv.style.textAlign = "center";

        button.classList.add("btns");
        button.classList.add("addTask");
        button.id = "addTask";
        button.innerText = "+ New Task";

        h2Div.appendChild(h2);
        btnsDiv.appendChild(button);
        headerDiv.appendChild(h2Div);
        headerDiv.appendChild(btnsDiv);

        return headerDiv;
    };
    
    const renderTask = (taskObj, index) => {
        const taskArea = document.querySelector(".taskArea");
        const taskContainer = document.createElement("div");
        const infoDiv = document.createElement("div");
        let completed;
        taskContainer.classList.add("task");
        taskContainer.id = index;

        for (const prop in taskObj) {
            const p = document.createElement("p");
            infoDiv.classList.add("left");

            if (prop === "completed" && taskObj[prop] === true) {
                taskContainer.classList.add("completed");
                completed = taskObj[prop];
                continue;
            }
            if (prop !== "id" && prop !== "completed") {
                if (prop === "priority") {
                taskContainer.style.borderLeftColor = setPriority(taskObj[prop]);
                continue;
                } else if (prop === "date") {
                    p.innerText = setDueDay(taskObj[prop]);
                } else {
                    p.innerText = taskObj[prop];
                    p.classList.add(`${prop}`);
                }
                infoDiv.appendChild(p);
            } 
            
            taskContainer.appendChild(infoDiv);
        }
        renderTaskBtns(taskContainer, completed);
        taskArea.appendChild(taskContainer);
    };

    const renderTaskBtns = (taskContainer, completed) => {
        const div = document.createElement("div");
        const completeBtn = document.createElement("button");
        const deleteTaskBtn = document.createElement("button");

        if (completed) {
            completeBtn.classList.add("hide");
        }
        
        completeBtn.classList.add("btns");
        completeBtn.classList.add("completeTask");
        completeBtn.innerText = "Done";

        deleteTaskBtn.classList.add("btns");
        deleteTaskBtn.classList.add("deleteTask");
        deleteTaskBtn.style.marginLeft = "20px";
        deleteTaskBtn.innerText = "Delete";


        div.classList.add("right");
        div.appendChild(completeBtn);
        div.appendChild(deleteTaskBtn);
        taskContainer.appendChild(div);
    };

    const sortTaskList = (taskList) => {
        taskList = taskList.sort((a,b) => {
            return  new Date(a.date) - new Date(b.date);
        });
        return taskList;
    };

    const setDueDay = (date) => {
        const daysLeft = differenceInCalendarDays(parseISO(date), parseISO(today));
        if (daysLeft < 0) {
            return `Overdue ${Math.abs(daysLeft)} days`;
        } else if (daysLeft === 0 && daysLeft < 1) {
            return "Due Today";
        } else if (daysLeft === 1 && daysLeft < 2) {
            return "Due Tomorrow"; 
        } else {
            return `Due in ${daysLeft} days`;
        }
    };

    const setPriority = (value) => {
        const priorityObj = {"low": "green", "medium": "orange", "high": "red"};
        return priorityObj[value];
    };
        
    const deleteTask = (e) => {
        const taskArea = document.querySelector(".taskArea");
        const taskId = e.target.parentElement.parentElement.id;
        const clickedTask = document.getElementById(`${taskId}`);
        clickedTask.remove();

        if (taskArea.firstChild) {
            clearTaskDisplay();
        }
        deleteFromList(taskId, projects, currentProject);
        projects[currentProject].forEach((taskObj, index) => renderTask(taskObj, index));
    };

    const renderProjectLink = (title) => {
        const links = document.querySelector(".links");
        const li = document.createElement("li");
        const a = document.createElement("a");
        const span = document.createElement("span");
        const text = document.createTextNode("\u00D7");

        a.classList.add("projects");
        a.href = "#";
        a.innerText = title;
        span.classList.add("deleteProject");
        span.appendChild(text);
        span.style.float = "right";
        span.style.cursor = "pointer";

        li.style.overflowWrap = "break-word";
        li.appendChild(a);
        li.appendChild(span);
        links.appendChild(li);
    };

    const activeLink = (currentProject) => {
        const links = document.querySelectorAll("a");
        let newActiveLink;

        for (let i = 0; i < links.length; i++) {
            if (links[i].innerText === currentProject) {
                newActiveLink = links[i];
            } else {
                links[i].parentElement.classList.remove("active");
            }
        }
        newActiveLink.parentElement.classList.add("active");
    };

    const clearContentDiv = () => {
    const contentDiv = document.querySelector(".content");

        while (contentDiv.firstChild) {
            contentDiv.removeChild(contentDiv.firstChild);
        }
    };

    const clearTaskDisplay = () => {
        const taskArea = document.querySelector(".taskArea");

        while (taskArea.firstChild) {
            taskArea.removeChild(taskArea.firstChild);
        }
    };

    const body = document.querySelector("body");
    const formDiv = document.querySelector(".formDiv");
    const form = document.querySelector("#form");
    const closeFormBtn = document.querySelector(".closeForm");
    const newProjectBtn = document.querySelector(".newProject");
    
    body.addEventListener("click", (e) => {
            const classes = e.target.classList;
            let taskId;
            let projectToDelete;
        
            switch (true) {
            case classes.contains("addTask"):
                formDiv.classList.toggle("hide");
                break;
            case classes.contains("deleteTask"):
                deleteTask(e);
                break;
            case classes.contains("completeTask"):
                taskId = e.target.parentElement.parentElement.id;
                completedTask(taskId, projects, currentProject);
                clearTaskDisplay();
                projects[currentProject].forEach((taskObj, index) => renderTask(taskObj, index));
                break;
            case classes.contains("projects"):
                currentProject = e.target.innerText;
                clearContentDiv();
                renderContent(projects, currentProject);
                activeLink(currentProject);
                break;
            case classes.contains("deleteProject"):
                projectToDelete = e.target.parentElement.childNodes[0].innerText;
        
                if (!(confirm("Are you sure you want to delete this project?"))) {
                break;
                }
                if (projectToDelete === currentProject) {
                    clearContentDiv();
                } 
                deleteProject(projects, projectToDelete);
                e.target.parentElement.remove();
                break;
            }
        });

    newProjectBtn.addEventListener("click", () => {
        const title = prompt("Please enter name of project.");
        
        if (!title || title.trim().length === 0) {
            return;
        } else if (title.trim() in projects) {
            alert("Project already Exist.");
            return;
        }
        newProject(projects, title);
        renderProjectLink(title);
    });

    form.addEventListener("submit", submitTask);
    closeFormBtn.addEventListener("click", () => formDiv.classList.add("hide"));
    

    const defaultProject = {"Default": []};

    let projects = (loadFromStorage("projects")) ? loadFromStorage("projects"):  defaultProject;
    let projectKeys = Object.keys(projects);
    let currentProject;

    if (projectKeys.length > 0) {
        currentProject = projectKeys[0];
        projectKeys.forEach(key => renderProjectLink(key));
        renderContent(projects, currentProject);
        activeLink(currentProject);
    }
};

export default loadProjects;