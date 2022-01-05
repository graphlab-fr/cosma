/**
 * @file Script on record window loading
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
    contextBridge,
    ipcRenderer
} = require('electron');

const report = ipcRenderer.sendSync('get-report');

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector('pre').textContent = report;
    console.log(report);
});

// contextBridge.exposeInMainWorld('api',
//     {
//         recordAdd: (title, type, tags) => ipcRenderer.send('record-add', title, type, tags),
//         recordBackup: (fx) => ipcRenderer.on('record-backup', (event, response) => fx(response))
//     }
// );