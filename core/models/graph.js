/**
 * @file Cosmoscope generator
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright MIT License ANR HyperOtlet
 */

const fs = require('fs')
    , path = require('path')
    , ymlFM = require('yaml-front-matter')
    , CSL = require('citeproc')
    , Citr = require('@zettlr/citr');

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

    static getQuoteKeysFromQuoteObject (quoteObject) {
        return Object.values(quoteObject)
            .map(function(key) {
                let ids = [];
    
                for (const cit of key) {
                    ids.push(cit.id);
                }
    
                return ids;
            })
            .flat();
    }

    constructor (parms) {

        this.config = new Config().serializeForGraph();

        this.parms = [];
        if (parms) {
            this.parms = parms.filter(parm => Graph.validParms.includes(parm)); }

        this.report = {
            ignoredFiles: [],
            typeRecordChange: [],
            typeLinkChange: [],
            linkInvalid: [],
            linkNoTarget: [],
            duplicates: [],
            quotesWithoutReference: []
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

        if (this.parms.includes('citeproc')
            && this.config['bibliography'] && this.config['csl'] && this.config['bibliography_locales'])
        {

            this.library = {};

            let libraryFileContent = fs.readFileSync(this.config['bibliography'], 'utf-8');
            libraryFileContent = JSON.parse(libraryFileContent);

            for (const item of libraryFileContent) {
                this.library[item.id] = item; }

            this.citeproc = this.getCSL();

            this.files = this.files.map(this.catchQuoteKeys, this);
            this.files = this.files.map(this.convertQuoteKeys, this);
            this.files = this.files.map(this.getBibliography, this);
        }

        this.data = {
            nodes: this.getNodes(),
            links: this.getLinks()
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
                .map((context) => {
                    context.paraph = context.paraph
                        .replaceAll('[[' + link.target.id + ']]', '<mark>[[' + link.target.id + ']]</mark>');

                    return context.paraph;
                });

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
        this.report.quotesWithoutReference = this.report.linkNoTarget.map((data) => {
            return `Quote key "${data.fileName}" from file ${data.quoteId} is not defined from the CSL library.`;
        });

        return this.report;
    }

    getCSL () {
        const xmlLocal = fs.readFileSync(this.config['bibliography_locales'], 'utf-8')
            , cslStyle = fs.readFileSync(this.config['csl'], 'utf-8');

        return new CSL.Engine({
            retrieveLocale: () => {
                return xmlLocal;
            },
            retrieveItem: (id) => {
                // find the quote item : CSL-JSON object
                return this.library[id];
            }
        }, cslStyle);
    }

    catchQuoteKeys (file) {
        file.quotes = {};

        let extractions = Citr.util.extractCitations(file.content);

        quoteExtraction:
        for (let i = 0; i < extractions.length; i++) {
            const extraction = extractions[i];

            const quotes = Citr.parseSingle(extraction);
            // there could be several quotes from one key
            for (const q of quotes) {

                if (!this.library[q.id]) {
                    // if the quote id is not defined from library
                    this.report.quotesWithoutReference.push({ fileName: file.name, quoteId: q.id })
                    continue quoteExtraction;
                }

                this.library[q.id].used = true;
            }

            file.quotes[extraction] = quotes;
        }

        return file;
    }

    convertQuoteKeys (file) {
        this.citeproc.updateItems(Graph.getQuoteKeysFromQuoteObject(file.quotes));
    
        const citations = Object.values(file.quotes).map(function(key, i) {
            return [{
                citationItems: key,
                properties: { noteIndex: i + 1 }
            }];
        });
    
        for (let i = 0; i < citations.length; i++) {
            const cit = citations[i];
            const key = Object.keys(file.quotes)[i]
    
            const citMark = this.citeproc.processCitationCluster(cit[0], [], [])[1][0][1];
    
            file.content = file.content.replaceAll(key, citMark);
        }
    
        return file;
    }

    getBibliography (file) {
        this.citeproc.updateItems(Graph.getQuoteKeysFromQuoteObject(file.quotes));

        file.bibliography = this.citeproc.makeBibliography()[1].join('\n');

        return file;
    }

    getUsedCitationReferences () {
        if (this.parms.includes('citeproc') === false) { return null; }

        const refs = Object.values(this.library).filter(item => item.used === true);

        if (refs.length === 0) { return null; }

        return refs;
    }

}

function deleteDupicates (array) {
    if (array.length < 2) { return array; }

    return array.filter((item, index) => {
        return array.indexOf(item) === index
    });
}