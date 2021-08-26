const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain, // interface of data exchange
        dialog
    } = require('electron')
    , path = require('path')
    , fs = require('fs')
    , moment = require('moment');

moment.locale('fr-ca');

const windowsModel = require('../../models/windows')
    , mainWindow = require('../../../main').mainWindow
    , History = require('../../models/history');

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

ipcMain.on("askHistoryDeleteAll", (event, data) => {

    dialog.showMessageBox(window, {
        title: 'Confirmation suppression historique',
        message: "Voulez-vous vraiment supprimer toutes les entrées de l'historique ?",
        type: 'question',
        buttons: ['Annuler', 'Oui'],
        defaultId: 0
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
            } else {
                response = {
                    isOk: false,
                    consolMsg: "L'historique n'a pu être vidé."
                }
            }

            window.webContents.send("confirmHistoryDeleteAll", response);
        }
    });
});

ipcMain.on("askHistoryList", (event, data) => {
    const historyRecords = History.getList();
    
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

    modalRename.webContents.openDevTools({
        mode: 'detach'
    })

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

ipcMain.on("sendHistoryToKeep", (event, recordId) => {
    const recordFromHistory = new History(recordId);
    recordFromHistory.metas.isTemp = false;

    const result = recordFromHistory.saveMetas();
    let response;

    if (result === true) {
        response = {
            isOk: true,
            consolMsg: "L'entrée est désormais pérenne.",
            data: recordFromHistory.metas
        }
    } else {
        response = {
            isOk: false,
            consolMsg: "L'état de l'entrée n'a pas été actualisé.",
            data: data
        }
    }

    window.webContents.send("confirmHistoryKeep", response);
    
});

ipcMain.on("askCosmoscopeExportFromHistory", (event, recordId) => {
    const recordFromHistory = new History(recordId);

    dialog.showSaveDialog(window, {
        title: 'Enregistrer depuis l\'historique',
        defaultPath: path.join(app.getPath('documents'), 'cosmoscope.html'),
        properties: ['createDirectory', 'showOverwriteConfirmation']
    }).then((response) => {
        if (response.canceled === false) {
            let dialogPath = response.filePath;

            if (['.html', '.htm'].includes(path.extname(response.filePath)) === false) {
                dialogPath = `${dialogPath}.html`
            }

            fs.copyFile(path.join(recordFromHistory.pathToStore, 'cosmoscope.html'), dialogPath, (err) => {
                if (err) { throw err; }
            });
        }
    });

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