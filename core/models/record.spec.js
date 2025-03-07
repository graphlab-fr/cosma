import Record from './record.js';
import Config from './config.js';
import Joi from 'joi';

jest.mock('../i18n.yml', () => ({}));
jest.mock('../../static/template/report.njk', () => '');

const props = {
  id: '20200501150208',
  title: 'Test Record',
  content: 'This is a test content',
  types: ['type1', 'type2'],
  tags: ['tag1', 'tag2'],
  metas: { author: 'John Doe' },
  begin: 1609459200,
  end: 1609545600,
  thumbnail: 'img.jpg',
};

const config = Config.getFrom({
  record_types: {
    undefined: { fill: '#858585', stroke: '#858585' },
    people: { fill: '#858585', stroke: '#858585' },
  },
  record_metas: ['author'],
  references_type_label: 'author',
});

describe('Record model', () => {
  it('should correctly initialize the Record instance with provided properties', () => {
    const record = new Record(props, config);

    expect(record.id).toEqual('20200501150208');
    expect(record.title).toEqual('Test Record');
    expect(record.content).toEqual('This is a test content');
    expect(record.links).toEqual([]);
    expect(record.types).toEqual(['type1', 'type2']);
    expect(record.tags).toEqual(['tag1', 'tag2']);
    expect(record.metas).toEqual({ author: 'John Doe' });
    expect(record.begin).toEqual(1609459200);
    expect(record.end).toEqual(1609545600);
    expect(record.thumbnail).toEqual('img.jpg');
  });

  it('should correctly initialize default values if some properties are not provided', () => {
    const props = {
      id: '20200501150208',
      title: 'Default Record',
      content: 'Content with defaults',
    };

    const record = new Record(props, config);

    expect(record.id).toBe('20200501150208');
    expect(record.title).toBe('Default Record');
    expect(record.content).toBe('Content with defaults');
    expect(record.links).toEqual([]);
    expect(record.types).toEqual(['undefined']);
    expect(record.tags).toEqual([]);
    expect(record.metas).toEqual({});
    expect(record.begin).toBeUndefined();
    expect(record.end).toBeUndefined();
    expect(record.thumbnail).toBeUndefined();
  });

  it('should generate YAML front matter with id', () => {
    const record = new Record({ ...props, tags: undefined }, config);

    const file = record.getFileContent(true);

    expect(file).toEqual(`---
id: "20200501150208"
title: Test Record
types:
  - type1
  - type2
thumbnail: img.jpg
author: John Doe
---

This is a test content`);
  });

  it('should generate YAML front matter without id', () => {
    const record = new Record({ ...props, tags: undefined }, config);

    const file = record.getFileContent(false);

    expect(file).toEqual(`---
title: Test Record
types:
  - type1
  - type2
thumbnail: img.jpg
author: John Doe
---

This is a test content`);
  });

  it('should get from file data', () => {
    const body = `

File linked to [[20210901132906]]`;
    const head = {
      id: 'Test Record',
      title: 'Test Record',
      types: ['people', 'undefined'],
      tags: ['test'],
      author: 'Paul Otlet',
      'phone number': '+33##########',
      begin: undefined,
      end: undefined,
      thumbnail: undefined,
    };

    const result = Record.recordFromFile(body, head, config);

    expect(result).toEqual({
      id: 'test-record',
      title: 'Test Record',
      content: '\n\nFile linked to [[20210901132906]]',
      links: [
        {
          type: 'undefined',
          target: '20210901132906',
          text: '20210901132906',
          contexts: ['File linked to [[20210901132906]]'],
        },
      ],
      types: ['people', 'undefined'],
      tags: ['test'],
      metas: { author: 'Paul Otlet' },
      begin: undefined,
      end: undefined,
      thumbnail: undefined,
      config: config,
    });
  });

  it('should get from citeproc item', () => {
    /** @type {import('../utils/citeExtractor.js'.CiteItem)} */
    const citeItem = {
      id: 'engelbart1962',
      prefix: undefined,
      locator: undefined,
      label: 'page',
      'suppress-author': false,
      suffix: undefined,
      type: 'agreesWith',
    };

    const note = 'ENGELBART, Douglas C, 1962.';

    const bibliography = {
      library: {
        engelbart1962: {
          title: 'Augmenting Human Intellect: A Conceptual Framework',
        },
      },
      getNotes: () => [note],
    };

    const result = Record.recordFromCiteItem(citeItem, config, bibliography);
    expect(result).toEqual({
      id: citeItem.id,
      title: bibliography.library['engelbart1962'].title,
      types: [config.opts.references_type_label],
      content: note,
      links: [],
      metas: {},
      tags: [],
      begin: undefined,
      end: undefined,
      thumbnail: undefined,
      config: config,
    });
  });

  it('should get Joi schema error if no id', () => {
    const result = Record.getErrors({}, config);

    expect(Joi.isError(result)).toBe(true);

    expect(result.message).toEqual('"id" is required');
    expect(result.name).toEqual('ValidationError');
    expect(result.details).toEqual([
      {
        context: { key: 'id', label: 'id' },
        message: '"id" is required',
        path: ['id'],
        type: 'any.required',
      },
    ]);
  });

  it('should return undefined if no error', () => {
    const result = Record.getErrors(props, config);

    expect(Joi.isError(result)).toBe(false);
    expect(result).toBeUndefined();
  });
});
