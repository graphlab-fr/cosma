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

const Config = require('../core/models/config')
    , History = require('./history');

module.exports = class Project {
    static filePath = path.join(app.getPath('userData'), 'projects.json');

    /** @type {Map<number, Project>} */
    static list = new Map();

    /** @type {number|undefined} */
    static current = undefined;

    static getCurrent() {
        if (Project.current === undefined || Project.list.has(Project.current) === false) {
            throw new Error("Can not find current project.");
        }
        return Project.list.get(Project.current);
    }

    static init() {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(Project.filePath)) {
                fs.readFile(Project.filePath, 'utf-8', (err, data) => {
                    if (err) { reject(err); }
                    try {
                        data = JSON.parse(data);
                        for (let i = 0; i < data.length; i++) {
                            const token = data[i];
                            token.history = JSON.parse(token.history);
                            const history = new Map();
                            for (const [id, { path, description }] of Object.entries(token.history)) {
                                if (fs.existsSync(path) === false) {
                                    continue;
                                }
                                history.set(Number(id), new History(path, description));
                            }
                            Project.list.set(i, new Project(token.opts, token.thumbnail, history));
                            if (token.isCurrent) {
                                Project.current = i;
                            }
                        }
                    } catch (error) {
                        writeBaseFile();
                    }
                    resolve();
                })
            } else {
                writeBaseFile();
            }

            function writeBaseFile() {
                const base = JSON.stringify([]);
                fs.writeFile(Project.filePath, base, 'utf-8', (err) => {
                    if (err) { reject(err); }
                    resolve();
                });
            }
        })

    }

    /**
     * @param {Project} project
     * @returns {number}
     */

    static add(project) {
        if (!project || project instanceof Project === false) {
            throw new Error('Need instance of Project to process');
        }
        const index = Project.list.size;
        Project.list.set(index, project);
        return index;
    }

    static save() {
        return new Promise((resolve, reject) => {
            let payload = [];
            Project.list.forEach((project, index) => {
                if (Project.current === index) { project.isCurrent = true; }
                project.history = JSON.stringify(Object.fromEntries(project.history));
                payload.push(project);
            });
            payload = JSON.stringify(payload);
            fs.writeFile(Project.filePath, payload, 'utf-8', (err) => {
                if (err) { reject(err); }
                resolve();
            });
        });
    }

    /**
     * 
     * @param {string} title 
     * @param {object} opts 
     * @param {string} thumbnail 
     * @param {Map} history 
     */

    constructor(opts, thumbnail, history) {
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