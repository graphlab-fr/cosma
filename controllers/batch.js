/**
 * @file Create several records from a JSON data file
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const fs = require('fs')
    , path = require('path')
    , { parse } = require("csv-parse/sync");

const Cosmoscope = require('../core/models/cosmoscope')
    , Record = require('../core/models/record')
    , Config = require('../models/config-cli');

module.exports = function (filePath) {
    const config = new Config();
    console.log(config.getConfigConsolMessage());

    if (fs.existsSync(filePath) === false) {
        return console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'Data file does not exist.'); }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'Cannot read data file.'); }

        switch (path.extname(filePath)) {
            case '.json':
                try {
                    data = JSON.parse(data);
                } catch (error) {
                    return console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'JSON data file is invalid.');
                }
                break;

            case '.csv':
                try {
                    data = parse(data, {
                        columns: true,
                        skip_empty_lines: true
                    }).map(line => Record.getFormatedDataFromCsvLine(line));
                } catch (error) {
                    return console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'CSV data file is invalid.');
                }
                break;

                default:
                    return console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'Data file format unrecognized. Supported file extensions: .json, .csv.');
        }

        const { files_origin } = config.opts;
        const index = Cosmoscope.getIndexToMassSave(files_origin);
        Record.massSave(data, index, config.opts)
            .then(() => {
                return console.log(['\x1b[32m', 'Records created', '\x1b[0m'].join(''), `(${data.length})`, ['\x1b[2m', files_origin, '\x1b[0m'].join(''))
            })
            .catch((err) => {
                return console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err);
            });
    })
}