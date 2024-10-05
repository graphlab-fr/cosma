/**
 * @file Reading this file of the interface messages in several langagues
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 Cosma's authors
 */

import content from '../i18n.yml';

const i = content;

/**
 * Get the current used langage flag
 * @type string
 */

const flag = 'fr';

/**
 * Get the translate for a multilingual object
 * @param {object} i - Object with lang flag, as 'fr'
 * @returns {string} - The string that corresponds to the optional language
 * @example
 * lang.getFor({
 *    fr: 'En français'
 *    en: 'In English'
 * })
 *
 * lang.getFor(lang.i.windows.record)
 */

function getFor(i) {
  return i['fr'];
}

/**
 * Get the translate for a object and replace $ vars
 * @param {object} i - Object with lang flag, as 'fr'
 * @param {array} substitutes - Array of replacement : key 0 corresponds to the $1
 * @returns {string} - The string that corresponds to the optional language
 * @example
 * lang.getFor({
 *    fr: 'Pour le fichier $1'
 *    en: 'For the $1 file'
 * }, [fileName])
 */

function getWith(i, substitutes) {
  let str = i['fr'];

  for (let y = 0; y < substitutes.length; y++) {
    const subst = substitutes[y];

    const I = y + 1;

    str = str.replace('$' + I, subst);
  }

  return str;
}

export default { i, flag, getFor, getWith };
