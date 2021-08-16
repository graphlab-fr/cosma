const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain // interface of data exchange
    } = require('electron')
    , path = require('path')
    , moment = require('moment');

moment.locale('fr-ca');

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
        const historyRecords = History.getList()
            .map(function (record) {
                splitDate = record.split('-');

                return {
                    forHuman: moment(splitDate).format('L, LTS'),
                    forSystem: record
                };
            })
        
        window.webContents.send("getHistoryList", historyRecords);
    });

    ipcMain.on("sendCosmoscopeFromHistoryList", (event, date) => {
        const cosmoscopePath = path.join(History.path, date, 'cosmoscope.html');
        mainWindow.webContents.loadFile(cosmoscopePath);
    });
}