/**
 * @file Windows configuration
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const path = require('path');

const iconPath = path.join(__dirname, '../../assets/icons/64x64.png');

module.exports = {

    /**
     * For main window that contains the graph :
     * big size, multipurpose handle, menu bar
     */

    main: {
        width: 1600,
        height: 1000,
        minWidth: 1200,
        minHeight: 600,
        show: false,
        icon: iconPath,
        webPreferences: {
            allowRunningInsecureContent: false,
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
            sandbox: true,
            preload: path.join(__dirname, '../views/cosmoscope/main-preload.js')
        },
        title: 'Cosma'
    },

    /**
     * For windows that contains forms :
     * intermediate size, multipurpose handle, no menu bar
     */

    forms: {
        width: 800,
        height: 600,
        minWidth: 600,
        minHeight: 300,
        show: false,
        icon: iconPath,
        autoHideMenuBar: true,
        webPreferences: {
            allowRunningInsecureContent: false,
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
            sandbox: true,
            preload: path.join(__dirname, '../controller.js')
        },
    },

    /**
     * For windows to set options :
     * small size, minimal control on view, no menu bar
     */

    modal: {
        width: 300,
        height: 400,
        resizable: false,
        minimizable: false,
        maximizable: false,
        fullscreenable: false,
        skipTaskbar: true,
        autoHideMenuBar: true,
        show: false,
        modal: true,
        icon: iconPath,
        webPreferences: {
            allowRunningInsecureContent: false,
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
            sandbox: true,
            preload: path.join(__dirname, '../controller.js')
        }
    }
}