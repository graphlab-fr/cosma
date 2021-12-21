const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain, // interface of data exchange
        clipboard
    } = require('electron')
    , path = require('path');

const config = require('../../../cosma-core/models/config').get()
    , lang = require('../../../cosma-core/models/lang')
    , Display = require('../../../core/models/display');

let window;

module.exports = function (viewName, action) {
    if (window !== undefined) {
        window.focus();
        return;
    }

    window = new BrowserWindow(
        Object.assign(Display.getBaseSpecs('modal'), {
            title: lang.windows[`view_${action}`].title[config.lang],
            parent: Display.getWindow('main'),
            webPreferences: {
                preload: path.join(__dirname, './preload.js')
            }
        })
    );
    
    window.loadFile(path.join(__dirname, './source.html'));

    window.once('ready-to-show', () => {
        window.show();
    });

    window.once('closed', () => {
        window = undefined;
    });

    ipcMain.once("get-view-name", (event) => {
        event.returnValue = viewName;
    });

    ipcMain.once("get-view-key", (event) => {
        // the key is store on clipboard from the cosmoscope.html
        event.returnValue = clipboard.readText();
    });

    ipcMain.once("get-action", (event) => {
        event.returnValue = action;
    });

    ipcMain.once("close", (event) => {
        if (window !== undefined) {
            window.close();
        }
    });

    return window;
}