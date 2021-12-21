const {
    app,
    ipcMain,
    dialog,
    BrowserWindow
} = require('electron');

const config = require('../cosma-core/models/config').get()
    , lang = require('../cosma-core/models/lang');

ipcMain.on("dialog-request-dir-path", (event, name) => {
    const window = BrowserWindow.getFocusedWindow();

    dialog.showOpenDialog(window, {
        title: lang.dialog[name].title[config.lang],
        defaultPath: app.getPath('documents'),
        buttonLabel: lang.dialog.btn.select[config.lang],
        properties: ['openDirectory'],
        message: lang.dialog[name].message[config.lang]
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
        title: lang.dialog[name].title[config.lang],
        defaultPath: app.getPath('documents'),
        filters: [
            { name: `Fichiers ${fileExtension.toUpperCase()}`, extensions: [fileExtension] }
        ],
        buttonLabel: lang.dialog.btn.select[config.lang],
        properties: ['openFile'],
        message: lang.dialog[name].message[config.lang]
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