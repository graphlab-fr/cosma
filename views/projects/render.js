const form = document.getElementById('form-project');
const projectList = document.getElementById('project-list');
const projectSorting = document.getElementById('select-sorting');

let editMode = false;
let projectsList = window.api.getList();
projectsList = Array.from(projectsList);
const currentProjectIndex = window.api.getCurrentId();

(function () {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const { action } = e.submitter.dataset;

        let data = new FormData(form);
        const { project: projectIndex } = Object.fromEntries(data);

        switch (action) {
            case 'new':
                window.api.openNewProjectModal();
                break;
            case 'delete':
                window.api.deleteProject(Number(projectIndex));
                break;

            case 'edit-start':
            case 'edit-end':
                editMode = !editMode;
                handleEditMode();
                break;
        }
    })
})();

function init() {
    projectList.innerHTML = '';

    for (const [index, { opts, thumbnail }] of projectsList) {
        const projectArticle = document.createElement('article');
        projectArticle.classList.add('project', currentProjectIndex === index ? 'active' : null);
        projectArticle.innerHTML =
        `<img class="project-thumbnail" src="data:image/jpg;base64,${thumbnail}" alt="project thumbnail" />
        <input type="radio" name="project" value="${index}" hidden>
        <h3>${opts.name}</h3>`;
        projectList.appendChild(projectArticle);

        projectArticle.addEventListener('click', () => {
            if (editMode) { return; }

            const { isOk } = window.api.openProject(index);
            if (isOk) {
                window.close();
            }
        });
    }
}

projectSorting.addEventListener('change', () => {
    switch (projectSorting.value) {
        case 'new_old':
            projectsList = projectsList.sort(([aIndex, aProject], [bIndex, bProject]) => {
                const { lastOpenDate: aLastOpenDate } = aProject, { lastOpenDate: bLastOpenDate } = bProject;
                if (aLastOpenDate < bLastOpenDate) { return 1; }
                if (aLastOpenDate > bLastOpenDate) { return -1; }
                return 0;
            });
            break;
        case 'old_new':
            projectsList = projectsList.sort(([aIndex, aProject], [bIndex, bProject]) => {
                const { lastOpenDate: aLastOpenDate } = aProject, { lastOpenDate: bLastOpenDate } = bProject;
                if (aLastOpenDate < bLastOpenDate) { return -1; }
                if (aLastOpenDate > bLastOpenDate) { return 1; }
                return 0;
            });
            break;
        case 'first_last':
            projectsList = projectsList.sort(([aIndex, aProject], [bIndex, bProject]) => {
                if (aIndex < bIndex) { return -1; }
                if (aIndex > bIndex) { return 1; }
                return 0;
            });
            break;
        case 'last_first':
            projectsList = projectsList.sort(([aIndex, aProject], [bIndex, bProject]) => {
                if (aIndex < bIndex) { return 1; }
                if (aIndex > bIndex) { return -1; }
                return 0;
            });
            break;
        case 'a_z':
            projectsList = projectsList.sort(([aIndex, aProject], [bIndex, bProject]) => {
                const { name: aName } = aProject.opts, { name: bName } = bProject.opts;
                return aName.localeCompare(bName);
            });
            break;
        case 'z_a':
            projectsList = projectsList.sort(([aIndex, aProject], [bIndex, bProject]) => {
                const { name: aName } = aProject.opts, { name: bName } = bProject.opts;
                return aName.localeCompare(bName);
            }).reverse();
            break;
    }
    init();
});

projectSorting.dispatchEvent(new Event('change'))

window.api.onProjectDelete((index) => {
    const deletedProjectArticle = document.querySelector(`article.project[data-project-index="${index}"]`);
    deletedProjectArticle.remove();
})

function handleEditMode() {
    const newProjectBtn = document.querySelector('button[data-action="new"]');
    const editStartBtn = document.querySelector('button[data-action="edit-start"]');
    const editEndBtn = document.querySelector('button[data-action="edit-end"]');
    const deleteBtn = document.querySelector('button[data-action="delete"]');
    const projectArticleInputs = document.querySelectorAll('article.project input[type="radio"]');
    if (editMode) {
        projectArticleInputs.forEach(input => input.removeAttribute('hidden'));
        newProjectBtn.setAttribute('hidden', true);
        editStartBtn.setAttribute('hidden', true);
        editEndBtn.removeAttribute('hidden');
        deleteBtn.removeAttribute('hidden');
    } else {
        projectArticleInputs.forEach(input => input.setAttribute('hidden', true));
        newProjectBtn.removeAttribute('hidden');
        editStartBtn.removeAttribute('hidden');
        editEndBtn.setAttribute('hidden', true);
        deleteBtn.setAttribute('hidden', true);
    }
}