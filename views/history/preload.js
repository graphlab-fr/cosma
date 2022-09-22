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
        historyAction: (recordId, description, action) => ipcRenderer.send('history-action', recordId, description, action),
        openModalHistoryRecordRename: (recordId) => ipcRenderer.send('open-modal-historyrename', recordId)
    }
);

function setView () {
    /** @type {Map<number,object>} */
    const historyRecords = ipcRenderer.sendSync('get-history-records');

    table.innerHTML = '';

    historyRecords.forEach(({ description }, id) => {
        id = id.toString();
        const year = id.substring(0, 4);
        const month = id.substring(4, 6);
        const day = id.substring(6, 8);
        const hour = id.substring(8, 10);
        const minute = id.substring(10, 12);
        const second = id.substring(12, 14);

        table.insertAdjacentHTML('afterbegin',
        `<tr>
            <td><input type="radio" name="history_record" value="${id}"></td>
            <td>${new Date(`${[year, month, day].join('-')} ${[hour, minute, second].join(':')}`).toLocaleDateString(lang, {
                year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
            })}</td>
            <td>${description || ''}</td>
        </tr>`);
    })
}