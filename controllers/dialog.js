const {
    app,
    ipcMain,
    dialog,
    BrowserWindow
} = require('electron');

const lang = require('../cosma-core/models/lang');

ipcMain.on("dialog-request-dir-path", (event, name) => {
    const window = BrowserWindow.getFocusedWindow();

    dialog.showOpenDialog(window, {
        title: lang.getFor(lang.i.dialog[name].title),
        defaultPath: app.getPath('documents'),
        buttonLabel: lang.getFor(lang.i.dialog.btn.select),
        properties: ['openDirectory']
    }).then((response) => {
        window.webContents.send("get-dir-path-from-dialog", {
            isOk: !response.canceled,
            target: name,
            data: response.filePaths[0]
        });
    }).catch(error => window.webContents.send('get-dir-path-from-dialog', {
        isOk: false
    }))
});

ipcMain.on("dialog-request-file-path", (event, name, fileExtension) => {
    const window = BrowserWindow.getFocusedWindow();

    dialog.showOpenDialog(window, {
        title: lang.getFor(lang.i.dialog[name].title),
        defaultPath: app.getPath('documents'),
        filters: [
            { name: `Fichiers ${fileExtension.toUpperCase()}`, extensions: [fileExtension] }
        ],
        buttonLabel: lang.getFor(lang.i.dialog.btn.select),
        properties: ['openFile']
    }).then((response) => {
        window.webContents.send("get-file-path-from-dialog", {
            isOk: !response.canceled,
            target: name,
            data: response.filePaths[0]
        });
    }).catch(error => window.webContents.send('get-file-path-from-dialog', {
        isOk: false
    }))
});