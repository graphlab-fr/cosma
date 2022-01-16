const {
        ipcMain,
        dialog,
        BrowserWindow
    } = require('electron')
    , fs = require('fs')
    , path = require('path');

const Config = require('../core/models/config')
    , Graph = require('../core/models/graph')
    , Template = require('../core/models/template');

ipcMain.on("get-export-options", (event) => {
    const config = new Config();

    event.returnValue = {
        citeproc: config.canCiteproc(),
        css_custom: config.canCssCustom()
    };
});

ipcMain.on("export-cosmoscope", (event, graphParams) => {
    const config = new Config()
        , window = BrowserWindow.getFocusedWindow();

    graphParams = {
        citeproc: (config.canCiteproc() === true && graphParams['citeproc'] === true),
        css_custom: (config.canCssCustom() === true && graphParams['css_custom'] === true)
    }
    
    for (const param in graphParams) {
        if (graphParams[param] === false) { delete graphParams[param]; }
    }

    graphParams = Object.keys(graphParams);
    graphParams.push('publish');

    let graph = new Graph(graphParams);

    if (graph.errors.length > 0) {
        dialog.showMessageBox(window, {
            message: graph.errors.join('. '),
            type: 'error',
            title: "Erreur de génération du graphe"
        });
        
        event.returnValue = false;
    }

    let template = new Template(graph);
    
    fs.writeFileSync(path.join(config.opts.export_target, 'cosmoscope.html'), template.html);
    event.returnValue = true;
});