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
    , config = new Config()

config.get();

module.exports = class {

    /**
     * Generate a record.
     * @param {string} title - Title of the record.
     * @param {string} type - Type of the record, validate from the config.
     * @param {array} tags - List of tags of the record.
     */

    constructor (title, type, tags) {
        this.title = title;
        this.type = type;
        this.tags = tags;
        this.path = path.join(config.opts.files_origin, `${title}.md`);

        this.content = yml.safeDump({
            title: title,
            id: generateId(),
            type: type,
            tags: [tags]
        });

        this.content = '---\n' + this.content + '---\n\n';
    }

    /**
     * Save the record to the config 'files_origin' path option
     * @return {boolean} - True if the record file is saved.
     */

    save () {
        try {
            fs.writeFileSync(this.path, this.content);

            return true;
        } catch (error) {
            return false;
        }
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