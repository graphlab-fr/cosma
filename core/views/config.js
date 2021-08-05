const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain // interface of data exchange
    } = require('electron')
    , path = require('path');

const Config = require('../models/config');

let window = new BrowserWindow ({
    width: 800,
    height: 500,
    webPreferences: {
        allowRunningInsecureContent: false,
        contextIsolation: true,
        enableRemoteModule: false,
        nodeIntegration: false,
        sandbox: true,
        preload: path.join(__dirname, '../controller.js')
    },
    title: 'Configuration'
})

window.loadFile(path.join(__dirname, './config.html'));

ipcMain.on("sendConfigOptions", (event, data) => {
    const config = new Config({
            files_origin: data.files_origin,
            export_target: data.export_target,
            focus_max: data.focus_max
        });

    config.save();

    if (config.isSet()) {
        window.webContents.send("confirmConfigRegistration", true);
    } else {
        window.webContents.send("confirmConfigRegistration", false);
    }
});