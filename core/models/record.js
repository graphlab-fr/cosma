/**
 * @file Generate records
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const { app } = require('electron')
    , path = require('path')
    , fs = require('fs');

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
        this.content =
`A record from Cosma

Title : ${title}
Type : ${type}
Tags : ${tags}

Lorem ipsum dolor est héhé`
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