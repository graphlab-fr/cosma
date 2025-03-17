import readline from 'node:readline/promises';
import fsPromise from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';
import Bibliography from '../core/models/bibliography';
import Record from '../core/models/record';
import Config from '../core/models/config';

/**
 *
 * @param {string} reference
 */

export default async function referenceRecord() {
  const config = Config.get(Config.configFilePath);

  console.log(config.getConfigConsolMessage());

  if (!config.canSaveRecords()) {
    throw new Error(
      'Unable to create record: missing value for files_origin in the configuration file',
    );
  }

  if (!config.canCiteproc()) {
    throw new Error('Unable to create reference record: missing config');
  }

  const { bib, cslStyle, xmlLocal } = Bibliography.getBibliographicFilesFromConfig(config);
  const bibliography = new Bibliography(bib, cslStyle, xmlLocal);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const qReference = await rl.question(
    `${['\x1b[1m', 'reference', '\x1b[0m'].join('')} (required): `,
  );
  const reference = qReference.trim();

  if (reference === '') {
    throw new Error('Reference is required');
  }
  if (!bibliography.library[reference]) {
    throw new Error('Reference does not exist');
  }

  const qTitle = await rl.question(`${['\x1b[1m', 'title', '\x1b[0m'].join('')} (optional): `);
  const title = qTitle.trim() || reference;

  const qType = await rl.question(
    `${['\x1b[1m', 'type', '\x1b[0m'].join('')} (optional; enter as comma-separated values): `,
  );

  let types = [];
  if (qType.trim() !== '') {
    types = qType.split(',').map((t) => t.trim());
  }

  const qTags = await rl.question(
    `${['\x1b[1m', 'tags', '\x1b[0m'].join('')} (optional; enter as comma-separated values): `,
  );

  let tags = [];
  if (qTags.trim() !== '') {
    tags = qTags.split(',').map((t) => t.trim());
  }

  const record = Record.recordWithReference({
    id: reference,
    title,
    types,
    tags,
  });

  const fileName = record.getFileName();
  const filePath = path.join(config.opts['files_origin'], fileName);

  if (fs.existsSync(filePath)) {
    const qOverwrite = await rl.question(`Do you want to overwrite '${fileName}' ? (y/n) `);
    if (qOverwrite !== 'y') {
      rl.close();
      return;
    }
  }

  rl.close();

  await fsPromise.writeFile(filePath, record.getFileContent(true));

  const { dir: fileDir, base: fileNameBase } = path.parse(filePath);
  console.log(
    ['\x1b[32m', 'Record created', '\x1b[0m'].join(''),
    `: ${['\x1b[2m', fileDir, '/', '\x1b[0m', fileNameBase].join('')}`,
  );
}
