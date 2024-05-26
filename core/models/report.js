/**
 * @file Register error in recoding processs
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 Cosma's authors
 */

import path from 'node:path';
import nunjucks from 'nunjucks';
import lang from './lang.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class Report {
  static listWarnings = new Map();
  static listErrors = new Map();

  /**
   * @param {string} projectTitle
   * @returns {string} HTML
   */

  static getAsHtmlFile(projectTitle) {
    const templateEngine = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(path.join(__dirname, '../static/template/')),
    );
    templateEngine.addFilter('translate', (input, args) => {
      if (args) {
        return lang.getWith(lang.i['report'][input], Object.values(args));
      }
      return lang.getFor(lang.i['report'][input]);
    });
    const date = new Date().toLocaleDateString(lang, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    return templateEngine.render('report.njk', {
      lang: lang.flag,
      date,
      projectTitle,
      listWarnings: Object.fromEntries(Report.listWarnings),
      listErrors: Object.fromEntries(Report.listErrors),
      warningsLength: Report.listWarnings.size,
      errorsLength: Report.listErrors.size,
    });
  }

  static getAsMessage() {
    let message = 'Report: ';
    const sentences = [];
    if (Report.listErrors.size > 0) {
      sentences.push(`${Report.listErrors.size} ${['\x1b[31m', 'errors', '\x1b[0m'].join('')}`);
    }
    if (Report.listWarnings.size > 0) {
      sentences.push(`${Report.listWarnings.size} ${['\x1b[33m', 'warnings', '\x1b[0m'].join('')}`);
    }
    message = message + sentences.join(' and ');
    return message;
  }

  static reset() {
    Report.listWarnings = new Map();
    Report.listErrors = new Map();
  }

  /**
   * Return true if there is any error or warning to report
   * @returns {boolean}
   */

  static isItEmpty() {
    return Report.listErrors.size === 0 && Report.listWarnings.size === 0;
  }

  /**
   * Generate and register a report
   * @param {Record.id} recordId
   * @param {Record.title} recordTitle
   * @param {'warning'|'error'} urgency
   */

  constructor(recordId, recordTitle, urgency) {
    this.recordId = recordId;
    this.recordTitle = recordTitle;
    this.urgency = urgency;
    this.about;
    this.args = {};

    switch (this.urgency) {
      case 'error':
        if (Report.listErrors.has(this.recordId)) {
          const r = Report.listErrors.get(this.recordId);
          r.push(this);
        } else {
          Report.listErrors.set(this.recordId, [this]);
        }
        break;
      case 'warning':
        if (Report.listWarnings.has(this.recordId)) {
          const r = Report.listWarnings.get(this.recordId);
          r.push(this);
        } else {
          Report.listWarnings.set(this.recordId, [this]);
        }
        break;
    }
  }

  /**
   * Record from a file has no identifier
   * @param {File.name} fileName
   */

  aboutNoId(fileName) {
    this.about = 'no_id';
    this.args = { fileName };
  }

  /**
   * Some record has the same identifier
   * @param {Record.id} recordId
   * @param {Record.title} recordTitle
   * @param {Record.title} recordTitleOfDuplicated
   */

  aboutDuplicatedIds(recordId, recordTitle, recordTitleOfDuplicated) {
    this.about = 'duplicated_ids';
    this.args = { recordId, recordTitle, recordTitleOfDuplicated };
  }

  /**
   * A link has no source or target
   * @param {Record.title} recordTitle
   * @param {Link.contect} linkContext
   */

  aboutBrokenLinks(recordTitle, linkContext) {
    this.about = 'broken_links';
    this.args = { recordTitle, linkContext };
  }

  /**
   * A link has undefined type, replaced by type 'undefined'
   * @param {Record.title} recordTitle
   * @param {string|number} linkTargetId
   * @param {string} unknownType
   */

  aboutLinkTypeChange(recordTitle, linkTargetId, unknownType) {
    this.about = 'link_type_change';
    this.args = { recordTitle, linkTargetId, unknownType };
  }

  /**
   * A record has undefined type, replaced by type 'undefined'
   * @param {Record.title} recordTitle
   * @param {string} unknownType
   */

  aboutRecordTypeChange(recordTitle, unknownType) {
    this.about = 'record_type_change';
    this.args = { recordTitle, unknownType };
  }

  /**
   * A record meta is not allowed from config
   * @param {Record.title} recordTitle
   * @param {string} ignoredMeta
   */

  aboutIgnoredRecordMeta(recordTitle, ignoredMeta) {
    this.about = 'ignored_record_meta';
    this.args = { recordTitle, ignoredMeta };
  }

  /**
   * A record meta is null
   * @param {Record.title} recordTitle
   * @param {string} ignoredMeta
   */

  aboutNullRecordMeta(recordTitle, ignoredMeta) {
    this.about = 'null_record_meta';
    this.args = { recordTitle, ignoredMeta };
  }

  /**
   * A record time is null
   * @param {Record.title} recordTitle
   * @param {string} invalidTime
   */

  aboutInvalidRecordTimeBegin(recordTitle, invalidTime) {
    this.about = 'invalid_record_time_begin';
    this.args = { recordTitle, invalidTime };
  }

  /**
   * A record time is null
   * @param {Record.title} recordTitle
   * @param {string} invalidTime
   */

  aboutInvalidRecordTimeEnd(recordTitle, invalidTime) {
    this.about = 'invalid_record_time_end';
    this.args = { recordTitle, invalidTime };
  }

  /**
   * A record reference is not registred in library
   * @param {Record.title} recordTitle
   * @param {string} bibliographicReference
   */

  aboutNullRecordMeta(recordTitle, ignoredMeta) {
    this.about = 'null_record_meta';
    this.args = { recordTitle, ignoredMeta };
  }

  /**
   * A record time is null
   * @param {Record.title} recordTitle
   * @param {string} invalidTime
   */

  aboutInvalidRecordTimeBegin(recordTitle, invalidTime) {
    this.about = 'invalid_record_time_begin';
    this.args = { recordTitle, invalidTime };
  }

  /**
   * A record time is null
   * @param {Record.title} recordTitle
   * @param {string} invalidTime
   */

  aboutInvalidRecordTimeEnd(recordTitle, invalidTime) {
    this.about = 'invalid_record_time_end';
    this.args = { recordTitle, invalidTime };
  }

  /**
   * A record reference is not registred in library
   * @param {Record.title} recordTitle
   * @param {string} bibliographicReference
   */

  aboutUnknownBibliographicReference(recordTitle, bibliographicReference) {
    this.about = 'unknown_bibliographic_reference';
    this.args = { recordTitle, bibliographicReference };
  }

  /**
   * A CSV line is ignores during parsing
   * @param {string} filePath
   * @param {'nodes'|'links'} type
   * @param {number} lineNb For first CSV line, `lineNb === 1`
   */

  aboutIgnoredCsvLine(filePath, type, lineNb, missingCols) {
    this.about = 'ignored_csv_line';
    this.args = { filePath, type, lineNb, missing: missingCols.join(', ') };
  }
}

export default Report;
