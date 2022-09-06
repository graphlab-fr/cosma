const path = require('path');

const Config = require('../core/models/config')
    , History = require('../models/history')
    , Cosmoscope = require('../core/models/cosmoscope')
    , Link = require('../core/models/link')
    , Record = require('../core/models/record')
    , Template = require('../core/models/template');

const Display = require('../models/display');

// const { cosmocope } = require('../core/utils/generate')

let windowPath;

module.exports = async function (templateParams = [], runLast = false) {
    const window = Display.getWindow('main');

    if (window === undefined) { return; }

    const config = new Config();
    const {
        select_origin: originType,
        files_origin: filesPath,
        nodes_origin: nodesPath,
        links_origin: linksPath
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

    let records;
    switch (originType) {
        case 'csv':
            let [formatedRecords, formatedLinks] = await Cosmoscope.getFromPathCsv(nodesPath, linksPath);
            const links = Link.formatedDatasetToLinks(formatedLinks);
            records = Record.formatedDatasetToRecords(formatedRecords, links, config);
            break;
        case 'directory':
        default:
        const files = Cosmoscope.getFromPathFiles(filesPath);
        records = Cosmoscope.getRecordsFromFiles(files, config.opts);    
        break;
    }

    const graph = new Cosmoscope(records, config.opts, []);

    let { html } = new Template(graph, templateParams)
        , history = new History();

    history.storeCosmoscope(html, graph.report);
    window.loadFile(history.pathToStore);

    windowHistory = Display.getWindow('history');
    if (windowHistory) {
        windowHistory.webContents.send("reset-history");
    }
}