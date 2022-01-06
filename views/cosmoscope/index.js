/**
 * @file Cosmoscope displaying
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
        ipcMain,
        shell,
        BrowserWindow // app windows generator
    } = require('electron')
    , path = require('path');

const Display = require('../../models/display');

let window;

const pageName = 'main';

module.exports = {
    open: function () {
        if (window !== undefined) {
            window.focus();
            return;
        }

        const windowSpecs = Display.getWindowSpecs(pageName);

        window = new BrowserWindow(
            Object.assign(windowSpecs, {
                webPreferences: {
                    preload: path.join(__dirname, './preload.js')
                },
                title: 'Cosma'
            })
        );

        if (windowSpecs.maximized === true) {
            window.maximize(); }

        Display.storeSpecs(pageName, window);

        window.on('resized', () => {
            Display.storeSpecs(pageName, window);
        });

        window.on('moved', () => {
            Display.storeSpecs(pageName, window);
        });

        window.on('maximize', () => {
            Display.storeSpecs(pageName, window);
        });

        window.on('unmaximize', () => {
            windowSpecs = Display.getWindowSpecs(pageName);
            window.setSize(windowSpecs.width, windowSpecs.height, true);
            window.setPosition(windowSpecs.x, windowSpecs.y, true);
            Display.storeSpecs(pageName, window);
        });

        require('../../controllers/cosmoscope')([], true);

        window.once('ready-to-show', () => {
            window.show();
        });

        window.once('close', () => {
            Display.emptyWindow(pageName);
        });

        window.once('closed', () => {
            window = undefined;
        });

        window.webContents.on('will-navigate', function(e, url) {
            e.preventDefault();
            shell.openExternal(url);
        });
    }
}

ipcMain.on("askReload", () => { window.reload(); });

ipcMain.on("askBack", () => {
    if (window.webContents.canGoBack()) {
        window.webContents.goBack();
    };
});

ipcMain.on("askForward", () => {
    if (window.webContents.canGoForward()) {
        window.webContents.goForward();
    };
});

ipcMain.on("askShare", () => {
    require('../export').open();
});

ipcMain.on("askRecordNew", () => {
    require('../record').open();
});

ipcMain.on("askCosmoscopeNew", () => {
    require('../../controllers/cosmoscope')();
});