const {
    BrowserWindow, // app windows generator
    ipcMain
} = require('electron')
, path = require('path');

const Display = require('../../models/display');

const lang = require('../../core/models/lang');

let window;

const pageName = 'report';

module.exports = {
    open: function () {
        if (window !== undefined) {
            window.focus();
            return;
        }

        window = new BrowserWindow(
            Object.assign(Display.getBaseSpecs('form'), {
                title: `${lang.getFor(lang.i.windows[pageName].title)}`,
                parent: Display.getWindow('history'),
                width: 700,
                height: 700,
                webPreferences: {
                    preload: path.join(__dirname, './preload.js')
                }
            })
        );

        Display.storeSpecs(pageName, window);

        window.once('closed', () => {
            window = undefined;
        });
    }
}