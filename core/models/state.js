/**
 * @file Manage the application states
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

module.exports = {

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