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
            case 'open':
                const { isOk } = window.api.openProject(Number(projectIndex));
                if (isOk) {
                    window.close();
                }
                break;
            case 'delete':
                window.api.deleteProject(Number(projectIndex));
                break;
        }
    })
})();

function init() {
    projectList.innerHTML = '';

    for (const [index, { opts, thumbnail }] of projectsList) {
        const projectArticle = document.createElement('tr');
        projectArticle.classList.add('project', currentProjectIndex === index ? 'active' : null);
        projectArticle.dataset.projectIndex = index;
        projectArticle.innerHTML =
        `<td>
            <input type="radio" name="project" value="${index}" />
        </td>

        <td class="thumbnail">
            <img class="project-thumbnail" src="data:image/jpg;base64,${thumbnail}" alt="" />
        </td>

        <td>
            <span class="project-title">${opts.title}</span>
        </td>`;
        projectList.appendChild(projectArticle);
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
                const { title: aTitle } = aProject.opts, { title: bTitle } = bProject.opts;
                return aTitle.localeCompare(bTitle);
            });
            break;
        case 'z_a':
            projectsList = projectsList.sort(([aIndex, aProject], [bIndex, bProject]) => {
                const { title: aTitle } = aProject.opts, { title: bTitle } = bProject.opts;
                return aTitle.localeCompare(bTitle);
            }).reverse();
            break;
    }
    init();
});

projectSorting.dispatchEvent(new Event('change'));

window.api.onProjectDelete((index) => {
    const deletedProjectArticle = document.querySelector(`[data-project-index="${index}"]`);
    deletedProjectArticle.remove();
});