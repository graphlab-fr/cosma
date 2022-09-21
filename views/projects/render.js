const form = document.getElementById('form-project');
let editMode = false;

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

window.addEventListener("DOMContentLoaded", () => {
    (function () {
        const projectArticles = document.querySelectorAll('article.project');
        for (const projectArticle of projectArticles) {
            projectArticle.addEventListener('click', (e) => {
                if (editMode) { return; }
                const { projectIndex } = projectArticle.dataset;
                const { isOk } = window.api.openProject(Number(projectIndex));
                if (isOk) {
                    window.close();
                }
            })
        }
    })();
});