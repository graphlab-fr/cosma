const {
    ipcMain,
    dialog,
    Menu,
    BrowserWindow
} = require('electron');

const Preferences = require('../models/preferences')
    , lang = require('../core/models/lang');

ipcMain.on("get-preferences-options", (event) => {
    event.returnValue = Preferences.get();
});

ipcMain.on("save-preferences-option", (event, name, value) => {
    const prefences = new Preferences({ [name]: value });

    const result = prefences.save();

    if (result === false) {
        event.returnValue = false;
        return;
    }

    switch (name) {
        case 'lang':
            dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                message: lang.getFor(lang.i.config.info.lang),
                type: 'info'
            });
            break;
        case 'devtools':
            appMenu = Menu.getApplicationMenu();
            appMenu.getMenuItemById('devtools').visible = prefences.opts.devtools;
            appMenu.getMenuItemById('new-cosmoscope-fake').visible = prefences.opts.devtools;
            break;
    }

    event.returnValue = true;
});