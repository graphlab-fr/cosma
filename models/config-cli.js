/**
 * @file Configuration administration for CLI interface
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

/**
 * @typedef FilesList
 * @type {object}
 * @property {string} fileName
 * @property {string} filePath
 */

const path = require('path'),
  fs = require('fs'),
  slugify = require('slugify');

const Config = require('../core/models/config');

const envPaths = require('env-paths');
const { data: envPathDataDir } = envPaths('cosma-cli', { suffix: '' });

module.exports = class ConfigCli extends Config {
  static pathConfigDir = envPathDataDir;
  static pathConfigFile = {
    fromConfigDir: path.join(ConfigCli.pathConfigDir, 'defaults.yml'),
    fromInstallationDir: path.join(__dirname, '../', 'defaults.yml'),
    fromExecutionDir: path.join(process.cwd(), 'config.yml'),
  };

  static currentUsedConfigFileName = 'default.yml';

  /** @type {'global'|'local'} */
  static currentScope = 'global';

  /**
   *
   * @param {string} inputFileName
   * @returns
   * @throws {Error} If invalid string in parameter or nowhere config file
   */

  static setCurrentUsedConfigFileName(inputFileName) {
    if (!inputFileName || typeof inputFileName !== 'string') {
      throw new Error('The targeted config file name is invalid.');
    }
    inputFileName = path.extname(inputFileName) === '.yml' ? inputFileName : `${inputFileName}.yml`;
    const list = ConfigCli.getConfigFileListFromConfigDir();
    const target = list.find(({ fileName }) => fileName === inputFileName);
    if (target) {
      ConfigCli.currentUsedConfigFileName = target.fileName;
    } else {
      throw new Error('The targeted config file name does not exist.');
    }
  }

  /**
   * @param {string} fileName
   * @returns {string}
   * @exemple
   * ```
   * ConfigCli.getSlugConfigFileName('mÿ Config') // => 'my-config.yml'
   * ```
   */

  static getSlugConfigFileName(fileName) {
    const slugName = slugify(fileName, {
      replacement: '-',
      lower: true,
      remove: /[&*+=~'"!?:@#$%^(){}\[\]\\/]/g,
    });
    return slugName + '.yml';
  }

  /**
   * Get the config file path that contains defaults options value
   * @returns {string}
   * @static
   */

  static getDefaultConfigFilePath() {
    if (fs.existsSync(ConfigCli.pathConfigFile.fromConfigDir)) {
      return ConfigCli.pathConfigFile.fromConfigDir;
    }
    return ConfigCli.pathConfigFile.fromInstallationDir;
  }

  /**
   * Get list of config files from user data directory
   * @returns {FilesList[]}
   * @throws {Error} If user data directory does not exist or FS error
   */

  static getConfigFileListFromConfigDir() {
    if (fs.existsSync(ConfigCli.pathConfigDir) === false) {
      throw new Error('Cosma user data directory does not exist.');
    }
    let files;
    try {
      files = fs.readdirSync(ConfigCli.pathConfigDir, 'utf-8');
    } catch (error) {
      throw new Error('Can not list config files from user data directory.');
    }
    return files
      .filter((fileName) => path.extname(fileName) === '.yml')
      .map((fileName) => ({ fileName, filePath: path.join(ConfigCli.pathConfigDir, fileName) }));
  }

  /**
   * Get the config file path that contains options
   * from current dir (if there is a config.yml file) or defaults dir
   * @returns {string}
   * @static
   */

  static getConfigFilePath() {
    if (ConfigCli.currentUsedConfigFileName !== 'default.yml') {
      return path.join(ConfigCli.pathConfigDir, ConfigCli.currentUsedConfigFileName);
    }
    if (fs.existsSync(ConfigCli.pathConfigFile.fromExecutionDir)) {
      ConfigCli.currentScope = 'local';
      return ConfigCli.pathConfigFile.fromExecutionDir;
    }
    return ConfigCli.getDefaultConfigFilePath();
  }

  /**
   * Get config options from the (config file) path
   * @param {string} configFilePath Path to a config file
   * @return {object} Config option or base config (Config.base) if errors
   * @throws {ErrorConfig} Will throw an error if config file can not be read or parse
   */

  static get(configFilePath) {
    if (configFilePath === undefined || fs.existsSync(configFilePath) === false) {
      configFilePath = ConfigCli.getConfigFilePath();
    }
    return Config.get(configFilePath);
  }

  /**
   * Get config options from the default config file
   * @return {object} Config option or base config (Config.base) if errors
   * @throws {ErrorConfig} Will throw an error if config file can not be read or parse
   */

  static getDefaultConfig() {
    return Config.get(ConfigCli.getDefaultConfigFilePath());
  }

  constructor(opts = {}) {
    const configFilePath = ConfigCli.getConfigFilePath();
    let configFromFile = Config.get(configFilePath);
    opts = Object.assign({}, configFromFile, opts);
    super(opts, configFilePath);
  }

  getConfigConsolMessage() {
    const { version } = require('../package.json');
    let name = this.opts['title'] || null;
    if (this.path === ConfigCli.getDefaultConfigFilePath()) {
      name = 'Default';
    }
    const messageSections = [
      `[Cosma v.${version}]`,
      ['\x1b[4m', name, '\x1b[0m'].join(''),
      ['\x1b[2m', this.path, '\x1b[0m'].join(''),
    ];
    return messageSections.join(' ');
  }
};
