/**
 * @file Create folders for save the export.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const fs = require('fs')
    , path = require('path');

const envPaths = require('env-paths');
const { data } = envPaths('cosma-cli', { suffix: '' });

const { getTimestampTuple } = require('../core/utils/misc');

/**
 * Get path to store cosmscope file in history
 * @param {string} projectName
 * @param {'global'|'local'} projectScope
 * @returns {Promise<string>}
 */

module.exports = async function(projectName, projectScope) {
    let pathDir;
    switch (projectScope) {
        case 'global':
            pathDir = path.join(data, projectName);
            break;
        case 'local':
            pathDir = path.join(process.env.PWD, 'history');
            break;
        default:
            throw new Error('Unknown project scope');
    }
    const pathFile = path.join(pathDir, `${getTimestampTuple().join('')}.html`);

    return new Promise(async (resolve, reject) => {
        if (fs.existsSync(pathDir) === false) {
            fs.mkdir(pathDir, { recursive: true }, (err) => {
                if (err) { reject(err.message); }
                resolve(pathFile);
            });
        }
        resolve(pathFile);
    });
}