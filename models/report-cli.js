/**
 * @file Report saving for CLI interface
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 Cosma's authors
 */

const path = require('path'),
  fs = require('fs');

const Report = require('../core/models/report');

const envPaths = require('env-paths');
const { log: envPathLogDir } = envPaths('cosma-cli', { suffix: '' });

module.exports = class ReportCli extends Report {
  static pathDir = path.join(envPathLogDir, 'logs');

  /**
   * @param {string} projectTitle
   * @returns {Promise<string>}
   */

  static save(projectTitle) {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(ReportCli.pathDir) === false) {
        reject('Can not save report: dir does not exist');
      }
      const pathSave = path.join(ReportCli.pathDir, `${ReportCli.generateTimestamp()}.html`);
      fs.writeFile(pathSave, Report.getAsHtmlFile(projectTitle), (err) => {
        if (err) {
          reject(err.message);
        }
        resolve(pathSave);
      });
    });
  }

  static makeDir() {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(ReportCli.pathDir)) {
        resolve();
      }
      fs.mkdir(ReportCli.pathDir, { recursive: true }, (err) => {
        if (err) {
          reject(err.message);
        }
        resolve();
      });
    });
  }

  /**
   * Get a number (14 caracters) from the time stats :
   * year + month + day + hour + minute + second
   * @return {string}
   */

  static generateTimestamp() {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().padStart(4, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hour = currentDate.getHours().toString().padStart(2, '0');
    const minute = currentDate.getMinutes().toString().padStart(2, '0');
    const second = currentDate.getSeconds().toString().padStart(2, '0');
    const idAsString = [year, month, day, hour, minute, second].join('');
    return idAsString;
  }
};
