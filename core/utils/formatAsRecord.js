import normalizeWithAliases from './normalizeWithAliases';

const aliasTable = {
  tag: 'tags',
  keywords: 'tags',
  keyword: 'tags',
  type: 'types',
};

/**
 *
 * @param {unknown} props
 * @param {import('../models/config').default} config
 */

export default function formatAsRecord(props) {
  const result = normalizeWithAliases(aliasTable, props);

  if (!result.id && result.title) {
    result.id = result.title;
  }
  if (!result.title && result.id) {
    result.title = result.id;
  }
  if (result.types && typeof result.types === 'string') {
    result.types = [result.types];
  }
  if (result.tags && typeof result.tags === 'string') {
    result.tags = [result.tags];
  }
  if (result.begin && typeof result.begin === 'string') {
    result.begin = new Date(result.begin).getTime() / 1000;
  }
  if (result.end && typeof result.end === 'string') {
    result.end = new Date(result.end).getTime() / 1000;
  }

  return result;
}
