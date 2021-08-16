/**
 * @file Manage the history of cosmocopes generations
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const {
        app, // app event lifecycle, events
        BrowserWindow // app windows generator
    } = require('electron')
    , fs = require('fs')
    , path = require('path')
    , moment = require('moment');

moment.locale('fr-ca');

const Config = require('./config')
    config = new Config();

module.exports = class History {

    static path = path.join(app.getPath('temp'), 'cosma-history');
    static noHistorypath = app.getPath('temp');

    /**
     * Get list of the sub-directories name from the history directory
     * @return {array} - List of sub-directories names
     */

    static getList () {
        return fs.readdirSync(History.path, 'utf8');
    }

    constructor () {

        this.moment = moment().format('YYYY-MM-DD-h-mm-ss');

        if (config.opts.history) {
            this.pathToStore = path.join(History.path, this.moment);
        } else {
            this.pathToStore = History.noHistorypath;
        }

        if (!fs.existsSync(History.path)) {
            fs.mkdirSync(History.path);
        }

        if (!fs.existsSync(this.pathToStore)) {
            fs.mkdirSync(this.pathToStore);
        }

    }

    store (fileName, fileContent) {
        try {
            fs.writeFileSync(path.join(this.pathToStore, fileName), fileContent);

            return true;
        } catch (error) {
            return false;
        }
    }

}