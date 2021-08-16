const saveToStorage = (name, projectsObj) => {
  localStorage.setItem(name, JSON.stringify(projectsObj));
};

const loadFromStorage = (name) => {
  return JSON.parse(localStorage.getItem(name));
};

export { saveToStorage, loadFromStorage };
