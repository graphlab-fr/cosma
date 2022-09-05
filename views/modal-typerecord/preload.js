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

    const fillImageBtn = document.getElementById('dialog-image');
    console.log(fillImageBtn, config['images_origin']);
    if (!config['images_origin']) {
        fillImageBtn.disabled = true;
    }

    if (recordType === undefined) {
       return; }

    document.querySelector('input[name="name"]').value = recordType;
    document.querySelector('input[name="initial_name"]').value = recordType;
    document.querySelector('input[name="fill"]').value = config.record_types[recordType]['fill'];
    document.querySelector('input[name="stroke"]').value = config.record_types[recordType]['stroke'];
});

contextBridge.exposeInMainWorld('api',
    {
        saveConfigOptionTypeRecord: (name, nameInitial, fill, stroke, action) => ipcRenderer.sendSync('save-config-option-typerecord', name, nameInitial, fill, stroke, action),
        dialogRequestImagePath: () => ipcRenderer.send('dialog-request-image-path'),
        getImagePathFromDialog: (callback) => ipcRenderer.on('get-image-path-from-dialog', (event, response) => callback(response))
    }
);