/**
 * @file Manage the opened windows
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
    BrowserWindow,
    app
    } = require('electron')
, path = require('path')
, fs = require('fs');
const { xor } = require('lodash');

const iconPath = path.join(__dirname, '../../assets/icons/64x64.png');

module.exports = class Display {
    /**
     * Store windows specs under their name
     * @type object
     */

    static windows = {
        main: undefined,
        config: undefined,
        record: undefined
    };

    static windowsType = {
        main: 'main',
        config: 'form',
        history: 'form',
        record: 'form'
    };

    static baseSpecs = {
        general: {
            show: false,
            icon: iconPath
        },
        main: {
            width: 1600,
            height: 1000,
            minWidth: 1200,
            minHeight: 600
        },
        form: {
            width: 800,
            height: 600,
            minWidth: 600,
            minHeight: 300,
            autoHideMenuBar: true
        },
        modal: {
            width: 500,
            height: 200,
            resizable: false,
            minimizable: false,
            maximizable: false,
            fullscreenable: false,
            skipTaskbar: true,
            autoHideMenuBar: true,
            modal: true
        }
    }

    /**
     * Get position, size and id
     * @param {'main'|'form'|'modal'} type
     * @return {object}
     */

    static getBaseSpecs (type) {
        return Object.assign({},
            Display.baseSpecs['general'],
            Display.baseSpecs[type]
        )
    }

    /**
     * Get position, size and id
     * @param {string} windowName - key from Display.windows
     * @param {class BrowserWindow} BrowserWindow
     * @return {object}
     */

    static storeSpecs (windowName, BrowserWindow) {
        const specs = BrowserWindow.getBounds();
        specs.id = BrowserWindow.id;
        specs.fullscreen = (BrowserWindow.isFullScreen() === true);
        specs.maximized = (BrowserWindow.isMaximized() === true);

        if (specs.maximized === true) {
            const baseSpecs = Display.getWindowSpecs(windowName)

            specs.width = baseSpecs.width;
            specs.height = baseSpecs.height;
            specs.x = baseSpecs.x;
            specs.y = baseSpecs.y;
        }

        Display.windows[windowName] = specs;

        return specs;
    }

    /**
     * Get a window by its name from Display.windows
     * @param {string} windowName - key from Display.windows
     * @return {class BrowserWindow}
     */

    static getWindow (windowName) {
        return BrowserWindow.getAllWindows()
            .find(window => window.id === Display.windows[windowName]?.id)
    }

    /**
     * Get specs of a window by its name from Display.windows
     * @param {string} windowName - key from Display.windows
     * @return {object}
     */

    static getWindowSpecs (windowName) {
        return Object.assign({},
            Display.getBaseSpecs(Display.windowsType[windowName]),
            Display.getDisplaying()[windowName]
        );
    }

    /**
     * Empty the window key from Display.windows
     * @param {string} windowName - key from Display.windows
     */

    static emptyWindow (windowName) {
        Display.saveDisplaying();
        delete Display.windows[windowName].id;
    }

    /**
     * Path to save window_state.json file
     * Contains the position of windows
     * @type string
     */

    static filePath = path.join(app.getPath('userData'), 'window_state.json');

    /**
     * Get all windows saved position from file window_state.json
     * @return {object}
     */

    static getDisplaying () {
        if (fs.existsSync(Display.filePath) === false) {
            return {}; }

        let data = fs.readFileSync(Display.filePath);
        data = JSON.parse(data);

        return data;
    }

    /**
     * Save Display.windows object, with all windows position
     * @return {boolean} - If it works
     */

    static saveDisplaying () {
        const toSave = Object.assign(Display.getDisplaying(), Display.windows);

        try {
            fs.writeFileSync(Display.filePath, JSON.stringify(toSave));
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}