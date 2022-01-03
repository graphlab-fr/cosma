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

const Config = require('../../cosma-core/models/config')
    , Display = require('../../models/display');

let windowPath, window;

const History = require('../../models/history')
    , Graph = require('../../cosma-core/models/graph')
    , Template = require('../../cosma-core/models/template');

module.exports = function (graphParams = [], runLast = false) {
    const pageName = 'main';

    window = Display.getWindow(pageName);

    const config = new Config();

    window.once('ready-to-show', () => {
        window.show();
    });

    window.on('resized', () => {
        Display.storeSpecs(pageName, window);
    });

    window.on('moved', () => {
        Display.storeSpecs(pageName, window);
    });

    window.on('maximize', () => {
        Display.storeSpecs(pageName, window);
    });

    window.on('unmaximize', () => {
        let windowSpecs = Display.getWindowSpecs(pageName);
        window.setSize(windowSpecs.width, windowSpecs.height, true);
        window.setPosition(windowSpecs.x, windowSpecs.y, true);
        Display.storeSpecs(pageName, window);
    });

    window.once('close', () => {
        Display.emptyWindow(pageName);
    });

    window.once('closed', () => {
        app.quit();
    });

    window.webContents.on('will-navigate', function(e, url) {
        e.preventDefault();
        shell.openExternal(url);
    });

    const lastHistoryEntry = History.getLast();

    if (runLast === true && lastHistoryEntry !== undefined) {
        windowPath = path.join(lastHistoryEntry.pathToStore);
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

    history.storeCosmoscope(template.html, graph.report);

    window.loadFile(history.pathToStore);

    windowHistory = Display.getWindow('history');
    if (windowHistory) {
        windowHistory.webContents.send("reset-history");
    }
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