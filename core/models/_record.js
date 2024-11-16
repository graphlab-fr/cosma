import yml from 'yaml';
import { getTimestampTuple } from '../utils/misc.js';
import { read as readYmlFm } from '../utils/yamlfrontmatter.js';
import Joi from 'joi';
import normalizeWithAliases from '../utils/normalizeWithAliases.js';
import parseWikilinks from '../utils/parseWikilinks.js';

/**
 * @typedef RecordLink
 * @type {object}
 * @property {string} type
 * @property {string} text
 * @property {string} target
 * @property {string[]} contexts
 */

const recordLinkSchema = Joi.object({
  type: Joi.string().required(),
  text: Joi.string().required(),
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
      ...normalizedHead,
    };

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
        begin: props.begin,
        end: props.end,
        metas,
        thumbnail: props.thumbnail,
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

  getYamlFrontMatter() {
    const ymlContent = yml.stringify({
      id: this.id,
      title: this.title,
      types: this.types,
      tags: this.tags.length === 0 ? undefined : this.tags,
      thumbnail: this.thumbnail,
      ...this.metas,
    });

    return ['---\n', ymlContent, '---'].join('');
  }
}
