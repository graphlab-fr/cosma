import modelize from './modelize.js';
import Config from '../core/models/config.js';
import findMarkdownFilesRecursively from '../core/utils/findMarkdownFilesRecursively.js';
import getGraph from '../core/utils/getGraph.js';
import fsPromise from 'node:fs/promises';

jest.mock('../core/models/config.js');
jest.mock('../core/models/bibliography.js', () => {
  return class Bibliography {
    static getBibliographicFilesFromConfig = () => ({
      bib: 'bib',
      cslStyle: 'cslStyle',
      xmlLocal: 'xmlLocal',
    });

    constructor() {
      this.library = {
        smith04: {
          title: 'Smith',
        },
      };
    }

    getNotes = () => ['note'];
    existsOnLibrary = () => true;
  };
});
jest.mock('../core/utils/findMarkdownFilesRecursively.js');
const mockWriteReportFile = jest.fn(() => 'reportHtml');
jest.mock('../core/utils/writeReportFile.js', () => {
  return (p) => mockWriteReportFile(p);
});
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
  log: jest.fn(),
};

const options = {
  citeproc: true,
  customCss: false,
};

describe.skip('modelize', () => {
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

  const config = {
    opts: {
      select_origin: 'directory',
      references_as_nodes: true,
      record_metas: [],
      references_type_label: 'reference',
    },
    canCiteproc: () => true,
    canCssCustom: jest.fn(),
    getConfigConsolMessage: jest.fn(),
    canModelizeFromDirectory: () => true,
    getTypesRecords: () => new Set(),
  };

  it('should generate records from citations', async () => {
    Config.get.mockReturnValue(config);

    findMarkdownFilesRecursively.mockResolvedValue(['../file1.md']);

    fsPromise.readFile.mockResolvedValue(
      `---
id: test-1
title: Test Title
---

Test @smith04`,
    );

    getGraph.mockReturnValue('graph');

    await modelize({
      citeproc: true,
      customCss: false,
    });

    expect(getGraph).toHaveBeenCalledTimes(1);
    expect(getGraph).toHaveBeenCalledWith(
      new Map([
        ['test-1', expect.objectContaining({ id: 'test-1', title: 'Test Title' })],
        ['smith04', expect.objectContaining({ id: 'smith04' })],
      ]),
      config,
    );
  });

  it('should report if duplicated key on YFM', async () => {
    mockWriteReportFile.mockClear();

    Config.get.mockReturnValue(config);
    getGraph.mockReturnValue('graph');

    findMarkdownFilesRecursively.mockResolvedValue(['../file1.md']);

    fsPromise.readFile.mockResolvedValue(
      `---
id: test-1
id: test-1
---

Content`,
    );

    await modelize({
      citeproc: false,
      customCss: false,
    });

    expect(mockWriteReportFile).toHaveBeenCalledWith([
      {
        locator: { file: '../file1.md', line: 2 },
        isError: true,
        message: expect.stringContaining('Map keys must be unique'),
      },
    ]);
  });

  it('should report if empty file', async () => {
    mockWriteReportFile.mockClear();

    Config.get.mockReturnValue(config);
    getGraph.mockReturnValue('graph');

    findMarkdownFilesRecursively.mockResolvedValue(['../file1.md']);

    fsPromise.readFile.mockResolvedValue('');

    await modelize({
      citeproc: false,
      customCss: false,
    });

    expect(mockWriteReportFile).toHaveBeenCalledWith([
      {
        locator: { file: '../file1.md' },
        isError: true,
        message: 'Yaml Front Matter is required.',
      },
    ]);
  });

  it('should report if does not contains title and id', async () => {
    mockWriteReportFile.mockClear();

    Config.get.mockReturnValue(config);
    getGraph.mockReturnValue('graph');

    findMarkdownFilesRecursively.mockResolvedValue(['../file1.md']);

    fsPromise.readFile.mockResolvedValue(
      `---
type: test
---`,
    );

    await modelize({
      citeproc: false,
      customCss: false,
    });

    expect(mockWriteReportFile).toHaveBeenCalledWith([
      {
        locator: { file: '../file1.md' },
        isError: true,
        message: '"id" is required',
      },
    ]);
  });
});
