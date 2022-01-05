/**
 * @file Define menus headlines, shortcuts and their functions
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const { app } = require('electron');

const Config = require('../cosma-core/models/config')
    , config = new Config()
    , lang = require('../cosma-core/models/lang');

const Display = require('./display');

const isMac = process.platform === 'darwin';

module.exports = [
    ...(isMac ? [{
        label: app. ame,
        submenu: [
            {
                label: lang.getFor(lang.i.app_menu.about),
                role: 'about',
                click () {
                    mainWindow.webContents.send("open-about");
                }
            },
            {
                label: lang.getFor(lang.i.app_menu.preferences),
                accelerator: 'CommandOrControl+,',
                role: 'options',
                click () {
                    require('../views/config').open();
                }
            },
            { type: 'separator' },
            {
                label: lang.getFor(lang.i.app_menu.services),
                role: 'services'
            },
            { type: 'separator' },
            { 
                label: lang.getFor(lang.i.app_menu.hide),
                role: 'hide'
            },
            {
                label: lang.getFor(lang.i.app_menu.hide_others),
                role: 'hideOthers'
            },
            {
                label: lang.getFor(lang.i.app_menu.unhide),
                role: 'unhide'
            },
            { type: 'separator' },
            {
                label: lang.getFor(lang.i.app_menu.quit),
                role: 'quit'
            }
        ]
    }]
    :
    []),

    {
        label: lang.getFor(lang.i.app_menu.file),
        submenu: [
            {
                label: lang.getFor(lang.i.app_menu.new_cosmoscope),
                accelerator: 'CommandOrControl+R',
                role: 'new-cosmoscope',
                click () {
                    require('../controllers/cosmoscope')();
                }
            },
            {
                label: lang.getFor(lang.i.app_menu.new_cosmoscope_quotes),
                accelerator: 'CommandOrControl+Shift+R',
                role: 'new-cosmoscope-citeproc',
                id: 'citeproc',
                enabled: config.canCiteproc(),
                click () {
                    require('../controllers/cosmoscope')(['citeproc']);
                }
            },
            {
                label: lang.getFor(lang.i.app_menu.new_record),
                role: 'new-record',
                accelerator: 'CommandOrControl+N',
                click () {
                    require('../views/record').open();
                }
            },
            {
                label: lang.getFor(lang.i.app_menu.share),
                accelerator: 'CommandOrControl+E',
                role: 'export-cosmoscope',
                click () {
                    require('../views/export/').open();
                }
            },
            {
                label: lang.getFor(lang.i.app_menu.print_record),
                accelerator: 'CommandOrControl+P',
                role: 'print',
                id: 'print',
                click () {
                    mainWindow = Display.getWindow('main');
                    if (mainWindow === undefined) { return; }
                    mainWindow.focus();
                    require('../controllers/print')();
                }
            },
            { type: 'separator' },
            {
                label: lang.getFor(lang.i.app_menu.history),
                accelerator: 'CommandOrControl+H',
                role: 'history',
                click () {
                    require('../views/history').open();
                }
            },
            { type: 'separator' },

            ...(isMac === false ? [
                {
                    label: lang.getFor(lang.i.app_menu.preferences),
                    accelerator: 'CommandOrControl+O',
                    role: 'options',
                    click () {
                        require('../views/config').open();
                    }
                }
            ]
            :
            [])
        ]
    },

    {
        label: lang.getFor(lang.i.app_menu.edit),
        submenu: [
            {
                label: lang.getFor(lang.i.app_menu.undo),
                role: 'undo'
            },
            {
                label: lang.getFor(lang.i.app_menu.redo),
                role: 'redo'
            },
            { type: 'separator' },
            {
                label: lang.getFor(lang.i.app_menu.cut),
                role: 'cut'
            },
            {
                label: lang.getFor(lang.i.app_menu.copy),
                role: 'copy'
            },
            {
                label: lang.getFor(lang.i.app_menu.paste),
                role: 'paste'
            },

            ...(isMac ? [
                {
                    label: lang.getFor(lang.i.app_menu.delete),
                    role: 'delete'
                },
                {
                    label: lang.getFor(lang.i.app_menu.select_all),
                    role: 'selectAll'
                },
                { type: 'separator' },
                {
                    label: lang.getFor(lang.i.app_menu.speech),
                    submenu: [
                        {
                            label: lang.getFor(lang.i.app_menu.start_speaking),
                            role: 'startSpeaking'
                        },
                        {
                            label: lang.getFor(lang.i.app_menu.stop_speaking),
                            role: 'stopSpeaking'
                        }
                    ]
                }
            ]
            :
            []),

            {
                label: lang.getFor(lang.i.app_menu.delete),
                role: 'delete'
            },
            { type: 'separator' },
            {
                label: lang.getFor(lang.i.app_menu.select_all),
                role: 'selectAll'
            }
        ]
    },

    {
        label: lang.getFor(lang.i.app_menu.view),
        submenu: [
            {
                label: lang.getFor(lang.i.app_menu.record_back),
                accelerator: 'CommandOrControl+Left',
                role: 'back',
                click () {
                    mainWindow = Display.getWindow('main');
                    if (mainWindow && mainWindow.webContents.canGoBack()) {
                        mainWindow.focus();
                        mainWindow.webContents.goBack();
                    };
                }
            },
            {
                label: lang.getFor(lang.i.app_menu.record_forward),
                accelerator: 'CommandOrControl+Right',
                role: 'back',
                click () {
                    mainWindow = Display.getWindow('main');
                    if (mainWindow && mainWindow.webContents.canGoForward()) {
                        mainWindow.focus();
                        mainWindow.webContents.goForward()
                    };
                }
            },
            { type: 'separator' },
            {
                label: lang.getFor(lang.i.app_menu.reset_zoom),
                role: 'resetZoom'
            },
            {
                label: lang.getFor(lang.i.app_menu.zoom_in),
                role: 'zoomIn'
            },
            {
                label: lang.getFor(lang.i.app_menu.zoom_out),
                role: 'zoomOut'
            },
            { type: 'separator' },
            {
                label: lang.getFor(lang.i.app_menu.fullscreen),
                role: 'togglefullscreen'
            },
            {
                label: lang.getFor(lang.i.app_menu.dev_tools),
                role: 'toggleDevTools',
                id: 'devtools',
                visible: config.opts.devtools
            }
        ]
    },

    {
        label: lang.getFor(lang.i.app_menu.window),
        submenu: [
            { role: 'minimize' },

            ...(isMac === false ? [
                {
                    label: lang.getFor(lang.i.app_menu.close),
                    role: 'close'
                }
            ]
            :
            [])
        ]
    },

    {
        label: lang.getFor(lang.i.app_menu.help),
        role: 'help',
        submenu : [
            {
                label: lang.getFor(lang.i.app_menu.manual),
                click : () => {
                    const { shell } = require('electron');
                    shell.openExternal('https://cosma.graphlab.fr/docs/');
                }
            },
            {
                label: lang.getFor(lang.i.app_menu.shortcuts),
                label: 'Raccourcis clavier',
                click : () => {
                    mainWindow.webContents.send("open-help");
                }
            }
        ]
    }
];