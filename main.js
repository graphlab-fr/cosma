const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        Menu,
        dialog
    } = require('electron');

process.on('uncaughtException', ({ name, message, stack }) => {
    switch (name) {
        case 'Error Project':
            Project.init();
            app.relaunch();
            app.exit();
            break;

        case 'Error save Cosmocope':
        case 'Error History':
            /**  @todo Reset config  */
            new History().deleteAll();
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

const History = require('./models/history');
const Project = require('./models/project');
const lang = require('./core/models/lang');
const Config = require('./core/models/config');
const ProjectConfig = require('./models/project-config');
const Preferences = require('./models/preferences');

/**
 * Wait for 'app ready' event, before lauch the window.
 */

Promise.all([app.whenReady(), Project.init(), ProjectConfig.init(), Preferences.init()])
    .then(() => {
        // need to edit flag from default config
        lang.flag = Preferences.get().lang;

        if (Project.current !== undefined) {
            require('./views/cosmoscope').open();
        } else {
            require('./views/projects').open();
        }
    
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

app.on('will-quit', function (e) {
    e.preventDefault();
    Project.save()
        .then(() => {
            app.exit();
        })
        .catch(async (err) => {
            await Project.init();
            app.exit();
        })
});

/**
 * Except on MacOs :
 * stop the app when all windows are closed.
 */

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') { // except on MacOs
        app.quit(); }
});