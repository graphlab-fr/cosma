const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain, // interface of data exchange
    } = require('electron')
    , path = require('path');

const lang = require('../../core/models/lang');

const { getFolksonomyFromUserData } = require('../misc');

let window;

const pageName = 'records_filter';

module.exports = {
    open: function () {
        if (window !== undefined) {
            window.focus();
            return;
        }

        const Display = require('../../models/display');

        window = new BrowserWindow(
            Object.assign(Display.getBaseSpecs('modal'), {
                title: lang.getFor(lang.i.windows[pageName].title),
                parent: Display.getWindow('config'),
                webPreferences: {
                    preload: path.join(__dirname, './preload.js')
                }
            })
        );
        
        window.webContents.openDevTools({ mode: 'detach' })

        window.loadFile(path.join(__dirname, `/dist/${lang.flag}.html`));

        window.once('ready-to-show', () => {
            window.show();
            getFolksonomyFromUserData().then((folksonomy) => {
                window.webContents.send('get-records-folksonomy', folksonomy);
            });
        });

        window.once('closed', () => {
            window = undefined;
        });

        return window;
    },

    build: () => require('../build-page')(pageName, __dirname)
}