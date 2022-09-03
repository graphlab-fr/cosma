const path = require('path');

const Config = require('../core/models/config')
    , History = require('../models/history')
    , Cosmoscope = require('../core/models/cosmoscope')
    , Template = require('../core/models/template');

const Display = require('../models/display');

// const { cosmocope } = require('../core/utils/generate')

let windowPath;

module.exports = function (templateParams = [], runLast = false) {
    const window = Display.getWindow('main');

    if (window === undefined) { return; }

    const config = new Config();
    const {
        files_origin: filesPath
    } = config.opts;
    const lastHistoryEntry = History.getLast();

    if (runLast === true && lastHistoryEntry !== undefined) {
        windowPath = path.join(lastHistoryEntry.pathToStore);
        window.loadFile(windowPath);
        return;
    }

    templateParams.push('minify');

    if (config.canCssCustom() === true) {
        templateParams.push('css_custom'); }

    const files = Cosmoscope.getFromPathFiles(filesPath);
    const records = Cosmoscope.getRecordsFromFiles(files, config.opts);    
    const graph = new Cosmoscope(records, config.opts, []);

    // if (graph.errors.length > 0) {
    //     dialog.showMessageBox(window, {
    //         message: graph.errors.join('. '),
    //         type: 'error',
    //         title: "Erreur de génération du graphe"
    //     });

    //     graph = new Cosmoscope(['empty']);
    // }

    let { html } = new Template(graph, templateParams)
        , history = new History();

    history.storeCosmoscope(html, graph.report);

    // const tempDirPath = path.join(__dirname, '../core/temp');
    // if (fs.existsSync(tempDirPath) === false) {
    //     fs.mkdirSync(tempDirPath);
    // }

    // cosmocope(app.getPath('userData')).then(({ savePath }) => {
    //     window.loadFile(savePath);
    // })

    

    window.loadFile(history.pathToStore);

    windowHistory = Display.getWindow('history');
    if (windowHistory) {
        windowHistory.webContents.send("reset-history");
    }
}