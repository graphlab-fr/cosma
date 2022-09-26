const {
        ipcMain,
        dialog,
        BrowserWindow
    } = require('electron')
    , fs = require('fs')
    , path = require('path');

const Cosmoscope = require('../core/models/cosmoscope')
    , Template = require('../core/models/template');

const Display = require('../models/display')
    , ProjectConfig = require('../models/project-config');

ipcMain.on("get-export-options", (event) => {
    const config = new ProjectConfig();

    event.returnValue = {
        citeproc: config.canCiteproc(),
        css_custom: config.canCssCustom()
    };
});

ipcMain.on("can-modelize-with-source-options", (event) => {
    const config = new ProjectConfig();
    const { select_origin: originType } = config.opts;

    switch (originType) {
        case 'csv':
            event.returnValue = config.canModelizeFromCsvFiles();
            return;
        case 'directory':
            event.returnValue = config.canModelizeFromDirectory();
            return;
    }
});

ipcMain.on("export-cosmoscope", async (event, templateParams) => {
    const config = new ProjectConfig()
    const {
        select_origin: originType,
        files_origin: filesPath,
        nodes_origin: nodesPath,
        links_origin: linksPath,
        export_target: exportPath
    } = config.opts;

    const window = Display.getWindow('export');
    if (!window) { return; }

    templateParams = {
        citeproc: (config.canCiteproc() === true && templateParams['citeproc'] === true),
        css_custom: (config.canCssCustom() === true && templateParams['css_custom'] === true)
    }

    templateParams = Object.entries(templateParams)
        .filter(([name, value]) => value === true)
        .map(([name, value]) => name);

    let records;
    switch (originType) {
        case 'csv':
            let [formatedRecords, formatedLinks] = await Cosmoscope.getFromPathCsv(nodesPath, linksPath);
            const links = Link.formatedDatasetToLinks(formatedLinks);
            records = Record.formatedDatasetToRecords(formatedRecords, links, config);
            break;
        case 'directory':
        const files = Cosmoscope.getFromPathFiles(filesPath);
        records = Cosmoscope.getRecordsFromFiles(files, config.opts);    
        break;
    }

    const graph = new Cosmoscope(records, config.opts);
    const { html } = new Template(graph, ['publish', ...templateParams]);

    fs.writeFile(path.join(exportPath, 'cosmoscope.html'), html, 'utf-8', (err) => {
        window.webContents.send("export-result", {
            isOk: err === null,
            message: err
        });
    });
});