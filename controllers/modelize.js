const fs = require('fs')
    , path = require('path')
    , getHistorySavePath = require('./history');

const Graph = require('../core/models/graph')
    , Cosmoscope = require('../core/models/cosmoscope')
    , Link = require('../core/models/link')
    , Record = require('../core/models/record')
    , Config = require('../models/config-cli')
    , Template = require('../core/models/template')
    , Report = require('../models/report-cli');

module.exports = async function (options) {
    let config = new Config();

    options['publish'] = true;
    options['citeproc'] = (!!options['citeproc'] && config.canCiteproc());
    options['css_custom'] = (!!options['customCss'] && config.canCssCustom());

    options = Object.entries(options)
        .map(([name, value]) => { return { name, value } })
        .filter(({ value }) => value === true);

    const optionsGraph = options
        .filter(({ name }) => Graph.validParams.has(name))
        .map(({ name }) => name);
    const optionsTemplate = options
        .filter(({ name }) => Template.validParams.has(name))
        .map(({ name }) => name);

    if (optionsGraph.includes('sample')) {
        config = new Config(Config.getSampleConfig());
    }

    const {
        select_origin: originType,
        files_origin: filesPath,
        nodes_online: nodesUrl,
        links_online: linksUrl,
        export_target: exportPath,
        history
    } = config.opts;

    let {
        nodes_origin: nodesPath,
        links_origin: linksPath
    } = config.opts;

    console.log(config.getConfigConsolMessage());

    switch (originType) {
        case 'directory':
            if (config.canModelizeFromDirectory() === false) {
                return console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'Cannot modelize from directory with this config.')
            }
            break;
        case 'csv':
            if (config.canModelizeFromCsvFiles() === false) {
                return console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'Cannot modelize from csv files with this config.')
            }
            break;
        case 'online':
            try {
                await config.canModelizeFromOnline();
            } catch (err) {
                return console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'Cannot modelize from online csv files with this config.')
            }
            break;
    }

    console.log(getModelizeMessage(optionsGraph, optionsTemplate, originType));

    let records;
    switch (originType) {
        case 'directory':
            const files = Cosmoscope.getFromPathFiles(filesPath, config.opts);
            records = Cosmoscope.getRecordsFromFiles(files, config.opts);    
            break;
        case 'online':
            const { downloadFile } = require('../core/utils/misc');
            const { tmpdir } = require('os');
            const tempDir = tmpdir();
            nodesPath = path.join(tempDir, 'cosma-nodes.csv');
            linksPath = path.join(tempDir, 'cosma-links.csv');
            await downloadFile(nodesUrl, nodesPath);
            console.log('- Nodes file downloaded');
            await downloadFile(linksUrl, linksPath);
            console.log('- Links file downloaded');
        case 'csv':
            let [formatedRecords, formatedLinks] = await Cosmoscope.getFromPathCsv(nodesPath, linksPath);
            const links = Link.formatedDatasetToLinks(formatedLinks);
            records = Record.formatedDatasetToRecords(formatedRecords, links, config);
            break;
    }

    const graph = new Cosmoscope(records, config.opts, []);

    const { html } = new Template(graph, optionsTemplate);

    fs.writeFile(exportPath + 'cosmoscope.html', html, (err) => { // Cosmoscope file for export folder
        if (err) {return console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'write Cosmoscope file: ' + err)}
        console.log(['\x1b[34m', 'Cosmoscope generated', '\x1b[0m'].join(''), `(${graph.records.length} records)`);
    });

    if (history) {
        const [projectName,] = Config.currentUsedConfigFileName.split('.', 2);
        const projectScope = Config.currentScope;
        getHistorySavePath(projectName, projectScope)
            .then((filePath) => {
                fs.writeFile(filePath, html, (err) => {
                    if (err) { console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'cannot save Cosmoscope in history folder: ' + err); }
                });
            });
    }

    if (Report.isItEmpty() === false) {
        try {
            await Report.makeDir();
            const pathSaveReport = await Report.save(config.opts.title);
            console.log(Report.getAsMessage());
            console.log(['\x1b[2m', pathSaveReport, '\x1b[0m'].join(''));
        } catch (err) {
            console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'cannot save log file in history folder: ' + err);
        }
    }
}

/**
 * @param {string[]} optionsGraph 
 * @param {string[]} optionsTemplate 
 * @param {string} originType 
 */

function getModelizeMessage(optionsGraph, optionsTemplate, originType) {
    const settings = [...optionsGraph, ...optionsTemplate]
        .filter(setting => setting !== 'publish');

    const msgSetting = settings.length === 0 ? '' : `; settings: \x1b[1m${settings.join(', ')}\x1b[0m`;
    return `Building cosmoscope… (source type: \x1b[1m${originType}\x1b[0m${msgSetting})`;
}