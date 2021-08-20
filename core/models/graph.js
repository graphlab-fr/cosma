/**
 * @file Cosmoscope generator
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright MIT License ANR HyperOtlet
 */

const fs = require('fs')
    , path = require('path')
    , ymlFM = require('yaml-front-matter');

const Config = require('./config');

module.exports = class Graph {

    static validParms = ['publish', 'citeproc'];

    static normalizeLinks (link) {
        link = link.split(':', 2);

        if (link.length === 2) {
            return { type: link[0], target: {id: (Number(link[1]) || link[1]) } }; }

        return { type: 'undefined', target: {id: (Number(link[0]) || link[0]) } };
    }

    static getNodeRank (linksNb, backlinksNb) {
        let rank = 1 // original rank
            , sizeDivisor = 2; // to subside rank

        rank += Math.floor(linksNb / sizeDivisor);
        rank += Math.floor(backlinksNb / sizeDivisor);

        return rank;
    }

    constructor (parms) {

        this.config = new Config().serializeForGraph();
        this.parms = parms.filter(parm => Graph.validParms.includes(parm));

        this.report = {
            ignoredFiles: [],
            typeRecordChange: [],
            typeLinkChange: [],
            linkInvalid: [],
            linkNoTarget: [],
            duplicates: []
        };

        this.files = this.serializeFiles()
            .filter(this.verifFile, this);


        this.filesIdnName = this.files.map((file) => {
            return { id: file.metas.id, name: file.name };
        });

        if (this.thereAreDuplicates()) {
            
        }

        delete this.filesIdnName;

        this.files = this.files.map(this.scanLinksnContexts, this);

        this.validTypes = {
            records: Object.keys(this.config.record_types),
            links: Object.keys(this.config.link_types)
        }

        this.filesId = this.files.map(file => file.metas.id);

        this.files = this.files.map(this.checkRecordType, this);
        this.files = this.files.map(this.checkLinkTargetnSource, this);

        delete this.validTypes;
        delete this.filesId;

        this.files = this.files.map(this.findBacklinks, this);

        if (this.config.focus_max > 0) {
            this.files = this.files.map(this.evalConnectionLevels, this); }

        return {
            report: this.report,
            files: this.files,
            data: {
                nodes: this.getNodes(),
                links: this.getLinks()
            }
        }
    }

    getFilesNames () {
        return fs.readdirSync(this.config.files_origin, 'utf8')
            .filter(fileName => path.extname(fileName) === '.md');
    }

    serializeFiles() {
        const config = this.config;

        return this.getFilesNames()
            .map(function (fileName) {
                let file = {};

                file.name = fileName;
                file.filePath = path.join(config.files_origin, fileName);
                file.lastEditDate = fs.statSync(file.filePath).mtime;
                
                file.contain = fs.readFileSync(file.filePath, 'utf8');
                file.metas = ymlFM.loadFront(file.contain);
                file.content = file.metas.__content
                delete file.metas.__content;
                delete file.contain;

                file.metas.tags = file.metas.tags || [];

                return file;
            });
    }

    verifFile (file) {
        if (!file.metas.id || isNaN(file.metas.id) === true) {
            this.report.ignoredFiles.push({ fileName: file.name, invalidMeta: 'id' });
            return false;
        }
    
        if (!file.metas.title) {
            this.report.ignoredFiles.push({ fileName: file.name, invalidMeta: 'title' });
            return false;
        }

        return true;
    }

    thereAreDuplicates () {
        let duplicatedFilesNameById = [];

        for (let i = 0; i < this.filesIdnName.length; i++) {
            const fileIdTitle = this.filesIdnName[i];

            if (Object.keys(duplicatedFilesNameById).includes(String(fileIdTitle.id))) {
                // if the id had already duplicates identifed
                continue;
            }

            const duplicates = this.filesIdnName.filter(file => file.id === fileIdTitle.id);

            if (duplicates.length === 1 && duplicates[0].name === fileIdTitle.name) {
                // if the only element found is in fact the verification element
                continue;
            }

            // store the id of the duplicated files, associated with their name
            // ex : 20201012091721: { file1.md, file2.md }
            duplicatedFilesNameById[fileIdTitle.id] = duplicates.map(duplic => duplic.name);
        }

        if (Object.keys(duplicatedFilesNameById).length === 0) {
            return false; // if there is no other file with this id
        }

        for (const eltId in duplicatedFilesNameById) {
            const filesWithSameId = duplicatedFilesNameById[eltId];
            this.report.duplicates.push({ id: eltId, files: filesWithSameId })
        }

        return true;
    }

    scanLinksnContexts (file) {
        file.contexts = [];
        file.links = [];

        const paraphs = file.content.match(/[^\r\n]+((\r|\n|\r\n)[^\r\n]+)*/g);

        if (paraphs === null) { return file; }

        for (const paraph of paraphs) {
            let links = paraph.match(/(?<=\[\[\s*).*?(?=\s*\]\])/gs);

            if (links === null) { continue; }

            links = deleteDupicates(links);
            links = links.map(Graph.normalizeLinks);

            file.contexts.push({
                paraph: paraph,
                ids: links
            });

            file.links = file.links.concat(links);
        }

        file.links = deleteDupicates(file.links);
        
        return file;
    }

    checkRecordType (file) {
        if (this.validTypes.records.includes(file.metas.type) === false) {
            this.report.typeRecordChange.push({ fileName: file.name, type: file.metas.type });

            file.metas.type = 'undefined';

            return file;
        }

        return file;
    }

    checkLinkTargetnSource (file) {
        file.links = file.links.filter((link) => {
            if (isNaN(Number(link.target.id)) === true) {
                this.report.linkInvalid.push({ targetId: link.target.id, fileName: file.name })
                return false;
            }

            if (this.filesId.includes(link.target.id) === false) {
                this.report.linkNoTarget.push({ targetId: link.target.id, fileName: file.name })
                return false;
            }

            return true;
        });

        file.links = file.links.map((link) => {
            if (this.validTypes.links.includes(link.type) === false) {
                this.report.typeLinkChange.push(`Unknow link type "${link.type}" from file ${file.name} change to "undefined".`);

                link.type = 'undefined';
            }

            link.context = file.contexts
                .filter((context) => {
                    if (context.ids.find(id => id.target.id === link.target.id) !== undefined) {
                        return true; }
                })
                .map(context => context.paraph)

            link.source = {
                id: file.metas.id,
                title: file.metas.title,
                type: file.metas.type
            };

            link.target = {
                id: link.target.id,
                title: this.files.find(file => file.metas.id == link.target.id).metas.title,
                type: this.files.find(file => file.metas.id == link.target.id).metas.type
            };

            return link;
        });

        return file;
    }

    findBacklinks (file) {
        file.backlinks = this.files
            .filter((otherFile) => {
                const targets = otherFile.links.map(link => link.target.id);

                if (targets.includes(file.metas.id)) {
                    return true; }

                return false;
            })
            .map((otherFile) => otherFile.links);

        file.backlinks = file.backlinks[0] || [];

        return file;
    }

    evalConnectionLevels (file) {
        file.focusLevels = [];

        const nodeId = file.metas.id
            , maxLevel = this.config.focus_max;

        let index = [[nodeId]] // add the node as first level
            , idsList = []; // contains all handled node ids

        for (let i = 0 ; i < maxLevel ; i++) {

            let level = [];

            // searching connections for each nodes from the last registred level
            for (const target of index[index.length - 1]) {
                let result = getConnectedIds.apply(this, [target]);
                if (result === false) { continue; } // node have not connections, analyse next one

                // throw ids already registered into an other level toavoid infinit loop
                result = result.filter(target => idsList.includes(target) === false);

                level = level.concat(result);
            }

            // stop : current level contain any connection. There is no more level
            if (level.length === 0) { break; }

            // ignore duplicated ids
            level = level.filter((item, index) => {
                return level.indexOf(item) === index
            });

            index.push(level);
            idsList = index.flat();
        }

        file.focusLevels = index.slice(1);

        function getConnectedIds(nodeId) {
            let sources = this.files
                .find(file => file.metas.id === nodeId).links
                .map(link => link.target.id);

            let targets = this.files
                .find(file => file.metas.id === nodeId).backlinks
                .map(backlink => backlink.source.id);

            targets = targets.concat(sources);

            if (targets.length === 0) {
                return false; }

            return targets;
        }

        return file;
    }

    getLinkStyle (linkType) {
        const linkTypeConfig = this.config.link_types[linkType];
        let stroke, color;

        if (linkTypeConfig) {
            stroke = linkTypeConfig.stroke;
            color = linkTypeConfig.color;
        } else {
            stroke = 'simple';
            color = null;
        }

        switch (stroke) {
            case 'simple':
                return { shape: { stroke: stroke, dashInterval: null }, color: color };
                
            case 'double':
                return { shape: { stroke: stroke, dashInterval: null }, color: color };
    
            case 'dash':
                return { shape: { stroke: stroke, dashInterval: '4, 5' }, color: color };
    
            case 'dotted':
                return { shape: { stroke: stroke, dashInterval: '1, 3' }, color: color };
        }
    
        return { shape: { stroke: 'simple', dashInterval: null }, color: color };
    }

    getNodes () {
        return this.files.map((file) => {
            return {
                id: file.metas.id,
                label: file.metas.title,
                type: file.metas.type,
                size: Graph.getNodeRank(file.links.length, file.backlinks.length),
                focus: file.focusLevels
            }
        })
    }

    getLinks () {
        const links = this.files.map(file => file.links).flat();

        return links.map((link, id) => {
            const style = this.getLinkStyle(link.type);

            return {
                id: id,
                type: link.type,
                shape: style.shape,
                color: style.color,
                source: link.source.id,
                target: link.target.id,
                context: link.context
            }
        });
    }

    reportToSentences () {
        this.report.ignoredFiles = this.report.ignoredFiles.map((data) => {
            return `Ignored file ${data.fileName} has no valid ${data.invalidMeta}`;
        });
        this.report.duplicates = this.report.duplicates.map((data) => {
            return `Id ${data.id} is duplicated for files ${data.files.join(', ')}`;
        });
        this.report.typeRecordChange = this.report.typeRecordChange.map((data) => {
            return `Unknow type "${data.type}" of file ${data.fileName}, changed to "undefined".`;
        });
        this.report.linkInvalid = this.report.linkInvalid.map((data) => {
            return `Ignored link "${data.targetId}" from file ${data.fileName} is not a string of numbers.`;
        });
        this.report.linkNoTarget = this.report.linkNoTarget.map((data) => {
            return `Ignored link "${data.targetId}" from file ${data.fileName} has no target.`;
        });

        return this.report;
    }

}

function deleteDupicates (array) {
    if (array.length < 2) { return array; }

    return array.filter((item, index) => {
        return array.indexOf(item) === index
    });
}