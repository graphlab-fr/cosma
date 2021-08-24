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

    let template = [
        {
            label: 'Cosma',
            submenu: [
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
                }
            ]
        },
        {
            label: 'Fichier',
            submenu: [
                {
                    label: 'Nouvelle fiche…',
                    role: 'new-record',
                    click () {
                        require('../views/record/index')();
                    }
                },
                {
                    label: 'Nouveau cosmoscope…',
                    accelerator: 'CommandOrControl+N',
                    role: 'new-cosmoscope',
                    click () {
                        require('../views/cosmoscope')();
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
                {
                    label: 'Historique…',
                    accelerator: 'CommandOrControl+H',
                    role: 'history',
                    click () {
                        require('../views/history/index')();
                    }
                }
            ]
        },
        {
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
        }
    ];

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