/**
 * @file Prompt config and questions to create record
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const Config = require('../core/models/config');
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

  let metas = {};

  // activate terminal questionnaire
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  // questions :

  try {
    metas.title = await new Promise((resolve, reject) => {
      rl.question(`${['\x1b[1m', 'title', '\x1b[0m'].join('')} (required): `, (answer) => {
        if (answer === '') {
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
          if (answer === '') {
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
          resolve(answer);
        },
      );
    });

    rl.close();

    createRecord(metas.title, metas.type, metas.tags, config);
  } catch (err) {
    console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err);
    rl.close();
  }
})();
