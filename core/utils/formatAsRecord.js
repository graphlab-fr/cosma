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
  props = normalizeWithAliases(aliasTable, props);

  if (!props.id && props.title) {
    props.id = props.title;
  }
  if (!props.title && props.id) {
    props.title = props.id;
  }
  if (props.types && typeof props.types === 'string') {
    props.types = [props.types];
  }
  if (props.tags && typeof props.tags === 'string') {
    props.tags = [props.tags];
  }
  if (props.begin && typeof props.begin === 'string') {
    props.begin = new Date(props.begin).getTime() / 1000;
  }
  if (props.end && typeof props.end === 'string') {
    props.end = new Date(props.end).getTime() / 1000;
  }

  return props;
}
