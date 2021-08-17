/**
 * @file Define menus headlines, shortcuts and their functions
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const {
        app,
        Menu, // top bar menu manager 
    } = require('electron');

const template = [
    {
        label: 'Cosma',
        submenu: [
            {
                label: 'Préférences…',
                accelerator: 'CommandOrControl+O',
                role: 'options',
                click () {
                    require('../views/config-launcher')();
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
                    require('../views/record-launcher')();
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
                    if (window && window.webContents.canGoBack()) { window.webContents.goBack() };
                }
            },
            {
                label: 'En avant',
                accelerator: 'CommandOrControl+Right',
                role: 'forward',
                click(item, window) {
                    if (window && window.webContents.canGoForward()) { window.webContents.goForward() };
                }
            }
        ]
    },
    {
        label: 'Développement',
        submenu: [
            {
                label: 'Afficher l’inspecteur web',
                role: 'devtools',
                click(item, window) {
                    if (window) { window.webContents.toggleDevTools() };
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

module.exports = Menu.buildFromTemplate(template);