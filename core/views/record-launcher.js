const {
    app, // app event lifecycle, events
    BrowserWindow, // app windows generator
    ipcMain // interface of data exchange
} = require('electron')
, path = require('path');

module.exports = function () {

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
    title: 'Nouvelle fiche'
    })
    
    window.loadFile(path.join(__dirname, './record-source.html'));
    
    ipcMain.on("sendRecordContent", (event, data) => {
        const Record = require('../models/record')
            , record = new Record(data.title, data.type, data.tags);
    
        const result = record.save();
    
        if (result === true) {
            window.webContents.send("confirmRecordSaving", true);
        } else {
            window.webContents.send("confirmRecordSaving", false);
        }
    });

}