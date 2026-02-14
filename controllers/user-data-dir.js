import fs from 'node:fs';
import Config from '../core/models/config.js';

function makeUserDataDir() {
  if (fs.existsSync(Config.configDirPath)) {
    console.log(
      'User data directory already exists at',
      ['\x1b[2m', Config.configDirPath, '\x1b[0m'].join(''),
    );
    return;
  }

  try {
    fs.mkdirSync(Config.configDirPath, { recursive: true });
    console.log(
      ['\x1b[32m', 'User data directory created at', '\x1b[0m'].join(''),
      ['\x1b[2m', Config.configDirPath, '\x1b[0m'].join(''),
    );
  } catch (err) {
    console.error(
      ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
      'cannot create user data directory: ' + err,
    );
  }
}

export default makeUserDataDir;
