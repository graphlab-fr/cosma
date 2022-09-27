/**
 * @file Script on record window loading
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
    contextBridge,
    ipcRenderer
} = require('electron');

let selectType;

window.addEventListener("DOMContentLoaded", () => {
    selectType = document.querySelector('select[name="type"]');

    setTypeList();
});

ipcRenderer.on('config-change', () => {
    setTypeList();
});

contextBridge.exposeInMainWorld('api',
    {
        recordAdd: (title, type, tags) => ipcRenderer.send('record-add', title, type, tags),
        recordBackup: (fx) => ipcRenderer.on('record-backup', (event, response) => fx(response)),
        getRecordTags: () => {
            const { tags } = ipcRenderer.sendSync('get-project-current-folksonomy');
            return Object.keys(tags);
        }
    }
);

function setTypeList () {
    const config = ipcRenderer.sendSync('get-config-options');

    selectType.innerHTML = '';

    for (const type of Object.keys(config.record_types)) {
        selectType.insertAdjacentHTML('beforeend',
        `<option value="${type}">${type}</option>`);
    }
}