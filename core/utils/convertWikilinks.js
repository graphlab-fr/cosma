const wikilinkRE = new RegExp(/\[\[((?<type>[^:|\]]+?):)?(?<id>.+?)(\|(?<text>.+?))?\]\]/, 'g');

/**
 * @param {string} markdown
 * @param {Record[]} records
 * @param {Config} opts
 * @param {string} idToHighlight
 * @returns string
 * @example
 * convertWikilinks('[[g:1234567890|toto]]'); // <a>toto</a>
 */

function convertWikilinks(markdown, records, opts, idToHighlight) {
  return markdown.replace(wikilinkRE, (match, _, type, targetId, __, text) => {
    const record = records.find(({ id }) => id === targetId.toLowerCase());

    if (!record) return match;

    let linkLibelle;
    if (text) {
      linkLibelle = text;
    } else if (opts['link_symbol']) {
      linkLibelle = opts['link_symbol'];
    } else {
      const isNumbers = !isNaN(Number(targetId));

      linkLibelle = isNumbers ? match : targetId;
    }

    return `<a href="#${record.id}" title="${escapeQuotes(record.title)}" class="record-link ${record.id === idToHighlight ? 'highlight' : ''}">${linkLibelle}</a>`;
  });
}

/**
 * @param {string} text
 * @returns {string}
 */

function escapeQuotes(text) {
  return text.replace(/'/g, '&apos;').replace(/"/g, '&quot;');
}

export default convertWikilinks;
