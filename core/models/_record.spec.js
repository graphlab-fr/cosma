import Record from './_record.js';
import Config from './config.js';

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

const config = new Config({
  files_origin: './dir',
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

  it('should generate the correct YAML front matter', () => {
    const record = new Record(props, config);

    const yamlFrontMatter = record.getYamlFrontMatter();

    expect(yamlFrontMatter).toEqual(`---
id: "20200501150208"
title: Test Record
types:
  - type1
  - type2
tags:
  - tag1
  - tag2
thumbnail: img.jpg
author: John Doe
---`);
  });

  it('should generate the correct YAML front matter', () => {
    const record = new Record({ ...props, tags: undefined }, config);

    const yamlFrontMatter = record.getYamlFrontMatter();

    expect(yamlFrontMatter).toEqual(`---
id: "20200501150208"
title: Test Record
types:
  - type1
  - type2
thumbnail: img.jpg
author: John Doe
---`);
  });

  it('should get from file', () => {
    const file = `---
id: "20200501150208"
title: Test Record
keyword:
  - test
author: Paul Otlet
---

File linked to [[20210901132906]]`;

    const result = Record.recordFromFile(file, config);
    expect(result).toEqual({
      id: '20200501150208',
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
      types: ['undefined'],
      tags: ['test'],
      metas: {
        author: 'Paul Otlet',
      },
      begin: undefined,
      end: undefined,
      thumbnail: undefined,
      config: config,
    });
  });

  it('should get with timestamp as id', () => {
    const props = {
      title: 'Paul Otlet',
      types: ['people']
    };

    const result = Record.recordWithTimestamp(props, config);
    expect(result).toEqual({
      id: expect.any(String),
      title: props.title,
      types: ['people'],
      content: '',
      links: [],
      metas: {},
      tags: [],
      begin: undefined,
      end: undefined,
      thumbnail: undefined,
      config: config,
    });
  });
});
