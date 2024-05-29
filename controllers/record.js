/**
 * @file Prompt config and questions to create record
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 Cosma's authors
 */

const Config = require('../core/models/config'),
  Record = require('../core/models/record');
const readline = require('readline');

const createRecord = require('./create-record');

(async () => {
  const config = Config.get(Config.configFilePath);

  console.log(config.getConfigConsolMessage());

  if (config.canSaveRecords() === false) {
    console.error(
      ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
      'Unable to create record: missing value for files_origin in the configuration file',
    );
    return;
  }

  const metas = {};
  let saveIdOnYmlFrontMatter = config.opts['generate_id'] === 'always';

  // activate terminal questionnaire
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  // questions :

  try {
    if (config.opts['generate_id'] === 'ask') {
      await new Promise((resolve) => {
        rl.question(`Generate ID? (y/n): `, (answer) => {
          if (answer === 'y') {
            saveIdOnYmlFrontMatter = true;
          }

          resolve(answer);
        });
      });
    }

    metas.title = await new Promise((resolve, reject) => {
      rl.question(`${['\x1b[1m', 'title', '\x1b[0m'].join('')} (required): `, (answer) => {
        if (answer.trim() === '') {
          reject('Title is required');
        }

        resolve(answer);
      });
    });

    metas.type = await new Promise((resolve, reject) => {
      rl.question(
        `${['\x1b[1m', 'type', '\x1b[0m'].join(
          '',
        )} (optional; enter as comma-separated values; if left blank, will be set as "undefined"): `,
        (answer) => {
          if (answer.trim() === '') {
            answer = 'undefined';
          }

          resolve(answer);
        },
      );
    });

    metas.tags = await new Promise((resolve, reject) => {
      rl.question(
        `${['\x1b[1m', 'tags', '\x1b[0m'].join('')} (optional; enter as comma-separated values): `,
        (answer) => {
          resolve(answer.trim());
        },
      );
    });

    rl.close();

    createRecord(metas.title, metas.type, metas.tags, config, saveIdOnYmlFrontMatter);
  } catch (err) {
    console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err);
    rl.close();
  }
})();
