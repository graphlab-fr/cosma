/**
 * @file Cosmoscope displaying
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
        app, // app event lifecycle, events
        ipcMain,
        clipboard,
        dialog,
        shell,
        BrowserWindow // app windows generator
    } = require('electron')
    , path = require('path')
    , fs = require('fs');

const Config = require('../../../cosma-core/models/config')
    , Display = require('../../models/display')
    , windowsModel = require('../../models/windows');

let windowPath, window;

const History = require('../../models/history')
    , Graph = require('../../../cosma-core/models/graph')
    , Template = require('../../../cosma-core/models/template');

module.exports = function (graphParams = [], runLast = false) {

    window = Display.getWindow('main');

    const config = new Config();

    window.once('ready-to-show', () => {
        window.show();
    });

    window.on('resized', () => {
        Display.storeSpecs('main', window);
    });

    window.on('moved', () => {
        Display.storeSpecs('main', window);
    });

    window.on('maximize', () => {
        Display.storeSpecs('main', window);
    });

    window.on('unmaximize', () => {
        const winSpecs = Display.getWindowSpecs('main');
        window.setSize(winSpecs.width, winSpecs.height, true);
        window.setPosition(winSpecs.x, winSpecs.y, true);
        Display.storeSpecs('main', window);
    });

    window.once('close', () => {
        Display.emptyWindow('main');
    });

    window.once('closed', () => {
        app.quit();
    });

    window.webContents.on('will-navigate', function(e, url) {
        e.preventDefault();
        shell.openExternal(url);
    });

    const lastHistoryEntry = History.getLast();

    if (runLast === true && lastHistoryEntry) {
        windowPath = path.join(lastHistoryEntry.pathToStore, 'cosmoscope.html');
        window.loadFile(windowPath);
        return;
    }

    graphParams.push('minify');

    if (config.canCssCustom() === true) {
        graphParams.push('css_custom'); }

    let graph = new Graph(graphParams);

    if (graph.errors.length > 0) {
        dialog.showMessageBox(window, {
            message: graph.errors.join('. '),
            type: 'error',
            title: "Erreur de génération du graphe"
        });

        graph = new Graph(['empty']);
    }

    let template = new Template(graph)
        , history = new History();

    windowPath = path.join(history.pathToStore, 'cosmoscope.html');

    history.store('cosmoscope.html', template.html);
    history.store('report.json', JSON.stringify(graph.reportToSentences()));

    window.loadFile(windowPath);
}

ipcMain.on("askReload", (event) => { window.reload(); });

ipcMain.on("askBack", (event) => {
    if (window.webContents.canGoBack()) {
        window.webContents.goBack();
    };
});

ipcMain.on("askForward", (event) => {
    if (window.webContents.canGoForward()) {
        window.webContents.goForward();
    };
});

ipcMain.on("askShare", (event) => {
    require('../export/index')(window);
});

ipcMain.on("askRecordNew", (event) => {
    require('../record/index')();
});

ipcMain.on("askCosmoscopeNew", (event) => {
    require('./index')();
});