/**
 * @file Script on main window loading
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
    contextBridge,
    ipcRenderer
} = require('electron');

const recordId = ipcRenderer.sendSync('get-record-id')
    , records = ipcRenderer.sendSync('get-history-records');

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector('input[name="description"]').value = records[recordId].description || '';
    document.querySelector('input[name="record_id"]').value = recordId;
});

contextBridge.exposeInMainWorld('api',
    { historyAction: (recordId, description, action) => ipcRenderer.sendSync('history-action', recordId, description, action) }
);