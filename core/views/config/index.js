const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain, // interface of data exchange
        dialog,
        Menu
    } = require('electron')
    , path = require('path');

const config = require('../../../cosma-core/models/config').get()
    , lang = require('../../../cosma-core/models/lang')
    , windowsModel = require('../../models/windows');

let window;

module.exports = function () {

    /**
     * Window
     * ---
     * manage displaying
     */

    if (window !== undefined) {
        window.focus();
        return;
    }

    window = new BrowserWindow (
        Object.assign(windowsModel.forms, {
            title: lang.windows[`preferences`][config.lang],
            webPreferences: {
                preload: path.join(__dirname, './preload.js')
            }
        })
    );

    window.webContents.openDevTools({mode: 'detach'});
    
    window.loadFile(path.join(__dirname, './source.html'));

    window.once('ready-to-show', () => {
        window.show();
    });

    window.once('closed', () => {
        window = undefined;
    });
}

// ipcMain.on("set-config-options", (event, data) => {
//     const config = new Config(data);

//     config.save();

//     let response;

//     if (config.isValid() === true) {
//         response = {
//             isOk: true,
//             consolMsg: "La configuration a bien été enregistrée.",
//             data: {}
//         }

//         Menu.getApplicationMenu()
//             .getMenuItemById('citeproc')
//             .enabled = config.canCiteproc();

//         Menu.getApplicationMenu()
//             .getMenuItemById('devtools')
//             .visible = config.opts.devtools;

//     } else {
//         response = {
//             isOk: false,
//             consolMsg: "La configuration saisie est invalide. Veuillez apporter les corrections suivantes : " + config.writeReport(),
//             data: {}
//         }
//     }

//     if (window) {
//         window.webContents.send("confirmConfigRegistration", response); }

// });

// ipcMain.on("askOptionMinimumFromConfig", (event, data) => {
//     window.webContents.send("getOptionMinimumFromConfig", Config.minValues);
// });

// ipcMain.on("askOptionLangageFromConfig", (event, data) => {
//     window.webContents.send("getOptionLangageFromConfig", Config.validLangages);
// });

// ipcMain.on("askLinkStokes", (event, data) => {
//     event.reply("getLinkStokes", Config.validLinkStrokes);
// });

// ipcMain.on("askNewRecordTypeModal", (event, data) => {
//     modalRecordNew = new BrowserWindow (
//         Object.assign(windowsModel.modal, {
//             parent: window,
//             title: 'Nouveau type de fiche'
//         })
//     );

//     modalRecordNew.loadFile(path.join(__dirname, './modal-addrecordtype-source.html'));

//     modalRecordNew.once('ready-to-show', () => {
//         modalRecordNew.show();
//     });
// });

// ipcMain.on("sendNewRecordTypeToConfig", (event, data) => {
//     let config = new Config();
//     let recordTypes = config.opts.record_types;

//     recordTypes[data.name] = data.color;

//     config = new Config({
//         record_types: recordTypes
//     });
    
//     config.save();

//     if (config.isValid() === true) {
//         window.webContents.send("confirmNewRecordTypeFromConfig", {
//             isOk: true,
//             consolMsg: "Le nouveau type de fiche a bien été enregistré dans la configuration.",
//             data: data
//         });

//         modalRecordNew.close();
//     } else {
//         modalRecordNew.webContents.send("confirmNewRecordTypeFromConfig", {
//             isOk: false,
//             consolMsg: "La configuration saisie est invalide. Veuillez apporter les corrections suivantes : " + config.writeReport(),
//             data: {}
//         });
//     }
// });

// ipcMain.on("askDeleteRecordType", (event, data) => {
//     let config = new Config();
//     let recordTypes = config.opts.record_types;

//     delete recordTypes[data.name];

//     config = new Config({
//         record_types: recordTypes
//     });

//     config.save();

//     let response;

//     if (config.isValid() === true) {
//         response = {
//             isOk: true,
//             consolMsg: "Le type de fiche a bien été supprimé de la configuration.",
//             data: data
//         };
//     } else {
//         response = {
//             isOk: false,
//             consolMsg: "La configuration saisie est invalide. Veuillez apporter les corrections suivantes : " + config.writeReport(),
//             data: {}
//         };
//     }

//     window.webContents.send("confirmDeleteRecordTypeFromConfig", response);
// });

// ipcMain.on("askUpdateRecordTypeModal", (event, data) => {
//     modalRecordUpdate = new BrowserWindow (
//         Object.assign(windowsModel.modal, {
//             parent: window,
//             title: 'Éditer un type de fiche'
//         })
//     );

//     modalRecordUpdate.loadFile(path.join(__dirname, './modal-updaterecordtype-source.html'));

//     modalRecordUpdate.once('ready-to-show', () => {
//         modalRecordUpdate.show();
//         modalRecordUpdate.webContents.send("getRecordTypeToUpdate", data);
//     });

// });

// ipcMain.on("sendUpdateRecordTypeToConfig", (event, data) => {
//     let config = new Config();
//     let recordTypes = config.opts.record_types;

//     if (data.originalName === data.name) {
//         recordTypes[data.name] = data.color
//     } else {
//         delete recordTypes[data.originalName];
//         recordTypes[data.name] = data.color;
//     }

//     config = new Config({
//         record_types: recordTypes
//     });

//     config.save();

//     if (config.isValid() === true) {
//         window.webContents.send("confirmUpdateRecordTypeFromConfig", {
//             isOk: true,
//             consolMsg: "Le type de fiche a bien été mis à jour dans la configuration.",
//             data: data
//         });

//         modalRecordUpdate.close();
//     } else {
//         modalRecordUpdate.webContents.send("confirmUpdateRecordTypeFromConfig", {
//             isOk: false,
//             consolMsg: "La configuration saisie est invalide. Veuillez apporter les corrections suivantes : " + config.writeReport(),
//             data: {}
//         });
//     }
// });

// ipcMain.on("askNewLinkTypeModal", (event, data) => {
//     modalLinkNew = new BrowserWindow (
//         Object.assign(windowsModel.modal, {
//             parent: window,
//             title: 'Nouveau type de lien'
//         })
//     );

//     modalLinkNew.loadFile(path.join(__dirname, './modal-addlinktype-source.html'));

//     modalLinkNew.once('ready-to-show', () => {
//         modalLinkNew.show();
//     });
// });

// ipcMain.on("sendNewLinkTypeToConfig", (event, data) => {
//     let config = new Config();
//     let linkTypes = config.opts.link_types;

//     linkTypes[data.name] = {
//         color: data.color,
//         stroke: data.stroke
//     };

//     config = new Config({
//         link_types: linkTypes
//     });

//     config.save();

//     if (config.isValid() === true) {
//         window.webContents.send("confirmNewLinkTypeFromConfig", {
//             isOk: true,
//             consolMsg: "Le nouveau type de lien a bien été enregistré dans la configuration.",
//             data: data
//         });

//         modalLinkNew.close();
//     } else {
//         modalLinkNew.webContents.send("confirmNewLinkTypeFromConfig", {
//             isOk: false,
//             consolMsg: "La configuration saisie est invalide. Veuillez apporter les corrections suivantes : " + config.writeReport(),
//             data: {}
//         });
//     }
// });

// ipcMain.on("askUpdateLinkTypeModal", (event, data) => {
//     modalLinkUpdate = new BrowserWindow (
//         Object.assign(windowsModel.modal, {
//             parent: window,
//             title: 'Éditer un type de lien'
//         })
//     );

//     modalLinkUpdate.loadFile(path.join(__dirname, './modal-updatelinktype-source.html'));

//     modalLinkUpdate.once('ready-to-show', () => {
//         modalLinkUpdate.show();
//         modalLinkUpdate.webContents.send("getLinkTypeToUpdate", data);
//     });

// });

// ipcMain.on("sendUpdateLinkTypeToConfig", (event, data) => {
//     let config = new Config();
//     let linkTypes = config.opts.link_types;

//     if (data.originalName === data.name) {
//         linkTypes[data.name] = {
//             color: data.color,
//             stroke: data.stroke
//         };
//     } else {
//         delete linkTypes[data.originalName];
//         linkTypes[data.name] = {
//             color: data.color,
//             stroke: data.stroke
//         };
//     }

//     config = new Config({
//         link_types: linkTypes
//     });

//     config.save();

//     if (config.isValid() === true) {
//         window.webContents.send("confirmUpdateLinkTypeFromConfig", {
//             isOk: true,
//             consolMsg: "Le type de lien a bien été mis à jour dans la configuration.",
//             data: data
//         });

//         modalLinkUpdate.close();
//     } else {
//         modalLinkUpdate.webContents.send("confirmUpdateLinkTypeFromConfig", {
//             isOk: false,
//             consolMsg: "La configuration saisie est invalide. Veuillez apporter les corrections suivantes : " + config.writeReport(),
//             data: {}
//         });
//     }
// });

// ipcMain.on("askDeleteRecordType", (event, data) => {
//     let config = new Config();
//     let linkTypes = config.opts.link_types;

//     delete linkTypes[data.name];

//     config = new Config({
//         link_types: linkTypes
//     });

//     config.save();

//     let response;

//     if (config.isValid() === true) {
//         response = {
//             isOk: true,
//             consolMsg: "Le type de lien a bien été supprimé de la configuration.",
//             data: data
//         };
//     } else {
//         response = {
//             isOk: false,
//             consolMsg: "La configuration saisie est invalide. Veuillez apporter les corrections suivantes : " + config.writeReport(),
//             data: {}
//         };
//     }

//     window.webContents.send("confirmDeleteLinkTypeFromConfig", response);
// });

// ipcMain.on("askFilesOriginPath", (event, data) => {

//     dialog.showOpenDialog(window, {
//         title: 'Sélectionner répertoire des fiches',
//         defaultPath: app.getPath('documents'),
//         properties: ['openDirectory']
//     }).then((response) => {
//         window.webContents.send("getFilesOriginPath", {
//             isOk: !response.canceled,
//             data: response.filePaths
//         });
//     });

// });

// ipcMain.on("askBibliographyPath", (event, data) => {

//     dialog.showOpenDialog(window, {
//         title: 'Sélectionner catalogue de références',
//         defaultPath: app.getPath('documents'),
//         filters: [
//             { name: 'Type de fichier personnalisé', extensions: ['json'] }
//         ],
//         properties: ['openFile']
//     }).then((response) => {
//         window.webContents.send("getBibliographyPath", {
//             isOk: !response.canceled,
//             data: response.filePaths
//         });
//     });

// });

// ipcMain.on("askCslPath", (event, data) => {

//     dialog.showOpenDialog(window, {
//         title: 'Sélectionner fichier style bibliographique',
//         defaultPath: app.getPath('documents'),
//         filters: [
//             { name: 'Type de fichier personnalisé', extensions: ['csl'] }
//         ],
//         properties: ['openFile']
//     }).then((response) => {
//         window.webContents.send("getCslPath", {
//             isOk: !response.canceled,
//             data: response.filePaths
//         });
//     });

// });

// ipcMain.on("askLocalesPath", (event, data) => {

//     dialog.showOpenDialog(window, {
//         title: 'Sélectionner fichier de format bibliographique',
//         defaultPath: app.getPath('documents'),
//         filters: [
//             { name: 'Type de fichier personnalisé', extensions: ['xml'] }
//         ],
//         properties: ['openFile']
//     }).then((response) => {
//         window.webContents.send("getLocalesPath", {
//             isOk: !response.canceled,
//             data: response.filePaths
//         });
//     });

// });

// ipcMain.on("askCustomCssPath", (event, data) => {

//     dialog.showOpenDialog(window, {
//         title: 'Sélectionner fichier CSS personnalisé',
//         defaultPath: app.getPath('documents'),
//         filters: [
//             { name: 'Type de fichier personnalisé', extensions: ['css'] }
//         ],
//         properties: ['openFile']
//     }).then((response) => {
//         window.webContents.send("getCustomCssPath", {
//             isOk: !response.canceled,
//             data: response.filePaths
//         });
//     });

// });

// ipcMain.on("askDeleteViewFromConfig", (event, viewName) => {

//     let config = new Config();
//     let views = config.opts.views;

//     delete views[viewName];

//     config = new Config({
//         views: views
//     });

//     config.save();
    
//     let response;

//     if (config.isValid() === true) {
//         response = {
//             isOk: true,
//             consolMsg: "La vue a bien été supprimée de la configuration.",
//             data: views
//         };
//     } else {
//         response = {
//             isOk: false,
//             consolMsg: "La configuration saisie est invalide. Veuillez apporter les corrections suivantes : " + config.writeReport(),
//             data: {}
//         };
//     }
    
//     window.webContents.send("confirmDeleteViewFromConfig", response);
// });

// ipcMain.on("askUpdateViewModal", (event, viewName) => {
//     modalViewUpdate = new BrowserWindow (
//         Object.assign(windowsModel.modal, {
//             parent: window,
//             title: 'Éditer une vue'
//         })
//     );

//     modalViewUpdate.loadFile(path.join(__dirname, './modal-updateview-source.html'));

//     modalViewUpdate.once('ready-to-show', () => {
//         modalViewUpdate.show();
//         modalViewUpdate.webContents.send("getViewToUpdate", viewName);
//     });

// });

// ipcMain.on("sendUpdateViewToConfig", (event, data) => {
//     let config = new Config();
//     let views = config.opts.views;

//     views[data.name] = views[data.originalName];

//     delete views[data.originalName];

//     config = new Config({
//         views: views
//     });

//     config.save();

//     if (config.isValid() === true) {
//         window.webContents.send("confirmUpdateViewFromConfig", {
//             isOk: true,
//             consolMsg: "La vue a bien été renommée dans la configuration.",
//             data: data.name
//         });

//         modalViewUpdate.close();
//     } else {
//         modalViewUpdate.webContents.send("confirmUpdateViewFromConfig", {
//             isOk: false,
//             consolMsg: "La configuration saisie est invalide. Veuillez apporter les corrections suivantes : " + result.join(' '),
//             data: {}
//         });
//     }
// });

// ipcMain.on("askDeleteAllView", (event, data) => {

//     config = new Config({
//         views: {}
//     });

//     config.save();

//     window.webContents.send("confirmDeleteAllViewFromConfig", {
//         isOk: true,
//         consolMsg: "Toutes les vues ont été supprimées.",
//         data: {}
//     });

// });