const { ipcMain } = require('electron');

ipcMain.on("open-modal-typerecord", (event, recordType, action) => {
    require('../core/views/modal-typerecord')(recordType, action);
});