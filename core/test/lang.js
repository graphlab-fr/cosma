const assert = require('assert'),
  should = require('chai').should();

const path = require('path'),
  fs = require('fs'),
  yml = require('yaml');

const Config = require('../models/config');

/**
 * @todo Add test for check if each translation contains each Config.validLangages
 */

describe('Lang', () => {
  let langIndex;

  before(() => {
    return new Promise((resolve) => {
      fs.readFile(path.join(__dirname, '../i18n.yml'), 'utf8', (err, data) => {
        data = yml.parse(data);
        langIndex = data;
        resolve();
      });
    });
  });

  it('should get an error message for each config option', () => {
    langIndex.should.have.property('config');
    langIndex['config'].should.have.property('errors');
    const errorList = Object.keys(langIndex['config']['errors']);

    for (const optionName of Object.keys(Config.base)) {
      errorList.should.contains(optionName);
    }
  });
});
