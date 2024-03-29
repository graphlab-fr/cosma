#!/usr/bin/env node

/**
 * @file Addressing of terminal commands.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const commander = require('commander'),
  program = new commander.Command(),
  { version, description } = require('./package.json');

const Config = require('./core/models/config');

(() => {
  const fs = require('fs');

  if (fs.existsSync(Config.executionConfigPath)) {
    Config.configFilePath = Config.executionConfigPath;
    return;
  }

  Config.configFilePath = Config.defaultConfigPath;

  if (!fs.existsSync(Config.defaultConfigPath)) {
    console.log(
      ['\x1b[33m', 'Warn.', '\x1b[0m'].join(''),
      'No default or local config file to use.',
      'Cosma runs with factory config.',
      'Use "cosma config --help" for more info about create config file.',
    );
  }
})();

program.version(version);

program
  .name('cosma')
  .description(description)
  .usage('[command] [options]')
  .option('--create-user-data-dir', 'Create user data directory.')
  .option(
    '-l, --list-projects',
    'Display the names of projects (configuration files) saved in user data directory.',
  )
  .action(({ createUserDataDir, listProjects }) => {
    if (createUserDataDir) {
      require('./controllers/user-data-dir')();
    } else if (listProjects) {
      try {
        const list = Config.getConfigFilesListFromConfigDir().map(({ name }) => name);
        console.log(list.join('\n'));
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
    require('./controllers/config')(title, options);
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
    if (projectName) {
      try {
        Config.setConfigFilePathByProjectName(projectName);
      } catch (err) {
        console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err.message);
      }
    }
    require('./controllers/modelize')(rest);
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
    if (projectName) {
      try {
        Config.setConfigFilePathByProjectName(projectName);
      } catch (err) {
        console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err.message);
      }
    }
    require('./controllers/record');
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
    if (projectName) {
      try {
        Config.setConfigFilePathByProjectName(projectName);
      } catch (err) {
        console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err.message);
      }
    }
    require('./controllers/autorecord')(title, type, tags, saveIdOnYmlFrontMatter);
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
    if (projectName) {
      try {
        Config.setConfigFilePathByProjectName(projectName);
      } catch (err) {
        console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err.message);
      }
    }
    require('./controllers/batch')(filePath, saveIdOnYmlFrontMatter);
  })
  .showHelpAfterError('("batch --help" for additional information)');

program.showSuggestionAfterError();
program.parse();
