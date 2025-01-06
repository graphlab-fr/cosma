import yml from 'yaml';
import { read as readYmlFm } from '../utils/yamlfrontmatter.js';
import Joi from 'joi';
import normalizeWithAliases from '../utils/normalizeWithAliases.js';
import parseWikilinks from '../utils/parseWikilinks.js';
import timestampIncrement from '../utils/timestampIncrement.js';
import slugify from '../utils/slugify.js';
import getTimestampTuple from '../utils/timestamp.js';

/**
 * @typedef RecordLink
 * @type {object}
 * @property {string} type
 * @property {string} [text]
 * @property {string} target
 * @property {string[]} contexts
 */

const recordLinkSchema = Joi.object({
  type: Joi.string().required(),
  text: Joi.string().optional(),
  target: Joi.string().required(),
  contexts: Joi.array().items(Joi.string()).required(),
});

function validateTimestamp(value, helpers) {
  const err = helpers.error('any.invalid', {
    message: `"${value}" can not convert to a valid timestamp.`,
  });

  if (!Number.isInteger(value)) {
    return err;
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return err;
  }

  return value;
}

const schema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().required(),
  content: Joi.string().optional(),
  links: Joi.array().items(recordLinkSchema).optional(),
  types: Joi.array().items(Joi.string()).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  begin: Joi.number().custom(validateTimestamp, 'timestamp validation').optional(),
  end: Joi.number().custom(validateTimestamp, 'timestamp validation').optional(),
  thumbnail: Joi.string().optional(),
  metas: Joi.object().pattern(Joi.string(), Joi.any()).optional(),
});
const schemaKeys = Object.keys(schema.describe().keys);

const aliasTable = {
  tag: 'tags',
  keywords: 'tags',
  keyword: 'tags',
  type: 'types',
};

export default class Record {
  /**
   * @param {string} file
   * @param {import('../models/config').default} config
   */

  static recordFromFile(file, config) {
    const { content, head } = readYmlFm(file, { schema: 'failsafe' });

    const props = {
      ...normalizeInput(head, config),
      links: parseWikilinks(content, config),
      content,
    };

    const { error } = schema.validate(props);
    if (error) {
      throw new Error(`Record contains error: ${error.message}`);
    }

    return new Record(props, config);
  }

  /**
   *
   * @param {unknown} line
   * @param {import('../models/config').default} config
   */

  static recordFromCsv(line, config) {
    const props = normalizeInput(line, config);

    const { error } = schema.validate(props);
    if (error) {
      throw new Error(`Record contains error: ${error.message}`);
    }

    return new Record(props, config);
  }

  /**
   * @param {import('../utils/citeExtractor.js').CiteItem} citeItem
   * @param {import('../models/config').default} config
   * @param {import('../models/bibliography').default} bibliography
   */

  static recordFromCiteItem(citeItem, config, bibliography) {
    const libraryItem = bibliography.library[citeItem.id];

    if (!libraryItem) {
      throw new Error(`Library item "${citeItem.id}" is unknown`);
    }

    const props = {
      id: citeItem.id,
      title: libraryItem['title'],
      content: bibliography.getNotes([citeItem])[0],
      types: [config.opts.references_type_label],
    };

    const { error } = schema.validate(props);
    if (error) {
      throw new Error(`Record contains error: ${error.message}`);
    }

    return new Record(props, config);
  }

  /**
   * @param {{
   *  title: string,
   *  types?: string[],
   *  tags?: string[],
   * }} props
   * @param {import('../models/config').default} config
   */

  static recordWithTimestamp(props, config) {
    props = {
      ...normalizeInput(props, config),
      id: getTimestampTuple().join(''),
    };

    const { error } = schema.validate(props);
    if (error) {
      throw new Error(`Record contains error: ${error.message}`);
    }

    return new Record(props, config);
  }

  /**
   * @param {unknown} props
   * @param {import('../models/config').default} config
   * @param {number} increment
   */

  static recordWithIncrementedTimestamp(props, config, increment) {
    props = {
      ...normalizeInput(props, config),
      id: timestampIncrement(increment),
    };

    const { error } = schema.validate(props);
    if (error) {
      throw new Error(`Record contains error: ${error.message}`);
    }

    return new Record(props, config);
  }

  /**
   *
   * @param {{
   *  id: string,
   *  title: string,
   *  content: string,
   *  links?: RecordLink[],
   *  types?: string[],
   *  tags?: string[],
   *  metas?: Object<string, any>,
   *  begin?: number,
   *  end?: number,
   *  thumbnail?: string,
   * }} props
   * @param {import('../models/config').default} config
   */

  constructor(
    {
      id,
      title,
      content = '',
      links = [],
      types = ['undefined'],
      tags = [],
      metas = {},
      begin,
      end,
      thumbnail,
    },
    config,
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.links = links;
    this.types = types;
    this.tags = tags;
    this.metas = metas;
    this.begin = begin;
    this.end = end;
    this.thumbnail = thumbnail;

    this.config = config;
  }

  /**
   * @param {boolean} withId
   */

  getFileContent(withId) {
    const ymlContent = yml.stringify({
      id: withId ? this.id : undefined,
      title: this.title,
      types: this.types,
      tags: this.tags.length === 0 ? undefined : this.tags,
      thumbnail: this.thumbnail,
      ...this.metas,
    });

    return ['---\n', ymlContent, '---\n\n', this.content].join('');
  }

  getFileName() {
    return slugify(this.title) + '.md';
  }

  /**
   *
   * @param {RecordLink} link
   */

  addLink(link) {
    const { error } = recordLinkSchema.validate(link);
    if (error) {
      throw new Error(`Record contains error: ${error.message}`);
    }

    this.links.push(link);
  }
}

/**
 * @param {unknown} head
 * @param {import('../models/config').default} config
 */

function normalizeInput(head, config) {
  const normalizedHead = normalizeWithAliases(aliasTable, head);

  const metas = {};

  for (const key of Object.keys(normalizedHead)) {
    if (config.opts.record_metas.includes(key)) {
      metas[key] = normalizedHead[key];
    }

    if (!schemaKeys.includes(key)) {
      delete normalizedHead[key];
    }
  }

  const props = {
    metas,
    ...normalizedHead,
  };

  if (!props.id && props.title) {
    props.id = props.title;
  }
  if (typeof props.types === 'string') {
    props.types = [props.types];
  }
  if (typeof props.tags === 'string') {
    props.tags = [props.tags];
  }
  if (typeof props.begin === 'string') {
    props.begin = new Date(props.begin).getTime() / 1000;
  }
  if (typeof props.end === 'string') {
    props.end = new Date(props.end).getTime() / 1000;
  }

  if (props.id) {
    props.id = slugify(props.id);
  }

  if (props.types) {
    const knownTypes = config.getTypesRecords();
    props.types = props.types.reduce((acc, curr, i, arr) => {
      if (!knownTypes.has(curr)) {
        if (!acc.includes('undefined')) {
          acc.push('undefined');
        }
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);
  }

  return props;
}
