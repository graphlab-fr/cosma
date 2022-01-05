const { dialog } = require('electron')
    , path = require('path');

const Config = require('../cosma-core/models/config')
    , History = require('../models/history')
    , Graph = require('../cosma-core/models/graph')
    , Template = require('../cosma-core/models/template');

const Display = require('../models/display');

let windowPath;

module.exports = function (graphParams = [], runLast = false) {
    const window = Display.getWindow('main');

    if (window === undefined) { return; }

    const config = new Config();
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