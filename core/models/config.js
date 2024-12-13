/**
 * @file Configuration administration
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 Cosma's authors
 */

import fs from 'node:fs';
import path from 'node:path';
import envPaths from 'env-paths';
import yaml from 'yaml';
import { FindUserDataDirError, ReadUserDataDirError } from './errors.js';
import app from '../../package.json';
import Joi from 'joi';

/**
 * @typedef RecordType
 * @type {object}
 * @property {string} stroke
 * @property {string} fill
 */

/**
 * @typedef LinkType
 * @type {object}
 * @property {string} stroke
 * @property {string} color
 */

/**
 * @typedef RecordFilters
 * @type {object}
 * @property {string} meta
 * @property {string} value
 */

/**
 * @typedef Options
 * @type {object}
 * @property {'directory'|'csv'|'online'} select_origin
 * @property {string} [files_origin]
 * @property {string} [nodes_origin]
 * @property {string} [links_origin]
 * @property {string} [nodes_online]
 * @property {string} [links_online]
 * @property {string} [images_origin]
 * @property {string} export_target
 * @property {boolean} history
 * @property {number} focus_max
 * @property {Object<string, RecordType>} record_types
 * @property {Object<string, LinkType>} link_types
 * @property {boolean} references_as_nodes
 * @property {string} references_type_label
 * @property {RecordFilters} record_filters
 * @property {string} graph_background_color
 * @property {string} graph_highlight_color
 * @property {boolean} graph_highlight_on_hover
 * @property {number} graph_text_size
 * @property {boolean} graph_arrows
 * @property {'unique'|'degree'} node_size_method
 * @property {number} node_size
 * @property {number} [node_size_max]
 * @property {number} [node_size_min]
 * @property {number} attraction_force
 * @property {number} attraction_distance_max
 * @property {number} attraction_vertical
 * @property {number} attraction_horizontal
 * @property {unknown} [views]
 * @property {string[]} record_metas
 * @property {'always'|'never'|'ask'} generate_id
 * @property {'tooltip'|'inline'} link_context
 * @property {boolean} hide_id_from_record_header
 * @property {string} [title]
 * @property {string} [author]
 * @property {string} [description]
 * @property {string[]} keywords
 * @property {string} [link_symbol]
 * @property {string} [csl]
 * @property {string} [bibliography]
 * @property {string} [csl_locale]
 * @property {string} [css_custom]
 * @property {boolean} devtools
 * @property {'fr'|'en'} lang
 */

const recordTypeItemSchema = Joi.object({
  stroke: Joi.string().required(),
  fill: Joi.string().required(),
});

const linkTypeItemSchema = Joi.object({
  stroke: Joi.string().required(),
  color: Joi.string().required(),
});

const recordFilterItemSchema = Joi.object({
  meta: Joi.string().required(),
  value: Joi.string().required(),
});

const minValues = {
  focus_max: 0,
  graph_text_size: 2,
  attraction_force: 50,
  attraction_distance_max: 200,
  attraction_vertical: 0,
  attraction_horizontal: 0,
};

function pathExists(path, helpers) {
  if (fs.existsSync(path)) {
    return path;
  }
  return helpers.error('any.invalid', {
    message: `File ${path} does not exists.`,
  });
}

function validateSelectOrigin(value, helpers) {
  /** @type {Options} */
  const opts = helpers.state.ancestors[0];

  switch (value) {
    case 'directory':
      if (!opts.files_origin) {
        return helpers.error('any.invalid', {
          message: 'Option "files_origin" have to be defined if select_origin is "directory"',
        });
      }
      break;
    case 'csv':
      if (!opts.nodes_origin || !opts.links_origin) {
        return helpers.error('any.invalid', {
          message:
            'Options "nodes_origin" and "links_origin" have to be defined if select_origin is "csv"',
        });
      }
      break;
    case 'online':
      if (!opts.nodes_online || !opts.links_online) {
        return helpers.error('any.invalid', {
          message:
            'Options "nodes_online" and "links_online" have to be defined if select_origin is "online"',
        });
      }
      break;
    default:
      return helpers.error('any.invalid', {
        message: 'Option "select_origin" should be "directory", "csv" or "online"',
      });
  }

  return value;
}

const optionsSchema = Joi.object({
  select_origin: Joi.string().custom(validateSelectOrigin, 'data origin validation'),
  files_origin: Joi.string().custom(pathExists, 'path existence validation').optional(),
  nodes_origin: Joi.string()
    .pattern(/\.csv$/, 'CSV file')
    .optional(),
  links_origin: Joi.string()
    .pattern(/\.csv$/, 'CSV file')
    .optional(),
  nodes_online: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .optional(),
  links_online: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .optional(),
  images_origin: Joi.string().custom(pathExists, 'path existence validation').optional(),
  export_target: Joi.string().custom(pathExists, 'path existence validation'),
  history: Joi.boolean(),
  focus_max: Joi.number(),
  record_types: Joi.object().pattern(Joi.string(), recordTypeItemSchema),
  link_types: Joi.object().pattern(Joi.string(), linkTypeItemSchema),
  references_as_nodes: Joi.boolean(),
  references_type_label: Joi.string(),
  record_filters: Joi.array().items(recordFilterItemSchema),
  graph_background_color: Joi.string(),
  graph_highlight_color: Joi.string(),
  graph_highlight_on_hover: Joi.boolean(),
  graph_text_size: Joi.number(),
  graph_arrows: Joi.boolean(),
  node_size_method: Joi.string().valid('unique', 'degree'),
  node_size: Joi.number().integer().min(0),
  node_size_max: Joi.number().integer().min(0).optional(),
  node_size_min: Joi.number().integer().min(0).optional(),
  attraction_force: Joi.number().integer().min(minValues.attraction_force),
  attraction_distance_max: Joi.number().integer().min(minValues.attraction_distance_max),
  attraction_vertical: Joi.number().min(minValues.attraction_vertical),
  attraction_horizontal: Joi.number().min(minValues.attraction_horizontal),
  views: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  record_metas: Joi.array().items(Joi.string()),
  generate_id: Joi.string().valid('always', 'never', 'ask'),
  link_context: Joi.string().valid('tooltip', 'inline'),
  hide_id_from_record_header: Joi.boolean(),
  title: Joi.string().optional(),
  author: Joi.string().optional(),
  description: Joi.string().optional(),
  keywords: Joi.array().items(Joi.string()),
  link_symbol: Joi.string().optional(),
  csl: Joi.string()
    .pattern(/\.csl$/, 'CSL file')
    .custom(pathExists, 'path existence validation')
    .optional(),
  bibliography: Joi.string()
    .pattern(/\.json$/, 'JSON file')
    .custom(pathExists, 'path existence validation')
    .optional(),
  csl_locale: Joi.string()
    .pattern(/\.xml$/, 'XML file')
    .custom(pathExists, 'path existence validation')
    .optional(),
  css_custom: Joi.string()
    .pattern(/\.css$/, 'CSS file')
    .custom(pathExists, 'path existence validation')
    .optional(),
  devtools: Joi.boolean(),
  lang: Joi.string().valid('fr', 'en'),
}).options({ presence: 'required' });

const { data: envPathDataDir } = envPaths('cosma-cli', { suffix: '' });

/**
 * Class to manage the user config
 */

class Config {
  /**
   * Default configuration options : the source of truth of the config
   * @type {Options}
   */

  static base = Object.freeze({
    select_origin: 'directory',
    files_origin: './',
    nodes_origin: undefined,
    links_origin: undefined,
    nodes_online: undefined,
    links_online: undefined,
    images_origin: undefined,
    export_target: './',
    history: true,
    focus_max: 2,
    record_types: { undefined: { fill: '#858585', stroke: '#858585' } },
    link_types: { undefined: { stroke: 'simple', color: '#e1e1e1' } },
    references_as_nodes: false,
    references_type_label: 'references',
    record_filters: [],
    graph_background_color: '#ffffff',
    graph_highlight_color: '#ff6a6a',
    graph_highlight_on_hover: true,
    graph_text_size: 10,
    graph_arrows: true,
    node_size_method: 'degree',
    node_size: 10,
    node_size_max: 20,
    node_size_min: 2,
    attraction_force: 200,
    attraction_distance_max: 250,
    attraction_vertical: 0,
    attraction_horizontal: 0,
    views: {},
    record_metas: [],
    generate_id: 'always',
    link_context: 'tooltip',
    hide_id_from_record_header: false,
    title: undefined,
    author: undefined,
    description: undefined,
    keywords: [],
    link_symbol: undefined,
    csl: undefined,
    bibliography: undefined,
    csl_locale: undefined,
    css_custom: undefined,
    devtools: false,
    lang: 'en',
  });

  /**
   * @returns {Set<string>}
   */

  static getOptionsList() {
    return new Set(Object.keys(Config.base));
  }

  /**
   * Valid langages flags
   * @static
   */

  static validLangages = {
    fr: 'Français',
    en: 'English',
  };

  /** directory contains global user projects options */
  static configDirPath = envPathDataDir;
  /** config file contains global user default options */
  static defaultConfigPath = path.join(Config.configDirPath, 'defaults.yml');
  /** config file contains local user options */
  static executionConfigPath = path.join(process.cwd(), 'config.yml');

  /**
   * Get config files from user data directory
   * @returns {{name: string, filePath: string}[]}
   * @throws {UserDataDirNotExists}
   */

  static getConfigFilesListFromConfigDir() {
    if (fs.existsSync(Config.configDirPath) === false) {
      throw new FindUserDataDirError();
    }

    let files;

    try {
      files = fs.readdirSync(Config.configDirPath, 'utf-8');
    } catch (error) {
      throw new ReadUserDataDirError('try to get config files', Config.configDirPath);
    }
    return files
      .filter((fileName) => path.extname(fileName) === '.yml')
      .map((fileName) => {
        const filePath = path.join(Config.configDirPath, fileName);
        const { name } = path.parse(filePath);
        return { name, filePath };
      });
  }

  /**
   * @param {Options} opts
   */

  static getFrom(opts) {
    opts = {
      ...Config.base,
      ...opts,
    };

    const { error } = optionsSchema.validate(opts);
    if (error) {
      const details = (error?.details || [])
        .flatMap((detail) => [detail.message, detail.context.message])
        .join(', ');

      throw new Error(`Config schema validation failed: ${details}`);
    }

    return new Config(opts);
  }

  /**
   * Default path to find config for current execution
   * @type {string}
   */
  static configFilePath = Config.executionConfigPath;

  /**
   * Get config options from the (config file) path
   * @param {string} configFilePath Path to a config file
   * @return {Config}
   * @throws {ErrorConfig} Will throw an error if config file can not be read or parse
   */

  static get(configFilePath) {
    if (configFilePath === undefined || fs.existsSync(configFilePath) === false) {
      throw new Error(`Can not find config file from ${configFilePath}.`);
    }

    const fileContent = fs.readFileSync(configFilePath, 'utf8');
    const data = yaml.parse(fileContent);

    for (const [key, value] of Object.entries(data)) {
      if (value === null) {
        data[key] = undefined;
      }
    }

    const opts = {
      ...Config.base,
      ...data,
    };

    const { error } = optionsSchema.validate(opts);
    if (error) {
      const details = (error?.details || [])
        .flatMap((detail) => [detail.message, detail.context.message])
        .join(', ');

      throw new Error(`Config file ${configFilePath} contains errors :\n${details}`);
    }

    return new Config(opts);
  }

  /**
   * @param {Options} [opts]
   */

  constructor(opts = Config.base) {
    /**
     * All options & their value from the config
     * @type {Options}
     */

    this.opts = opts;
  }

  canModelizeFromDirectory() {
    return !!this.opts.files_origin;
  }

  canModelizeFromCsvFiles() {
    return !!this.opts.nodes_origin && !!this.opts.links_origin;
  }

  canModelizeFromOnline() {
    return !!this.opts.nodes_online && !!this.opts.links_online;
  }

  canCiteproc() {
    return !!this.opts.csl && !!this.opts.bibliography && !!this.opts.csl_locale;
  }

  canCssCustom() {
    return !!this.opts.css_custom;
  }

  canSaveRecords() {
    return !!this.opts.files_origin;
  }

  getTypesRecords() {
    return new Set(Object.keys(this.opts.record_types));
  }

  getTypesLinks() {
    return new Set(Object.keys(this.opts.link_types));
  }

  getRecordMetas() {
    return new Set(this.opts.record_metas);
  }

  getYaml() {
    return yaml.stringify(this.opts, { keepUndefined: true });
  }

  /**
   * @param {string} type
   * @returns {'color'|'image'}
   */

  // getFormatOfTypeRecord(type) {
  //   const validExtnames = new Set(['.jpg', '.jpeg', '.png']);

  //   const { fill } = this.opts['record_types'][type];
  //   if (validExtnames.has(path.extname(fill))) {
  //     return 'image';
  //   }
  //   return 'color';
  // }

  getConfigConsolMessage() {
    let name = this.opts['title'] || null;
    if (this.path === Config.defaultConfigPath) {
      name = 'Default';
    }
    const messageSections = [
      `[Cosma v.${app.version}]`,
      ['\x1b[4m', name, '\x1b[0m'].join(''),
      ['\x1b[2m', this.path, '\x1b[0m'].join(''),
    ];

    // if (this.report.length > 0) {
    //   messageSections.push(
    //     [
    //       '\n',
    //       ['\x1b[31m', 'Config errors', '\x1b[0m'].join(''),
    //       ' for options: ',
    //       this.report.join(', '),
    //     ].join(''),
    //   );
    // }

    return messageSections.join(' ');
  }
}

export default Config;
