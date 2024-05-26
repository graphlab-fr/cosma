import assert from 'assert';
import Cosmoscope from '../models/cosmoscope.js';

describe('Cosmoscope', () => {
  describe('data from Yaml FrontMatter', () => {
    describe('id', () => {
      it('should get string from number', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
id: 20210901132906
---`,
          'path',
        );
        assert.strictEqual(result.metas.id, '20210901132906');
      });

      it('should get string from string', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
id: 'toto'
---`,
          'path',
        );
        assert.strictEqual(result.metas.id, 'toto');
      });

      it('should get string from date', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
id: 2012-05-12
---`,
          'path',
        );
        assert.strictEqual(result.metas.id, '2012-05-12');
      });

      it('should get undefined', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
title: toto
---`,
          'path',
        );
        assert.strictEqual(result.metas.id, undefined);
      });
    });

    describe('content', () => {
      it('should get string', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
title: simple
---

toto et tata`,
          'path',
        );
        assert.strictEqual(result.content, '\n\ntoto et tata');
      });
    });

    describe('title', () => {
      it('should get string', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
title: simple
---`,
          'path',
        );
        assert.strictEqual(result.metas.title, 'simple');
      });

      it('should stringify date as YYYY-MM-DD', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
title: 2001-01-01
---`,
          'path',
        );
        assert.strictEqual(result.metas.title, '2001-01-01');
      });

      it('should stringify null', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
title: null
---`,
          'path',
        );
        assert.strictEqual(result.metas.title, 'null');
      });

      it('should stringify boolean', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
title: true
---`,
          'path',
        );
        assert.strictEqual(result.metas.title, 'true');
      });

      it('should stringify array', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
title: ['title', 'as', 'array']
---`,
          'path',
        );
        assert.strictEqual(result.metas.title, 'title,as,array');
      });

      it('should get undefined', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
id: toto
---`,
          'path',
        );
        assert.strictEqual(result.metas.title, undefined);
      });
    });

    describe('type', () => {
      it('should keep array', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
type: ['toto', 'tata']
---`,
          'path',
        );
        assert.deepStrictEqual(result.metas.types, ['toto', 'tata']);
      });

      it('should get array from string', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
type: toto
---`,
          'path',
        );
        assert.deepStrictEqual(result.metas.types, ['toto']);
      });

      it('should get array contains "undefined" from empty string', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
type: 
---`,
          'path',
        );
        assert.deepStrictEqual(result.metas.types, ['undefined']);
      });

      it('should get array contains "undefined" from empty array', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
type: []
---`,
          'path',
        );
        assert.deepStrictEqual(result.metas.types, ['undefined']);
      });

      it('should skip falsy values from array', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
type: [false]
---`,
          'path',
        );
        assert.deepStrictEqual(result.metas.types, ['false']);
      });
    });

    describe('tags', () => {
      it('should keep array', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
tags: ['toto', 'tata']
---`,
          'path',
        );
        assert.deepStrictEqual(result.metas.tags, ['toto', 'tata']);
      });

      it('should keep "keywords" key value', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
keywords: ['toto', 'tata']
---`,
          'path',
        );
        assert.deepStrictEqual(result.metas.tags, ['toto', 'tata']);
      });
    });

    describe('references', () => {
      it('should keep array', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
references: ['toto', 'tata']
---`,
          'path',
        );
        assert.deepStrictEqual(result.metas.references, ['toto', 'tata']);
      });

      it('should stringify falsy values from array', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
references: [false]
---`,
          'path',
        );
        assert.deepStrictEqual(result.metas.references, ['false']);
      });

      it('should get array from string', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
references: tata
---`,
          'path',
        );
        assert.deepStrictEqual(result.metas.references, ['tata']);
      });

      it('should get empty array from empty string', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
references:
---`,
          'path',
        );
        assert.deepStrictEqual(result.metas.references, []);
      });
    });

    describe('other metas', () => {
      it('should keep "toto" key and value', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
toto: tata
---`,
          'path',
        );
        assert.deepStrictEqual(result.metas['toto'], 'tata');
      });
    });

    describe('begin, end', () => {
      it('should keep get number from date', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
begin: 1999
end: 2001
---`,
          'path',
        );
        assert.deepStrictEqual(result.metas['begin'], 915148800000);
        assert.deepStrictEqual(result.metas['end'], 978307200000);
      });

      it('should get NaN for invalid date', () => {
        const result = Cosmoscope.getDataFromYamlFrontMatter(
          `---
end:
---`,
          'path',
        );
        assert.deepStrictEqual(result.metas['begin'], NaN);
        assert.deepStrictEqual(result.metas['end'], NaN);
      });
    });
  });
});
