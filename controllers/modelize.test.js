import modelize from './modelize.js';
import Config from '../core/models/config.js';
import findMarkdownFilesRecursively from '../core/utils/findMarkdownFilesRecursively.js';
import getGraph from '../core/utils/getGraph.js';
import readRecordFile from '../core/utils/readRecordFile.js';
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
jest.mock('../core/utils/readRecordFile.js');
jest.mock('../core/utils/getGraph.js');
jest.mock('../core/utils/csvToNodes.js', () => {
  return {
    processLinks: jest.fn(),
    processLinksOnline: jest.fn(),
    processNodes: jest.fn(),
    processNodesOnline: jest.fn(),
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

const config = {
  opts: {
    select_origin: 'directory',
    references_as_nodes: true,
    record_metas: [],
    references_type_label: 'reference',
  },
  canCiteproc: jest.fn(() => true),
  canCssCustom: jest.fn(),
  getConfigConsolMessage: jest.fn(),
  canModelizeFromDirectory: () => true,
  getTypesRecords: () => new Set(),
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

  it('should record files without bibliography if no citeproc option', async () => {
    readRecordFile.mockClear();

    Config.get.mockReturnValue(config);
    getGraph.mockReturnValue({ graph: 'graph', brokenEdges: [] });

    findMarkdownFilesRecursively.mockResolvedValue(['../file1.md']);

    readRecordFile.mockResolvedValueOnce({
      records: [],
      recordsCiteproc: [],
      reportItems: [],
    });

    await modelize({
      citeproc: false,
      customCss: false,
    });

    expect(readRecordFile).toHaveBeenCalledWith('../file1.md', config, undefined);
  });

  it('should record files without bibliography if no citeproc config', async () => {
    readRecordFile.mockClear();

    config.canCiteproc.mockReturnValueOnce(false);
    Config.get.mockReturnValueOnce(config);
    getGraph.mockReturnValue({ graph: 'graph', brokenEdges: [] });

    findMarkdownFilesRecursively.mockResolvedValue(['../file1.md']);

    readRecordFile.mockResolvedValueOnce({
      records: [],
      recordsCiteproc: [],
      reportItems: [],
    });

    await modelize({
      citeproc: true,
      customCss: false,
    });

    expect(readRecordFile).toHaveBeenCalledWith('../file1.md', config, undefined);
  });

  it('should record files with bibliography if citeproc option and config', async () => {
    readRecordFile.mockClear();

    Config.get.mockReturnValue(config);
    getGraph.mockReturnValue({ graph: 'graph', brokenEdges: [] });

    findMarkdownFilesRecursively.mockResolvedValue(['../file1.md']);

    readRecordFile.mockResolvedValueOnce({
      records: [],
      recordsCiteproc: [],
      reportItems: [],
    });

    await modelize({
      citeproc: true,
      customCss: false,
    });

    expect(readRecordFile).toHaveBeenCalledWith('../file1.md', config, expect.any(Object));
  });

  it('should merge record file and record citeproc if same id', async () => {
    readRecordFile.mockClear();

    Config.get.mockReturnValue(config);
    getGraph.mockReturnValue({ graph: 'graph', brokenEdges: [] });

    findMarkdownFilesRecursively.mockResolvedValue(['../file1.md']);

    readRecordFile.mockResolvedValueOnce({
      records: [
        { id: 'test1', types: ['undefined'] },
        { id: 'test2', types: ['concept'] },
      ],
      recordsCiteproc: [{ id: 'test1' }, { id: 'test2' }],
      reportItems: [],
    });

    await modelize({
      citeproc: true,
      customCss: false,
    });

    expect(getGraph).toHaveBeenCalledWith(
      new Map([
        [
          'test1',
          {
            id: 'test1',
            types: ['reference'],
          },
        ],
        [
          'test2',
          {
            id: 'test2',
            types: ['concept', 'reference'],
          },
        ],
      ]),
      config,
    );
  });

  it('should report if duplicated record', async () => {
    mockWriteReportFile.mockClear();

    Config.get.mockReturnValue(config);
    getGraph.mockReturnValue({ graph: 'graph', brokenEdges: [] });

    findMarkdownFilesRecursively.mockResolvedValue(['../file1.md', '../file2.md']);

    readRecordFile
      .mockResolvedValueOnce({
        records: [{ id: 'test1' }],
        recordsCiteproc: [],
        reportItems: [],
      })
      .mockResolvedValueOnce({
        records: [{ id: 'test1' }],
        recordsCiteproc: [],
        reportItems: [],
      });

    await modelize({
      citeproc: false,
      customCss: false,
    });

    expect(mockWriteReportFile).toHaveBeenCalledWith([
      {
        locator: { file: '../file2.md' },
        isError: true,
        message: 'Id "test1" is duplicated.',
      },
    ]);
  });

  it('should report if broken links', async () => {
    mockWriteReportFile.mockClear();

    Config.get.mockReturnValue(config);
    getGraph.mockReturnValue({
      graph: 'graph',
      brokenEdges: [{ source: 'test1', target: 'test2' }],
    });

    findMarkdownFilesRecursively.mockResolvedValue(['../file1.md', '../file2.md']);

    readRecordFile
      .mockResolvedValueOnce({
        records: [{ id: 'test1' }],
        recordsCiteproc: [],
        reportItems: [],
      })
      .mockResolvedValueOnce({
        records: [{ id: 'test2' }],
        recordsCiteproc: [],
        reportItems: [],
      });

    await modelize({
      citeproc: false,
      customCss: false,
    });

    expect(mockWriteReportFile).toHaveBeenCalledWith([
      {
        locator: { file: '../file1.md' },
        isError: true,
        message: 'Link to "test2" is broken.',
      },
    ]);
  });

  it('should not create report dir if no report items', async () => {
    fsPromise.mkdir.mockClear();

    Config.get.mockReturnValue(config);
    getGraph.mockReturnValue({ graph: 'graph', brokenEdges: [] });
    findMarkdownFilesRecursively.mockResolvedValue(['../file1.md']);
    readRecordFile.mockResolvedValueOnce({
      records: [],
      recordsCiteproc: [],
      reportItems: [],
    });

    await modelize({ citeproc: false, customCss: false });

    expect(fsPromise.mkdir).not.toHaveBeenCalled();
  });

  it('should create report dir recursively when report items exist', async () => {
    fsPromise.mkdir.mockClear();

    Config.get.mockReturnValue(config);
    getGraph.mockReturnValue({ graph: 'graph', brokenEdges: [] });
    findMarkdownFilesRecursively.mockResolvedValue(['../file1.md']);
    readRecordFile.mockResolvedValueOnce({
      records: [{ id: 'test1' }],
      recordsCiteproc: [],
      reportItems: [{ isError: true, locator: { file: '../file1.md' }, message: 'error' }],
    });

    await modelize({ citeproc: false, customCss: false });

    expect(fsPromise.mkdir).toHaveBeenCalledTimes(1);
    expect(fsPromise.mkdir.mock.calls[0][1]).toEqual({ recursive: true });
  });
});
