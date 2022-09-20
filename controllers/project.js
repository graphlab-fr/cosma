const {
    ipcMain,
    dialog,
    BrowserWindow
} = require('electron');

const Project = require('../models/project');

ipcMain.on("get-project-list", (event) => {
    event.returnValue = Project.list;
});