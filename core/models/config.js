/**
 * @file Manage the user config
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const { app } = require('electron')
    , path = require('path')
    , fs = require('fs');

const baseConfig = require('../data/base-config');

/** Class to manage the user config */

module.exports = class {

    /**
     * Create a user config.
     * @param {object} opts - Options to change from the default config.
     */

    constructor (opts) {
        this.opts = baseConfig
        // path to save config file
        this.path = path.join(app.getPath('userData'), 'config.json');

        if (!opts) { return; }

        for (const opt in opts) {
            // if the option exist from default config
            if (this.opts[opt] === undefined) { continue; }
            // replace the default value by the new
            this.opts = Object.assign(this.opts, opts);
        }
    }

    /**
     * Save the config options to the (file) path
     * @return {boolean} - True if the config file is saved.
     */

    save () {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.opts));

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get the config options from the (file) path
     * @return {boolean} - True if the config file is gotten.
     */

    get () {
        if (this.isSet() === false) { return false; }

        try {
            const configFileContent = fs.readFileSync(this.path, 'utf8');
            this.opts = JSON.parse(configFileContent);

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Verif if the config options from the (file) path exist
     * @return {boolean} - True if the config file exist.
     */

    isSet () {
        if (fs.existsSync(this.path)) {
            return true;
        }
        return false;
    }

    /**
     * Verif if the config inform the system about essentials options
     * @return {boolean} - True if the config contains essentials options.
     */

    isCompleted () {
        for (const opt in this.opts) {
            if (this.opts[opt] === '' ||
                this.opts[opt] === undefined ||
                this.opts[opt] === null)
            {
                return false;
            }
        }

        return true;
    }
}