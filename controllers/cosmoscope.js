const { app, dialog } = require('electron');

const fs = require('fs')
    , path = require('path');

const Cosmoscope = require('../core/models/cosmoscope')
    , Report = require('../core/models/report')
    , Link = require('../core/models/link')
    , Record = require('../core/models/record')
    , Template = require('../core/models/template')
    , lang = require('../core/models/lang');

const Display = require('../models/display')
    , History = require('../models/history')
    , ProjectConfig = require('../models/project-config')
    , Project = require('../models/project');

let windowPath;

module.exports = async function (templateParams = [], runLast = false, fake = false) {
    const window = Display.getWindow('main');

    if (window === undefined) { return; }

    if (fake) {
        const { cosmocope: generateFake, tempDirPath } = require('../core/utils/generate');
        const { graph } = await generateFake(tempDirPath);
        window.loadFile(path.join(tempDirPath, 'cosmoscope.html'));
        return;
    }

    const config = new ProjectConfig();
    const {
        select_origin: originType,
        files_origin: filesPath,
        nodes_online: nodesUrl,
        links_online: linksUrl,
        history: isHistoryActive
    } = config.opts;
    let {
        nodes_origin: nodesPath,
        links_origin: linksPath
    } = config.opts;
    const currentProject = Project.getCurrent();

    if (runLast === true && currentProject.history.size > 0) {
        const lastHistoryItemfromCurrentProject = Array.from(currentProject.history)[currentProject.history.size-1][1];
        const { path } = lastHistoryItemfromCurrentProject;
        window.loadFile(path);
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

    Report.reset();

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
    currentProject.folksonomy = graph.getFolksonomyAsObjectOfArrays();

    let { html } = new Template(graph, templateParams);

    let historyId;
    if (isHistoryActive === false && currentProject.history.size > 0) {
        const [lastHistoryRecordId, lastHistoryRecordValues] = Array.from(currentProject.history)[currentProject.history.size-1];
        if (lastHistoryRecordValues.isTemp) {
            historyId = lastHistoryRecordId;
        }
    } else {
        historyId = History.generateId();
    }
    const historyPath = path.join(History.dirPath, `${historyId}.html`);
    const reportPath = path.join(History.dirPath, `${historyId}-report.html`);

    fs.writeFile(historyPath, html, 'utf-8', (err) => {
        if (err) { throw new ErrorSaveCosmoscope("Can not save and open Cosmoscope"); }
        window.loadFile(historyPath);
        window.once('ready-to-show', () => { window.show(); });

        currentProject.history.set(historyId, new History(historyPath));
        fs.writeFile(reportPath, Report.getAsHtmlFile(), 'utf-8', (err) => {
            if (err) { throw new Error("Can not save report"); }
            currentProject.history.get(historyId).pathReport = reportPath;
        });

        window.once('ready-to-show', () => {
            setTimeout(() => {
                window.capturePage()
                    .then((image) => {
                        const { width, height } = image.getSize();
                        image = image.crop({ x: 500, y: 0, width: width - 500, height: height - 100 })
                        image = image.resize({ width: 300, quality: 'best'})
                        const imageBuffer = image.toJPEG(70);
                        const imageBase64 = imageBuffer.toString('base64');
                        currentProject.thumbnail = imageBase64;
                    })
            }, 1000);
        });


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