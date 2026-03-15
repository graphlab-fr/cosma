import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import Config from '../core/models/config.js';
import slugify from '../core/utils/slugify.js';

/**
 * Create a config file in the execution or global directory
 * @param {string} title Config name
 * @param {{ global: boolean }} options
 * @returns {void}
 */

function makeConfigFile(title, { global: isGlobal }) {
  const globalFlag = Boolean(isGlobal);

  // Early validations
  if (globalFlag && fs.existsSync(Config.configDirPath) === false) {
    console.log(
      ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
      'To create global configuration files, first create a user data directory by running',
      ['\x1b[1m', 'cosma --create-user-data-dir', '\x1b[0m'].join(''),
      '.',
    );
    return;
  }
  if (process.cwd() === Config.configDirPath && globalFlag === false) {
    console.log(
      ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
      'Cannot create a local config file in the global config directory.',
      'To create a global config file, use "cosma config --global".',
    );
    return;
  }

  const defaultConfigExists = Config.defaultConfigExists();
  const hasTitle = Boolean(title);

  let opts;
  let configSource;

  if (globalFlag && !hasTitle) {
    opts = Config.base;
    configSource = 'base';
  } else if (defaultConfigExists) {
    opts = Config.get(Config.defaultConfigPath).opts;
    configSource = 'default';
  } else {
    opts = Config.base;
    configSource = 'base';
  }

  // Note: title is only relevant for global configs (cosma config --global <name>)
  let configFilePath;
  let configScope;

  if (globalFlag && hasTitle) {
    configFilePath = path.join(Config.configDirPath, slugify(title) + '.yml');
    configScope = 'global';
  } else if (globalFlag && !hasTitle) {
    configFilePath = Config.defaultConfigPath;
    configScope = 'global default';
  } else {
    configFilePath = Config.executionConfigPath;
    configScope = 'local';
  }

  const { dir: configFileDir, base: configFileName } = path.parse(configFilePath);

  if (fs.existsSync(configFilePath)) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`Do you want to overwrite '${configFileName}' ? (y/n) `, async (answer) => {
      if (answer === 'y') {
        saveConfig();
      }
      rl.close();
    });
  } else {
    saveConfig();
  }

  function saveConfig() {
    const config = Config.getFrom(opts);

    try {
      fs.writeFileSync(configFilePath, config.getYaml());

      console.log(
        ['\x1b[32m', 'Configuration created', '\x1b[0m'].join(''),
        `: You are creating a ${['\x1b[1m', configScope, '\x1b[0m'].join('')} config`,
        `with parameters from ${['\x1b[1m', configSource, '\x1b[0m'].join('')}`,
      );
      console.log(
        ['\x1b[2m', 'Path', '\x1b[0m'].join(''),
        `: ${['\x1b[2m', configFileDir, '/', '\x1b[0m', configFileName].join('')}`,
      );
    } catch (error) {
      console.error(
        ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
        'Could not save configuration file: ',
        error?.message,
      );
    }
  }
}

export default makeConfigFile;
