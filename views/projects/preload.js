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

ipcRenderer.on('reset-project', init);

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

// ipcRenderer.on('config-change', () => {
//     setTypeList();
// });





contextBridge.exposeInMainWorld('api',
    {
        // recordAdd: (title, type, tags) => ipcRenderer.send('record-add', title, type, tags),
        // recordBackup: (fx) => ipcRenderer.on('record-backup', (event, response) => fx(response)),
    }
);