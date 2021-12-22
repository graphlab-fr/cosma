/**
 * @file Script on record window loading
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
    contextBridge,
    ipcRenderer
} = require('electron');

const config = ipcRenderer.sendSync('get-config-options');

window.addEventListener("DOMContentLoaded", () => {
    const selectType = document.querySelector('select[name="type"]');

    for (const type of Object.keys(config.record_types)) {
        selectType.insertAdjacentHTML('beforeend',
        `<option value="${type}">${type}</option>`);
    }
});

contextBridge.exposeInMainWorld('api',
    {
        recordAdd: (title, type, tags) => ipcRenderer.send('record-add', title, type, tags),
        recordBackup: (fx) => ipcRenderer.on('record-backup', (event, response) => fx(response))
    }
);