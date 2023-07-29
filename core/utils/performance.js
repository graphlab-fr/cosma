const path = require('path');

const Cosmoscope = require('../models/cosmoscope'),
  Record = require('../models/record');

const { fetchSpreadsheets } = require('./generate');

const tempDirPath = path.join(__dirname, '../temp');

module.exports = async function () {
  fetchSpreadsheets().then(() => {
    Cosmoscope.getFromPathCsv(
      path.join(tempDirPath, 'nodes.csv'),
      path.join(tempDirPath, 'links.csv')
    )
      .then(async ([records, links]) => {
        Record.massSave(records, 1, { files_origin: tempDirPath }).then(async () => {
          console.time('Read async');
          const filesAsync = await Cosmoscope.getFromPathFilesAsync(tempDirPath);
          console.timeEnd('Read async');
          console.time('Read sync');
          const filesSync = Cosmoscope.getFromPathFiles(tempDirPath);
          console.timeEnd('Read sync');

          if (filesAsync.length !== filesSync.length) {
            console.error('Err. lengths are not equal');
          }
        });
      })
      .catch(console.error);
  });
};
