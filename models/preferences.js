/**
 * @file App preferences
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const { app } = require('electron')
    , path = require('path')
    , fs = require('fs');

const Config = require('../core/models/config');

module.exports = class Preferences {
    static base = Object.freeze({
        lang: 'en',
        devtools: true
    })

    static filePath = path.join(app.getPath('userData'), 'preferences.json');

    static memory = undefined;

    static get () {
        if (Preferences.memory) {
            return Preferences.memory;
        }
        try {
            const fileContent = fs.readFileSync(Preferences.filePath, 'utf8');
            const opts = JSON.parse(fileContent);
            Preferences.memory = opts;
            return opts
        } catch (error) {
            throw new ErrorPreferences("The preferences file cannot be read.")
        }
    }

    static init () {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(Preferences.filePath)) {
                Preferences.get();
                resolve();
                return;
            }

            fs.writeFile(Preferences.filePath, JSON.stringify(Preferences.base), 'utf-8', (err) => {
                if (err) reject()
                Preferences.memory = {...Preferences.base};
                resolve();
            })
        });
    }

    /**
     * Create preference instance.
     * @param {object} opts - Options to change preferences
     */

    constructor (opts = {}) {
        /** @type {keyof Preferences.base} */
        this.invalidOpts = [];

        /**
         * All options & their value from the config
         * @type object
         */
        this.opts = Object.assign({}, Preferences.base, Preferences.get(), opts);

        if (this.isValid() === false) {
            this.fix();
            this.save();
        }
    }

    /**
     * Save the preferences options to the (file) path
     * @return {boolean} - True if the prefences file is saved, false if fatal error
     * or the errors array
     */

    save () {
        if (this.isValid() === false) { return false; }

        try {
            fs.writeFileSync(Preferences.filePath, JSON.stringify(this.opts));
        } catch (error) {
            console.log(error);
            throw new ErrorPreferences("The preferences file cannot be save.")
        }

        Preferences.memory = this.opts;
        return true;
    }

    /**
     * Store invalid fields into this.report
     */

    verif () {
        const validLangFlags = Object.keys(Config.validLangages);
        if (
            typeof this.opts['lang'] !== 'string' ||
            validLangFlags.includes(this.opts['lang']) === false
        ) {
            this.invalidOpts.push('lang');
        }

        if (typeof this.opts['devtools'] !== 'boolean') {
            this.invalidOpts.push('devtools');
        }
    }

    isValid () {
        this.verif();
        if (this.invalidOpts.length) {
            return false;
        }
        return true;
    }

    fix () {
        for (const opt of this.invalidOpts) {
            this.opts[opt] = Preferences.base[opt];
        }
    }
}

class ErrorPreferences extends Error {
    constructor(message) {
      super(message);
      this.name = 'Error Preferences';
    }
}