import loadProjects from "./toDo.js";
import {format} from "date-fns";

let today = format(new Date(), "yyyy-MM-dd\'T\'HH:mm:ss");
const dueDate = document.querySelector("#dueDate");
dueDate.value = today;
dueDate.min = today;

loadProjects(today);