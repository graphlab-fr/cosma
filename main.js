const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        Menu
    } = require('electron')
    , path = require('path');

const Display = require('./models/display');

/**
 * Wait for 'app ready' event, before lauch the window.
 */

app.whenReady().then(() => {
    const windowSpecs = Display.getWindowSpecs('main');

    const mainWindow = new BrowserWindow(
        Object.assign(windowSpecs, {
            webPreferences: {
                preload: path.join(__dirname, './views/cosmoscope/preload.js')
            },
            title: 'Cosma'
        })
    );
    
    if (windowSpecs.maximized === true) {
        mainWindow.maximize(); }

    Display.storeSpecs('main', mainWindow);

    const openCosmoscope = require('./views/cosmoscope/index');

    const menuTemplate = require('./models/menu');

    const appMenu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(appMenu);

    require('./controllers');

    openCosmoscope([], runLast = true);

    /**
     * MacOS apps generally continue running even without any windows open.
     * Activating the app when no windows are available should open a new one.
     */

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            openCosmoscope([], runLast = true);
        }
    });
});

/**
 * Except on MacOs :
 * stop the app when all windows are closed.
 */

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') { // except on MacOs
        app.quit(); }
});

if (app.isPackaged === false) {
    require('./controllers/build-pages');
}