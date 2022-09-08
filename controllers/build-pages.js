const { app } = require('electron');

/**
 * Build pages (electron windows)
 */

module.exports = function() {
    if (app.isPackaged === false) {
        require('../views/config').build();
        require('../views/record').build();
        require('../views/export').build();
        require('../views/history').build();
        require('../views/modal-typerecord').build();
        require('../views/modal-typelink').build();
        require('../views/modal-view').build();
        require('../views/modal-historyrename').build();
    }
}