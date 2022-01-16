const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain, // interface of data exchange
    } = require('electron')
    , path = require('path');

const lang = require('../../core/models/lang');

let window;

const pageName = 'linktype';

module.exports = {
    open: function (linkType, action) {
        if (window !== undefined) {
            window.focus();
            return;
        }

        const Display = require('../../models/display');

        window = new BrowserWindow(
            Object.assign(Display.getBaseSpecs('modal'), {
                title: lang.getFor(lang.i.windows[pageName].title[action]),
                parent: Display.getWindow('config'),
                webPreferences: {
                    preload: path.join(__dirname, './preload.js')
                }
            })
        );
        
        window.loadFile(path.join(__dirname, `/dist/${lang.flag}.html`));

        window.once('ready-to-show', () => {
            window.show();
        });

        window.once('closed', () => {
            window = undefined;
        });

        ipcMain.once("get-linktype", (event) => {
            event.returnValue = linkType;
        });

        ipcMain.once("get-action", (event) => {
            event.returnValue = action;
        });

        return window;
    },

    build: () => require('../build-page')(pageName, __dirname)
}