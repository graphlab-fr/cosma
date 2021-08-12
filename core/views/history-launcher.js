const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain // interface of data exchange
    } = require('electron')
    , path = require('path');

const windowsModel = require('../models/windows')
    , mainWindow = require('../../main').mainWindow
    , History = require('../models/history');

module.exports = function () {

    /**
     * Window
     * ---
     * manage displaying
     */

    window = new BrowserWindow (
        Object.assign(windowsModel.modal, {
            title: 'Historique',
            parent: mainWindow
        })
    );

    window.loadFile(path.join(__dirname, './history-source.html'));

    window.once('ready-to-show', () => {
        window.show();
    });

    /**
     * API
     * ---
     * manage data
     */

     ipcMain.on("askHistoryList", (event, data) => {
        window.webContents.send("getHistoryList", History.getList());
    });

    ipcMain.on("sendCosmoscopeFromHistoryList", (event, date) => {
        const cosmoscopePath = path.join(History.path, date, 'cosmoscope.html');
        mainWindow.webContents.loadFile(cosmoscopePath);
    });
}