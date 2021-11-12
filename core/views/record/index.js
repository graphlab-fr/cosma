const {
    app, // app event lifecycle, events
    BrowserWindow, // app windows generator
    ipcMain, // interface of data exchange
    dialog
} = require('electron')
, path = require('path');

const windowsModel = require('../../models/windows')
    , mainWindow = require('../../../main').mainWindow
    , state = require('../../models/state');

let window;

module.exports = function () {

    /**
     * Window
     * ---
     * manage displaying
     */

    if (state.needConfiguration() === true) {
        dialog.showMessageBox({
            title: 'Application non configurée',
            message: 'Veuillez configurer l\'application avant de créer des fiches',
            type: 'info',
            buttons: ['Ok']
        });

        return;
    }

    if (window !== undefined) {
        window.focus();
        return;
    }

    window = new BrowserWindow (
        Object.assign(windowsModel.modal, {
            title: 'Nouvelle fiche',
            parent: mainWindow
        })
    );

    window.loadFile(path.join(__dirname, './main-source.html'));

    window.once('ready-to-show', () => {
        window.show();
    });

    window.once('closed', () => {
        window = undefined;
    });

}

/**
 * API
 * ---
 * manage data
 */

ipcMain.on("sendRecordContent", (event, data) => {
    const Record = require('../../models/record')
        , record = new Record(data.title, data.type, data.tags);

    let result = record.save()
        , response;

    if (result === true) {
        response = { isOk: true };

        window.webContents.send("confirmRecordSaving", response);
        window.close();
        return;
    } else if (result === false) {
        response = { isOk: false };

        dialog.showMessageBox(window, {
            title: 'Erreur d\'enregistrement',
            message: `Erreur d'enregistrement de la fiche.`,
            type: 'error',
            buttons: ['Ok']
        });
    } else if (result === 'overwriting') {
        response = { isOk: false };

        dialog.showMessageBox(window, {
            title: 'Confirmation d\'écrasement',
            message: `Voulez-vous vraiment écraser le fichier ${record.title}.md ?`,
            type: 'question',
            buttons: ['Annuler', 'Oui']
        }).then((response) => {
            if (response.response === 1) {
                record.save(true);
            }
        });
    } else {
        response = { isOk: false };

        dialog.showMessageBox(window, {
            title: 'Erreur d\'enregistrement',
            message: "Les métadonnées de la fiche sont incorrectes. Veuillez apporter les corrections suivantes : " + result.join(' '),
            type: 'error',
            buttons: ['Ok']
        });
    }

    window.webContents.send("confirmRecordSaving", response);
});

ipcMain.on("askRecordTypes", (event, data) => {
    const Config = require('../../models/config')
        , config = new Config();

    let result = config.get()
        , response;

    if (result === true) {
        response = {
            isOk: true,
            consolMsg: "Les types de fiche ont bien été transmis depuis la configuration.",
            data: config.opts.record_types
        };
    } else {
        response = {
            isOk: false,
            consolMsg: "Les types de fiche n'ont pu être transmis depuis la configuration.",
            data: {}
        };
    }

    window.webContents.send("getRecordTypes", response);
});