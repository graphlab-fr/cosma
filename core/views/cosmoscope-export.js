const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain, // interface of data exchange
        dialog
    } = require('electron')
    , path = require('path')
    , fs = require('fs');

const cosmoscopePath = path.join(app.getPath('userData'), 'cosmoscope.html');

module.exports = function (window) {

    dialog.showOpenDialog(window, {
        title: 'Sélectionner répertoire d\'export cosmoscope',
        properties: ['openDirectory']
    }).then((response) => {

        if (response.canceled === true) { return; }

        fs.copyFile(cosmoscopePath, response.filePaths[0], (err) => {
            if (err) { throw err; }
        });
    });

}