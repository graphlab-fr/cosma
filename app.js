#!/usr/bin/env node

/**
 * @file Addressing of terminal commands.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 Cosma's authors
 */

import fs from 'node:fs';
import { Command } from 'commander';
import Config from './core/models/config.js';
import app from './package.json';
import makeUserDataDir from './controllers/user-data-dir.js';
import makeConfigFile from './controllers/config.js';
import modelize from './controllers/modelize.js';
import makeRecord from './controllers/record.js';
import autorecord from './controllers/autorecord.js';
import batch from './controllers/batch.js';

process.title = app.name;

const program = new Command();

program.version(app.version);

program
  .name('cosma')
  .description(app.description)
  .usage('[command] [options]')
  .option('--create-user-data-dir', 'Create user data directory.')
  .option(
    '-l, --list-projects',
    'Display the names of projects (configuration files) saved in user data directory.',
  )
  .action(({ createUserDataDir, listProjects }) => {
    if (createUserDataDir) {
      makeUserDataDir();
    } else if (listProjects) {
      try {
        const list = Config.getConfigFilesListFromConfigDir().map(({ name }) => name);
        if (list.length > 0) {
          console.log(list.join('\n'));
        } else {
          console.log(
            'No projects found from global directory.',
            'Use "cosma config --global <name>" to create project.',
          );
        }
      } catch (err) {
        console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err.message);
      }
    } else {
      program.help(); // return full manual if no valid option is input
    }
  })
  .addHelpText(
    'after',
    `
Example call:
  cosma modelize --citeproc --custom-css
  cosma autorecord "My record" "concept" "tag 1,tag 2"
  cosma batch ~/Documents/data.json

Display command-specific help:
  cosma [command] --help`,
  );

program
  .command('config')
  .alias('c')
  .description('Create a configuration file in the current directory.')
  .argument('[name]', 'Configuration name.')
  .option('-g, --global', 'Create the file in the user data directory.')
  .action((title, options) => {
    makeConfigFile(title, options);
  });

program
  .command('modelize')
  .alias('m')
  .description('Create a cosmoscope.')
  .option(
    '-p, --project <name>',
    'Use the configuration file for project <name> from the user data directory.',
  )
  .option('--citeproc', 'Process citations.')
  .option('--custom-css', 'Apply custom CSS.')
  .option('--sample', 'Create a sample cosmoscope.')
  .option('--fake', 'Create a fake cosmoscope for testing purposes.')
  .action(({ project: projectName, ...rest }) => {
    setConfigFileToRun(projectName);
    modelize(rest);
  });

program
  .command('record')
  .alias('r')
  .description(
    'Create a record. You will be prompted for a record title (mandatory), record type and list of comma-separated tags.',
  )
  .option(
    '-p, --project <name>',
    'Use the configuration file for project <name> from the user data directory.',
  )
  .action(({ project: projectName }) => {
    setConfigFileToRun(projectName);
    makeRecord();
  });

program
  .command('autorecord')
  .alias('a')
  .description('Create a record (one-liner mode).')
  .argument('<title>', '(mandatory) Record title.')
  .argument('[type]', 'Record type (default value if skipped: undefined).')
  .argument('[tags]', 'List of comma-separated tags.')
  .option(
    '-id, --generate-id',
    'If config option generate_id = ask, get record with timestamp as id.',
  )
  .option(
    '-p, --project <name>',
    'Use the configuration file for project <name> from the user data directory.',
  )
  .action((title, type, tags, { project: projectName, generateId: saveIdOnYmlFrontMatter }) => {
    setConfigFileToRun(projectName);
    autorecord(title, type, tags, saveIdOnYmlFrontMatter);
  })
  .showHelpAfterError('("autorecord --help" for additional information)');

program
  .command('batch')
  .alias('b')
  .description('Create records (batch mode).')
  .argument('<file>', 'Path to a JSON file containing a list of records to be created.')
  .option(
    '-id, --generate-id',
    'If config option generate_id = ask, get record with timestamp as id.',
  )
  .option(
    '-p, --project <name>',
    'Use the configuration file for project <name> from the user data directory.',
  )
  .action((filePath, { project: projectName, generateId: saveIdOnYmlFrontMatter }) => {
    setConfigFileToRun(projectName);
    batch(filePath, saveIdOnYmlFrontMatter);
  })
  .showHelpAfterError('("batch --help" for additional information)');

program.showSuggestionAfterError();
program.parse();

/**
 * Set config file for current execution,
 * if unset or unknown project name, Cosma use execution path config file,
 * if does not exist, Cosma use defaut config file,
 * if does not exist, Cosma can not run.
 *
 * @param {string} projectName Global config file name to use
 */

function setConfigFileToRun(projectName) {
  if (projectName) {
    const list = Config.getConfigFilesListFromConfigDir();
    const target = list.find(({ name }) => name === projectName);
    if (target) {
      Config.configFilePath = target.filePath;
    } else {
      console.log(
        ['\x1b[33m', 'Warn.', '\x1b[0m'].join(''),
        `Project name "${projectName}" does not exist.`,
        'Check projects list with "cosma --list-projects"',
      );

      process.exit();
    }

    return;
  }

  if (!fs.existsSync(Config.executionConfigPath)) {
    if (!fs.existsSync(Config.defaultConfigPath)) {
      console.log(
        ['\x1b[33m', 'Warn.', '\x1b[0m'].join(''),
        'No default or local config file to use.',
        'Use "cosma config --help" for more info about create config file.',
      );

      process.exit();
    }

    // if no config file for current execution path, switch to default config file
    Config.configFilePath = Config.defaultConfigPath;
  }
}
