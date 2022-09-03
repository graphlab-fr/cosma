/**
 * @file Manage the history of cosmocopes generations
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
        app, // app event lifecycle, events
    } = require('electron')
    , fs = require('fs')
    , path = require('path')
    , moment = require('moment');

const Config = require('../core/models/config');

module.exports = class History {

    /**
     * Path to the cosmoscopes
     * @type string
     */

    static pathForDirs = path.join(app.getPath('temp'), 'cosma-history');

    /**
     * Path to the JSON data file of the history
     * @type string
     */

    static pathForData = path.join(app.getPath('userData'), 'history.json');

    static baseData = {
        records: {}
    }

    /**
     * Get history data from the 'pathForData'
     * @return {mixed} - Existing history records or empty data if errors
     */

    static get () {
        try {
            let fileContent = fs.readFileSync(History.pathForData, 'utf8');
            fileContent = JSON.parse(fileContent);

            for (const record in fileContent.records) {
                if (fs.existsSync(fileContent.records[record].path) === false) {
                    delete fileContent.records[record];
                }
            }

            return fileContent;
        } catch (error) {
            return History.baseData;
        }
    }

    static getLast () {
        const records = History.get().records
            , recordsId = Object.keys(records)
            , lastRecordId = recordsId[recordsId.length - 1];

        if (lastRecordId === undefined) {
            return undefined;
        }

        return new History(lastRecordId);
    }

    static getTemp () {
        const tempRecordId = History.get().temp

        return new History(tempRecordId);
    }

    /**
     * Create the 'cosma-history' directory to store files
     */

    static createHistoryDirectory () {
        if (!fs.existsSync(History.pathForDirs)) {
            fs.mkdirSync(History.pathForDirs);
        }
    }

    /**
     * Get a number (14 caracters) from the time stats :
     * year + month + day + hour + minute + second
     * @return {number} - unique 14 caracters number from the second
     */

    static generateId () {
        return moment().format('YYYYMMDDHHmmss');
    }

    /**
     * Dalate an history directory
     * @param {string} id - Name of the directory to use as a history entry
     */

    constructor (id = undefined) {
        History.createHistoryDirectory();

        /**
         * Data extract from JSON data file from History.pathForData
         * @type object
         */
        this.data = History.get();
        /**
         * From Config.opts
         * @type object
         */
        this.config = new Config().opts;
        /**
         * 14 characters
         * @type number
         */
        this.id;
        /**
         * Path to store or find a cosmoscope by its id
         * @type string
         */
        this.pathToStore
        /**
         * Date in international standard format
         * @type string
         * @example '2021-12-23T10:09:45+01:00'
         */
        this.date
        /**
         * @type string
         */
        this.description
        /**
         * Graph report for the record
         * @type object
         */
        this.report

        if (id === undefined) {
            this.id = History.generateId();
            this.pathToStore = path.join(History.pathForDirs, `${this.id}.html`);
            this.date = moment().format();
            return;
        }

        if (this.data.records[id] === undefined) {
            console.log('Introuvable depuis historique');
            return;
        }

        const record = this.data.records[id];

        this.id = id;
        this.pathToStore = record.path;
        this.date = record.date;
        this.description = record.description;
        this.report = record.report;
    }

    /**
     * Save a file into the current history directory
     * @param {Template.html} templateHtml - HTML page
     * @param {Graph.report} graphReport - new Graph().report
     * @return {boolean} - If the file is saved
     */

    storeCosmoscope (templateHtml, graphReport) {
        try {
            if (this.config.history === false) {
                const lastRecord = History.getLast();
                if (lastRecord !== undefined) {
                    lastRecord.delete();
                    this.data = lastRecord.data;
                }
            }

            fs.writeFileSync(this.pathToStore, templateHtml);

            this.data.records[this.id] = {
                path: this.pathToStore,
                date: moment().format(),
                description: this.description,
                report: graphReport
            }

            this.save();

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get not empty section from 'this.report' for Graph.reportToSentences()
     * @return {object}
     */

    getReport () {
        for (const reportSection in this.report) {
            if (this.report[reportSection].length === 0) {
                delete this.report[reportSection];
                continue;
            }
        }

        return this.report;
    }

    /**
     * Save the history dat file to the History.pathForData
     * @return {boolean} - True if the config file is saved, false if fatal error
     */

    save () {
        try {
            fs.writeFileSync(History.pathForData, JSON.stringify(this.data));
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /**
     * @return {boolean}
     */

    delete () {
        try {
            fs.rmSync(this.pathToStore);

            delete this.data.records[this.id];

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    deleteAll () {
        fs.rmSync(History.pathForDirs, { recursive: true });
        this.data = History.baseData;

        this.save();
    }
}