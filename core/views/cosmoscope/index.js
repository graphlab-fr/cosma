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

const Config = require('../../models/config')
    , windowsModel = require('../../models/windows')
    , window = require('../../../main').mainWindow;

let windowPath, modalView;

const History = require('../../models/history')
    , Graph = require('../../models/graph')
    , Template = require('../../models/template');

module.exports = function (graphParams = [], runLast = false) {

    window.once('ready-to-show', () => {
        window.show();
    })

    window.once('closed', () => {
        app.quit();
    });

    const lastHistoryEntry = History.getLast();

    if (runLast && lastHistoryEntry) {
        console.log(lastHistoryEntry.pathToStore);
        windowPath = path.join(lastHistoryEntry.pathToStore, 'cosmoscope.html');
        window.loadFile(windowPath);
        return;
    }

    graphParams.push('minify');
    
    const graph = new Graph(graphParams)
        , template = new Template(graph)
        , history = new History();

    windowPath = path.join(history.pathToStore, 'cosmoscope.html');

    history.store('cosmoscope.html', template.html);
    history.store('report.json', JSON.stringify(graph.reportToSentences()));

    window.loadFile(windowPath);

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

ipcMain.on("askReload", (event, data) => { window.reload(); });

ipcMain.on("askBack", (event, data) => {
    if (window.webContents.canGoBack()) {
        window.webContents.goBack();
    };
});

ipcMain.on("askForward", (event, data) => {
    if (window.webContents.canGoForward()) {
        window.webContents.goForward();
    };
});

ipcMain.on("askShare", (event, data) => {
    require('../export/index')(window);
});

ipcMain.on("askRecordNew", (event, data) => {
    require('../record/index')();
});

ipcMain.on("askCosmoscopeNew", (event, data) => {
    require('./index')();
});