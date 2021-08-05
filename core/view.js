const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain, // interface of data exchange
        Menu // top bar menu manager
    } = require('electron')
    , path = require('path')
    , fs = require('fs');

const state = require('./models/state')
    , Config = require('./models/config');

let window = new BrowserWindow ({
    width: 1200,
    height: 600,
    webPreferences: {
        allowRunningInsecureContent: false,
        contextIsolation: true,
        enableRemoteModule: false,
        nodeIntegration: false,
        sandbox: true,
        preload: path.join(__dirname, 'controller.js')
    },
    title: 'Cosma'
})

const appMenu = require('./models/menu');
Menu.setApplicationMenu(appMenu);

// window.webContents.openDevTools();

switch (state.needConfiguration()) {
    case true:
        window.loadFile('./views/form.html');
        break;
    case false:
        loadCosmoscope();
        break;
}

function loadCosmoscope () {
    const config = new Config();
    config.get();
    exports.config = config.opts;

    const cosmoscopePath = path.join(app.getPath('userData'), 'cosmoscope.html');

    const graph = require('./models/graph')();
    const cosmoscope = require('./models/template')(graph.files, graph.entities);

    fs.writeFileSync(cosmoscopePath, cosmoscope);

    window.loadFile(cosmoscopePath);
}

ipcMain.on("sendConfigOptions", (event, data) => {
    const config = new Config({
            files_origin: data.files_origin,
            export_target: data.export_target,
            focus_max: data.focus_max
        });

    config.save();

    if (config.isSet()) {
        window.webContents.send("confirmConfigRegistration", true);
    } else {
        window.webContents.send("confirmConfigRegistration", false);
    }
});