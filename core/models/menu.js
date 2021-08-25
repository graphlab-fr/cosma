/**
 * @file Define menus headlines, shortcuts and their functions
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const {
        app,
        Menu, // top bar menu manager
        dialog
    } = require('electron'),
    fs = require('fs'),
    path = require('path');

const Config = require('./config')
    , mainWindow = require('../../main').mainWindow;

module.exports = function () {
    const config = new Config().opts;

    let template = [];

    if (process.platform === 'darwin') { // on MacOS
        template.push({
            label: app.name,
            submenu: [
                {
                    label: 'À propos',
                    role: 'about'
                },
                {
                    label: 'Préférences…',
                    accelerator: 'CommandOrControl+O',
                    role: 'options',
                    click () {
                        require('../views/config/index')();
                    }
                },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                {
                    label: 'Masquer Cosma',
                    role: 'hide'
                },
                { 
                    label: 'Masquer les autres',
                    role: 'hideothers'
                },
                {
                    label: 'Tout afficher',
                    role: 'unhide' 
                },
                { type: 'separator' },
                {
                    label: 'Quitter Cosma',
                    role: 'quit'
                }
            ]
        },
        {
            label: 'Fichier',
            submenu: [
                {
                    label: 'Nouveau cosmoscope…',
                    accelerator: 'CommandOrControl+N',
                    role: 'new-cosmoscope',
                    click () {
                        require('../views/cosmoscope')();
                    }
                },
                {
                    label: 'Nouvelle fiche…',
                    role: 'new-record',
                    click () {
                        require('../views/record/index')();
                    }
                },
                {
                    label: 'Exporter cosmoscope…',
                    accelerator: 'CommandOrControl+E',
                    role: 'export-cosmoscope',
                    click (item, window) {
                        require('../views/export/index')(window);
                    }
                },
                { type: 'separator' },
                {
                    label: 'Historique…',
                    accelerator: 'CommandOrControl+H',
                    role: 'history',
                    click () {
                        require('../views/history/index')();
                    }
                }
            ]
        });
    } else {
        template.push({
            label: 'Fichier',
            submenu: [
                {
                    label: 'Nouveau cosmoscope…',
                    accelerator: 'CommandOrControl+N',
                    role: 'new-cosmoscope',
                    click () {
                        require('../views/cosmoscope')();
                    }
                },
                {
                    label: 'Nouvelle fiche…',
                    role: 'new-record',
                    click () {
                        require('../views/record/index')();
                    }
                },
                {
                    label: 'Exporter cosmoscope…',
                    accelerator: 'CommandOrControl+E',
                    role: 'export-cosmoscope',
                    click (item, window) {
                        require('../views/export/index')(window);
                    }
                },
                { type: 'separator' },
                {
                    label: 'Historique…',
                    accelerator: 'CommandOrControl+H',
                    role: 'history',
                    click () {
                        require('../views/history/index')();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Préférences…',
                    accelerator: 'CommandOrControl+O',
                    role: 'options',
                    click () {
                        require('../views/config/index')();
                    }
                },
                {
                    label: 'Quitter',
                    accelerator: 'CommandOrControl+Q',
                    role: 'quit',
                    click () {
                        app.quit();
                    }
                },
            ]
        });
    }

    template.push({
        label: 'Affichage',
        submenu: [
            {
                label: 'En arrière',
                accelerator: 'CommandOrControl+Left',
                role: 'back',
                click(item, window) {
                    if (mainWindow.webContents.canGoBack()) { mainWindow.webContents.goBack() };
                }
            },
            {
                label: 'En avant',
                accelerator: 'CommandOrControl+Right',
                role: 'forward',
                click(item, window) {
                    if (mainWindow.webContents.canGoForward()) { window.webContents.goForward() };
                }
            },
            {
                label: 'Imprimer',
                accelerator: 'CommandOrControl+P',
                role: 'print',
                click(item, window) {
                    mainWindow.webContents.printToPDF({
                        headerFooter: {
                            title: mainWindow.title,
                            url: 'https://cosma.netlify.app/'
                        },
                        pageSize: 'A4'
                    })
                    .then(pdfData => {
                        dialog.showSaveDialog(mainWindow, {
                            title: 'Enregistrer le PDF',
                            defaultPath: path.join(app.getPath('documents'), `${mainWindow.title}.pdf`),
                            properties: ['createDirectory', 'showOverwriteConfirmation']
                        }).then((response) => {
                            if (response.canceled === false) {
                                fs.writeFile(response.filePath, pdfData, (err) => {
                                    if (err) { throw `Erreur d'enregistrement de l'impression PDF : ${err}`; }
                                })
                            }
                        });
                    })
                    .catch(err => {
                        throw `Erreur d'impression du PDF : ${err}`;
                    })
                }
            }
        ]
    },
    {
        label: 'Aide',
        submenu: [
            {
                label: 'Aide Cosma',
                role: 'doc'
            }
        ]
    });

    if (config.devtools === true) {
        template.push({
            label: 'Développement',
            submenu: [
                {
                    id: 'devtools',
                    label: 'Afficher l’inspecteur web',
                    role: 'devtools',
                    click(item, window) {
                        if (window) { window.webContents.toggleDevTools() };
                    },
                },
            ],
            visible: false
        })
    }

    const appMenu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(appMenu);

    return template;
}