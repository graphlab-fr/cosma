/**
 * @file Cosmoscope displaying
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const {
        app, // app event lifecycle, events
        ipcMain,
        clipboard,
        BrowserWindow // app windows generator
    } = require('electron')
    , path = require('path')
    , fs = require('fs');

const state = require('../../models/state')
    , Config = require('../../models/config')
    , windowsModel = require('../../models/windows')
    , window = require('../../../main').mainWindow;

let cosmoscope, windowPath, modalView;

const History = require('../../models/history');

module.exports = function () {
    
    switch (state.needConfiguration()) {

        /**
         * If the config is not complete or contain errors
         * the app show the exemple graph while waiting for a valid config
         */
    
        case true:
            const exempleGraph = require('../../data/exemple-graph');
            cosmoscope = require('../../models/template')(exempleGraph.files, exempleGraph.entities);

            windowPath = path.join(app.getPath('temp'), 'cosmoscope-exemple.html');

            fs.writeFileSync(windowPath, cosmoscope);
            break;
    
        case false:
            const graph = require('../../models/graph')()
            cosmoscope = require('../../models/template')(graph.files, graph.entities);

            const history = new History();
            windowPath = path.join(history.pathToStore, 'cosmoscope.html');

            history.store('cosmoscope.html', cosmoscope);
            break;
    }

    window.loadFile(windowPath);
    
    window.once('ready-to-show', () => {
        window.show();
    })

}

ipcMain.on("askNewViewModal", (event, data) => {
    modalView = new BrowserWindow (
        Object.assign(windowsModel.modal, {
            parent: window,
            title: 'Nouvelle vue'
        })
    );

    modalView.loadFile(path.join(__dirname, './modal-view-source.html'));

    modalView.once('ready-to-show', () => {
        modalView.show();
        modalView.webContents.send("getNewViewKey", clipboard.readText());
    });
});

ipcMain.on("sendViewName", (event, data) => {
    let config = new Config();

    const views = config.opts.views || {};

    views[data.name] = data.key;

    config = new Config({
        views: views
    });

    let result = config.save()
        , response;

    if (result === true) {
        response = {
            isOk: true,
            consolMsg: "La nouvelle vue a bien été enregistré dans la configuration.",
            data: data
        };

        window.webContents.send('confirmViewRegistration', response);
        modalView.close();
    } else if (result === false) {
        response = {
            isOk: false,
            consolMsg: "La nouvelle vue n'a pas pu être enregistrée dans la configuration.",
            data: {}
        };

        modalView.webContents.send("confirmNewRecordTypeFromConfig", response);
    } else {
        response = {
            isOk: false,
            consolMsg: "La configuration saisie est invalide. Veuillez apporter les corrections suivantes : " + result.join(' '),
            data: {}
        };

        modalView.webContents.send("confirmNewRecordTypeFromConfig", response);
    }
});