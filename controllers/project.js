const {
    ipcMain,
    dialog,
    BrowserWindow
} = require('electron');

const lang = require('../core/models/lang');

const Project = require('../models/project')
    , ProjectConfig =  require('../models/project-config')
    , Display = require('../models/display');

ipcMain.on("get-project-list", (event) => {
    event.returnValue = Project.list;
});

ipcMain.on("add-new-project", async (event, opts) => {
    for (const option of ['select_origin', 'files_origin', 'nodes_origin', 'links_origin', 'nodes_online', 'links_online']) {
        if (opts[option] === undefined) {
            throw new Error(`${option} option left for create a new project`);
        }
    }

    const config = new ProjectConfig(opts);
    let isOk = config.canModelizeFromDirectory() || config.canModelizeFromCsvFiles() || await config.canModelizeFromOnline();
    
    if (isOk === false) {
        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
            title: lang.getFor(lang.i.dialog.no_origin.title),
            message: lang.getFor(lang.i.dialog.no_origin.message),
            type: 'info'
        });
        return event.reply('new-project-result', { isOk });
    }

    const newProjectIndex = Project.add();
    Project.current = newProjectIndex;
    Project.getCurrent().opts = config.opts;
    Project.save()
        .then(() => {
            require('../views/cosmoscope').open();

            event.reply('new-project-result', { isOk: true });
            let windowForSend = Display.getWindow('projects');
            if (windowForSend) {
                windowForSend.webContents.send('new-project-result', { isOk: true });
            }
        })
        .catch(() => event.reply('new-project-result', { isOk: false }));
});