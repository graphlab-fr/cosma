const {
    app, // app event lifecycle, events
    BrowserWindow, // app windows generator
    ipcMain // interface of data exchange
} = require('electron')
, path = require('path');

module.exports = function () {

    let window = new BrowserWindow ({
    width: 800,
    height: 500,
    webPreferences: {
        allowRunningInsecureContent: false,
        contextIsolation: true,
        enableRemoteModule: false,
        nodeIntegration: false,
        sandbox: true,
        preload: path.join(__dirname, '../controller.js')
    },
    title: 'Nouvelle fiche'
    })
    
    window.loadFile(path.join(__dirname, './record-source.html'));
    
    ipcMain.on("sendRecordContent", (event, data) => {
        const Record = require('../models/record')
            , record = new Record(data.title, data.type, data.tags);
    
        let result = record.save()
            , response;
    
        if (result === true) {
            response = {
                isOk: true,
                consolMsg: "La fiche a bien été enregistrée.",
                data: {}
            };
        } else if (result === false) {
            response = {
                isOk: false,
                consolMsg: "Erreur d'enregistrement de la fiche.",
                data: {}
            };
        } else {
            response = {
                isOk: false,
                consolMsg: "Les métadonnées de la fiche sont incorrectes. Veuillez apporter les corrections suivantes : " + result.join(' '),
                data: {}
            };
        }

        window.webContents.send("confirmRecordSaving", response);
    });

}