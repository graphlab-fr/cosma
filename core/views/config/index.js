const {
        BrowserWindow, // app windows generator
        shell
    } = require('electron')
    , path = require('path');

const Display = require('../../models/display')
    , lang = require('../../../cosma-core/models/lang');

let window;

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

    const windowSpecs = Display.getWindowSpecs('config');

    window = new BrowserWindow(
        Object.assign(windowSpecs, {
            title: lang.getFor(lang.i.windows['preferences'].title),
            webPreferences: {
                preload: path.join(__dirname, './preload.js')
            }
        })
    );
    
    if (windowSpecs.maximized === true) {
        window.maximize(); }

    Display.storeSpecs('config', window);

    window.webContents.on('will-navigate', function(e, url) {
        e.preventDefault();
        shell.openExternal(url);
    });

    window.on('resized', () => {
        Display.storeSpecs('config', window);
    });

    window.on('moved', () => {
        Display.storeSpecs('config', window);
    });

    window.on('maximize', () => {
        Display.storeSpecs('config', window);
    });

    window.on('unmaximize', () => {
        const winSpecs = Display.getWindowSpecs('config');
        window.setSize(winSpecs.width, winSpecs.height, true);
        window.setPosition(winSpecs.x, winSpecs.y, true);
        Display.storeSpecs('config', window);
    });
    
    window.loadFile(path.join(__dirname, './source.html'));

    window.once('ready-to-show', () => {
        window.show();
    });

    window.once('close', () => {
        Display.emptyWindow('config');
    });

    window.once('closed', () => {
        window = undefined;
    });
}