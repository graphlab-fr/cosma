/**
 * @file Functions to analyse wiki links from Markdown content.
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const mdIt = require('markdown-it')()
    , mdItAttr = require('markdown-it-attrs');

// markdown-it plugin
mdIt.use(mdItAttr, {
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: []
})

/**
 * Catch links from Markdown file content
 * @param {string} fileContent - Markdown file content
 * @returns {array} - Objets array : links with type & target id
 */

function catchLinksFromContent(fileContent) {
    let tempL = {}, // temp link container
    links = []; // final link container

    /**
     * Get all paragraphs from the file content
     */

    const paraphs = fileContent.match(/[^\r\n]+((\r|\n|\r\n)[^\r\n]+)*/g);

    if (paraphs === null) { return []; }

    /**
     * Get all links from each paragraph
     */

    for (let i = 0; i < paraphs.length; i++) {
        // get string '***' from '[[***]]' (wikilinks), for each paragraph
        let linksId = paraphs[i].match(/(?<=\[\[\s*).*?(?=\s*\]\])/gs);
        if (!linksId) { continue; }

        for (const linkId of linksId) {
            // each linkId is put to 'tempL', for get a list witout duplicated links
            if (tempL[linkId]) {
                // if the linkId is already registered, we juste save one more paragraph number
                tempL[linkId].paraphs.push(i)
            } else {
                // if the linkId is new, we register its type and a paragraph number
                tempL[linkId] = normalizeLink(linkId);
                tempL[linkId].paraphs = [i]
            }
        }
    }

    /**
     * Put context (original paragraph) into each link
     */

    for (const linkId in tempL) {
        tempL[linkId].context = [];

        for (let i = 0; i < paraphs.length; i++) {
            // for each paraph number from the link
            if (tempL[linkId].paraphs.includes(i)) {
                let par = paraphs[i]; // Markdown paraph
                par = mdIt.render(par); // HTML paraph

                // find the link string into the paraph and <mark> it
                par = par.replace('[[' + linkId + ']]', '<mark>[[' + linkId + ']]</mark>');

                tempL[linkId].context.push(par);
            }
        } 

        // paraphs array to context string
        tempL[linkId].context = tempL[linkId].context.join('');
        links.push(tempL[linkId]); // put all link metas on final 'links' container
    }

    return links;
}

exports.catchLinksFromContent = catchLinksFromContent;

/**
 * Add its type to a link & turn its target id to int value
 * @param {string} link - The wikilink content, '***' from '[[***]]'
 * @returns {object} - Object : link type & target
 */

function normalizeLink(link) {
    link = link.split(':', 2);
    if (link.length === 2) {
        return {type: link[0], target: {id: Number(link[1])} };
    }
    // default value
    return {type: 'undefined', target: {id: Number(link[0])} };
}

/**
 * Add Markdown attributes to valid links into file content
 * Leave disabled links as simple text
 * @param {string} content - Markdown file content
 * @param {object} file - File after links parsing
 * @returns {string} - Markdown content with converted links
 */

function convertLinks(content, file) {
    return content.replace(/(\[\[\s*).*?(\]\])/g, function(extract) { // get '[[***]]' strings
        // extract link id, without '[[' & ']]' caracters
        let link = extract.slice(0, -2).slice(2);

        link = normalizeLink(link).target.id;

        if (link === NaN) { return extract; } // link is not a number

        const associatedMetas = file.links.find(function(i) {
            return i.target.id === link; });

        // link is not registred into file metas
        if (associatedMetas === undefined) { return extract; }

        link = associatedMetas;

        // return '[[***]]' string into a Markdown link with openRecord function & class
        return `[${extract}](#${link.target.id}){title="${link.target.title}" onclick=openRecord(${link.target.id}) .record-link}`;
    });
}

exports.convertLinks = convertLinks;