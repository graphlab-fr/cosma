/**
 * @file Bibliography pattern
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 Cosma's authors
 */

import fs from 'node:fs';
import CSL from 'citeproc';
import extractCitations from '../utils/citeExtractor';
import extractParaphs from '../utils/paraphExtractor';

/**
 * @typedef BibliographicRecord
 * @type {object}
 * @property {object} quotesExtract
 * @property {Citation[]} quotesExtract.citationItems
 * @property {object} quotesExtract.properties
 * @property {number} quotesExtract.properties.noteIndex
 * @property {string} text Quote string from plain text
 * @property {string[]} contexts Paragraph contains quote
 * @property {Set} ids All quote ids from quotesExtract.citationItems
 */

/**
 * @typedef BibliographicOutput
 * @type {object}
 * @property {string} cluster Quoting string to insert in text
 * @property {string[]} record Bibliographic record in HTML
 * @property {string[]} unknowedIds Ids out from library
 */

class Bibliography {
  static regexParagraph = new RegExp(/[^\r\n]+((\r|\n|\r\n)[^\r\n]+)*/, 'g');

  /**
   * @param {string} recordContent
   * @returns {BibliographicRecord[]}
   */

  static getBibliographicRecordsFromText(recordContent) {
    /** @type {BibliographicRecord[]} */
    let quotes = [];

    extractParaphs(recordContent).forEach((paraph) => {
      extractCitations(paraph).forEach((result) => {
        quotes.push({
          quotesExtract: {
            citationItems: result.citations,
            properties: {
              noteIndex: 1,
            },
          },
          text: result.source,
          contexts: [paraph],
          ids: new Set(result.citations.map(({ id }) => id)),
        });
      });
    });

    return quotes;
  }

  /**
   * @param {string[]} quotesId
   */

  static getBibliographicRecordsFromList(quotesId = []) {
    return quotesId.map((quoteId, index) => {
      return {
        contexts: [],
        id: quoteId,
      };
    });
  }

  /**
   * @param {Config} config
   */

  static getBibliographicFilesFromConfig(config) {
    if (config.canCiteproc() === false) {
      throw 'You can not get bibliographic files from config witout register files paths in config';
    }

    const {
      csl: cslFilePath,
      bibliography: bibFilePath,
      csl_locale: cslLocalFilePath,
    } = config.opts;

    let bib, cslStyle, xmlLocal;

    try {
      (bib = JSON.parse(fs.readFileSync(bibFilePath, 'utf-8'))),
        (cslStyle = fs.readFileSync(cslFilePath, 'utf-8')),
        (xmlLocal = fs.readFileSync(cslLocalFilePath, 'utf-8'));
    } catch (error) {
      throw `You can not get bibliographic files from config because of file read error : ${error}`;
    }

    return { bib, cslStyle, xmlLocal };
  }

  /**
   * Remove `<div class="csl-entry">` and `</div>` from bibliographic record HTML
   * @param {string} record HTML from `citeproc.makeBibliography`
   * @example
   * ```
   * Input:  <div class="csl-entry">ENGELBART, Douglas C, 1962…</div>
   * Output: ENGELBART, Douglas C, 1962…
   * ```
   */

  static getFormatedHtmlBibliographicRecord(record) {
    return record.trim().slice(23, -6);
  }

  /**
   * @param {object} library
   * @param {string} cslStyle
   * @param {string} xmlLocal
   * @param {Record[]} records
   * @returns
   * @exemple
   * ```
   * const { records } = new Graph(records, undefined, []);
   * const bibliography = new Bibliography(
   *      [
   *          {
   *              "id": "Goody_1979",
   *              "type": "book",
   *              "title": "La Raison graphique: la domestication de la pensée sauvage",
   *              ...
   *              "author": [
   *                  {
   *                      "family": "Goody",
   *                      "given": "Jack"
   *                  }
   *              ],
   *              "issued": { "date-parts": [[1979]] }
   *          },
   *      ],
   *      '<?xml version="1.0" encoding="utf-8"?><style xmlns="http://purl.org/net/xbiblio/csl" ...> ... </style>',
   *      '<?xml version="1.0" encoding="utf-8"?><locale xmlns="http://purl.org/net/xbiblio/csl" ...> ... </locale>',
   *      records
   * );
   * ```
   */

  constructor(library = {}, cslStyle, xmlLocal) {
    this.library = {};
    this.ids = new Set();
    for (const { id, ...rest } of Object.values(library)) {
      this.library[id] = { id, ...rest };
      this.ids.add(id);
    }
    this.cslStyle = cslStyle;
    this.xmlLocal = xmlLocal;

    this.citeproc;

    if (!this.cslStyle || !this.xmlLocal) {
      return;
    }

    this.citeproc = this.getCSL();
  }

  /**
   * @param {BibliographicRecord} bibliographicRecord
   * @returns {BibliographicOutput}
   */

  get(bibliographicRecord) {
    const unknowedIds = [];
    const ids = Array.from(bibliographicRecord.ids).filter((id) => {
      if (this.ids.has(id)) {
        return true;
      }
      unknowedIds.push(id);
      return false;
    });
    if (ids.length === 0) {
      return {
        record: undefined,
        cluster: '',
        unknowedIds,
      };
    }

    for (const id of ids) {
      this.library[id]['used'] = true;
    }

    this.citeproc.updateItems(ids);
    let record = this.citeproc
      .makeBibliography()[1]
      .map((t) => Bibliography.getFormatedHtmlBibliographicRecord(t));

    bibliographicRecord.quotesExtract.citationItems = [
      ...bibliographicRecord.quotesExtract.citationItems.filter(({ id }) => this.ids.has(id)),
    ];
    const cluster = this.citeproc.processCitationCluster(
      bibliographicRecord.quotesExtract,
      [],
      [],
    )[1][0][1];

    return {
      record,
      cluster,
      unknowedIds,
    };
  }

  /**
   * Get 'citeproc' engine, from library (JSON CSL) and config files (XML, CSL)
   * @returns {CSL}
   */

  getCSL() {
    return new CSL.Engine(
      {
        retrieveLocale: () => {
          return this.xmlLocal;
        },
        retrieveItem: (id) => {
          // find the quote item : CSL-JSON object
          return this.library[id];
        },
      },
      this.cslStyle,
    );
  }
}

export default Bibliography;
