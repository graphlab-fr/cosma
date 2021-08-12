/**
 * @file Cosmoscope displaying
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const {
        app, // app event lifecycle, events
        BrowserWindow // app windows generator
    } = require('electron')
    , path = require('path')
    , fs = require('fs');

const state = require('../models/state')
    , window = require('../../main').mainWindow;

let cosmoscope, windowPath;

const History = require('../models/history');

module.exports = function () {
    
    switch (state.needConfiguration()) {

        /**
         * If the config is not complete or contain errors
         * the app show the exemple graph while waiting for a valid config
         */
    
        case true:
            const exempleGraph = require('../data/exemple-graph');
            cosmoscope = require('../models/template')(exempleGraph.files, exempleGraph.entities);

            windowPath = path.join(app.getPath('temp'), 'cosmoscope-exemple.html');

            fs.writeFileSync(windowPath, cosmoscope);
            break;
    
        case false:
            const graph = require('../models/graph')()
            cosmoscope = require('../models/template')(graph.files, graph.entities);

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