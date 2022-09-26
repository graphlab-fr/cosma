/**
 * @file Script on record window loading
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
    contextBridge,
    ipcRenderer
} = require('electron');

ipcRenderer.on('new-project-result', (event, response) => {
    if (response.isOk) {
        window.close();
    }
});

contextBridge.exposeInMainWorld('api',
    {
        openNewProjectModal: () => ipcRenderer.send('open-modal-projectorigin'),
        openProject: (index) => ipcRenderer.sendSync('open-project', index),
        deleteProject: (index) => ipcRenderer.send('delete-project', index),
        onProjectDelete: (fx) => ipcRenderer.on('project-has-been-delete', (event, index) => fx(index)),
        getList: () => ipcRenderer.sendSync('get-project-list'),
        getCurrentId: () => ipcRenderer.sendSync('get-project-current-id')
    }
);