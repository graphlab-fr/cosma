const { expect } = require('chai');

const Config = require('../models/config-cli');

describe('ConfigCli', () => {
  describe('file slug', () => {
    it('should return a ".yml" file', () => {
      const slugifyName = Config.getSlugConfigFileName('toto');
      expect(slugifyName).equal('toto.yml');
    });

    it('should lower case', () => {
      const slugifyName = Config.getSlugConfigFileName('TOTO');
      expect(slugifyName).equal('toto.yml');
    });

    it('should remove dangerous caracters', () => {
      const names = [
        ['t@t@', 'tt'],
        ['té', 'te'],
        ['ÿe', 'ye'],
        ['tô', 'to'],
      ];
      for (const [actual, expected] of names) {
        expect(Config.getSlugConfigFileName(actual)).equal(`${expected}.yml`);
      }
    });

    it('should remove spaces', () => {
      const slugifyName = Config.getSlugConfigFileName('to to');
      expect(slugifyName).equal('to-to.yml');
    });
  });

  describe('current used config file', () => {
    it('should not be set for invalid value (empty strings, arrays…)', () => {
      expect(() => Config.setCurrentUsedConfigFileName('')).to.throw(Error);
      expect(() => Config.setCurrentUsedConfigFileName(['file.yml'])).to.throw(Error);
    });
  });
});
