import reportTemplate from '../../static/template/report.njk';
import nunjucks from 'nunjucks';
import lang from '../models/lang.js';

/**
 * @typedef ReportWithLocator
 * @type {object}
 * @property {boolean} isError
 * @property {string} message
 * @property {string} locator
 */

/**
 *
 * @param {string} projectTitle
 * @param {ReportWithLocator[]} reports
 */

export default function templateReport(projectTitle, reports) {
  const templateEngine = new nunjucks.Environment();

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

  const warns = reports.filter((r) => !r.isError);
  const errs = reports.filter((r) => r.isError);

  return templateEngine.renderString(reportTemplate, {
    lang: lang.flag,
    date,
    projectTitle,
    reports,
    listWarnings: warns,
    listErrors: errs,
    warningsLength: warns.length,
    errorsLength: errs.length,
  });
}
