const assert = require('assert'),
  should = require('chai').should();

const fs = require('fs'),
  path = require('path'),
  yml = require('yaml');

const Config = require('../models/config'),
  { fetchBibliographyFiles } = require('../utils/generate');

describe('Config', () => {
  const tempFolderPath = path.join(__dirname, '../temp');

  describe('base', () => {
    it('should not be mutable', () => {
      const option = 'node_size_method';
      const validValue = Config.base[option];
      const invalidValue = 'invalid value';
      const config = new Config({
        [option]: invalidValue,
      });
      Config.base[option] = invalidValue;
      Config.base.should.have.property(option).and.to.be.equal(validValue);
    });
  });

  describe('config report array', () => {
    it('should be empty with base config', () => {
      const config = new Config(Config.base);
      config.report.should.be.empty;
    });
  });

  describe('url validator', () => {
    it('should return false if empty', () => Config.isValidUrl('').should.be.false);
    it('should return false if juste a curious word', () =>
      Config.isValidUrl('wrong').should.be.false);
    it('should return false if no protocol', () => Config.isValidUrl('site.com').should.be.false);
    it('should return true for valid and existing website', () =>
      Config.isValidUrl('https://myllaume.fr/').should.be.true);
  });

  describe('path validator', () => {
    it('should return false if empty', () => Config.isValidPath('').should.be.false);
    it('should return false if undefined or null', () => {
      Config.isValidPath(undefined).should.be.false;
      Config.isValidPath(null).should.be.false;
    });
    it('should return true if real path', () => Config.isValidPath(tempFolderPath).should.be.true);
  });

  describe('number validator', () => {
    const optionName = 'node_size';
    it('should return false if string', () => Config.isValidNumber(optionName, '').should.be.false);
    it('should return false if to lower number', () =>
      Config.isValidNumber(optionName, Config.minValues[optionName] - 1).should.be.false);
    it('should return true for a minimal number', () =>
      Config.isValidNumber(optionName, Config.minValues[optionName]).should.be.true);
  });

  describe('view validator', () => {
    it('should return false if not object', () => Config.isValidViews(100).should.be.false);
    it('should return false if not object', () => {
      const viewJson = {
        recordId: 20220114171220,
        filters: ['idée'],
        focus: {
          fromRecordId: 20220114171220,
          level: 1,
        },
      };
      const viewDecodeKey = JSON.stringify(viewJson);
      const viewEncodeKey = Buffer.from(viewDecodeKey, 'utf-8').toString('base64');
      Config.isValidViews({ test: viewEncodeKey }).should.be.true;
    });
  });

  describe('record filters validator', () => {
    it('should return false if invalid meta', () => {
      Config.isValidRecordFilters([
        {
          meta: 'invalid',
          value: 'foo',
        },
      ]).should.be.false;
    });
    it('should return false if invalid value', () => {
      Config.isValidRecordFilters([
        {
          meta: 'type',
          value: '' || undefined || null,
        },
      ]).should.be.false;
    });
    it('should return true if empty', () => Config.isValidRecordFilters([]).should.be.true);
  });

  describe('type record checker', () => {
    it('should return false because undefined is unset', () => {
      Config.isValidRecordTypes({
        other: { fill: 'image.jpg', stroke: 'purple' },
      }).should.be.false;
    });
    it('should return false because unset fill or stroke', () => {
      Config.isValidRecordTypes({
        ...Config.base['record_types'],
        other: { fill: 'image.jpg' },
      }).should.be.false;
      Config.isValidRecordTypes({
        ...Config.base['record_types'],
        other: { stroke: 'image.jpg' },
      }).should.be.false;
    });
    it('should return true because valid object', () => {
      Config.isValidRecordTypes({
        undefined: { fill: 'orange', stroke: 'blue' },
        other: { fill: 'image.jpg', stroke: 'purple' },
      }).should.be.true;
    });
  });

  describe('type link checker', () => {
    it('should return false because undefined is unset', () => {
      Config.isValidLinkTypes({
        other: { color: 'purple', stroke: 'simple' },
      }).should.be.false;
    });
    it('should return false because unset color or stroke', () => {
      Config.isValidLinkTypes({
        ...Config.base['link_types'],
        other: { color: 'orange' },
      }).should.be.false;
      Config.isValidLinkTypes({
        ...Config.base['link_types'],
        other: { stroke: 'simple' },
      }).should.be.false;
    });
    it('should return false because invalid stroke', () => {
      Config.isValidLinkTypes({
        ...Config.base['link_types'],
        other: { color: 'orange', stroke: 'INVALID' },
      }).should.be.false;
    });
    it('should return true for valid object', () => {
      Config.isValidLinkTypes({
        undefined: { color: 'orange', stroke: 'simple' },
        other: { color: 'gray', stroke: 'dotted' },
      }).should.be.true;
    });
  });

  describe('get fake config', () => {
    const fakeConfigPath = path.join(__dirname, '../static/fake/config.yml');
    const fakeConfig = Config.get(fakeConfigPath);
    let fakeFileOpts;
    before(() => {
      return new Promise((resolve) => {
        fs.readFile(fakeConfigPath, 'utf8', (err, data) => {
          data = yml.parse(data);
          fakeFileOpts = data;
          resolve();
        });
      });
    });

    it('should be match with file content', () => {
      Object.keys(fakeFileOpts).forEach((opt) =>
        assert.deepStrictEqual(fakeFileOpts[opt], fakeConfig.opts[opt]),
      );
    });
    it('should be a valid config', () => {
      fakeConfig.report.should.be.empty;
      fakeConfig.isValid().should.be.true;
    });
  });

  describe('fix config', () => {
    it('should get the base option for an invalid option', () => {
      const option = 'node_size_method';
      const config = new Config({
        [option]: 'invalid value',
      });
      config.opts.should.have.property(option).and.to.be.equal(Config.base[option]);
    });
  });

  describe('get sample config', () => {
    it('should be a valid config', () => {
      const config = new Config(Config.getSampleConfig());
      config.report.should.be.empty;
      config.isValid().should.be.true;
    });
  });

  describe('can citeproc', () => {
    let bibliographyFiles;
    before(() => {
      return new Promise(async (resolve) => {
        bibliographyFiles = await fetchBibliographyFiles();
        bibliographyFiles = bibliographyFiles.map(([url, fileName]) =>
          path.join(tempFolderPath, fileName),
        );
        resolve();
      });
    });

    it('should be true with fake files', () => {
      const [csl, csl_locale] = bibliographyFiles;
      const config = new Config({
        bibliography: path.join(__dirname, '../static/fake/bib.json'),
        csl,
        csl_locale,
      });
      config.canCiteproc().should.be.true;
    });
  });

  describe('can custom css', () => {
    it('should be true with fake CSS file', () => {
      const config = new Config({
        css_custom: path.join(__dirname, '../static/fake/style.css'),
      });
      config.canCssCustom().should.be.true;
    });
  });

  describe('can modelize', () => {
    const fixtureDirPath = path.join(__dirname, './fixture');

    describe('from directory', () => {
      it('should be true with fake path', () => {
        const config = new Config({
          files_origin: fixtureDirPath,
        });
        config.canModelizeFromDirectory().should.be.true;
      });
    });

    describe('from csv files', () => {
      it('should be true with fake path', () => {
        const config = new Config({
          nodes_origin: path.join(fixtureDirPath, 'nodes.csv'),
          links_origin: path.join(fixtureDirPath, 'links.csv'),
        });
        config.canModelizeFromCsvFiles().should.be.true;
      });
    });
  });
});
