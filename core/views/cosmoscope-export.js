const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain, // interface of data exchange
        dialog,
        globalShortcut
    } = require('electron')
    , path = require('path')
    , fs = require('fs');
const { resourceUsage } = require('process');

const windowsModel = require('../models/windows');

const cosmoscopePath = path.join(app.getPath('userData'), 'cosmoscope.html');

let modal;

module.exports = function (window) {

    /**
     * Window
     * ---
     * manage displaying
     */

    modal = new BrowserWindow (
        Object.assign(windowsModel.modal, {
            parent: window,
            title: 'Exporter un cosmoscope'
        })
    );

    modal.loadFile(path.join(__dirname, './cosmoscope-export.html'));

    modal.once('ready-to-show', () => {
        modal.show();
    });

    /**
     * API
     * ---
     * manage data
     */

    ipcMain.on("askExportPath", (event, data) => {

        dialog.showOpenDialog(modal, {
            title: 'Sélectionner répertoire d\'export cosmoscope',
            defaultPath: app.getPath('documents'),
            properties: ['openDirectory']
        }).then((response) => {
            modal.webContents.send("getExportPath", {
                isOk: !response.canceled,
                data: response.filePaths
            });
        });

    });

    ipcMain.on("sendExportOptions", (event, data) => {

        fs.copyFile(cosmoscopePath, data.export_path, (err) => {
            if (err) {
                modal.webContents.send("confirmExport", {
                    isOk: false,
                    consolMsg: `Le cosmoscope n'a pas pu être exporté : ${err}.`,
                    data: {}
                });

                return;
            }

            modal.webContents.send("confirmExport", {
                isOk: true,
                consolMsg: 'Le cosmoscope a bien été exporté.',
                data: {}
            });

            modal.close();
        });

    });

}