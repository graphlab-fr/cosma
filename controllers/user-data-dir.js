const fs = require('fs');

const Config = require('../core/models/config');

module.exports = function () {
  if (fs.existsSync(Config.configDirPath)) {
    console.log(
      'User data directory already exists at',
      ['\x1b[2m', Config.configDirPath, '\x1b[0m'].join(''),
    );
  } else {
    fs.mkdir(Config.configDirPath, { recursive: true }, (err) => {
      if (err) {
        console.error(
          ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
          'cannot create user data directory: ' + err,
        );
      }
      console.log(
        ['\x1b[32m', 'User data directory created at', '\x1b[0m'].join(''),
        ['\x1b[2m', Config.configDirPath, '\x1b[0m'].join(''),
      );
    });
  }
};
