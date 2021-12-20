const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain, // interface of data exchange
    } = require('electron')
    , path = require('path');

const config = require('../../../cosma-core/models/config').get()
    , lang = require('../../../cosma-core/models/lang')
    , windowsModel = require('../../models/windows');

let window;

module.exports = function (recordType, action) {
    if (window !== undefined) {
        window.focus();
        return;
    }

    window = new BrowserWindow (
        Object.assign(windowsModel.modal, {
            title: lang.windows[`recordtype_${action}`][config.lang],
            parent: BrowserWindow.getFocusedWindow(),
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

    ipcMain.once("get-recordtype", (event) => {
        event.returnValue = recordType;
    });

    ipcMain.once("get-action", (event) => {
        event.returnValue = action;
    });

    ipcMain.once("close", (event) => {
        window.close();
    });

    return window;
}