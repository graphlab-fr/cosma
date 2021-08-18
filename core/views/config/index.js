const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain, // interface of data exchange
        dialog
    } = require('electron')
    , path = require('path');

const Config = require('../../models/config')
    , state = require('../../models/state')
    , windowsModel = require('../../models/windows');

let window, modalRecordNew, modalRecordUpdate, modalLinkNew, modalLinkUpdate;

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
    
    window.loadFile(path.join(__dirname, './main-source.html'));

    window.once('ready-to-show', () => {
        window.show();
        state.openedWindows.config = true;
    });

    window.once('closed', () => {
        state.openedWindows.config = false;
    });
    
}

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

ipcMain.on("askOptionMinimumFromConfig", (event, data) => {
    window.webContents.send("getOptionMinimumFromConfig", Config.minValues);
});

ipcMain.on("askLinkStokes", (event, data) => {
    event.reply("getLinkStokes", Config.linkStrokes);
});

ipcMain.on("askNewRecordTypeModal", (event, data) => {
    modalRecordNew = new BrowserWindow (
        Object.assign(windowsModel.modal, {
            parent: window,
            title: 'Nouveau type de fiche'
        })
    );

    modalRecordNew.loadFile(path.join(__dirname, './modal-addrecordtype-source.html'));

    modalRecordNew.once('ready-to-show', () => {
        modalRecordNew.show();
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
        modalRecordNew.close();
    } else if (result === false) {
        response = {
            isOk: false,
            consolMsg: "Le nouveau type de fiche n'a pas pu être enregistrée dans la configuration.",
            data: {}
        };

        modalRecordNew.webContents.send("confirmNewRecordTypeFromConfig", response);
    } else {
        response = {
            isOk: false,
            consolMsg: "La configuration saisie est invalide. Veuillez apporter les corrections suivantes : " + result.join(' '),
            data: {}
        };

        modalRecordNew.webContents.send("confirmNewRecordTypeFromConfig", response);
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
    modalRecordUpdate = new BrowserWindow (
        Object.assign(windowsModel.modal, {
            parent: window,
            title: 'Éditer un type de fiche'
        })
    );

    modalRecordUpdate.loadFile(path.join(__dirname, './modal-updaterecordtype-source.html'));

    modalRecordUpdate.once('ready-to-show', () => {
        modalRecordUpdate.show();
        modalRecordUpdate.webContents.send("getRecordTypeToUpdate", data);
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
        modalRecordUpdate.close();
    } else if (result === false) {
        response = {
            isOk: false,
            consolMsg: "Le type de fiche n'a pas pu être mis à jour dans la configuration.",
            data: {}
        };

        modalRecordUpdate.webContents.send("confirmUpdateRecordTypeFromConfig", response);
    } else {
        response = {
            isOk: false,
            consolMsg: "La configuration saisie est invalide. Veuillez apporter les corrections suivantes : " + result.join(' '),
            data: {}
        };

        modalRecordUpdate.webContents.send("confirmUpdateRecordTypeFromConfig", response);
    }
});

ipcMain.on("askNewLinkTypeModal", (event, data) => {
    modalLinkNew = new BrowserWindow (
        Object.assign(windowsModel.modal, {
            parent: window,
            title: 'Nouveau type de lien'
        })
    );

    modalLinkNew.loadFile(path.join(__dirname, './modal-addlinktype-source.html'));

    modalLinkNew.once('ready-to-show', () => {
        modalLinkNew.show();
    });
});

ipcMain.on("sendNewLinkTypeToConfig", (event, data) => {
    let config = new Config();
    let linkTypes = config.opts.link_types;

    linkTypes[data.name] = {
        color: data.color,
        stroke: data.stroke
    };

    config = new Config({
        link_types: linkTypes
    });

    let result = config.save()
        , response;

    if (result === true) {
        response = {
            isOk: true,
            consolMsg: "Le nouveau type de lien a bien été enregistré dans la configuration.",
            data: data
        };

        window.webContents.send("confirmNewLinkTypeFromConfig", response);
        modalLinkNew.close();
    } else if (result === false) {
        response = {
            isOk: false,
            consolMsg: "Le nouveau type de fiche n'a pas pu être enregistrée dans la configuration.",
            data: {}
        };

        modalLinkNew.webContents.send("confirmNewLinkTypeFromConfig", response);
    } else {
        response = {
            isOk: false,
            consolMsg: "La configuration saisie est invalide. Veuillez apporter les corrections suivantes : " + result.join(' '),
            data: {}
        };

        modalLinkNew.webContents.send("confirmNewLinkTypeFromConfig", response);
    }
});

ipcMain.on("askUpdateLinkTypeModal", (event, data) => {
    modalLinkUpdate = new BrowserWindow (
        Object.assign(windowsModel.modal, {
            parent: window,
            title: 'Éditer un type de lien'
        })
    );

    modalLinkUpdate.loadFile(path.join(__dirname, './modal-updatelinktype-source.html'));

    modalLinkUpdate.once('ready-to-show', () => {
        modalLinkUpdate.show();
        modalLinkUpdate.webContents.send("getLinkTypeToUpdate", data);
    });

});

ipcMain.on("sendUpdateLinkTypeToConfig", (event, data) => {
    let config = new Config();
    let linkTypes = config.opts.link_types;

    if (data.originalName === data.name) {
        linkTypes[data.name] = {
            color: data.color,
            stroke: data.stroke
        };
    } else {
        delete linkTypes[data.originalName];
        linkTypes[data.name] = {
            color: data.color,
            stroke: data.stroke
        };
    }

    config = new Config({
        link_types: linkTypes
    });

    let result = config.save()
        , response;

    if (result === true) {
        response = {
            isOk: true,
            consolMsg: "Le type de lien a bien été mis à jour dans la configuration.",
            data: data
        };

        window.webContents.send("confirmUpdateLinkTypeFromConfig", response);
        modalLinkUpdate.close();
    } else if (result === false) {
        response = {
            isOk: false,
            consolMsg: "Le type de lien n'a pas pu être mis à jour dans la configuration.",
            data: {}
        };

        modalLinkUpdate.webContents.send("confirmUpdateLinkTypeFromConfig", response);
    } else {
        response = {
            isOk: false,
            consolMsg: "La configuration saisie est invalide. Veuillez apporter les corrections suivantes : " + result.join(' '),
            data: {}
        };

        modalLinkUpdate.webContents.send("confirmUpdateLinkTypeFromConfig", response);
    }
});

ipcMain.on("askDeleteRecordType", (event, data) => {
    let config = new Config();
    let linkTypes = config.opts.link_types;

    delete linkTypes[data.name];

    config = new Config({
        link_types: linkTypes
    });

    let result = config.save()
        , response;

    if (result === true) {
        response = {
            isOk: true,
            consolMsg: "Le type de lien a bien été supprimé de la configuration.",
            data: data
        };
    } else if (result === false) {
        response = {
            isOk: false,
            consolMsg: "Le type de lien n'a pas pu être supprimé de la configuration.",
            data: {}
        };
    } else {
        response = {
            isOk: false,
            consolMsg: "La configuration saisie est invalide. Veuillez apporter les corrections suivantes : " + result.join(' '),
            data: {}
        };
    }

    window.webContents.send("confirmDeleteLinkTypeFromConfig", response);
});

ipcMain.on("askFilesOriginPath", (event, data) => {

    dialog.showOpenDialog(window, {
        title: 'Sélectionner répertoire des fiches',
        defaultPath: app.getPath('documents'),
        properties: ['openDirectory']
    }).then((response) => {
        window.webContents.send("getFilesOriginPath", {
            isOk: !response.canceled,
            data: response.filePaths
        });
    });

});

ipcMain.on("askBibliographyPath", (event, data) => {

    dialog.showOpenDialog(window, {
        title: 'Sélectionner catalogue de références',
        defaultPath: app.getPath('documents'),
        filters: [
            { name: 'Type de fichier personnalisé', extensions: ['json'] }
        ],
        properties: ['openFile']
    }).then((response) => {
        window.webContents.send("getBibliographyPath", {
            isOk: !response.canceled,
            data: response.filePaths
        });
    });

});

ipcMain.on("askCslPath", (event, data) => {

    dialog.showOpenDialog(window, {
        title: 'Sélectionner fichier style bibliographique',
        defaultPath: app.getPath('documents'),
        filters: [
            { name: 'Type de fichier personnalisé', extensions: ['csl'] }
        ],
        properties: ['openFile']
    }).then((response) => {
        window.webContents.send("getCslPath", {
            isOk: !response.canceled,
            data: response.filePaths
        });
    });

});