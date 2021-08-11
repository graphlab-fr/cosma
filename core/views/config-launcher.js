const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain // interface of data exchange
    } = require('electron')
    , path = require('path');

const Config = require('../models/config')
    , state = require('../models/state')
    , windowsModel = require('../models/windows');
const windows = require('../models/windows');

let window, newRecordModal, updateRecordModal;

module.exports = function () {

    if (state.openedWindows.config === true) { return; }

    /**
     * Window
     * ---
     * manage displaying
     */

    window = new BrowserWindow (
        Object.assign(windowsModel.forms, {
            title: 'Configuration'
        })
    );
    
    window.loadFile(path.join(__dirname, './config-source.html'));

    window.once('ready-to-show', () => {
        window.show();
        state.openedWindows.config = true;
        // window.webContents.openDevTools();
    });

    window.once('closed', () => {
        state.openedWindows.config = false;
    });

    /**
     * API
     * ---
     * manage data
     */

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

    ipcMain.on("askConfig", (event, data) => {
        const config = new Config(data);

        let result = config.get();
    
        if (result === true) {
            response = {
                isOk: true,
                consolMsg: "La configuration a bien été transmise.",
                data: config.opts
            };
        } else {
            response = {
                isOk: false,
                consolMsg: "La configuration n'a pu être transmise.",
                data: {}
            };
        }

        window.webContents.send("getConfig", response);
    });

    ipcMain.on("askNewRecordTypeModal", (event, data) => {
        newRecordModal = new BrowserWindow (
            Object.assign(windowsModel.modal, {
                parent: window,
                title: 'Nouveau type de fiche'
            })
        );

        newRecordModal.loadFile(path.join(__dirname, './config-modal-add-source.html'));

        newRecordModal.once('ready-to-show', () => {
            newRecordModal.show();
        });
    });

    ipcMain.on("sendNewRecordTypeToConfig", (event, data) => {
        let config = new Config();
        let recordTypes = config.opts.record_types;

        recordTypes[data.name] = data.color;

        config = new Config({
            record_types: recordTypes
        });

        let result = config.save()
            , response;
    
        if (result === true) {
            response = {
                isOk: true,
                consolMsg: "Le nouveau type de fiche a bien été enregistré dans la configuration.",
                data: data
            };

            window.webContents.send("confirmNewRecordTypeFromConfig", response);
            newRecordModal.close();
        } else if (result === false) {
            response = {
                isOk: false,
                consolMsg: "Le nouveau type de fiche n'a pas pu être enregistrée dans la configuration.",
                data: {}
            };

            newRecordModal.webContents.send("confirmNewRecordTypeFromConfig", response);
        } else {
            response = {
                isOk: false,
                consolMsg: "La configuration saisie est invalide. Veuillez apporter les corrections suivantes : " + result.join(' '),
                data: {}
            };

            newRecordModal.webContents.send("confirmNewRecordTypeFromConfig", response);
        }
    });

    ipcMain.on("askDeleteRecordType", (event, data) => {
        let config = new Config();
        let recordTypes = config.opts.record_types;

        delete recordTypes[data.name];

        config = new Config({
            record_types: recordTypes
        });

        let result = config.save()
            , response;
    
        if (result === true) {
            response = {
                isOk: true,
                consolMsg: "Le type de fiche a bien été supprimé de la configuration.",
                data: data
            };
        } else if (result === false) {
            response = {
                isOk: false,
                consolMsg: "Le type de fiche n'a pas pu être supprimé de la configuration.",
                data: {}
            };
        } else {
            response = {
                isOk: false,
                consolMsg: "La configuration saisie est invalide. Veuillez apporter les corrections suivantes : " + result.join(' '),
                data: {}
            };
        }

        window.webContents.send("confirmDeleteRecordTypeFromConfig", response);
    });

    ipcMain.on("askUpdateRecordTypeModal", (event, data) => {
        updateRecordModal = new BrowserWindow (
            Object.assign(windowsModel.modal, {
                parent: window,
                title: 'Éditer un type de fiche'
            })
        );

        updateRecordModal.loadFile(path.join(__dirname, './config-modal-update-source.html'));

        updateRecordModal.once('ready-to-show', () => {
            updateRecordModal.show();
            updateRecordModal.webContents.send("getRecordTypeToUpdate", data);
        });

    });

    ipcMain.on("sendUpdateRecordTypeToConfig", (event, data) => {
        let config = new Config();
        let recordTypes = config.opts.record_types;

        if (data.originalName === data.name) {
            recordTypes[data.name] = data.color
        } else {
            delete recordTypes[data.originalName];
            recordTypes[data.name] = data.color;
        }

        config = new Config({
            record_types: recordTypes
        });

        let result = config.save()
            , response;
    
        if (result === true) {
            response = {
                isOk: true,
                consolMsg: "Le type de fiche a bien été mis à jour dans la configuration.",
                data: data
            };

            window.webContents.send("confirmUpdateRecordTypeFromConfig", response);
            updateRecordModal.close();
        } else if (result === false) {
            response = {
                isOk: false,
                consolMsg: "Le type de fiche n'a pas pu être mis à jour dans la configuration.",
                data: {}
            };

            updateRecordModal.webContents.send("confirmUpdateRecordTypeFromConfig", response);
        } else {
            response = {
                isOk: false,
                consolMsg: "La configuration saisie est invalide. Veuillez apporter les corrections suivantes : " + result.join(' '),
                data: {}
            };

            updateRecordModal.webContents.send("confirmUpdateRecordTypeFromConfig", response);
        }
    });

}