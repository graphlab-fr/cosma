/**
 * @file Manage the history of cosmocopes generations
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const {
        app, // app event lifecycle, events
    } = require('electron')
    , fs = require('fs')
    , path = require('path')
    , moment = require('moment')
    , rimraf = require('rimraf');

moment.locale('fr-ca');

const Config = require('./config')
    config = new Config();

module.exports = class History {

    static path = path.join(app.getPath('temp'), 'cosma-history');
    static noHistoryPath = app.getPath('temp');

    /**
     * Get list of the sub-directories name from the history directory
     * @return {array} - List of sub-directories names
     */

    static getList () {
        return fs.readdirSync(History.path, 'utf8')
            .map(function (dirName) {
                const hist = new History(dirName);

                return {
                    id: dirName,
                    name: hist.metas.name
                }
            })
    }

    /**
     * Dalate an history directory
     * @return {boolean} - If the directory is delete
     */

    static delete (date) {
        try {
            rimraf.sync(path.join(History.path, date));

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Dalate an history directory
     * @param {string} id - Name of the directory to use as a history entry
     */

    constructor (id = '') {

        if (!fs.existsSync(History.path)) { fs.mkdirSync(History.path); }

        if (id === '') {
            this.id = moment().format('YYYY-MM-DD-h-mm-ss');
        } else {
            const pathToStoreTest = path.join(History.path, id)
                , pathToMetasTest = path.join(pathToStoreTest, 'metas.json');

            if (!fs.existsSync(pathToStoreTest) || !fs.existsSync(pathToMetasTest)) {
                throw 'Record history no exist';
            }
            this.id = id;
        }

        if (config.opts.history === false && id === '') {
            this.pathToStore = History.noHistoryPath;
            return;
        }

        this.pathToStore = path.join(History.path, this.id);
        this.pathToMetas = path.join(this.pathToStore, 'metas.json');

        if (id === '') {
            fs.mkdirSync(this.pathToStore);
            this.metas = {
                name: this.id
            };
            this.saveMetas();
        } else {
            this.metas = this.getMetas();
        }

    }

    /**
     * Save a file into the current history directory
     * @return {boolean} - If the file is saved
     */

    store (fileName, fileContent) {
        try {
            fs.writeFileSync(path.join(this.pathToStore, fileName), fileContent);

            return true;
        } catch (error) {
            return false;
        }
    }

    saveMetas () {
        fs.writeFileSync(this.pathToMetas, JSON.stringify(this.metas));
    }

    getMetas () {
        let content = fs.readFileSync(this.pathToMetas, 'utf-8');
        return JSON.parse(content);
    }

}