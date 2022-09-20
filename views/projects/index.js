const {
        BrowserWindow, // app windows generator
    } = require('electron')
    , path = require('path');

const lang = require('../../core/models/lang');

let window;

const pageName = 'projects';

module.exports = {
    open: function () {
        if (window !== undefined) {
            window.focus();
            return;
        }

        const Display = require('../../models/display');
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

        window.loadFile(path.join(__dirname, `/dist/${lang.flag}.html`));

        window.once('ready-to-show', () => {
            window.show();
        });

        window.once('close', () => {
            Display.emptyWindow(pageName);
        });

        window.once('closed', () => {
            window = undefined;
        });
    },

    build: () => require('../build-page')(pageName, __dirname)
}