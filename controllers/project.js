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

ipcMain.on("open-project", (event, index) => {
    if (Project.current === index) {
        event.returnValue = { isOk: false };
        return;
    }
    if (Project.list.has(index) === false) {
        event.returnValue = { isOk: false };
        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
            title: lang.getFor(lang.i.dialog.project_no_exist.title),
            message: lang.getFor(lang.i.dialog.project_no_exist.message),
            type: 'info'
        });
    }

    try {
        Project.current = index;
        const mainIsOpen = Display.getWindow('main') !== undefined;
        if (mainIsOpen) {
            require('../controllers/cosmoscope')();
        } else {
            require('../views/cosmoscope').open();
        }
        event.returnValue = { isOk: true };
    } catch (error) {
        event.returnValue = { isOk: false };
    }
});

ipcMain.on("delete-project", (event, index) => {
    if (Project.list.has(index) === false) {
        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
            title: lang.getFor(lang.i.dialog.project_no_exist.title),
            message: lang.getFor(lang.i.dialog.project_no_exist.message),
            type: 'info'
        });
        return;
    }

    Project.list.delete(index);
    event.reply('project-has-been-delete', index);
});

ipcMain.on("add-new-project", async (event, opts) => {
    for (const option of ['select_origin', 'files_origin', 'nodes_origin', 'links_origin', 'nodes_online', 'links_online']) {
        if (opts[option] === undefined) {
            throw new Error(`${option} option left for create a new project`);
        }
    }

    Project.current = undefined;
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

    switch (lang.flag) {
        case 'fr':
            config.opts.name = `Projet sans nom n°${Project.list.size + 1}`;
            break;
        case 'en':
            config.opts.name = `Unnamed project number ${Project.list.size + 1}`;
            break;
    }

    const project = new Project(config.opts, undefined, new Map());
    const newProjectIndex = Project.add(project);
    Project.current = newProjectIndex;
    event.reply('new-project-result', { isOk: true });

    const mainIsOpen = Display.getWindow('main') !== undefined;
    let windowForSend = Display.getWindow('projects');
    if (windowForSend) {
        windowForSend.webContents.send('new-project-result', { isOk: true });
    }

    if (mainIsOpen) {
        require('../controllers/cosmoscope')();
    } else {
        require('../views/cosmoscope').open();
    }
});