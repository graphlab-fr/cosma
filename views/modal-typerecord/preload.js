/**
 * @file Script on main window loading
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
    contextBridge,
    ipcRenderer
} = require('electron');

const recordType = ipcRenderer.sendSync('get-recordtype')
    , action = ipcRenderer.sendSync('get-action')
    , config = ipcRenderer.sendSync('get-config-options');

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector('input[name="action"]').value = action;

    if (recordType === undefined) {
       return; }

    document.querySelector('input[name="name"]').value = recordType;
    document.querySelector('input[name="initial_name"]').value = recordType;
    document.querySelector('input[name="color"]').value = config.record_types[recordType];
});

contextBridge.exposeInMainWorld('api',
    { saveConfigOptionTypeRecord: (name, nameInitial, color, action) => ipcRenderer.sendSync('save-config-option-typerecord', name, nameInitial, color, action) }
);