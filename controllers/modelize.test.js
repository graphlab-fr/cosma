import modelize from './modelize.js';
import Config from '../core/models/config.js';
import findMarkdownFilesRecursively from '../core/utils/findMarkdownFilesRecursively.js';
import Record from '../core/models/record.js';
import getGraph from '../core/utils/getGraph.js';

jest.mock('../core/models/config.js');
jest.mock('../core/models/record.js');
jest.mock('../core/models/bibliography.js', () => {
  return class Bibliography {
    static getBibliographicFilesFromConfig = () => ({
      bib: 'bib',
      cslStyle: 'cslStyle',
      xmlLocal: 'xmlLocal',
    });

    constructor() {}

    existsOnLibrary = () => true;
  };
});
jest.mock('../core/utils/findMarkdownFilesRecursively.js');
jest.mock('../core/utils/getGraph.js');
jest.mock('../core/utils/csvToNodes.js', () => {
  return {
    processLinks: jest.fn(),
    processLinksOnline: jest.fn(),
    processNodes: jest.fn(),
    processNodesOnline: jest.fn(),
  };
});
jest.mock('../models/report-cli.js', () => {
  return {
    isItEmpty: () => false,
  };
});
jest.mock('./history.js');
jest.mock('node:fs/promises');
jest.mock('node:fs');
jest.mock('node:path');
jest.mock('../core/models/template.js', () => {
  return class Template {
    static validParams = new Set(['citeproc', 'customCss']);

    constructor() {
      this.html = '<html></html>';
    }
  };
});

global.console = {
  ...global.console,
  error: jest.fn(),
  // log: jest.fn(),
};

const options = {
  citeproc: true,
  customCss: false,
};

describe('modelize', () => {
  it('should throw an error for unknown data origin', () => {
    const config = {
      opts: {
        select_origin: 'unknown',
      },
      canCiteproc: jest.fn(),
      canCssCustom: jest.fn(),
      getConfigConsolMessage: jest.fn(),
      canModelizeFromDirectory: () => true,
    };

    Config.get.mockReturnValue(config);

    expect(modelize(options)).rejects.toThrow('Unknown data origin.');
  });

  it('should get graph from directory', async () => {
    const config = {
      opts: {
        select_origin: 'directory',
      },
      canCiteproc: jest.fn(),
      canCssCustom: jest.fn(),
      getConfigConsolMessage: jest.fn(),
      canModelizeFromDirectory: () => true,
    };

    Config.get.mockReturnValue(config);

    Record.recordFromFile
      .mockReturnValueOnce({
        id: 'test-1',
        title: 'Test Title',
        content: 'Test content',
        links: [],
        types: ['test-type'],
        tags: ['test-tag'],
        metas: {},
        begin: 1627849200,
        end: 1627849200,
        thumbnail: 'test-thumbnail',
      })
      .mockReturnValueOnce({
        id: 'test-2',
        title: 'Test Title',
        content: 'Test content',
        links: [],
        types: ['test-type'],
        tags: ['test-tag'],
        metas: {},
        begin: 1627849200,
        end: 1627849200,
        thumbnail: 'test-thumbnail',
      });

    findMarkdownFilesRecursively.mockResolvedValue(['../file1.md', '../file2.md']);
    getGraph.mockReturnValue('graph');

    getGraph.mockClear();

    await modelize(options);

    expect(getGraph).toHaveBeenCalledTimes(1);
    expect(getGraph).toHaveBeenCalledWith(
      new Map([
        ['test-1', expect.any(Object)],
        ['test-2', expect.any(Object)],
      ]),
      config,
    );
  });

  it('should generate records from citations', async () => {
    const config = {
      opts: {
        select_origin: 'directory',
        references_as_nodes: true,
      },
      canCiteproc: () => true,
      canCssCustom: jest.fn(),
      getConfigConsolMessage: jest.fn(),
      canModelizeFromDirectory: () => true,
    };

    Config.get.mockReturnValue(config);

    Record.recordFromFile.mockReturnValueOnce({
      id: 'test-1',
      title: 'Test Title',
      content: 'Test @smith04.',
      links: [],
      types: ['test-type'],
      tags: ['test-tag'],
      metas: {},
      begin: 1627849200,
      end: 1627849200,
      thumbnail: 'test-thumbnail',
      addLink: jest.fn(),
    });
    Record.recordFromCiteItem.mockReturnValueOnce({
      id: 'smith04',
      title: 'Test Title',
      content: 'smith04',
      links: [],
      types: ['test-type'],
      tags: ['test-tag'],
      metas: {},
      begin: 1627849200,
      end: 1627849200,
      thumbnail: 'test-thumbnail',
      addLink: jest.fn(),
    });

    findMarkdownFilesRecursively.mockResolvedValue(['../file1.md']);
    getGraph.mockReturnValue('graph');

    await modelize({
      citeproc: true,
      customCss: false,
    });

    expect(Record.recordFromCiteItem).toHaveBeenCalledTimes(1);
    expect(Record.recordFromCiteItem).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'smith04' }),
      config,
      expect.any(Object),
    );
  });
});
