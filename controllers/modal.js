const { ipcMain } = require('electron');

ipcMain.on("open-modal-typerecord", (event, recordType, action) => {
    require('../views/modal-typerecord').open(recordType, action);
});

ipcMain.on("open-modal-typelink", (event, linkType, action) => {
    require('../views/modal-typelink').open(linkType, action);
});

ipcMain.on("open-modal-view", (event, viewName, action) => {
    require('../views/modal-view').open(viewName, action);
});

ipcMain.on("open-modal-historyrename", (event, recordId) => {
    require('../views/modal-historyrename').open(recordId);
});