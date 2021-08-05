const {
        Menu, // top bar menu manager
        BrowserWindow
    } = require('electron')
    , path = require('path');

const template = [
    {
        label: 'Cosma',
        submenu: [
            {
                label: 'À propos de Cosma',
                role: 'about'
            },
            {
                label: 'Préférences…',
                accelerator: 'CommandOrControl+V',
                role: 'options',
                click () {
                    require('../views/config');
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
                    require('../views/record');
                }
            },
            {
                label: 'Nouveau cosmoscope…',
                accelerator: 'CommandOrControl+N',
                role: 'new-cosmoscope'
            },
            {
                label: 'Historique…',
                accelerator: 'CommandOrControl+H',
                role: 'history'
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