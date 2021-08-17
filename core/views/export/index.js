const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain, // interface of data exchange
        dialog
    } = require('electron')
    , path = require('path')
    , fs = require('fs');

const windowsModel = require('../../models/windows')
    , Config = require('../../models/config');

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

    modal.loadFile(path.join(__dirname, './main-source.html'));

    modal.once('ready-to-show', () => {
        modal.show();
    });

    
}

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

ipcMain.on("askExportPathFromConfig", (event, data) => {
    let config = new Config();

    if (config.opts.export_path !== undefined) {
        modal.webContents.send("getExportPathFromConfig", {
            isOk: true,
            data: config.opts.export_path
        });
    } else {
        modal.webContents.send("getExportPathFromConfig", {
            isOk: false,
            data: {}
        });
    }
});

ipcMain.on("sendExportOptions", (event, data) => {

    // save the export path into the configuration
    let config = new Config({ export_path: data.export_path });
    config.save();

    data.export_path = path.join(data.export_path, 'cosmoscope.html');

    const graph = require('../../models/graph')()
    cosmoscope = require('../../models/template')(graph.files, graph.entities);

    fs.writeFile(data.export_path, cosmoscope, (err) => {
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