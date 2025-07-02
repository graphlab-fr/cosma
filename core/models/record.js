import yml from 'yaml';
import Joi from 'joi';
import formatAsRecord from '../utils/formatAsRecord.js';
import parseWikilinks from '../utils/parseWikilinks.js';
import timestampIncrement from '../utils/timestampIncrement.js';
import slugify from '../utils/slugify.js';
import getTimestampTuple from '../utils/timestamp.js';

/**
 * @enum {number}
 */

const templates = {
  default: 0,
  quote: 1,
};

/**
 * @typedef RecordLink
 * @type {object}
 * @property {string} type
 * @property {string} [label]
 * @property {string} [text]
 * @property {string} target
 * @property {string[]} contexts
 */

const recordLinkSchema = Joi.object({
  type: Joi.string().required(),
  text: Joi.string().optional(),
  label: Joi.string().optional(),
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

export default class Record {
  /**
   * @param {unknown} data
   */

  static getErrors(data) {
    const { error } = schema.validate(data, { stripUnknown: true });
    return error;
  }

  /** @param {string} key */

  static isSchemaKey(key) {
    return schemaKeys.includes(key);
  }

  /**
   * @param {string} body
   * @param {unknown} head
   * @param {import('../models/config').default} config
   */

  static recordFromFile(body, props, config) {
    props = configContraints(props, config);

    props = {
      ...props,
      links: parseWikilinks(body, config),
      content: body,
    };

    const { error, value: validProps } = schema.validate(props, { stripUnknown: true });
    if (error) {
      throw new Error(`Record contains error: ${error.message}`);
    }

    return new Record(validProps, config);
  }

  /**
   * @param {unknown} props
   * @param {import('../models/config').default} config
   */

  static recordWithReference(props, config) {
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

  static recordFromCsv(props, config) {
    props = formatAsRecord(props, config);
    props = configContraints(props, config);

    const { error, value: validProps } = schema.validate(props, { stripUnknown: true });
    if (error) {
      throw new Error(`Record contains error: ${error.message}`);
    }

    return new Record(validProps, config);
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

    return new Record({ ...props, template: templates.quote }, config);
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
    props = configContraints(props, config);

    props = {
      ...props,
      id: timestampIncrement(increment),
    };

    const { error } = schema.validate(props, { stripUnknown: true });
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
   *  template?: templates,
   * }} props
   * @param {import('../models/config').default} config
   */

  constructor(
    {
      id,
      title,
      content = '',
      links = [],
      types = [],
      tags = [],
      metas = {},
      begin,
      end,
      thumbnail,
      template = templates.default,
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
    this.template = template;

    this.config = config;
  }

  /**
   * @param {boolean} withId
   */

  getFileContent(withId) {
    const ymlContent = yml.stringify({
      id: withId ? this.id : undefined,
      title: this.title,
      types: this.types.length === 0 ? undefined : this.types,
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

function configContraints(props, config) {
  const metas = {};

  for (const key of Object.keys(props)) {
    if (config.canSupportRecordMeta(key)) {
      metas[key] = props[key];
    }
  }

  props = {
    ...props,
    metas,
  };

  props.id = slugify(props.id);

  if (props.types) {
    props.types = props.types.reduce((acc, curr) => {
      if (!config.hasRecordType(curr)) {
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
