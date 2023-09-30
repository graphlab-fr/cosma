const assert = require('assert');

const Graph = require('../models/graph'),
  Config = require('../models/config'),
  Record = require('../models/record');

describe('Graph verif', () => {
  describe('params', () => {
    it('should register only valid params', () => {
      const graph = new Graph(undefined, undefined, ['sample', 'empty', 'invalid param']);
      assert.deepStrictEqual(graph.params, new Set(['sample', 'empty']));
    });
  });

  const opts = {
    record_types: {
      ...Config.base.record_types,
      foo: Config.base.record_types.undefined,
      bar: Config.base.record_types.undefined,
    },
    record_metas: ['foo'],
  };
  const graph = new Graph([
    new Record(
      1,
      'Record 1',
      ['foo'],
      ['foo', 'bar'],
      { foo: 'bar' },
      undefined,
      undefined,
      undefined,
      '1901-01-01',
      '1999-01-01',
      undefined,
      undefined,
      opts,
    ),
    new Record(
      2,
      'Record 2',
      ['bar'],
      'foo,bar',
      { foo: 'baz' },
      undefined,
      undefined,
      undefined,
      '1999',
      '2020-01-01',
      undefined,
      undefined,
      opts,
    ),
    new Record(
      3,
      'Record 2',
      ['bar'],
      'bar',
      { out: 'bar' },
      undefined,
      undefined,
      undefined,
      '',
      '1701-01-01',
      undefined,
      undefined,
      opts,
    ),
  ]);

  describe('chronos', () => {
    it('should get begin and end timestamps from graph records', () => {
      assert.deepStrictEqual(graph.getTimelineFromRecords(), {
        begin: new Date('1701-01-01').getTime() / 1000,
        end: new Date('2020-01-01').getTime() / 1000 + 1,
      });
    });
  });

  describe('types', () => {
    it('should get all types from records', () => {
      const typesFromGraph = [];
      graph.getTypesFromRecords().forEach((nodes, name) => {
        nodes = Array.from(nodes);
        typesFromGraph.push({ name, nodes });
      });
      assert.deepStrictEqual(typesFromGraph, [
        { name: 'foo', nodes: [1] },
        { name: 'bar', nodes: [2, 3] },
      ]);
    });
  });

  describe('tags', () => {
    it('should get all tags from records', () => {
      const tagsFromGraph = [];
      graph.getTagsFromRecords().forEach((nodes, name) => {
        nodes = Array.from(nodes);
        tagsFromGraph.push({ name, nodes });
      });
      assert.deepStrictEqual(tagsFromGraph, [
        { name: 'foo', nodes: [1, 2] },
        { name: 'bar', nodes: [1, 2, 3] },
      ]);
    });
  });

  describe('metas', () => {
    it('should get all metas keys from records', () => {
      const metasFromGraph = [];
      graph.getMetasFromRecords().forEach((values, meta) => {
        values = Array.from(values);
        metasFromGraph.push({ meta, values });
      });
      assert.deepStrictEqual(metasFromGraph, [{ meta: 'foo', values: ['bar', 'baz'] }]);
    });
  });
});
