/**
 * @file Manage the application states
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

module.exports = {

    openedWindows: {
        config: false,
        record: false
    },

    /**
     * Reveal if the application need a (re)configuration
     * in the case of a first lauch or nuclear error
     * @return {boolean} - True if the app need a (re)configuration.
     */

    needConfiguration: function () {
        const Config = require('./config')
            , config = new Config();

        if (config.isSet() === false) {
            return true;
        }

        if (config.isCompleted() === false) {
            return true;
        }

        return false;
    }

}