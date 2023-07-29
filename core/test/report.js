const assert = require('assert'),
  should = require('chai').should();

const Report = require('../models/report'),
  Config = require('../models/config'),
  Bibliography = require('../models/bibliography'),
  Graph = require('../models/graph'),
  Record = require('../models/record'),
  Link = require('../models/link'),
  Node = require('../models/node');

describe('Report', () => {
  const { fetchBibliographyFiles } = require('../utils/generate'),
    { config: configFake, bib } = require('../utils/fake');

  before('reset report list', () => {
    Report.listErrors.clear();
    Report.listWarnings.clear();
  });

  afterEach('reset report list', () => {
    Report.listErrors.clear();
    Report.listWarnings.clear();
  });

  it('should report about duplicated records', () => {
    const graph = new Graph([
      new Record(777, 'Record 1'),
      new Record(777, 'Record 3'),
      new Record(1, 'Record 4'),
    ]);
    Report.listErrors.size.should.be.equal(1);
    Report.listErrors.has(777).should.be.true;
    const report = Report.listErrors.get(777);
    report.should.have.length(1);
    const line = report[0];
    line.should.have.property('about').and.be.equal('duplicated_ids');
    const args = line.args;
    args.should.have.property('recordId').and.be.equal(777);
    args.should.have.property('recordTitle').and.be.equal('Record 3');
    args.should.have.property('recordTitleOfDuplicated').and.be.equal('Record 1');
  });

  it('should report about broken links', () => {
    Link.getReferencesFromLinks(
      1,
      [
        new Link(1, 'foo [[2]]', undefined, undefined, undefined, undefined, 1, 2),
        new Link(2, 'bar [[777]]', undefined, undefined, undefined, undefined, 1, 777),
      ],
      [new Node(1, 'node 1'), new Node(2, 'node 2')],
    );
    Report.listErrors.size.should.be.equal(1);
    Report.listErrors.has(1).should.be.true;
    const report = Report.listErrors.get(1);
    report.should.have.length(1);
    const line = report[0];
    line.should.have.property('about').and.be.equal('broken_links');
    const args = line.args;
    args.should.have.property('recordTitle').and.be.equal('node 1');
    args.should.have.property('linkContext').and.be.equal('bar [[777]]');
  });

  it('should report about record type change', () => {
    const opts = {
      link_types: {
        ...Config.base.link_types,
        foo: Config.base.link_types.undefined,
      },
    };
    const links = [
      { type: 'foo', target: { id: 1 } },
      { type: 'bar', target: { id: 2 } },
    ];
    new Record(
      1,
      'Record 1',
      ['undefined'],
      undefined,
      undefined,
      undefined,
      links,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      opts,
    );
    Report.listWarnings.size.should.be.equal(1);
    Report.listWarnings.has(1).should.be.true;
    const report = Report.listWarnings.get(1);
    report.should.have.length(1);
    const line = report[0];
    line.should.have.property('about').and.be.equal('link_type_change');
    const args = line.args;
    args.should.have.property('recordTitle').and.be.equal('Record 1');
    args.should.have.property('linkTargetId').and.be.equal(2);
    args.should.have.property('unknownType').and.be.equal('bar');
  });

  it('should report about record type change', () => {
    const opts = {
      record_types: {
        ...Config.base.record_types,
        foo: Config.base.record_types.undefined,
      },
    };
    new Record(
      1,
      'Record 1',
      ['foo'],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      opts,
    );
    new Record(
      2,
      'Record 2',
      ['bar'],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      opts,
    );
    Report.listWarnings.size.should.be.equal(1);
    Report.listWarnings.has(2).should.be.true;
    const report = Report.listWarnings.get(2);
    report.should.have.length(1);
    const line = report[0];
    line.should.have.property('about').and.be.equal('record_type_change');
    const args = line.args;
    args.should.have.property('recordTitle').and.be.equal('Record 2');
    args.should.have.property('unknownType').and.be.equal('bar');
  });

  it('should report about ignored record meta', () => {
    const opts = { record_metas: ['foo'] };
    new Record(
      1,
      'Record 1',
      ['undefined'],
      undefined,
      { foo: 'toto', bar: 'toto' },
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      opts,
    );
    Report.listWarnings.size.should.be.equal(1);
    Report.listWarnings.has(1).should.be.true;
    const report = Report.listWarnings.get(1);
    report.should.have.length(1);
    const line = report[0];
    line.should.have.property('about').and.be.equal('ignored_record_meta');
    const args = line.args;
    args.should.have.property('recordTitle').and.be.equal('Record 1');
    args.should.have.property('ignoredMeta').and.be.equal('bar');
  });

  it('should report about null record meta', () => {
    const opts = { record_metas: ['foo'] };
    new Record(
      1,
      'Record 1',
      ['undefined'],
      undefined,
      { foo: null },
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      opts,
    );
    Report.listWarnings.size.should.be.equal(1);
    Report.listWarnings.has(1).should.be.true;
    const report = Report.listWarnings.get(1);
    report.should.have.length(1);
    const line = report[0];
    line.should.have.property('about').and.be.equal('null_record_meta');
    const args = line.args;
    args.should.have.property('recordTitle').and.be.equal('Record 1');
    args.should.have.property('ignoredMeta').and.be.equal('foo');
  });

  it('should report about invalid record time', () => {
    new Record(
      1,
      'Record 1',
      ['undefined'],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      '2001/2/8',
      '2022-10-02',
    );
    new Record(
      2,
      'Record 2',
      ['undefined'],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      'foo',
      '1999',
    );
    new Record(
      3,
      'Record 2',
      ['undefined'],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      '2022-10-02',
    );
    Report.listErrors.size.should.be.equal(1);
    Report.listErrors.has(2).should.be.true;
    const report = Report.listErrors.get(2);
    report.should.have.length(1);
    const line = report[0];
    line.should.have.property('about').and.be.equal('invalid_record_time_begin');
    const args = line.args;
    args.should.have.property('recordTitle').and.be.equal('Record 2');
    args.should.have.property('invalidTime').and.be.equal('foo');
  });

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

  it('should report about unknown bibliographic reference', () => {
    const bibKeys = Object.values(bib).map(({ id }) => `${id}`);
    const text = `Lorem ipsum [@${bibKeys[0]}, 12] dolor est [@${bibKeys[1]} ; @unknown, 24]`;
    const bibliographicRecords = Bibliography.getBibliographicRecordsFromText(text);
    new Record(
      1,
      'Record 1',
      ['undefined'],
      undefined,
      undefined,
      text,
      undefined,
      undefined,
      undefined,
      undefined,
      bibliographicRecords,
    ).replaceBibliographicText(bibliography);
    Report.listErrors.size.should.be.equal(1);
    Report.listErrors.has(1).should.be.true;
    const report = Report.listErrors.get(1);
    report.should.have.length(1);
    const line = report[0];
    line.should.have.property('about').and.be.equal('unknown_bibliographic_reference');
    const args = line.args;
    args.should.have.property('recordTitle').and.be.equal('Record 1');
    args.should.have.property('bibliographicReference').and.be.equal('unknown');
  });
});
