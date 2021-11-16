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
    , moment = require('moment');

moment.locale('fr-ca');

const Config = require('./config');

module.exports = class History {

    static path = path.join(app.getPath('temp'), 'cosma-history');

    /**
     * Get list of the sub-directories name from the history directory
     * @return {array} - List of sub-directories names
     */

    static getList () {
        try {
            return fs.readdirSync(History.path, 'utf8')
                .filter(dirName => dirName !== '.DS_Store')
                .map(function (dirName) {
                    const hist = new History(dirName);
                    return hist;
                })
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    static deleteAll () {
        const records = History.getList();

        try {
            for (const record of records) {
                record.delete();
            }

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static getLast () {
        const records = History.getList()
            .sort((a, b) => { a.ctime - b.ctime })

        return records[records.length - 1];
    }

    /**
     * Dalate an history directory
     * @param {string} id - Name of the directory to use as a history entry
     */

    constructor (id = null) {
        this.config = new Config().opts;

        if (id === null) {
            this.id = moment().format('YYYY-MM-DD-h-mm-ss');
        } else {
            const pathToStoreTest = path.join(History.path, id)
                , pathToMetasTest = path.join(pathToStoreTest, 'metas.json');

            if (!fs.existsSync(pathToStoreTest) || !fs.existsSync(pathToMetasTest)) {

                if (!fs.existsSync(pathToMetasTest)) {
                    // if the dir doesn't contain the metas.json file
                    fs.rmdirSync(pathToStoreTest, { recursive: true });
                }

                return 'Record history no exist';
            }
            this.id = id;
        }

        this.pathToStore = path.join(History.path, this.id);
        this.pathToMetas = path.join(this.pathToStore, 'metas.json');
        this.pathToReport = path.join(this.pathToStore, 'report.json');

        this.metas = {
            date: moment().format('LLLL'),
            description: '',
            // if history param is false, this history record is temporary
            isTemp: !this.config.history
        };

        if (id === null && this.config.history === false) {
            // the user does not want to automatically save more versions
            // we replace the last one
            const lastRecord = History.getLast();

            if (lastRecord !== undefined && lastRecord.metas.isTemp === true) {
                // delete last history record if it is temporary
                lastRecord.delete(); }
        }

        if (id === null) {
            fs.mkdirSync(this.pathToStore);
            this.saveMetas();
        } else {
            this.metas = this.getMetas();
        }

        this.ctime = fs.statSync(this.pathToStore).ctime;

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

    delete () {
        try {
            fs.rmdirSync(path.join(History.path, this.id), { recursive: true })

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    saveMetas () {
        try {
            fs.writeFileSync(this.pathToMetas, JSON.stringify(this.metas));

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    getMetas () {
        let content = fs.readFileSync(this.pathToMetas, 'utf-8');
        return JSON.parse(content);
    }

    getReport () {
        try {
            let content = fs.readFileSync(this.pathToReport, 'utf-8');

            return JSON.parse(content);
        } catch (error) {
            return null;
        }
    }

}