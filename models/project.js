/**
 * @file Manage projects
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
    app, // app event lifecycle, events
} = require('electron')
, fs = require('fs')
, path = require('path');

const Config = require('../core/models/config');

module.exports = class Project {
    static filePath = path.join(app.getPath('userData'), 'projects.json');

    /** @type {Map<number, Project>} */
    static list = new Map();

    // static get(projectId) {
    //     try {
    //         const dataProjects = fs.readFileSync(Project.filePath, 'utf-8');
    //     } catch (error) {
    //         throw new ErrorProject("The projects file can not be readed")
    //     }
    // }

    // static getAll() {
    //     try {
    //         const dataProjects = fs.readFileSync(Project.filePath, 'utf-8');
    //         console.log(dataProjects);
    //     } catch (error) {
    //         throw new ErrorProject("The projects file can not be readed")
    //     }
    // }

    static init() {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(Project.filePath) === false) {
                const base = JSON.stringify([]);
                fs.writeFile(Project.filePath, base, 'utf-8', (err) => {
                    if (err) { reject(err); }
                    resolve();
                });
            } else {
                fs.readFile(Project.filePath, 'utf-8', (err, data) => {
                    if (err) { reject(err); }
                    data = JSON.parse(data);
                    for (let i = 0; i < data.length; i++) {
                        const token = data[i];
                        Project.list.set(i, new Project(token.title, token.opts, token.thumbnail, token.history));
                    }
                    resolve();
                })
            }
        })
    }

    /**
     * 
     * @param {string} title 
     * @param {object} opts 
     * @param {string} thumbnail 
     * @param {Map} history 
     */

    constructor(title, opts, thumbnail, history) {
        this.title = title;
        this.opts = opts;
        this.thumbnail = thumbnail;
        this.history = history;
    }

    fromList(index) {
        if (id && typeof id === 'number') {
            console.log('will find the project');
            // const allProjects = Project.getAll();
            // allProjects[index] === undefined
        }
    }
}

class ErrorProject extends Error {
    constructor(message) {
      super(message);
      this.name = 'Error Project';
    }
}