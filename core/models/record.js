/**
 * @file Generate records
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const { app } = require('electron')
    , path = require('path')
    , fs = require('fs')
    , yml = require('js-yaml')
    , moment = require('moment');

const Config = require('../../cosma-core/models/config');

module.exports = class Record {

    /**
     * Get a number (14 caracters) from the time stats :
     * year + month + day + hour + minute + second
     * @return {number} - unique 14 caracters number from the second
     */

    static generateId () {
        return Number(moment().format('YYYYMMDDHHmmss'));
    }

    /**
     * Generate a record.
     * @param {string} title - Title of the record.
     * @param {string} type - Type of the record, validate from the config.
     * @param {array} tags - List of tags of the record.
     */

    constructor (title, type, tags) {
        this.title = title;
        this.id = Record.generateId();
        this.type = type;

        if (tags !== '') {
            this.tags = tags.split(',');
        }

        this.content = yml.safeDump(this);
        this.content = '---\n' + this.content + '---\n\n';

        this.config = new Config().opts;

        this.path = path.join(this.config.files_origin, `${title}.md`);

    }

    /**
     * Save the record to the config 'files_origin' path option
     * @param {boolean} - If can overwrite
     * @return {mixed} - True if the record is saved, false if fatal error
     * or the errors array
     */

    save (force = false) {
        try {
            const errs = this.getErrors();

            if (errs.length !== 0) {
                return errs;
            }

            if (this.willOverwrite() === true && force === false) {
                return 'overwriting';
            }

            fs.writeFileSync(this.path, this.content);

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Verif if the record metas are correct
     * @return {array} - Error message for each correction to do.
     */

    getErrors () {
        let errs = [];

        if (this.title === '') {
            errs.push('Le titre n\'est pas défini.'); }

        if (this.config.record_types[this.type] === undefined) {
            errs.push('Ce type n\'est pas enregistré.'); }

        return errs;
    }

    /**
     * Verif if a file already exist with this name
     * @return {boolean}
     */

    willOverwrite () {
        if (fs.existsSync(this.path)) {
            return true;
        }

        return false;
    }

};