/**
 * @file Script on history window loading
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

 const {
    contextBridge,
    ipcRenderer
} = require('electron');

let table;

let { lang } = ipcRenderer.sendSync('get-config-options');

window.addEventListener("DOMContentLoaded", () => {
    table = document
        .getElementById('form-history')
        .querySelector('tbody');

    setView();
});

ipcRenderer.on('reset-history', () => {
    setView();
});

contextBridge.exposeInMainWorld('api',
    {
        historyAction: (recordId, description, action) => ipcRenderer.sendSync('history-action', recordId, description, action),
        openModalHistoryRecordRename: (recordId) => ipcRenderer.send('open-modal-historyrename', recordId)
    }
);

function setView () {
    const historyRecords = ipcRenderer.sendSync('get-history-records');

    table.innerHTML = '';

    for (const record in historyRecords) {
        table.insertAdjacentHTML('afterbegin',
        `<tr>
            <td><input type="radio" name="history_record" value="${record}"></td>
            <td>${new Date(historyRecords[record].date).toLocaleDateString(lang, {
                year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
            })}</td>
            <td>${historyRecords[record].description || ''}</td>
        </tr>`);
    }
}