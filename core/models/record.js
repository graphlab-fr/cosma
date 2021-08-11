/**
 * @file Generate records
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const { app } = require('electron')
    , path = require('path')
    , fs = require('fs')
    , yml = require('js-yaml')
    , moment = require('moment');

const Config = require('./config')
    , config = new Config();

module.exports = class {

    /**
     * Generate a record.
     * @param {string} title - Title of the record.
     * @param {string} type - Type of the record, validate from the config.
     * @param {array} tags - List of tags of the record.
     */

    constructor (title, type, tags) {
        this.title = title;
        this.id = generateId();
        this.type = type;

        if (tags !== '') {
            this.tags = tags.split(',');
        }

        this.content = yml.safeDump(this);
        this.content = '---\n' + this.content + '---\n\n';

        this.path = path.join(config.opts.files_origin, `${title}.md`);
    }

    /**
     * Save the record to the config 'files_origin' path option
     * @return {mixed} - True if the record is saved, false if fatal error
     * or the errors array
     */

    save () {
        try {
            const errs = this.getErrors();

            if (errs.length !== 0) {
                return errs;
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

        if (config.opts.record_types[this.type] === undefined) {
            errs.push('Ce type n\'est pas enregistré.'); }

        return errs;
    }

};

/**
 * Get a number (14 caracters) from the time stats :
 * year + month + day + hour + minute + second
 * @return {number} - unique 14 caracters number from the second
 */

function generateId () {
    return Number(moment().format('YYYYMMDDHHmmss'));
}