import path from 'node:path';
import yml from 'yaml';
import { getTimestampTuple, getTimestamp, slugify } from '../utils/misc.js';
import { read as readYmlFm } from '../utils/yamlfrontmatter.js';
import Joi from 'joi';
import normalizeWithAliases from '../utils/normalizeWithAliases.js';

const schema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
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
        content: props.content,
        title: props.title,
        id: props.id,
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
    const { error } = schema.validate(props);
    if (error) {
      throw new Error(`Record schema validation failed: ${error.message}`);
    }

    return new Record(
      {
        content,
        title: props.title,
        id: getTimestampTuple().join(),
        tags: props.tags,
        types: props.types,
      },
      config,
    );
  }

  /**
   *
   * @param {{
   *  id: string,
   *  title: string,
   *  content: string,
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
    { id, title, content, types = ['undefined'], tags = [], metas = {}, begin, end, thumbnail },
    config,
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
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
