/**
 * @file Script on main window loading
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
    contextBridge,
    ipcRenderer
} = require('electron');

let config = ipcRenderer.sendSync('get-default-config-options');

window.addEventListener("DOMContentLoaded", () => {
    const selectOrigin = document.querySelector('select[name="select_origin"]');
    const selectOriginOptions = selectOrigin.querySelectorAll('option');

    selectOriginOptions.forEach(option => {
        const {select_origin} = config;
        if (option.value === select_origin) {
            option.setAttribute('selected', true);
        }
    });
    const changeEvent = new Event('change');
    selectOrigin.dispatchEvent(changeEvent);
});

// ipcRenderer.on('get-records-folksonomy', (event, { tags, metas }) => {
//     recordsTags = tags;
//     recordsMetas = metas;
//     setGroupOtherOptions(Object.keys(recordsMetas));
//     changeSelectableValues();
// });

contextBridge.exposeInMainWorld('api',
    {
        addNewProject: (opts) => ipcRenderer.send('add-new-project', opts),
        getNewProjectResult: (fx) => ipcRenderer.on('new-project-result', (event, response) => fx(response)),
        dialogRequestDirPath: (name) => ipcRenderer.send('dialog-request-dir-path', name),
        dialogRequestFilePath: (name, fileExtension) => ipcRenderer.send('dialog-request-file-path', name, fileExtension),
        getFilePathFromDialog: (fx) => ipcRenderer.on('get-file-path-from-dialog', (event, response) => fx(response)),
        getDirPathFromDialog: (fx) => ipcRenderer.on('get-dir-path-from-dialog', (event, response) => fx(response))
    }
);