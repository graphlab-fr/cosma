/**
 * @file Define menus headlines, shortcuts and their functions
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const {
        app,
        Menu, // top bar menu manager 
    } = require('electron');

const cosmoscopeGenerationDisplaying = require('../view').cosmoscopeGenerationDisplaying;

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
                accelerator: 'CommandOrControl+N',
                role: 'new-record',
                click () {
                    require('../views/record-launcher')();
                }
            },
            {
                label: 'Nouveau cosmoscope…',
                role: 'new-cosmoscope',
                click () {
                    cosmoscopeGenerationDisplaying();
                }
            },
            {
                label: 'Exporter cosmoscope…',
                role: 'export-cosmoscope',
                click () {
                    require('../views/cosmoscope-export')();
                }
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