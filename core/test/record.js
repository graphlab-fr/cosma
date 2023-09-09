const fs = require('fs'),
  path = require('path'),
  { parse } = require('csv-parse/sync');

const assert = require('assert'),
  chai = require('chai'),
  chaiFs = require('chai-fs');

chai.use(chaiFs);
const should = chai.should();

const Record = require('../models/record'),
  Cosmocope = require('../models/cosmoscope'),
  Link = require('../models/link'),
  Config = require('../models/config'),
  Bibliography = require('../models/bibliography');

const { getTimestampTuple } = require('../utils/misc');

const { fetchBibliographyFiles } = require('../utils/generate'),
  { config: configFake, getRecords } = require('../utils/fake');

const tempFolderPath = path.join(__dirname, '../temp');

describe('Record', () => {
  describe('check', () => {
    it('should be invalid a record without title', () => {
      const record = new Record(undefined, undefined);
      assert.ok(record.isValid() === false);
    });

    it('should not be save without title', () => {
      const record = new Record(undefined, undefined);
      record.saveAsFile().catch(({ type }) => type === 'report');
    });

    it('should split tags strings in array', () => {
      assert.deepStrictEqual(
        new Record(undefined, 'the title', undefined, 'tag 1,tag 2'),
        new Record(undefined, 'the title', undefined, ['tag 1', 'tag 2']),
      );
      assert.deepStrictEqual(
        new Record(undefined, 'the title', undefined, ','),
        new Record(undefined, 'the title', undefined, []),
      );
    });

    it('should convert undefined type in array', () => {
      let record = new Record(undefined, 'the title', undefined);
      assert.deepStrictEqual(record.types, ['undefined']);
    });
  });

  describe('register', () => {
    it('should register only valid record types', () => {
      const record = new Record(
        undefined,
        'the title',
        ['important', 'done', 'invalid type'],
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        {
          record_types: {
            undefined: { fill: '#ccc', stroke: '#ccc' },
            important: { fill: '#ccc', stroke: '#ccc' },
            done: { fill: '#ccc', stroke: '#ccc' },
          },
        },
      );
      assert.deepStrictEqual(record.types, ['important', 'done', 'undefined']);
    });

    it('should register only valid link types', () => {
      const record = new Record(
        undefined,
        'the title',
        undefined,
        undefined,
        undefined,
        undefined,
        [
          {
            context: 'lorem ipsum',
            type: 'g',
            source: { id: 1, title: 'Record 1' },
            target: { id: 2, title: 'Record 2' },
          },
          {
            context: 'lorem ipsum',
            type: 'invalid type',
            source: { id: 3, title: 'Record 3' },
            target: { id: 4, title: 'Record 4' },
          },
        ],
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        {
          link_types: {
            undefined: { stroke: 'double', color: '#ccc' },
            g: { stroke: 'simple', color: '#ccc' },
          },
        },
      );
      const links = Link.getLinksFromRecords([record]);
      assert.deepEqual(links, [
        {
          id: 0,
          context: 'lorem ipsum',
          type: 'g',
          shape: { stroke: 'simple', dashInterval: null },
          color: '#ccc',
          colorHighlight: Config.base.graph_highlight_color,
          source: 1,
          target: 2,
          report: [],
        },
        {
          id: 1,
          context: 'lorem ipsum',
          type: 'undefined',
          shape: { stroke: 'double', dashInterval: null },
          color: '#ccc',
          colorHighlight: Config.base.graph_highlight_color,
          source: 3,
          target: 4,
          report: [],
        },
      ]);
    });
  });

  describe('ymlFrontMatter', () => {
    it('should have a today identifier', () => {
      const recordIdAsString = new Record(undefined, 'the title').id.toString();
      const year = recordIdAsString.substring(0, 4);
      const month = recordIdAsString.substring(4, 6);
      const day = recordIdAsString.substring(6, 8);
      const hour = recordIdAsString.substring(8, 10);
      const minute = recordIdAsString.substring(10, 12);
      const second = recordIdAsString.substring(12, 14);
      assert.strictEqual(
        new Date(`${[year, month, day].join('-')} ${[hour, minute, second].join(':')}`).toString(),
        new Date().toString(),
      );
    });

    it('should be render a string from some attributes', () => {
      const recordId = Record.generateId();
      let recordYmlFrontMatter = new Record(
        recordId,
        'the title',
        undefined,
        ['tag 1', 'tag 2'],
        undefined,
        'the content',
        undefined,
        undefined,
        undefined,
        undefined,
        Bibliography.getBibliographicRecordsFromList(['author1', 'author2']),
        'image.jpg',
      ).ymlFrontMatter;

      let recordYmlFrontMatterExpected = `---
title: the title
id: "${recordId}"
types:
  - undefined
tags:
  - tag 1
  - tag 2
references:
  - author1
  - author2
thumbnail: image.jpg
---

`;
      assert.strictEqual(recordYmlFrontMatter, recordYmlFrontMatterExpected);

      recordYmlFrontMatter = new Record(
        recordId,
        'the title',
        ['type 1', 'type 2'],
        [],
        {
          name: 'Guillaume',
          lastname: 'Brioudes',
          foo: null,
          bar: undefined,
          isDead: false,
          ignored: 'not in result',
        },
        'the content',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        {
          record_types: {
            undefined: { fill: 'gray', stroke: 'gray' },
            'type 1': { fill: 'yellow', stroke: 'yellow' },
            'type 2': { fill: 'green', stroke: 'green' },
          },
          record_metas: ['name', 'lastname', 'isDead'],
        },
      ).ymlFrontMatter;

      recordYmlFrontMatterExpected = `---
title: the title
id: "${recordId}"
types:
  - type 1
  - type 2
name: Guillaume
lastname: Brioudes
isDead: false
---

`;
      assert.strictEqual(recordYmlFrontMatter, recordYmlFrontMatterExpected);
    });
  });

  describe('File save', () => {
    let record;

    const content = 'Lorem ipsum dolor est',
      recordConfig = { files_origin: tempFolderPath },
      fileName = 'my-record.md',
      filePath = path.join(tempFolderPath, fileName);

    before(() => {
      if (fs.existsSync(tempFolderPath) === false) {
        fs.mkdirSync(tempFolderPath);
      }
    });

    afterEach(() => {
      fs.unlinkSync(filePath);
    });

    it('should save the record as file on temp folder', async () => {
      record = new Record(
        undefined,
        'My record',
        undefined,
        undefined,
        undefined,
        content,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        recordConfig,
      );
      await record.saveAsFile(true);
      filePath.should.be.a.file();
    });

    it('should save the record with a clean file name', async () => {
      record = new Record(
        undefined,
        'My [@récörd?!]',
        undefined,
        undefined,
        undefined,
        content,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        recordConfig,
      );
      await record.saveAsFile(true);
      filePath.should.be.a.file();
    });

    it('should save warn file overwritting', async () => {
      record = new Record(
        undefined,
        'My record',
        undefined,
        undefined,
        undefined,
        content,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        recordConfig,
      );
      await record.saveAsFile();
      record.saveAsFile().catch(({ type }) => {
        type.should.be.equal('overwriting');
      });
    });

    it('should save record content', async () => {
      record = new Record(
        undefined,
        'My record',
        undefined,
        undefined,
        undefined,
        content,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        recordConfig,
      );
      await record.saveAsFile();
      const fileContent = record.getYamlFrontMatter() + content;
      filePath.should.be.a.file().with.content(fileContent);
    });
  });

  describe('Batch', () => {
    const line = {
      title: 'Paul Otlet',
      'type:étude': 'documentation',
      'type:relation': 'ami',
      'tag:genre': 'homme',
      'content:biography': 'Lorem ipsum...',
      'content:notes': 'Lorem ipsum...',
      'meta:prenom': 'Paul',
      'meta:nom': 'Otlet',
      'meta:useless': '',
      'time:begin': '1868',
      'time:end': '1944',
      thumbnail: 'photo.jpg',
      references: 'otlet1934,otlet1934',
    };

    it('should format minimal line in deep for batch', () => {
      assert.deepStrictEqual(
        Record.getDeepFormatedDataFromCsvLine({
          title: 'Paul Otlet',
          type: 'documentation',
          tag: 'homme',
          content: 'Lorem ipsum...',
          thumbnail: 'photo.jpg',
          references: 'otlet1934',
        }),
        {
          id: undefined,
          title: 'Paul Otlet',
          type: {
            undefined: 'documentation',
          },
          metas: {},
          tags: {
            undefined: 'homme',
          },
          time: {
            begin: undefined,
            end: undefined,
          },
          content: {
            undefined: 'Lorem ipsum...',
          },
          thumbnail: 'photo.jpg',
          references: ['otlet1934'],
        },
      );
    });

    it('should format line in deep for batch', () => {
      assert.deepStrictEqual(Record.getDeepFormatedDataFromCsvLine(line), {
        id: undefined,
        title: 'Paul Otlet',
        type: {
          étude: 'documentation',
          relation: 'ami',
        },
        metas: {
          prenom: 'Paul',
          nom: 'Otlet',
        },
        tags: {
          genre: 'homme',
        },
        time: {
          begin: '1868',
          end: '1944',
        },
        content: {
          biography: 'Lorem ipsum...',
          notes: 'Lorem ipsum...',
        },
        thumbnail: 'photo.jpg',
        references: ['otlet1934', 'otlet1934'],
      });
    });

    it('should format line for batch', () => {
      assert.deepStrictEqual(Record.getFormatedDataFromCsvLine(line), {
        id: undefined,
        title: 'Paul Otlet',
        types: ['documentation', 'ami'],
        metas: {
          prenom: 'Paul',
          nom: 'Otlet',
        },
        tags: ['homme'],
        begin: '1868',
        end: '1944',
        content: `<h3>biography</h3>\n\nLorem ipsum...\n\n<h3>notes</h3>\n\nLorem ipsum...`,
        thumbnail: 'photo.jpg',
        references: ['otlet1934', 'otlet1934'],
      });
    });

    it('should format line for batch with several syntaxes', () => {
      const line = Record.getFormatedDataFromCsvLine({
        title: 'Paul Otlet',
        'type:domaine': 'type 1',
        type: 'type 2',
        tag: 'tag 1',
        tag: 'tag 2',
      });

      line.should.property('types').deep.equal(['type 1', 'type 2']);
      line.should.property('tags').deep.equal(['tag 2']);
    });

    it('should convert dataset to record', () => {
      const data = [Record.getFormatedDataFromCsvLine(line)];
      const config = new Config({
        record_types: {
          undefined: Config.base.record_types['undefined'],
          documentation: Config.base.record_types['undefined'],
          ami: Config.base.record_types['undefined'],
        },
        record_metas: ['nom'],
      });

      const [record] = Record.formatedDatasetToRecords(data, [], config);
      record.title.should.equal(line.title);
      record.types.should.contains.members([line['type:relation'], line['type:étude']]);
      record.tags.should.contains.members([line['tag:genre']]);
      record.metas.should.deep.equal({ nom: line['meta:nom'] });
    });

    describe('make file', () => {
      const fileName = 'Paul Otlet';
      const filePath = path.join(tempFolderPath, Record.getSlugFileName(fileName));
      afterEach(() => {
        fs.unlinkSync(filePath);
      });

      it('should batch a file from formated (csv) data', async () => {
        const opts = { files_origin: tempFolderPath, record_metas: ['prenom', 'nom'] };
        const csv = parse(
          `title     ,content ,type:nature,type:field,meta:prenom,meta:nom,meta:ignored,tag:genre,time:begin,time:end,thumbnail,references
                     Paul Otlet,Lorem...,Personne   ,Histoire  ,Paul       ,Otlet   ,toto        ,homme    ,1868      ,1944    ,image.png,otlet1934`,
          { columns: true, trim: true, rtrim: true, skip_empty_lines: true },
        );
        const data = csv.map((line) => Record.getFormatedDataFromCsvLine(line));
        const index = Cosmocope.getIndexToMassSave(tempFolderPath);
        await Record.massSave(data, index, opts);

        filePath.should.be.a.file();

        const files = Cosmocope.getFromPathFiles(tempFolderPath);
        const record = Cosmocope.getRecordsFromFiles(files, opts).find(
          ({ title }) => title === fileName,
        );
        assert.deepEqual(record, {
          ...record,
          title: 'Paul Otlet',
          content: '\n\nLorem...',
          metas: { prenom: 'Paul', nom: 'Otlet' },
          thumbnail: 'image.png',
        });
        record.bibliographicRecords[0].ids.should.to.deep.equal(new Set(['otlet1934']));
      });

      it('should batch a file from data', async () => {
        const minimalData = [
          {
            title: 'Paul Otlet',
          },
        ];
        const index = Cosmocope.getIndexToMassSave(tempFolderPath);
        await Record.massSave(minimalData, index, { files_origin: tempFolderPath });

        filePath.should.be.a.file();
      });

      it('should batch a file from data', async () => {
        const data = [
          {
            title: 'Paul Otlet',
            type: ['Personne', 'Histoire'],
            metas: {
              prenom: 'Paul',
              nom: 'Otlet',
            },
            tags: ['documentation'],
            begin: '1868',
            end: '1944',
            content: 'Lorem...',
            thumbnail: 'image.jpg',
            references: ['otlet1934'],
          },
        ];
        const index = Cosmocope.getIndexToMassSave(tempFolderPath);
        await Record.massSave(data, index, { files_origin: tempFolderPath });

        filePath.should.be.a.file();
      });
    });
  });

  describe('record id generation', () => {
    it('should generate 14 caracters string', () => {
      assert.strictEqual(Record.generateId().length, 14);
    });

    describe('timestamp to date', () => {
      it('should return a valid date for a 14 caracters number identifier', () => {
        const id = '20210619091954';
        const date = Record.getDateFromId(id);
        assert.strictEqual(id, getTimestampTuple(date).join(''));
      });

      it('should return undefined for 14 caracters string identifier', () => {
        const date = Record.getDateFromId('string_identifer');
        assert.strictEqual(date, undefined);
      });
    });

    describe('out daily', () => {
      it('should generate id with increment', () => {
        assert.strictEqual(Record.generateOutDailyId().length, 14);

        const [year, month, day] = getTimestampTuple();

        assert.strictEqual(Record.generateOutDailyId(), year + month + day + '24' + '60' + '60');
        assert.strictEqual(Record.generateOutDailyId(-1), year + month + day + '24' + '60' + '60');

        const increment = 10;
        assert.strictEqual(
          Record.generateOutDailyId(increment),
          year + month + day + (246060 + increment).toString(),
        );

        const maxIncrement = 753939;
        assert.strictEqual(
          Record.generateOutDailyId(maxIncrement),
          year + month + day + (246060 + maxIncrement).toString(),
        );

        const errorIncrement = maxIncrement + 1;
        (function () {
          Record.generateOutDailyId(errorIncrement);
        }).should.throw(Error);
      });
    });
  });

  describe('bibliography', () => {
    let bibliography;

    before(() => {
      return new Promise((resolve) => {
        fetchBibliographyFiles().then(() => {
          const { bib, cslStyle, xmlLocal } =
            Bibliography.getBibliographicFilesFromConfig(configFake);
          bibliography = new Bibliography(bib, cslStyle, xmlLocal);
          resolve();
        });
      });
    });

    const content = 'Molestiae [@Cockburn_2002, 10] architecto quisquam ducimus [@Brooks_1983, 2].';

    it('should replace content and context of links and backlinks', () => {
      const fakeRecords = getRecords(1);
      const record = fakeRecords[0];
      record.content = content;
      record.links = [
        {
          ...record.links[0],
          context: ['Molestiae [@Cockburn_2002, 10]'], // part of content
        },
      ];
      record.backlinks = [
        {
          ...record.backlinks[0],
          context: ['Lorem ipsum dolor sit amet [@Clements_2003, 5]'], // from another content
        },
      ];
      record.bibliographicRecords = Bibliography.getBibliographicRecordsFromText(content);

      record.replaceBibliographicText(bibliography);
      record.content
        .replace(/\s/g, ' ') // remove special whitespaces
        .should.to.include('(Brooks 1983, p. 2)');

      record.links[0].context[0].replace(/\s/g, ' ').should.to.include('(Cockburn 2002, p. 10)');

      record.backlinks[0].context[0]
        .replace(/\s/g, ' ')
        .should.to.include('(Clements et al. 2003, p. 5)');
    });
  });
});
