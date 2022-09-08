const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        Menu,
        dialog
    } = require('electron');;

const Config = require('./core/models/config');
const buildPages = require('./controllers/build-pages');

process.on('uncaughtException', ({ name, message, stack }) => {
    switch (name) {
        case 'Error Config':
            new Config();
            app.relaunch();
            app.exit();
            break;
    
        default:
            dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                title: name,
                message: message + "\n\n" + stack,
                type: 'error',
            });
            break;
    }
})

/**
 * Wait for 'app ready' event, before lauch the window.
 */

Promise.all([app.whenReady(), new Config(), buildPages()])
    .then(() => {
        require('./views/cosmoscope').open();
    
        const menuTemplate = require('./models/menu');
        const appMenu = Menu.buildFromTemplate(menuTemplate)
        Menu.setApplicationMenu(appMenu);
    
        require('./controllers');
    
        /**
         * MacOS apps generally continue running even without any windows open.
         * Activating the app when no windows are available should open a new one.
         */
    
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                require('./views/cosmoscope').open();
            }
        });
    })

/**
 * Except on MacOs :
 * stop the app when all windows are closed.
 */

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') { // except on MacOs
        app.quit(); }
});