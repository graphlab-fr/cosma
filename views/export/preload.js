/**
 * @file Script on export window loading
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
    contextBridge,
    ipcRenderer
} = require('electron');

let config = ipcRenderer.sendSync('get-config-options');

let checkboxs;

window.addEventListener("DOMContentLoaded", () => {
    checkboxs = {
        citeproc: document.querySelector('input[name="citeproc"]'),
        css_custom: document.querySelector('input[name="css_custom"]')
    };

    setOptions();

    document.querySelector('input[name="export_target"]').value = config.export_target;
});

ipcRenderer.on('config-change', () => {
    setOptions();
});

contextBridge.exposeInMainWorld('api',
    {
        saveConfigOption: (name, value) => ipcRenderer.sendSync('save-config-option', name, value),
        exportCosmoscope: (graphParams) => ipcRenderer.sendSync('export-cosmoscope', graphParams),
        dialogRequestDirPath: (name) => ipcRenderer.send('dialog-request-dir-path', name),
        getDirPathFromDialog: (fx) => ipcRenderer.on('get-dir-path-from-dialog', (event, response) => fx(response))
    }
);

function setOptions () {
    const options = ipcRenderer.sendSync('get-export-options');

    for (const option in checkboxs) {
        const checkbox = checkboxs[option];
        
        if (options[option] === true) {
            checkbox.disabled = false;
        } else {
            checkbox.disabled = true;
        }
    }
}