const parahsRE = new RegExp(/[^\r\n]+((\r|\n|\r\n)[^\r\n]+)*/, 'g');

/**
 *
 * @param {string} markdown
 * @returns {string[]}
 */

export default function extractParaphs(markdown) {
  return markdown.match(parahsRE) || [];
}
