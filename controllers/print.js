const { app, dialog } = require('electron')
    , fs = require('fs')
    , path = require('path');

const Display = require('../models/display');

const lang = require('../cosma-core/models/lang');

module.exports = function () {
    const mainWindow = Display.getWindow('main');

    if (mainWindow === undefined) { return; }

    mainWindow.webContents.printToPDF({
        headerFooter: {
            title: mainWindow.title,
            url: 'https://cosma.graphlab.fr/'},
            pageSize: 'A4'
        })
        .then(pdfData => {
            dialog.showSaveDialog(mainWindow, {
                title: lang.getFor(lang.i.dialog.print.title),
                defaultPath: path.join(app.getPath('documents'), `${mainWindow.title}.pdf`),
                properties: ['createDirectory', 'showOverwriteConfirmation']
            }).then((response) => {
                if (response.canceled === true) { return; }

                fs.writeFile(response.filePath, pdfData, (err) => {
                    if (err) { errorDialog(); }
                });
            });
        })
        .catch(err => { errorDialog(); })
}

function errorDialog (window) {
    dialog.showMessageBox(window, {
        message: lang.getFor(lang.i.dialog.print.error),
        type: 'error',
        buttons: [lang.getFor(lang.i.dialog.btn.ok)],
        defaultId: 0,
        cancelId: 0,
        noLink: true
    })
}