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
    , windowsModel = require('../models/windows');

let window, cosmoscope;

module.exports = function () {

    window = new BrowserWindow(windowsModel.main);
    
    const cosmoscopePath = path.join(app.getPath('userData'), 'cosmoscope.html');
    
    switch (state.needConfiguration()) {

        /**
         * If the config is not complete or contain errors
         * the app show the exemple graph while waiting for a valid config
         */
    
        case true:
            const exempleGraph = require('../data/exemple-graph');
            cosmoscope = require('../models/template')(exempleGraph.files, exempleGraph.entities);
            break;
    
        case false:
            const graph = require('../models/graph')()
            cosmoscope = require('../models/template')(graph.files, graph.entities);
            break;
    }
    
    fs.writeFileSync(cosmoscopePath, cosmoscope);
    window.loadFile(cosmoscopePath);
    
    window.once('ready-to-show', () => {
        window.show();
    })

}