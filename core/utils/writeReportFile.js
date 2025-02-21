import reportTemplate from '../../static/template/report.njk';

/**
 * @typedef ReportLocator
 * @type {object}
 * @property {string} file
 * @property {number} [line]
 */

/**
 * @typedef ReportItem
 * @type {object}
 * @property {ReportLocator} locator
 * @property {boolean} isError
 * @property {string} message
 */

/**
 * @param {ReportItem[]} items
 * @param {import('../models/config').default} config
 * @returns {string} HTML
 */

export default function writeReportFile(items, config) {
  const templateEngine = new nunjucks.Environment();

  const date = new Date().toLocaleDateString(lang, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  return templateEngine.renderString(reportTemplate, {
    date,
    projectTitle: config.opts.title,
    items,
  });
}
