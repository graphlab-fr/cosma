const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain, // interface of data exchange
        dialog,
        shell
    } = require('electron')
    , path = require('path')
    , fs = require('fs')
    , moment = require('moment');

moment.locale('fr-ca');

const windowsModel = require('../../models/windows')
    , mainWindow = require('../../../main').mainWindow
    , History = require('../../models/history')
    , Config = require('../../models/config')
    , config = new Config().opts;

let window, modalRename, modalReport;

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
            title: 'Historique'
        })
    );

    window.loadFile(path.join(__dirname, './main-source.html'));

    window.once('ready-to-show', () => {
        window.show();
    });

    window.once('closed', () => {
        window = undefined;
    });

    /**
     * API
     * ---
     * manage data
     */

}

ipcMain.once("askHistoryDeleteAll", (event, data) => {

    dialog.showMessageBox(window, {
        title: 'Confirmation suppression historique',
        message: "Voulez-vous vraiment supprimer toutes les entrées de l'historique ?",
        type: 'question',
        buttons: ['Annuler', 'Oui']
    })
    .then((response) => {
        if (response.response === 1) {
            const result = History.deleteAll();

            let response;
        
            if (result) {
                response = {
                    isOk: true,
                    consolMsg: "L'historique bien a été vidé."
                }

                window.webContents.send("confirmHistoryDeleteAll", response);
                window.close();
            } else {
                response = {
                    isOk: false,
                    consolMsg: "L'historique n'a pu être vidé."
                }

                window.webContents.send("confirmHistoryDeleteAll", response);
            }
        }
    });
});

ipcMain.on("askHistoryList", (event, data) => {
    let historyRecords = History
        .getList()
        .filter(historyRecord => historyRecord.metas.isTemp !== true);
    
    window.webContents.send("getHistoryList", historyRecords);
});

ipcMain.on("sendCosmoscopeFromHistoryList", (event, recordId) => {
    const cosmoscopePath = path.join(History.path, recordId, 'cosmoscope.html');
    mainWindow.webContents.loadFile(cosmoscopePath);
});

ipcMain.on("sendHistoryToDelete", (event, date) => {
    const history = new History(date);
    const result = history.delete();
    let response;

    if (result === true) {
        response = {
            isOk: true,
            consolMsg: 'L\'entrée d\'historique a bien été supprimée'
        }
    } else {
        response = {
            isOk: false,
            consolMsg: 'L\'entrée d\'historique n\'a pas été supprimée'
        }
    }

    window.webContents.send("confirmHistoryDelete", response);
});

ipcMain.on("askRenameHistoryModal", (event, recordId) => {
    modalRename = new BrowserWindow (
        Object.assign(windowsModel.modal, {
            parent: window,
            title: 'Renommer un enregistrement'
        })
    );

    modalRename.loadFile(path.join(__dirname, './modal-rename-source.html'));

    const recordFromHistory = new History(recordId);

    modalRename.once('ready-to-show', () => {
        modalRename.show();
        modalRename.webContents.send("getMetasHistory", {
            id: recordFromHistory.id,
            description: recordFromHistory.metas.description
        });
    });
});

ipcMain.on("sendNewHistoryName", (event, data) => {
    const recordFromHistory = new History(data.id);
    recordFromHistory.metas.description = data.description;

    const result = recordFromHistory.saveMetas();
    let response;

    if (result === true) {
        response = {
            isOk: true,
            consolMsg: "La description de l'entrée a bien été modifiée.",
            data: recordFromHistory.metas
        }

        modalRename.close();
        window.webContents.send("confirmRenameHistory", response);
    } else {
        response = {
            isOk: false,
            consolMsg: "La description de l'entrée n'a pu être modifiée.",
            data: data
        }

        modalRename.webContents.send("confirmRenameHistory", response);
    }

    
});

ipcMain.on("askHistoryToKeep", (event, data) => {
    const lastHistoryRecord = History.getLast();
    let response;

    if (!lastHistoryRecord) {
        response = {
            isOk: false,
            consolMsg: "L'historique est vide",
            data: {}
        }

        window.webContents.send("confirmHistoryKeep", response);
        return;
    }

    if (config.history === true || lastHistoryRecord.metas.isTemp === false) {
        response = {
            isOk: false,
            consolMsg: "L'entrée d'historique courante est déjà ajouté à l'historique",
            data: lastHistoryRecord
        }
    } else {
        lastHistoryRecord.metas.isTemp = false;
        const result = lastHistoryRecord.saveMetas();

        if (result === true) {
            response = {
                isOk: true,
                consolMsg: "L'entrée d'historique courante n'est désormais plus temporaire",
                data: lastHistoryRecord
            }
        } else {
            response = {
                isOk: false,
                consolMsg: "L'entrée d'historique courante n'a pu être éditée",
                data: lastHistoryRecord
            }
        }
    }
    
    window.webContents.send("confirmHistoryKeep", response);
});

ipcMain.on("askHistoryReportModal", (event, recordId) => {
    modalReport = new BrowserWindow (
        Object.assign(windowsModel.forms, {
            parent: window,
            title: 'Rapport d’erreur'
        })
    );

    modalReport.loadFile(path.join(__dirname, './modal-report-source.html'));

    modalReport.once('ready-to-show', () => {
        modalReport.show();

        const recordFromHistory = new History(recordId)
        , report = recordFromHistory.getReport();

        modalReport.webContents.send("getHistoryReport", report);
    });
    
});

ipcMain.on("askRevealCosmoscopeFromHistoryFolder", (event, recordId) => {
    const recordFromHistory = new History(recordId);

    shell.showItemInFolder(path.join(recordFromHistory.pathToStore, 'cosmoscope.html'));
});