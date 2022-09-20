const { app, dialog } = require('electron');

const fs = require('fs')
    , path = require('path');

const ProjectConfig = require('../models/project-config')
    , History = require('../models/history')
    , Cosmoscope = require('../core/models/cosmoscope')
    , Link = require('../core/models/link')
    , Record = require('../core/models/record')
    , Template = require('../core/models/template')
    , lang = require('../core/models/lang');

const Display = require('../models/display');

let windowPath;

module.exports = async function (templateParams = [], runLast = false, fake = false) {
    const window = Display.getWindow('main');

    if (window === undefined) { return; }

    if (fake) {
        const { cosmocope: generateFake, tempDirPath } = require('../core/utils/generate');
        const { graph } = await generateFake(tempDirPath);
        window.loadFile(path.join(tempDirPath, 'cosmoscope.html'));
        fs.writeFile(path.join(app.getPath('userData'), 'folks.json'), graph.getFolksonomyAsText(), (err) => {});
        return;
    }

    const config = new ProjectConfig();
    const {
        select_origin: originType,
        files_origin: filesPath,
        nodes_online: nodesUrl,
        links_online: linksUrl
    } = config.opts;
    let {
        nodes_origin: nodesPath,
        links_origin: linksPath
    } = config.opts;
    const lastHistoryEntry = History.getLast();

    if (runLast === true && lastHistoryEntry !== undefined) {
        windowPath = path.join(lastHistoryEntry.pathToStore);
        window.loadFile(windowPath);
        return;
    }

    switch (originType) {
        case 'csv':
            if (config.canModelizeFromCsvFiles() === false) {
                dialog.showMessageBox(window, {
                    title: lang.getFor(lang.i.dialog.error_modelize.title),
                    message: lang.getFor(lang.i.dialog.error_modelize.message_source_csv),
                    type: 'error'
                });
            }
            return;
        case 'directory':
            if (config.canModelizeFromDirectory() === false) {
                dialog.showMessageBox(window, {
                    title: lang.getFor(lang.i.dialog.error_modelize.title),
                    message: lang.getFor(lang.i.dialog.error_modelize.message_source_directory),
                    type: 'error'
                });
            }
            break;
        case 'online':
            if (await config.canModelizeFromOnline() === false) {
                dialog.showMessageBox(window, {
                    title: lang.getFor(lang.i.dialog.error_modelize.title),
                    message: lang.getFor(lang.i.dialog.error_modelize.message_source_online),
                    type: 'error'
                });
            }
            break;
    }

    templateParams.push('minify');

    if (config.canCssCustom() === true) {
        templateParams.push('css_custom'); }

    let records;
    switch (originType) {
        case 'online':
            const { downloadFile } = require('../core/utils/misc');
            const tempDir = app.getPath('temp');
            nodesPath = path.join(tempDir, 'cosma-nodes.csv');
            linksPath = path.join(tempDir, 'cosma-links.csv');
            await downloadFile(nodesUrl, nodesPath);
            await downloadFile(linksUrl, linksPath);
        case 'csv':
            let [formatedRecords, formatedLinks] = await Cosmoscope.getFromPathCsv(nodesPath, linksPath);
            const links = Link.formatedDatasetToLinks(formatedLinks);
            records = Record.formatedDatasetToRecords(formatedRecords, links, config);
            break;
        case 'directory':
            const files = Cosmoscope.getFromPathFiles(filesPath, config.opts);
            records = Cosmoscope.getRecordsFromFiles(files, config.opts);    
        break;
    }

    const graph = new Cosmoscope(records, config.opts, []);
    fs.writeFile(path.join(app.getPath('userData'), 'folks.json'), graph.getFolksonomyAsText(), (err) => {});

    let { html } = new Template(graph, templateParams)
        , history = new History();

    fs.writeFile(path.join(history.pathToStore), html, (err) => {
        if (err) { throw new ErrorSaveCosmoscope("Can not save and open Cosmoscope"); }

        history.registerCosmoscope();
        window.loadFile(history.pathToStore);
        windowHistory = Display.getWindow('history');
        if (windowHistory) {
            windowHistory.webContents.send("reset-history");
        }
    });

}

class ErrorSaveCosmoscope extends Error {
    constructor(message) {
      super(message);
      this.name = 'Error save Cosmocope';
    }
}