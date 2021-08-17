/**
 * @file Cosmoscope generator
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const fs = require('fs')
    , path = require('path')
    , ymlFM = require('yaml-front-matter')
    , moment = require('moment');

const Config = require('../models/config')
    , linksTools = require('./links');

module.exports = function () {

    let fileIds = []
        , logs = { warn: [], err: [] }
        , entities = { nodes: [], links: [] }
        , id = 0
        , config = new Config();

    config = config.serialize();

    config.record_types_list = Object.keys(config.record_types)
        , config.link_types_list = Object.keys(config.link_types);

    let files = fs.readdirSync(config.files_origin, 'utf8') // files name list
        .filter(fileName => path.extname(fileName) === '.md') // throw no .md file
        .map(function(file) { // file analysis
            const filePath = path.join(config.files_origin, file);
            const mTime = fs.statSync(filePath).mtime; // last modif date
            const fileName = file;

            file = fs.readFileSync(filePath, 'utf8')
            // YAML Front Matter extract = file metas + file content
            file = ymlFM.loadFront(file);
            // file content extract
            let content = file.__content;
            delete file.__content;
            // file metas extract
            let metas = file;

            metas.mtime = moment(mTime).format('YYYY-MM-DD');
            metas.fileName = fileName;

            return {
                content: content,
                metas: metas
            }
        })
        .filter(function(file) { // throw files with bad metas
            if (!file.metas.id || isNaN(file.metas.id) === true) {
                logs.err.push(`File ${file.metas.fileName} throw out : no valid id`);
                return false; }
    
            if (!file.metas.title) {
                logs.err.push(`File ${file.metas.fileName} throw out : no valid title`);
                return false; }
    
            if (fileIds.includes(file.metas.id)) {
                logs.err.push(`File ${file.metas.fileName} throw out : uses an identifier common to another file`); }
    
            fileIds.push(file.metas.id);
    
            return true;
        })
        .map(function(file) { // normalize metas
            // null or no registered types changed to "undefined"
            if (file.metas.type === null || config.record_types_list.indexOf(file.metas.type) === -1) {
                file.metas.type = 'undefined';
                logs.warn.push(`Type of file ${file.metas.fileName} changed to undefined : no registered type`);
            }
    
            file.metas.tags = file.metas.tags || [];
    
            // if (quoteTools.citeprocModeIsActive()) {
            //     // extract quoting key from file content as '[@perretFonctionDocumentairePreuve2020, 22]'
            //     const quoteExtraction = quoteTools.catchQuoteKeys(file.content);
            //     file.quoteKeys = quoteExtraction.quoteKeys; // quoting keys and their content
            //     quoteExtraction.undefinedLibraryIds.forEach(id => { // errors processing
            //         logs.warn.push(`Quote key "${id}" written on file ${file.metas.fileName} is undefined from the CSL library`);
            //     });
            // }
    
            // analysis file content by regex : get links target id
            file.links = linksTools.catchLinksFromContent(file.content)
                .filter(function(link) {
                    // throw links that are not numbers or from/to an unknown file id
                    if (fileIds.includes(link.target.id) === false || isNaN(link.target.id) !== false) {
                        logs.warn.push(`The link "${link.target.id}" from file ${file.metas.fileName} has been ignored : no valid target`);
                        return false;
                    }
                    // change link type if is not registred into configuration. Exception for 'undefined' type
                    if (config.link_types_list.includes(link.type) === false && link.type !== 'undefined') {
                        logs.warn.push(`The link "${link.target.id}" type "${link.type}" from file ${file.metas.fileName} has been ignored : no registered type`);
                    }
    
                    return true;
                }).map(function(link) {
                    link.source = { id: file.metas.id };
                    return link
                });
    
            registerLinks(file);
    
            return file;
        });

        files = files.map(function(file) {

            file.links = file.links.map(function(link) {
                const targetMetas = findFileMeta(link.target.id);
                return {
                    type: link.type,
                    context: link.context,
                    target: {
                        id: link.target.id,
                        title: targetMetas.title,
                        type: targetMetas.type
                    },
                    source: {
                        id: link.source.id,
                        title: file.metas.title,
                        type: file.metas.type
                    }
                };
            });
        
            file.backlinks = entities.links.filter(link => link.target === file.metas.id)
                .map(function(link) {
                    const targetMetas = findFileMeta(link.source);
                    return {
                        type: link.type,
                        context: link.context,
                        target: {
                            id: link.source,
                            title: targetMetas.title,
                            type: targetMetas.type
                        },
                        source: {
                            id: link.target,
                            title: file.metas.title,
                            type: file.metas.type
                        }
                    };
                });
        
            file.focusLevels = ((config.focus_max <= 0) ? undefined : getConnectionLevels(file.metas.id, config.focus_max));
        
            registerNodes(file);
        
            return file;
        });
        
    entities.links = entities.links.map(function(link) {
        delete link.context; return link;
    });

    /**
     * Feed entities.edges object with link object
     * @param {object} file - File after links parsing
     */
    
        function registerLinks(file) {
        if (file.links.length === 0) { return; }
    
        for (const link of file.links) {
            const style = getLinkStyle(link.type);
    
            entities.links.push({
                id: Number(id++),
                type: link.type,
                shape: style.shape,
                color: style.color,
                source: Number(link.source.id),
                target: Number(link.target.id),
                context: link.context
            });
        }
    }
    
    /**
     * Feed entities.nodes object with node object
     * @param {object} file - File after links & backlinks crop
     */
    
    function registerNodes(file) {
        const size = getRank(file.links.length, file.backlinks.length);
    
        entities.nodes.push({
            id: Number(file.metas.id),
            label: file.metas.title,
            type: String(file.metas.type),
            size: Number(size),
            outLink: Number(file.links.length),
            inLink: Number(file.backlinks.length),
            focus: file.focusLevels
        });
    }
    
    /**
     * Find file metas by its id
     * @param {int} fileId - File after links & backlinks parsing
     * @returns {array} - List of metas
     */
    
    function findFileMeta(fileId) {
        return title = files.find(function(file) {
            return file.metas.id === fileId;
        }).metas;
    }
    
    /**
     * Get link stroke and color according to the type config
     * @param {string} linkType - Link type extract from his registration
     * @returns {object} - Shape and color paramters
     */
    
    function getLinkStyle(linkType) {
        const linkTypeConfig = config.link_types[linkType];
        let stroke, color;
    
        if (linkTypeConfig) {
            stroke = config.link_types[linkType].stroke;
            color = config.link_types[linkType].color;
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
    
    /**
     * Find nodes connected around a single one on several levels
     * Get data 'focus mode'
     * @param {number} nodeId - File id
     * @returns {array} - Array of arrays : contain one array per connection level
     */
    
    function getConnectionLevels(nodeId, maxLevel) {
    
        let index = [[nodeId]]; // add the node as first level
        let idsList = []; // contains all handled node ids
    
        for (let i = 0 ; i < maxLevel ; i++) {
    
            let level = [];
            
            // searching connections for each nodes from the last registred level
            for (const target of index[index.length - 1]) {
                let result = getConnectedIds(target);
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
    
        return index.slice(1);
    }
    
    /**
     * Get connected links & backlinks from a node
     * @param {int} nodeId - File id
     * @returns {array} - Links and backlinks ids list
     */
    
    function getConnectedIds(nodeId) {
        const links = entities.links;
    
        let sources = links.filter(edge => edge.source === nodeId).map(edge => edge.target);
        let targets = links.filter(edge => edge.target === nodeId).map(edge => edge.source);
    
        targets = targets.concat(sources);
    
        if (targets.length === 0) {
            return false; }
    
        return targets;
    }
    
    /**
     * Get node rank from number of links & backlinks
     * @param {number} backLinkNb - Number of backlinks
     * @param {number} linkNb - Number of links
     * @returns {number} - Rank
     */
    
    function getRank(backLinkNb, linkNb) {
        let rank = 1 // original rank
            , sizeDivisor = 2; // to subside rank
    
        rank += Math.floor(linkNb / sizeDivisor);
        rank += Math.floor(backLinkNb / sizeDivisor);
        return rank;
    }

    return {
        files: files,
        entities: entities
    };

}
