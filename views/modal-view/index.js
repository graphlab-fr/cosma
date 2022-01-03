const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain, // interface of data exchange
        clipboard
    } = require('electron')
    , path = require('path');

const lang = require('../../cosma-core/models/lang')
    , Display = require('../../models/display');

let window;

module.exports = function (viewName, action) {
    if (window !== undefined) {
        window.focus();
        return;
    }

    window = new BrowserWindow(
        Object.assign(Display.getBaseSpecs('modal'), {
            title: lang.getFor(lang.i.windows[`view_${action}`].title),
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