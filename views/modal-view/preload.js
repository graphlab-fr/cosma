/**
 * @file Script on main window loading
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
    contextBridge,
    ipcRenderer
} = require('electron');

const viewName = ipcRenderer.sendSync('get-view-name')
    , viewKey = ipcRenderer.sendSync('get-view-key')
    , action = ipcRenderer.sendSync('get-action')
    // , config = ipcRenderer.sendSync('get-config-options');

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector('input[name="action"]').value = action;
    document.querySelector('input[name="key"]').value = viewKey;

    if (viewName === undefined) {
       return; }

    document.querySelector('input[name="name"]').value = viewName;
    document.querySelector('input[name="initial_name"]').value = viewName;
});

contextBridge.exposeInMainWorld('api',
    { saveConfigOptionView: (name, nameInitial, key, action) => ipcRenderer.sendSync('save-config-option-view', name, nameInitial, key, action) }
);