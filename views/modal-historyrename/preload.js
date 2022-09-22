/**
 * @file Script on main window loading
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
    contextBridge,
    ipcRenderer
} = require('electron');

const recordId = ipcRenderer.sendSync('get-record-id');
/** @type {Map<number,object>} */
const historyRecords = ipcRenderer.sendSync('get-history-records');

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector('input[name="description"]').value = historyRecords.get(recordId).description || '';
    document.querySelector('input[name="record_id"]').value = recordId;
});

contextBridge.exposeInMainWorld('api',
    { historyAction: (recordId, description, action) => ipcRenderer.send('history-action', recordId, description, action) }
);