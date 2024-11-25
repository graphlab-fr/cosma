/**
 * @param {string} str
 */

export default function slugify(str) {
  return removeAccents(str)
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/-+/g, '-') // remove double hyphens
    .toLowerCase();
}

function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
