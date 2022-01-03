const {
        BrowserWindow
    } = require('electron')
    , path = require('path')

const Display = require('../../models/display')
    , lang = require('../../cosma-core/models/lang');

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

    const pageName = 'history';

    let windowSpecs = Display.getWindowSpecs(pageName);

    window = new BrowserWindow(
        Object.assign(windowSpecs, {
            title: lang.getFor(lang.i.windows[pageName].title),
            webPreferences: {
                preload: path.join(__dirname, './preload.js')
            }
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

    window.loadFile(path.join(__dirname, './source.html'));

    window.once('ready-to-show', () => {
        window.show();
    });

    window.once('close', () => {
        Display.emptyWindow(pageName);
    });

    window.once('closed', () => {
        window = undefined;
    });
}