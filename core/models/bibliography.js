/**
 * @file Bibliography pattern
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 Cosma's authors
 */

import fs from 'node:fs';
import CSL from 'citeproc';
import Joi from 'joi';

const cslJsonSchema = Joi.array().items(
  Joi.object({
    id: Joi.string().required(),
  }).unknown(true),
);

class Bibliography {
  /**
   * @param {import('./config').default} config
   */

  static async getBibliography(config) {
    const { bib, csl, local } = await config.getBibliographyFiles();

    console.log(bib);
    

    // const { error } = cslJsonSchema.validate(bib);
    // if (error) {
    //   throw new Error(`Bibliography validation error: ${error.message}`);
    // }

    const library = {};
    for (const { id, ...rest } of bib) {
      library[id] = { id, ...rest };
    }

    const citeproc = new CSL.Engine(
      {
        retrieveLocale: () => {
          return local;
        },
        retrieveItem: (id) => {
          // find the quote item : CSL-JSON object
          return library[id];
        },
      },
      csl,
    );

    return new Bibliography(library, citeproc);
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
   * @param {Record<string, unknown>} library
   * @param {CSL.Engine} citeproc
   * @returns
   * @exemple
   * ```
   *
   * ```
   */

  constructor(library, citeproc) {
    this.library = library;
    this.citeproc = citeproc;
  }

  /**
   * @param {import('../utils/citeExtractor').CiteItem[]} items
   * @returns {string[]}
   */

  getNotes(items) {
    this.citeproc.updateItems(items.map((item) => item.id));
    return this.citeproc.makeBibliography()[1].map((t) => t.trim().slice(23, -6));
  }

  /**
   * @param {import('../utils/citeExtractor').CiteItem[]} items
   * @returns {string}
   */

  getCluster(items) {
    return this.citeproc.processCitationCluster(
      {
        citationItems: items,
        properties: { noteIndex: 1 },
      },
      [],
      [],
    )[1][0][1];
  }

  /**
   * @param {import('../utils/citeExtractor').CiteItem} item
   */

  existsOnLibrary(item) {
    return !!this.library[item.id];
  }
}

export default Bibliography;
