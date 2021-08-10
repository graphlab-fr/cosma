const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain // interface of data exchange
    } = require('electron')
    , path = require('path');

const Config = require('../models/config')
    , state = require('../models/state');

module.exports = function () {

    if (state.openedWindows.config === true) { return; }

    let window = new BrowserWindow ({
        width: 800,
        height: 500,
        show: false,
        icon: path.join(__dirname, '../../assets/icons/64x64.png'),
        webPreferences: {
            allowRunningInsecureContent: false,
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
            sandbox: true,
            preload: path.join(__dirname, '../controller.js')
        },
        title: 'Configuration'
    })
    
    window.loadFile(path.join(__dirname, './config-source.html'));
    
    ipcMain.on("sendConfigOptions", (event, data) => {
        const config = new Config(data);
    
        let result = config.save()
            , response;
    
        if (result === true) {
            response = {
                isOk: true,
                consolMsg: "La configuration a bien été enregistrée. Veuillez relancer l'application.",
                data: {}
            };
        } else if (result === false) {
            response = {
                isOk: false,
                consolMsg: "La configuration n'a pas pu être enregistrée.",
                data: {}
            };
        } else {
            response = {
                isOk: false,
                consolMsg: "La configuration saisie est invalide. Veuillez apporter les corrections suivantes : " + result.join(' '),
                data: {}
            };
        }

        window.webContents.send("confirmConfigRegistration", response);
    });

    window.once('ready-to-show', () => {
        window.show();
        state.openedWindows.config = true;
    });

    window.once('closed', () => {
        state.openedWindows.config = false;
    });

}