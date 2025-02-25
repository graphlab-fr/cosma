import reportTemplate from '../../static/template/report.njk';
import nunjucks from 'nunjucks';
import { groups } from 'd3';

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

  const date = new Date().toLocaleDateString('en', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const sortItems = (a, b) => {
    if (a.locator.line === undefined) return 1;
    if (b.locator.line === undefined) return -1;
    return a.locator.line - b.locator.line;
  };

  const output = {
    errors: Object.fromEntries(
      groups(items.filter((d) => d.isError).sort(sortItems), (d) => d.locator.file),
    ),
    warnings: Object.fromEntries(
      groups(items.filter((d) => !d.isError).sort(sortItems), (d) => d.locator.file),
    ),
  };

  return templateEngine.renderString(reportTemplate, {
    date,
    projectTitle: config.opts.title,
    items: output,
  });
}
