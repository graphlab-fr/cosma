const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain, // interface of data exchange
        dialog
    } = require('electron')
    , path = require('path')
    , fs = require('fs');

const windowsModel = require('../../models/windows')
    , Config = require('../../models/config')
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
            title: 'Partager le cosmoscope'
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

ipcMain.on("askExportOptions", (event, data) => {
    let config = new Config().opts;

    let response = {
        citeproc: false
    };

    if (config['bibliography'] && config['csl'] && config['bibliography_locales']) {
        response.citeproc = true; }

    modal.webContents.send("getExportOptions", response);
});

ipcMain.on("sendExportOptions", (event, data) => {
    // save the export path into the configuration
    let config = new Config({ export_path: data.export_path });
    config.save();

    const exportPath = path.join(data.export_path, 'cosmoscope.html');

    delete data.export_path;

    let activatedModes = ['publish'];
    for (const mode in data) {
        if (data[mode] === true) {
            activatedModes.push(mode); }
    }

    const graph = new Graph(activatedModes, config.serializeForGraph())
        , template = new Template(graph, config.serializeForTemplate());

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