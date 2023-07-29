const assert = require('assert');

const Cosmocope = require('../models/cosmoscope');

describe('Cosmoscope', () => {
  describe('data from Yaml FrontMatter', () => {
    describe('id', () => {
      it('should get string from number', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
id: 20210901132906
---`,
          'path'
        );
        assert.strictEqual(result.metas.id, '20210901132906');
      });

      it('should get string from string', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
id: 'toto'
---`,
          'path'
        );
        assert.strictEqual(result.metas.id, 'toto');
      });

      it('should get string from date', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
id: 2012-05-12
---`,
          'path'
        );
        assert.strictEqual(result.metas.id, '2012-05-12');
      });
    });

    describe('content', () => {
      it('should get string', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
title: simple
---

toto et tata`,
          'path'
        );
        assert.strictEqual(result.content, '\n\ntoto et tata');
      });
    });

    describe('title', () => {
      it('should get string', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
title: simple
---`,
          'path'
        );
        assert.strictEqual(result.metas.title, 'simple');
      });

      it('should stringify date as YYYY-MM-DD', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
title: 2001-01-01
---`,
          'path'
        );
        assert.strictEqual(result.metas.title, '2001-01-01');
      });

      it('should stringify null', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
title: null
---`,
          'path'
        );
        assert.strictEqual(result.metas.title, 'null');
      });

      it('should stringify boolean', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
title: true
---`,
          'path'
        );
        assert.strictEqual(result.metas.title, 'true');
      });

      it('should stringify array', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
title: ['title', 'as', 'array']
---`,
          'path'
        );
        assert.strictEqual(result.metas.title, 'title,as,array');
      });
    });

    describe('type', () => {
      it('should keep array', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
type: ['toto', 'tata']
---`,
          'path'
        );
        assert.deepStrictEqual(result.metas.types, ['toto', 'tata']);
      });

      it('should get array from string', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
type: toto
---`,
          'path'
        );
        assert.deepStrictEqual(result.metas.types, ['toto']);
      });

      it('should get array contains "undefined" from empty string', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
type: 
---`,
          'path'
        );
        assert.deepStrictEqual(result.metas.types, ['undefined']);
      });

      it('should get array contains "undefined" from empty array', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
type: []
---`,
          'path'
        );
        assert.deepStrictEqual(result.metas.types, ['undefined']);
      });

      it('should skip falsy values from array', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
type: [false]
---`,
          'path'
        );
        assert.deepStrictEqual(result.metas.types, ['false']);
      });
    });

    describe('tags', () => {
      it('should keep array', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
tags: ['toto', 'tata']
---`,
          'path'
        );
        assert.deepStrictEqual(result.metas.tags, ['toto', 'tata']);
      });

      it('should keep "keywords" key value', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
keywords: ['toto', 'tata']
---`,
          'path'
        );
        assert.deepStrictEqual(result.metas.tags, ['toto', 'tata']);
      });
    });

    describe('references', () => {
      it('should keep array', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
references: ['toto', 'tata']
---`,
          'path'
        );
        assert.deepStrictEqual(result.metas.references, ['toto', 'tata']);
      });

      it('should stringify falsy values from array', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
references: [false]
---`,
          'path'
        );
        assert.deepStrictEqual(result.metas.references, ['false']);
      });

      it('should get array from string', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
references: tata
---`,
          'path'
        );
        assert.deepStrictEqual(result.metas.references, ['tata']);
      });

      it('should get empty array from empty string', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
references:
---`,
          'path'
        );
        assert.deepStrictEqual(result.metas.references, []);
      });
    });

    describe('other metas', () => {
      it('should keep "toto" key and value', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
toto: tata
---`,
          'path'
        );
        assert.deepStrictEqual(result.metas['toto'], 'tata');
      });
    });

    describe('begin, end', () => {
      it('should keep get number from date', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
begin: 1999
end: 2001
---`,
          'path'
        );
        assert.deepStrictEqual(result.metas['begin'], 915148800000);
        assert.deepStrictEqual(result.metas['end'], 978307200000);
      });

      it('should get NaN for invalid date', () => {
        const result = Cosmocope.getDataFromYamlFrontMatter(
          `---
end:
---`,
          'path'
        );
        assert.deepStrictEqual(result.metas['begin'], NaN);
        assert.deepStrictEqual(result.metas['end'], NaN);
      });
    });
  });
});
