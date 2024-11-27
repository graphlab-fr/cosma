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

const schema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().required(),
  content: Joi.string().optional(),
  links: Joi.array().items(recordLinkSchema).optional(),
  types: Joi.array().items(Joi.string()).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  begin: Joi.number().optional(),
  end: Joi.number().optional(),
  thumbnail: Joi.string().optional(),
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

    const normalizedHead = normalizeWithAliases(aliasTable, head);
    const metas = {};

    for (const key of Object.keys(normalizedHead)) {
      if (!schemaKeys.includes(key)) {
        metas[key] = normalizedHead[key];
        delete normalizedHead[key];
      }
    }

    const links = parseWikilinks(content, config);

    const props = {
      content,
      id: head.id || head.title.toLowerCase(),
      ...normalizedHead,
    };

    if (typeof props.types === 'string') {
      props.types = [props.types];
    }
    if (typeof props.tags === 'string') {
      props.tags = [props.tags];
    }
    if (typeof props.begin === 'string') {
      props.begin = new Date(props.begin).getTime();
    }
    if (typeof props.end === 'string') {
      props.end = new Date(props.end).getTime();
    }

    const { error } = schema.validate(props);
    if (error) {
      throw new Error(`Record schema validation failed: ${error.message}`);
    }

    return new Record(
      {
        id: props.id,
        title: props.title,
        content: props.content,
        links,
        tags: props.tags,
        types: props.types,
        begin: props.begin,
        end: props.end,
        metas,
        thumbnail: props.thumbnail,
      },
      config,
    );
  }

  /**
   *
   * @param {unknown} line
   * @param {import('../models/config').default} config
   */

  static recordFromCsv(line, config) {
    const normalizedHead = normalizeWithAliases(aliasTable, line);
    const metas = {};

    for (const key of Object.keys(normalizedHead)) {
      if (!schemaKeys.includes(key)) {
        metas[key] = normalizedHead[key];
        delete normalizedHead[key];
      }
    }

    const props = {
      ...normalizedHead,
    };

    if (typeof props.types === 'string') {
      props.types = [props.types];
    }
    if (typeof props.tags === 'string') {
      props.tags = [props.tags];
    }
    if (typeof props.begin === 'string') {
      props.begin = new Date(props.begin).getTime();
    }
    if (typeof props.end === 'string') {
      props.end = new Date(props.end).getTime();
    }

    const { error } = schema.validate(props);
    if (error) {
      throw new Error(`Record schema validation failed: ${error.message}`);
    }

    return new Record(
      {
        id: props.id,
        title: props.title,
        content: props.content,
        links: [],
        tags: props.tags,
        types: props.types,
        begin: props.begin,
        end: props.end,
        metas,
        thumbnail: props.thumbnail,
      },
      config,
    );

    return undefined;
  }

  /**
   * @param {import('../utils/citeExtractor.js').CiteItem} citeItem
   * @param {import('../models/config').default} config
   * @param {import('../models/bibliography').default} bibliography
   */

  static recordFromCiteItem(citeItem, config, bibliography) {
    const libraryItem = bibliography.library[citeItem.id];

    return new Record(
      {
        id: citeItem.id,
        title: libraryItem['title'],
        content: bibliography.getNotes([citeItem])[0],
      },
      config,
    );
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
      ...props,
      id: getTimestampTuple().join(''),
    };

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

    const { error } = schema.validate(props);
    if (error) {
      throw new Error(`Record schema validation failed: ${error.message}`);
    }

    return new Record(props, config);
  }

  /**
   * @param {unknown} props
   * @param {import('../models/config').default} config
   * @param {number} increment
   */

  static recordWithIncrementedTimestamp(props, config, increment) {
    const normalizedProps = normalizeWithAliases(aliasTable, props);
    const metas = {};

    for (const key of Object.keys(normalizedProps)) {
      if (!schemaKeys.includes(key)) {
        metas[key] = normalizedProps[key];
        delete normalizedProps[key];
      }
    }

    props = {
      ...normalizedProps,
      id: timestampIncrement(increment),
    };

    if (typeof props.types === 'string') {
      props.types = [props.types];
    }
    if (typeof props.tags === 'string') {
      props.tags = [props.tags];
    }
    if (typeof props.begin === 'string') {
      props.begin = new Date(props.begin).getTime();
    }
    if (typeof props.end === 'string') {
      props.end = new Date(props.end).getTime();
    }

    const { error } = schema.validate(props);
    if (error) {
      throw new Error(`Record schema validation failed: ${error.message}`);
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
   *  metas?: unknown,
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
      throw new Error(`Record schema validation failed: ${error.message}`);
    }

    this.links.push(link);
  }
}
