const {
    app, // app event lifecycle, events
    BrowserWindow, // app windows generator
    ipcMain, // interface of data exchange
    dialog
} = require('electron')
, path = require('path');

const Display = require('../../models/display')
    , lang = require('../../cosma-core/models/lang');

let window;

module.exports = function (report) {
    window = new BrowserWindow(
        Object.assign(Display.getBaseSpecs('modal'), {
            title: lang.getFor(lang.i.windows['report'].title),
            parent: Display.getWindow('history'),
            webPreferences: {
                preload: path.join(__dirname, './preload.js')
            }
        })
    );

    window.loadFile(path.join(__dirname, './source.html'));

    window.once('ready-to-show', () => {
        window.show();
    });

    window.once('closed', () => {
        window = undefined;
    });

    ipcMain.once("get-report", (event) => {
        event.returnValue = report;
    });
}

/**
 * API
 * ---
 * manage data
 */

// ipcMain.on("sendRecordContent", (event, data) => {
//     const Record = require('../../models/record')
//         , record = new Record(data.title, data.type, data.tags);

//     let result = record.save()
//         , response;

//     if (result === true) {
//         response = { isOk: true };

//         window.webContents.send("confirmRecordSaving", response);
//         window.close();
//         return;
//     } else if (result === false) {
//         response = { isOk: false };

//         dialog.showMessageBox(window, {
//             title: 'Erreur d\'enregistrement',
//             message: `Erreur d'enregistrement de la fiche.`,
//             type: 'error',
//             buttons: ['Ok']
//         });
//     } else if (result === 'overwriting') {
//         response = { isOk: false };

//         dialog.showMessageBox(window, {
//             title: 'Confirmation d\'écrasement',
//             message: `Voulez-vous vraiment écraser le fichier ${record.title}.md ?`,
//             type: 'question',
//             buttons: ['Annuler', 'Oui']
//         }).then((response) => {
//             if (response.response === 1) {
//                 record.save(true);
//                 window.close();
//             }
//         });
//     } else {
//         response = { isOk: false };

//         dialog.showMessageBox(window, {
//             title: 'Erreur d\'enregistrement',
//             message: "Les métadonnées de la fiche sont incorrectes. Veuillez apporter les corrections suivantes : " + result.join(' '),
//             type: 'error',
//             buttons: ['Ok']
//         });
//     }

//     window.webContents.send("confirmRecordSaving", response);
// });

// ipcMain.on("askRecordTypes", (event, data) => {
//     const Config = require('../../cosma-core/models/config')
//         , config = new Config().opts;

//     window.webContents.send("getRecordTypes", Object.keys(config.record_types));
// });