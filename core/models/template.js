/**
 * @file Generate the Cosmoscope's source code
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 Cosma's authors
 */

import fs from 'node:fs';
import path from 'node:path';
import Record from './record.js';
import Config from './config.js';
import Bibliography from './bibliography.js';
import nunjucks from 'nunjucks';
import mdIt from 'markdown-it';
import app from '../../package.json';
import { isAnImagePath, slugify } from '../utils/misc.js';
import langPck from './lang.js';
import convertWikilinks from '../utils/convertWikilinks.js';
import convertQuotes from '../utils/convertQuotes.js';
import cosmoscopeTemplate from '../../static/template/cosmoscope.njk';
import favicon from '../../static/icons/cosmafavicon.png';
import logo from '../../static/icons/cosmalogo.svg';
import frontendScript from 'front';
import GraphEngine from 'graphology';
import { extent } from 'd3';

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
   * @param {Map<string, import('../models/_record.js').default>} records
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

    if (this.config.isValid() === false) {
      throw new Error('Can not template : config invalid');
    }

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

    /** @type {string[]} */
    const references = [];
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
      // for (const record of records) {
      //   record.setBibliography(bibliography);

      //   record.bibliographicLinks.forEach(({ target }) =>
      //     references.push(bibliography.library[target]),
      //   );
      // }
    }

    const thumbnailsFromTypesRecords = Array.from(this.config.getTypesRecords())
      .filter((type) => this.config.getFormatOfTypeRecord(type) === 'image')
      .map((type) => {
        return {
          name: recordTypes[type]['fill'],
          path: path.join(imagesPath, recordTypes[type]['fill']),
        };
      });
    const thumbnailsFromRecords = [...records.values()]
      .filter(({ thumbnail }) => typeof thumbnail === 'string')
      .map(({ thumbnail }) => {
        return {
          name: thumbnail,
          path: path.join(imagesPath, thumbnail),
        };
      });

    const templateEngine = new nunjucks.Environment();

    md.inline.ruler2.push('image_to_base64', (state) =>
      Template.mdItImageToBase64(imagesPath, state),
    );

    templateEngine.addFilter('slugify', (input) => {
      return slugify(input);
    });
    templateEngine.addFilter('convertLinks', (input, opts, idToHighlight) => {
      input = convertWikilinks(input, records, opts, idToHighlight);

      if (bibliography) {
        input = convertQuotes(input, bibliography, records, idToHighlight);
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
      records: [...records.values()].map(({ thumbnail, links, bibliographicLinks, ...rest }) => {
        const backNodes = graph.inNeighbors(rest.id);

        const toto = links.map(({ contexts, type, target }) => {
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

        const backlinks = [];

        backNodes.forEach((nodeId) => {
          const record = records.get(nodeId);

          record.links
            .filter((link) => {
              return link.target === rest.id;
            })
            .forEach((link) => {
              backlinks.push({
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

        return {
          ...rest,
          backlinks,
          links: toto,
          thumbnail: !!thumbnail ? path.join(imagesPath, thumbnail) : undefined,
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

      customCss: this.custom_css,

      views: views || [],
      filters: Object.fromEntries(filtersDictAsArrays),
      tags: Object.fromEntries(tagsDictAsArrays),

      references,

      metadata: {
        title,
        author,
        description,
        keywords,
      },

      nodeThumbnails: [...thumbnailsFromTypesRecords, ...thumbnailsFromRecords].filter(({ path }) =>
        isAnImagePath(path),
      ),

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
  }
}

function escapeQuotes(text) {
  return text.replace(/'/g, '&apos;').replace(/"/g, '&quot;');
}

export default Template;
