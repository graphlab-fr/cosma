import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import Config from '../core/models/config.js';
import { slugify } from '../core/utils/misc.js';

/**
 * Make config file on execution dir or global dir
 * @param {string} title Config name
 * @param {{ global: boolean }} options
 * @returns {void}
 */

function makeConfigFile(title, { global: isGlobal }) {
  isGlobal = !!isGlobal;

  if (isGlobal && fs.existsSync(Config.configDirPath) === false) {
    return console.log(
      ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
      'To create global configuration files, first create a user data directory by running',
      ['\x1b[1m', 'cosma --create-user-data-dir', '\x1b[0m'].join(''),
      '.',
    );
  }
  if (process.cwd() === Config.configDirPath && isGlobal === false) {
    return console.log(
      ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
      'Can not create local config file in global config directory.',
      'To create global config file, use "cosma config --global".',
    );
  }

  const isGlobalDefaultConfig = isGlobal && !title;

  let opts, configFilePath;

  if (isGlobalDefaultConfig) {
    opts = Config.base;
    configFilePath = Config.defaultConfigPath;
  } else {
    opts = Config.get(Config.defaultConfigPath).opts;
    configFilePath = isGlobal
      ? path.join(Config.configDirPath, slugify(title) + '.yml')
      : Config.executionConfigPath;
  }

  const { dir: configFileDir, base: configFileName } = path.parse(configFilePath);

  if (fs.existsSync(configFilePath)) {
    rl = readline.createInterface({ input: process.stdin, output: process.stdout });
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
    const config = new Config(opts);
    config.path = configFilePath;
    const isOk = config.save();

    if (isOk) {
      console.log(
        ['\x1b[32m', 'Configuration file created', '\x1b[0m'].join(''),
        `: ${['\x1b[2m', configFileDir, '/', '\x1b[0m', configFileName].join('')}`,
      );
    } else {
      console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'could not save configuration file');
    }
  }
}

export default makeConfigFile;
