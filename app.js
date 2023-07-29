#!/usr/bin/env node

/**
 * @file Addressing of terminal commands.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const commander = require('commander'),
  program = new commander.Command(),
  { version, description } = require('./package.json');

const Config = require('./models/config-cli');

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
        const list = Config.getConfigFileListFromConfigDir().map(({ fileName }) => fileName);
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
  .action(({ project: configFileName, ...rest }) => {
    if (configFileName) {
      try {
        Config.setCurrentUsedConfigFileName(configFileName);
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
  .action(({ project: configFileName }) => {
    if (configFileName) {
      try {
        Config.setCurrentUsedConfigFileName(configFileName);
      } catch (err) {
        console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err.message);
      }
    }
    console.log(new Config().getConfigConsolMessage());
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
    '-p, --project <name>',
    'Use the configuration file for project <name> from the user data directory.',
  )
  .action((title, type, tags, { project: configFileName }) => {
    if (configFileName) {
      try {
        Config.setCurrentUsedConfigFileName(configFileName);
      } catch (err) {
        console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err.message);
      }
    }
    console.log(new Config().getConfigConsolMessage());
    require('./controllers/autorecord')(title, type, tags);
  })
  .showHelpAfterError('("autorecord --help" for additional information)');

program
  .command('batch')
  .alias('b')
  .description('Create records (batch mode).')
  .argument('<file>', 'Path to a JSON file containing a list of records to be created.')
  .option(
    '-p, --project <name>',
    'Use the configuration file for project <name> from the user data directory.',
  )
  .action((filePath, { project: configFileName }) => {
    if (configFileName) {
      try {
        Config.setCurrentUsedConfigFileName(configFileName);
      } catch (err) {
        console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err.message);
      }
    }
    require('./controllers/batch')(filePath);
  })
  .showHelpAfterError('("batch --help" for additional information)');

program.showSuggestionAfterError();
program.parse();
