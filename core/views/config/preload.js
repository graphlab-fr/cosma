/**
 * @file Script on main window loading
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
    contextBridge,
    ipcRenderer
} = require('electron');

let config = ipcRenderer.sendSync('get-config-options');

let inputs, tableTypesRecord;

window.addEventListener("DOMContentLoaded", () => {
    inputs = document.querySelectorAll('input');
    tableTypesRecord = document
        .getElementById('form-type-record')
        .querySelector('tbody')

    setConfigView();
});

ipcRenderer.on('reset-config', () => {
    config = ipcRenderer.sendSync('get-config-options');
    setConfigView();
});

contextBridge.exposeInMainWorld('api',
    {
        saveConfigOption: (name, value) => ipcRenderer.sendSync('save-config-option', name, value),
        saveConfigOptionTypeRecord: (name, nameInitial, color, action) => ipcRenderer.sendSync('save-config-option-typerecord', name, nameInitial, color, action),
        openModalTypeRecord: (recordType, action) => ipcRenderer.send('open-modal-typerecord', recordType, action)
    }
);

function setConfigView () {
    for (const input of inputs) {
        switch (input.type) {
            case 'text':
                input.value = config[input.name];
                break;

            case 'number':
                input.value = config[input.name];
                break;

            case 'checkbox':
                input.checked = config[input.name];
                break;
        }
    }

    tableTypesRecord.innerHTML = '';

    for (const recordType in config.record_types) {
        tableTypesRecord.insertAdjacentHTML('beforeend',
        `<tr>
            <td><input type="radio" name="record_types" value="${recordType}"></td>
            <td>${recordType}</td>
            <td>${config.record_types[recordType]}</td>
        </tr>`);
    }
}