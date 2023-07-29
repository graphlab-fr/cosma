/**
 * @file Configuration administration
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const path = require('path'),
  fs = require('fs');

const Link = require('./link');

/**
 * Class to manage the user config
 */

module.exports = class Config {
  /**
   * Default configuration options : the source of truth of the config
   * @static
   */

  static base = Object.freeze({
    select_origin: 'directory',
    files_origin: '',
    nodes_origin: '',
    links_origin: '',
    nodes_online: '',
    links_online: '',
    images_origin: '',
    export_target: '',
    history: true,
    focus_max: 2,
    record_types: { undefined: { fill: '#858585', stroke: '#858585' } },
    link_types: { undefined: { stroke: 'simple', color: '#e1e1e1' } },
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
    chronological_record_meta: 'created',
    record_metas: [],
    title: '',
    author: '',
    description: '',
    keywords: [],
    link_symbol: '',
    csl: '',
    bibliography: '',
    csl_locale: '',
    css_custom: '',
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
   * Contains all options gotten with Config.get() from config files.
   * For each config file, memory get a property with the config file path and a value as the options contained.
   * @static
   * @exemple
   * ```
   * Config.get('/home/user/doc/config.yml')
   * Config.memory // { '/home/user/doc/config.yml': { 'select_origin': '...', ... } }
   * ```
   */

  static memory = {};

  /**
   * Get the context of the process
   * @returns {'electron', 'other'} - 'electron' or 'other'
   * @static
   */

  static getContext() {
    if (process.versions['electron'] !== undefined) {
      return 'electron';
    }

    return 'other';
  }

  /**
   * Min value for each number options
   * Apply to config form and to verif values from this class
   * @static
   */

  static minValues = {
    focus_max: 0,
    graph_text_size: 2,
    attraction_force: 50,
    attraction_distance_max: 200,
    attraction_vertical: 0,
    attraction_horizontal: 0,
    node_size: 0,
    node_size_max: 0,
    node_size_min: 0,
  };

  /**
   * Valid langages flags
   * @static
   */

  static validLangages = {
    fr: 'Français',
    en: 'English',
  };

  /**
   * @param {string} path
   * @returns {boolean}
   */

  static isValidPath(path) {
    if (typeof path !== 'string') {
      return false;
    }
    if (fs.existsSync(path)) {
      return true;
    }

    return false;
  }

  static isValidUrl(url) {
    if (typeof url !== 'string') {
      return false;
    }
    if (url === '') {
      return false;
    }

    try {
      new URL(url);
    } catch (error) {
      return false;
    }
    return true;
  }

  static isValidNodeSize(nodeSize) {
    if (typeof nodeSize !== 'object') {
      return false;
    }
    if (nodeSize['method'] === undefined) {
      return false;
    }
    if (new Set(['unique', 'degree']).has(nodeSize['method']) === false) {
      return false;
    }

    switch (nodeSize['method']) {
      case 'unique':
        if (typeof nodeSize['value'] !== 'number') {
          return false;
        }
        if (nodeSize['value'] < 0) {
          return false;
        }
        break;
      case 'degree':
        if (typeof nodeSize['min'] !== 'number' || typeof nodeSize['max'] !== 'number') {
          return false;
        }
        if (nodeSize['min'] < 0 || nodeSize['max'] < 0) {
          return false;
        }
        break;
    }
    return true;
  }

  /**
   * @param {string} optionName
   * @param {number} value
   * @returns {boolean}
   */

  static isValidNumber(optionName, value) {
    if (typeof value !== 'number') {
      return false;
    }
    if (value < Config.minValues[optionName]) {
      return false;
    }

    return true;
  }

  static isValidViews(views) {
    if (typeof views !== 'object') {
      return false;
    }

    for (const key of Object.values(views)) {
      if (typeof key !== 'string') {
        return false;
      }
    }

    return true;
  }

  static isValidLangage(lang) {
    if (Config.validLangages[lang] === undefined) {
      return false;
    }

    return true;
  }

  static isValidRecordTypes(recordTypes) {
    if (!recordTypes) {
      return false;
    }
    if (typeof recordTypes !== 'object') {
      return false;
    }
    if (recordTypes['undefined'] === undefined) {
      return false;
    }

    for (const key in recordTypes) {
      if (!key) {
        return;
      }
      if (
        typeof recordTypes[key] !== 'object' ||
        recordTypes[key]['fill'] === undefined ||
        typeof recordTypes[key]['fill'] !== 'string' ||
        recordTypes[key]['stroke'] === undefined ||
        typeof recordTypes[key]['stroke'] !== 'string'
      ) {
        return false;
      }
    }

    return true;
  }

  static isValidLinkTypes(linkTypes) {
    if (!linkTypes) {
      return false;
    }
    if (typeof linkTypes !== 'object') {
      return false;
    }
    if (linkTypes['undefined'] === undefined) {
      return false;
    }

    for (const key in linkTypes) {
      if (!key) {
        return false;
      }
      if (
        typeof linkTypes[key] !== 'object' ||
        linkTypes[key]['color'] === undefined ||
        typeof linkTypes[key]['color'] !== 'string' ||
        linkTypes[key]['stroke'] === undefined ||
        typeof linkTypes[key]['stroke'] !== 'string' ||
        Link.validLinkStrokes.has(linkTypes[key]['stroke']) === false
      ) {
        return false;
      }
    }

    return true;
  }

  static isValidRecordFilters(recordFilters) {
    if (Array.isArray(recordFilters) === false) {
      return false;
    }
    const validMetas = new Set(['type', 'tags']);

    for (const { meta, value } of recordFilters) {
      if (!meta || !value) {
        return false;
      }
      if (validMetas.has(meta) === false) {
        return false;
      }
    }
    return true;
  }

  /**
   * Get config options from the (config file) path
   * @param {string} configFilePath Path to a config file
   * @return {object} Config option or base config (Config.base) if errors
   * @throws {ErrorConfig} Will throw an error if config file can not be read or parse
   */

  static get(configFilePath) {
    if (configFilePath === undefined || fs.existsSync(configFilePath) === false) {
      throw new ErrorConfig('No valid config file path to get config');
    }

    let opts;

    if (Config.memory[configFilePath] === undefined) {
      let fileContent;
      try {
        fileContent = fs.readFileSync(configFilePath, 'utf8');
      } catch (error) {
        // throw "The config file cannot be read.\n\n" + error
        throw new ErrorConfig('The config file cannot be read.');
      }

      try {
        switch (path.extname(configFilePath)) {
          case '.json':
            opts = JSON.parse(fileContent);
            break;

          case '.yml':
            const yml = require('yaml');
            opts = yml.parse(fileContent);
            break;
        }
      } catch (error) {
        // throw "The config file cannot be parsed.\n\n" + error
        throw new ErrorConfig('The config file cannot be parsed.');
      }
      Config.memory[configFilePath] = opts;
    } else {
      opts = Config.memory[configFilePath];
    }
    return opts;
  }

  /**
   * Config opts to overwrite the graph config for generate sample cosmoscope
   * @return {object} - Config.opts for sample
   */

  static getSampleConfig() {
    const lang = require('./lang');

    return Object.assign({}, Config.base, {
      files_origin: path.join(__dirname, '../static/sample', lang.flag),
      record_types: {
        undefined: { fill: '#147899', stroke: '#147899' },
        documentation: { fill: '#147899', stroke: '#147899' },
        important: { fill: '#aa0000', stroke: '#aa0000' },
      },
      attraction_force: 600,
      attraction_distance_max: 800,
      graph_text_size: 15,
      title: lang.getFor(lang.i.demo.title),
      description: lang.getFor(lang.i.demo.description),
      lang: lang.flag,
    });
  }

  /**
   * Create a user config.
   * @param {object} opts - Options to change from current config or the base config
   * @param {string} configFilePath - Path to config file (JSON or YAML)
   */

  constructor(opts = {}, configFilePath) {
    this.path = configFilePath;
    /** List of invalid fields */
    this.report = [];
    /**
     * All options & their value from the config
     * @type object
     */
    this.opts = Object.assign({}, Config.base, opts);

    if (this.isValid() === false) {
      this.fix();
      this.save();
    }
  }

  /**
   * Save the config options to the (file) path
   * @return {boolean} - True if the config file is saved, false if fatal error
   * or the errors array
   */

  save() {
    if (this.path === undefined || this.isValid() === false) {
      return false;
    }

    try {
      switch (path.extname(this.path)) {
        case '.json':
          fs.writeFileSync(this.path, JSON.stringify(this.opts));
          break;

        case '.yml':
          const yml = require('yaml');
          fs.writeFileSync(this.path, yml.stringify(this.opts));
          break;
      }
    } catch (error) {
      throw new ErrorConfig('The config file cannot be save.');
    }

    Config.memory[this.path] = this.opts;
    return true;
  }

  /**
   * Store invalid fields into this.report
   */

  verif() {
    const select_origin = new Set(['directory', 'csv', 'online']).has(this.opts.select_origin)
      ? null
      : 'select_origin';

    const paths = [
      'files_origin',
      'nodes_origin',
      'links_origin',
      'images_origin',
      'export_target',
      'csl',
      'bibliography',
      'csl_locale',
      'css_custom',
    ]
      .filter((option) => {
        if (this.opts[option] === '') {
          return false;
        }
        return Config.isValidPath(this.opts[option]) === false;
      })
      .map((invalidPath) => {
        return invalidPath;
      });

    const urls = ['nodes_online', 'links_online']
      .filter((option) => {
        if (this.opts[option] === '') {
          return false;
        }
        return Config.isValidUrl(this.opts[option]) === false;
      })
      .map((invalidUrl) => {
        return invalidUrl;
      });

    const numbers = [
      'focus_max',
      'graph_text_size',
      'attraction_force',
      'attraction_distance_max',
      'attraction_vertical',
      'attraction_horizontal',
      'node_size',
      'node_size_max',
      'node_size_min',
    ]
      .filter((option) => {
        return Config.isValidNumber(option, this.opts[option]) === false;
      })
      .map((invalidNumber) => {
        return invalidNumber;
      });

    const bools = ['history', 'graph_highlight_on_hover', 'graph_arrows', 'devtools']
      .filter((option) => {
        return typeof this.opts[option] !== 'boolean';
      })
      .map((invalidBool) => {
        return invalidBool;
      });

    const record_types = Config.isValidRecordTypes(this.opts['record_types'])
      ? null
      : 'record_types';

    const link_types = Config.isValidLinkTypes(this.opts['link_types']) ? null : 'link_types';

    const lang = Config.isValidLangage(this.opts['lang']) ? null : 'lang';

    const views = Config.isValidViews(this.opts['views']) ? null : 'views';

    const chronological_record_meta = new Set(['lastOpen', 'lastEdit', 'created', 'timestamp']).has(
      this.opts.chronological_record_meta
    )
      ? null
      : 'chronological_record_meta';

    const node_size_method = new Set(['unique', 'degree']).has(this.opts.node_size_method)
      ? null
      : 'node_size_method';

    const record_filters = Config.isValidRecordFilters(this.opts['record_filters'])
      ? null
      : 'record_filters';

    this.report = [
      select_origin,
      ...paths,
      ...urls,
      ...numbers,
      ...bools,
      record_types,
      link_types,
      lang,
      views,
      chronological_record_meta,
      node_size_method,
      record_filters,
    ].filter((invalidOption) => invalidOption !== null);
  }

  /**
   * Check 'this.report' array.
   * If values are strings true, or empty arrays : TRUE
   * else : FALSE
   * @returns {boolean}
   */

  isValid() {
    this.verif();

    for (const key in this.report) {
      if (this.report[key] === true) {
        continue;
      }

      if (Array.isArray(this.report[key]) === true && this.report[key].length === 0) {
        continue;
      }

      return false;
    }

    return true;
  }

  /**
   * Fix the config : for each invalid option, get the Config.base value
   */

  fix() {
    for (const invalidOpt of this.report) {
      this.opts[invalidOpt] = Config.base[invalidOpt];
    }
  }

  /**
   * Tranform 'this.report' array (contains error list) to a string
   * @returns {string}
   */

  writeReport() {
    const lang = require('./lang');

    return this.report
      .map((invalidOption) => {
        if (Object.keys(Config.minValues).includes(invalidOption)) {
          return lang.getWith(lang.i.config.errors[invalidOption], [
            Config.minValues[invalidOption],
          ]);
        }
        return lang.getFor(lang.i.config.errors[invalidOption]);
      })
      .join(', ');
  }

  /**
   * If the config allow citeproc process
   * @returns {boolean}
   * @todo Check if files match with citeproc files schema
   */

  canCiteproc() {
    const options = [
      { filePath: this.opts['csl'], extension: '.csl' },
      { filePath: this.opts['bibliography'], extension: '.json' },
      { filePath: this.opts['csl_locale'], extension: '.xml' },
    ];
    for (const { filePath, extension } of options) {
      if (Config.isValidPath(filePath) === false) {
        return false;
      }
      if (path.extname(filePath) !== extension) {
        return false;
      }
    }
    return true;
  }

  /**
   * If the config allow css_custom process
   * @returns {boolean}
   */

  canCssCustom() {
    if (Config.isValidPath(this.opts['css_custom']) === false) {
      return false;
    }
    if (path.extname(this.opts['css_custom']) !== '.css') {
      return false;
    }
    return true;
  }

  /**
   * @returns {boolean}
   */

  canSaveRecords() {
    return Config.isValidPath(this.opts['files_origin']);
  }

  /**
   * @returns {boolean}
   */

  canModelizeFromDirectory() {
    return Config.isValidPath(this.opts['files_origin']);
  }

  /**
   * @returns {boolean}
   */

  canModelizeFromCsvFiles() {
    const options = [
      { filePath: this.opts['nodes_origin'], extension: '.csv' },
      { filePath: this.opts['links_origin'], extension: '.csv' },
    ];
    for (const { filePath, extension } of options) {
      if (Config.isValidPath(filePath) === false) {
        return false;
      }
      if (path.extname(filePath) !== extension) {
        return false;
      }
    }
    return true;
  }

  /**
   * @returns {boolean}
   */

  canModelizeFromOnlineSync() {
    for (const url of [this.opts['nodes_online'], this.opts['links_online']]) {
      if (Config.isValidUrl(url) === false) {
        return false;
      }
    }
    return true;
  }

  /**
   * @returns {Promise}
   */

  canModelizeFromOnline() {
    const http = require('http');
    return new Promise((resolve, reject) => {
      for (const url of [this.opts['nodes_online'], this.opts['links_online']]) {
        if (Config.isValidUrl(url) === false) {
          resolve(false);
        }
        const { host, port, pathname: path } = new URL(url);
        const options = { method: 'HEAD', host, port, path };
        const req = http.request(options, (r) => {});
        req.on('error', (err) => resolve(false));
        req.end();
      }
      resolve(true);
    });
  }

  /**
   * @returns {Set<string>}
   */

  getTypesRecords() {
    return new Set(Object.keys(this.opts.record_types));
  }

  /**
   * @returns {Set<string>}
   */

  getTypesLinks() {
    return new Set(Object.keys(this.opts.link_types));
  }

  /**
   * @returns {Set<string>}
   */

  getRecordMetas() {
    return new Set(this.opts.record_metas);
  }

  /**
   * @param {string} type
   * @returns {'color'|'image'}
   */

  getFormatOfTypeRecord(type) {
    const validExtnames = new Set(['.jpg', '.jpeg', '.png']);

    const { fill } = this.opts['record_types'][type];
    if (validExtnames.has(path.extname(fill))) {
      return 'image';
    }
    return 'color';
  }
};

class ErrorConfig extends Error {
  constructor(message) {
    super(message);
    this.name = 'Error Config';
  }
}
