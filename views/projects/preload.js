/**
 * @file Script on record window loading
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
    contextBridge,
    ipcRenderer
} = require('electron');

window.addEventListener("DOMContentLoaded", () => {
    projectList = document.getElementById('project-list');
    submitBtn = document.querySelector('button[type="submit"]');
    init();
});

ipcRenderer.on('new-project-result', (event, response) => {
    if (response.isOk) {
        window.close();
    }
});

function init() {
    /** @type {Map<number,Project>} */
    let list = ipcRenderer.sendSync('get-project-list');

    projectList.innerHTML = '';
    list.forEach(({ opts, thumbnail }, index) => {
        projectList.insertAdjacentHTML('beforeend',
        `<article class="project" data-project-index="${index}">
            <img class="project-thumbnail" src="data:image/jpg;base64,${thumbnail}" alt="" />
            <input type="radio" name="project" value="${index}" hidden>
            <h3>${opts.name}</h3>
        </article>`);
    });
}

contextBridge.exposeInMainWorld('api',
    {
        openNewProjectModal: () => ipcRenderer.send('open-modal-projectorigin'),
        openProject: (index) => ipcRenderer.sendSync('open-project', index),
        deleteProject: (index) => ipcRenderer.send('delete-project', index),
        onProjectDelete: (fx) => ipcRenderer.on('project-has-been-delete', (event, index) => fx(index))
    }
);