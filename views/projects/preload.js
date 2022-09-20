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

    // submitBtn.addEventListener('click', () => {
    //     ipcRenderer.send('add-new-project');
    // })
});

// ipcRenderer.on('new-project-response', (event, response) => {
//     if (response.isOk) {
//         window.close();
//     }
// });
// ipcRenderer.on('reset-project', init);

ipcRenderer.on('new-project-result', (event, response) => {
    if (response.isOk) {
        window.close();
    }
});

function init() {
    /** @type {Map<number,Project>} */
    let list = ipcRenderer.sendSync('get-project-list');

    projectList.innerHTML = '';
    list.forEach(({ title, thumbnail }, index) => {
        projectList.insertAdjacentHTML('beforeend',
        `<article class="project">
            <img class="project-thumbnail" src="" alt="" />
            <input type="radio" name="project">
            <h3>${title}</h3>
        </article>`);
    })
}

contextBridge.exposeInMainWorld('api',
    {
        openNewProjectModal: () => ipcRenderer.send('open-modal-projectorigin'),
        // newProjectResult: (fx) => ipcRenderer.on('new-project-result', (event, response) => fx(response)),
    }
);