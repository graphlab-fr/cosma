/**
 * @file Generate the Cosmoscope's source code
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 Cosma's authors
 */

import fs from 'node:fs';
import path from 'node:path';
import Config from './config.js';
import Bibliography from './bibliography.js';
import nunjucks from 'nunjucks';
import mdIt from 'markdown-it';
import app from '../../package.json';
import { isAnImagePath } from '../utils/misc.js';
import slugify from '../utils/slugify.js';
import langPck from './lang.js';
import convertWikilinks from '../utils/convertWikilinks.js';
import convertQuotes from '../utils/convertQuotes.js';
import cosmoscopeTemplate from '../../static/template/cosmoscope.njk';
import favicon from '../../static/icons/cosmafavicon.png';
import logo from '../../static/icons/cosmalogo.svg';
import frontendScript from 'front';
import GraphEngine from 'graphology';
import { extent } from 'd3';
import extractCitations from '../utils/citeExtractor.js';
import cssPrint from '../frontend/print.css';
import cssStyles from '../frontend/styles.css';
import quotesFromText from '../utils/quotesFromText.js';

/**
 * @typedef ThumbnailIntegration
 * @type {object}
 * @property {string} name
 * @property {string} path
 */

const md = new mdIt({
  html: true,
  linkify: true,
  breaks: true,
});

/**
 * Class to get the Cosmoscope source code
 */

class Template {
  static validParams = new Set(['css_custom', 'citeproc', 'dev']);

  /**
   * Convert a path to an image to the base64 encoding of the image source
   * @param {string} imgPath
   * @returns {string|boolean} False if error
   */

  static imagePathToBase64(imgPath) {
    if (isAnImagePath(imgPath) === false) {
      return '';
    }
    const imgFileContent = fs.readFileSync(imgPath);
    const imgType = path.extname(imgPath).substring(1);
    const imgBase64 = Buffer.from(imgFileContent).toString('base64');
    return `data:image/${imgType};base64,${imgBase64}`;
  }

  /**
   * Update markdown-it image source, from a path to a base64 encoding
   * @param {string} imagesPath
   * @param {Function} state
   * @returns {String}
   * @exemple
   * ```
   * md.inline.ruler2.push('image_to_base64', state => Template.mdItImageToBase64(imagesPath, state));
   * ```
   */

  static mdItImageToBase64(imagesPath, state) {
    for (let i = 0; i < state.tokens.length; i++) {
      const token = state.tokens[i];
      const { type, attrs } = token;
      if (type === 'image') {
        const { src, ...rest } = Object.fromEntries(attrs);
        const imgPath = path.join(imagesPath, src);
        const imgBase64 = Template.imagePathToBase64(imgPath);
        if (imgBase64) {
          state.tokens[i].attrs = Object.entries({
            src: imgBase64,
            ...rest,
          });
        }
      }
    }
  }

  /**
   * Get data from graph and make a web app
   * @param {Map<string, import('../models/record.js').default>} records
   * @param {GraphEngine} graph
   * @param {string[]} params
   * @exemple
   * ```
   * const graph = new Cosmocope(records, config.opts, optionsGraph);
   * const { html } = new Template(graph, ['citeproc']);
   * ```
   */

  constructor(records, graph, params = [], opts = {}) {
    this.params = new Set(params.filter((param) => Template.validParams.has(param)));
    this.config = Config.get(Config.configFilePath);

    const {
      images_origin: imagesPath,
      css_custom: cssCustomPath,
      lang,
      link_symbol: linkSymbol,
      views,
      title,
      author,
      description,
      keywords,
      focus_max: focusMax,
      record_types: recordTypes,
      hide_id_from_record_header: hideIdFromRecordHeader,
    } = this.config.opts;

    /** @type {Map<string, unknown>} */
    const references = new Map();
    /** @type {Bibliography} */
    let bibliography;

    /** @type {Map<string, Set<string>>} */
    const filtersDict = new Map();
    /** @type {Map<string, Set<string>>} */
    const tagsDict = new Map();

    records.forEach((record) => {
      record.types.forEach((type) => {
        if (filtersDict.has(type)) {
          filtersDict.get(type).add(record.id);
        } else {
          filtersDict.set(type, new Set([record.id]));
        }
      });

      record.tags.forEach((type) => {
        if (tagsDict.has(type)) {
          tagsDict.get(type).add(record.id);
        } else {
          tagsDict.set(type, new Set([record.id]));
        }
      });
    });
    /** @type {[string, string[]]} */
    const filtersDictAsArrays = Array.from(filtersDict, (arr) => {
      arr[1] = Array.from(arr[1]);
      return arr;
    });
    /** @type {[string, string[]]} */
    const tagsDictAsArrays = Array.from(tagsDict, (arr) => {
      arr[1] = Array.from(arr[1]);
      return arr;
    });

    const linkFiltersFromGraph = {};
    const allLinkKeys = []; // Keep track of all link keys (Graphology IDs)

    graph.forEachEdge((edgeKey, edgeAttributes, source, target, sourceAttributes, targetAttributes, undirected) => {
      const type = edgeAttributes.type || 'undefined'; // Use 'undefined' if no type
      allLinkKeys.push(edgeKey); // Store the Graphology key

      if (!linkFiltersFromGraph[type]) {
        linkFiltersFromGraph[type] = {
          linkKeys: new Set(), // Store Set of Graphology edge keys
          active: true,       // Default state
          color: edgeAttributes?.color || '#e1e1e1'
        };
      }
      linkFiltersFromGraph[type].linkKeys.add(edgeKey);
    });

    // Convert Sets to Arrays for JSON serialization
    for (const type in linkFiltersFromGraph) {
      linkFiltersFromGraph[type].linkKeys = Array.from(linkFiltersFromGraph[type].linkKeys);
    }

    const tagsListAlphabetical = tagsDictAsArrays
      .map(([name]) => name)
      .sort((a, b) => a.localeCompare(b));
    const tagsListIncreasing = tagsDictAsArrays
      .sort(([, aNodes], [, bNodes]) => {
        if (aNodes.length < bNodes.length) return -1;
        if (aNodes.length > bNodes.length) return 1;
        return 0;
      })
      .map(([name]) => name);

    const recordsListAlphabetical = [...records.values()]
      .sort((a, b) => a.title.localeCompare(b.title))
      .map(({ title }) => title);
    const recordsListChronological = [...records.values()]
      .sort((a, b) => {
        if (a.begin < b.begin) return -1;
        if (a.begin > b.begin) return 1;
        return 0;
      })
      .map(({ title }) => title);

    if (this.params.has('citeproc') && this.config.canCiteproc()) {
      const { bib, cslStyle, xmlLocal } = Bibliography.getBibliographicFilesFromConfig(this.config);
      bibliography = new Bibliography(bib, cslStyle, xmlLocal);

      [...records.values()].forEach((record) => {
        const citeExtract = extractCitations(record.content);
        citeExtract.forEach((extract) =>
          extract.citations.forEach((item) =>
            references.set(item.id, bibliography.library[item.id]),
          ),
        );
      });
    }

    /** @type {Map<string, ThumbnailIntegration>} */
    const thumbnailsMap = new Map();

    if (this.config.opts.images_origin) {
      const validExtnames = new Set(['.jpg', '.jpeg', '.png']);

      records.forEach((record) => {
        if (
          record.thumbnail &&
          validExtnames.has(path.extname(record.thumbnail)) &&
          fs.existsSync(path.join(this.config.opts.images_origin, record.thumbnail))
        ) {
          thumbnailsMap.set(record.thumbnail, {
            name: record.thumbnail,
            path: path.join(this.config.opts.images_origin, record.thumbnail),
          });
        }
      });

      Object.entries(this.config.opts.record_types).forEach(([type, { fill }]) => {
        if (
          validExtnames.has(path.extname(fill)) &&
          fs.existsSync(path.join(this.config.opts.images_origin, fill))
        ) {
          thumbnailsMap.set(fill, {
            name: fill,
            path: path.join(this.config.opts.images_origin, fill),
          });
        }
      });
    }

    const templateEngine = new nunjucks.Environment();

    if (imagesPath) {
      md.inline.ruler2.push('image_to_base64', (state) =>
        Template.mdItImageToBase64(imagesPath, state),
      );
    }

    templateEngine.addFilter('slugify', (input) => {
      return slugify(input);
    });
    templateEngine.addFilter('convertLinks', (input, opts, idToHighlight) => {
      input = convertWikilinks(input, records, opts, idToHighlight);

      if (bibliography) {
        const citeItems = quotesFromText(input);

        if (citeItems.every((item) => bibliography.existsOnLibrary(item))) {
          input = convertQuotes(input, bibliography, records, idToHighlight);
        }
      }

      return input;
    });
    templateEngine.addFilter('markdown', (input) => {
      return md.render(input);
    });
    templateEngine.addFilter('timestampToLocal', (input) => {
      return new Date(input * 1000).toLocaleDateString(lang);
    });
    templateEngine.addFilter('imgPathToBase64', Template.imagePathToBase64);

    this.custom_css = null;
    if (this.params.has('css_custom') === true && this.config.canCssCustom() === true) {
      this.custom_css = fs.readFileSync(cssCustomPath, 'utf-8');
    }

    this.html = templateEngine.renderString(cosmoscopeTemplate, {
      hideIdFromRecordHeader,
      records: [...records.values()]
        .sort((a, b) => a.title.localeCompare(b.title))
        .map(({ thumbnail, links, bibliographicLinks, content, ...rest }) => {
          const backNodes = graph.inNeighbors(rest.id);

          const recordLinks = links
            .filter((link) => graph.hasNode(link.target))
            .map(({ contexts, type, target }) => {
              const recordTarget = records.get(target);

              return {
                context: contexts.join(''),
                target: {
                  id: recordTarget.id,
                  title: recordTarget.title,
                  types: recordTarget.types,
                },
                type,
              };
            });

          const recordBacklinks = [];

          backNodes.forEach((nodeId) => {
            const record = records.get(nodeId);

            record.links
              .filter((link) => {
                return link.target === rest.id;
              })
              .forEach((link) => {
                recordBacklinks.push({
                  context: link.contexts.join(''),
                  source: {
                    id: record.id,
                    title: record.title,
                    types: record.types,
                  },
                  type: link.type,
                });
              });
          });

          /** @type {string[]} */
          let citeNotes = [];

          if (bibliography) {
            const citeItems = quotesFromText(content);

            if (citeItems.every((item) => bibliography.existsOnLibrary(item))) {
              citeNotes = new Set(bibliography.getNotes(citeItems));
              citeNotes = Array.from(citeNotes);
            }
          }

          return {
            ...rest,
            backlinks: recordBacklinks,
            links: recordLinks,
            bibliography: citeNotes,
            content,
            thumbnail: thumbnailsMap.has(thumbnail) ? thumbnailsMap.get(thumbnail).path : undefined,
          };
        }),

      graph: {
        config: this.config.opts,
        data: graph.export(),
        minValues: Config.minValues,
      },

      timeline: (() => {
        let dates = [];
        for (const { begin, end } of [...records.values()]) {
          dates.push(begin, end);
        }
        const [begin, end] = extent(dates);
        return {
          begin,
          // Add margin of one second to display oldest node at end of timeline
          end: end,
        };
      })(),

      translation: langPck.i,
      lang: lang,

      css: cssStyles + cssPrint,
      customCss: this.custom_css,

      views: views || [],
      filters: Object.fromEntries(filtersDictAsArrays),
      tags: Object.fromEntries(tagsDictAsArrays),
      linkFilters: linkFiltersFromGraph,
      allLinkKeys: allLinkKeys,

      references: [...references.values()],

      metadata: {
        title,
        author,
        description,
        keywords,
      },

      nodeThumbnails: [...thumbnailsMap.values()],

      focusIsActive: !(focusMax <= 0),

      // stats

      nblinks: graph.size,

      date: new Date().toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),

      sorting: {
        records: [...records.values()].map(({ title }) => ({
          alphabetical: recordsListAlphabetical.indexOf(title),
          chronological: recordsListChronological.indexOf(title),
        })),
        tags: tagsDictAsArrays.map(([name]) => ({
          alphabetical: tagsListAlphabetical.indexOf(name),
          digital: tagsListIncreasing.indexOf(name),
        })),
      },

      app: app, // app version, description, license…
      script: frontendScript,
      favicon,
      logo,
    });

    let css = '';
    // ... (existing CSS generation for record types)

    // Add CSS variables for link colors
    for (const [linkTypeName, linkTypeData] of Object.entries(linkFiltersFromGraph)) {
      const slug = slugify(linkTypeName);
      // Use the stored color or fallback
      const color = linkTypeData.color;
      css += `--l_${slug}: ${color};\n`;
      // Add CSS for the filter label color (optional but nice)
      css += `--n_${slug}: ${color};\n`;
    }
    // Prepend link type CSS
    this.html = this.html.replace('<style>', `<style>\n:root {\n${css}\n}\n`);
  }
}

function escapeQuotes(text) {
  return text.replace(/'/g, '&apos;').replace(/"/g, '&quot;');
}

export default Template;
