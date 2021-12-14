const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain, // interface of data exchange
        dialog
    } = require('electron')
    , path = require('path')
    , fs = require('fs');

const windowsModel = require('../../models/windows')
    , Config = require('../../../cosma-core/models/config')
    , Graph = require('../../../cosma-core/models/graph')
    , Template = require('../../../cosma-core/models/template');

let modal;

module.exports = function (window) {

    /**
     * Window
     * ---
     * manage displaying
     */

    if (modal !== undefined) {
        return;
    }

    modal = new BrowserWindow (
        Object.assign(windowsModel.modal, {
            parent: window,
            title: 'Partager le cosmoscope',
            height: 230
        })
    );

    modal.loadFile(path.join(__dirname, './main-source.html'));

    modal.once('ready-to-show', () => {
        modal.show();
    });

    modal.once('closed', () => {
        modal = undefined;
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
    let config = new Config().opts;

    modal.webContents.send("getExportPathFromConfig", config.export_target);
});

ipcMain.on("askExportOptions", (event, data) => {
    let config = new Config();

    let response = {
        citeproc: config.canCiteproc(),
        css_custom: config.canCssCustom()
    };

    modal.webContents.send("getExportOptions", response);
});

ipcMain.on("sendExportOptions", (event, data) => {
    // save the export path into the configuration
    let config = new Config({ export_target: data.export_target });
    config.save();

    const exportPath = path.join(data.export_target, 'cosmoscope.html');

    delete data.export_target;

    let activatedModes = ['publish'];
    for (const mode in data) {
        if (data[mode] === true) {
            activatedModes.push(mode); }
    }

    const graph = new Graph(activatedModes)
        , template = new Template(graph);

    fs.writeFile(exportPath, template.html, (err) => {
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