import referenceRecord from './referenceRecord';
import Config from '../core/models/config';
import Bibliography from '../core/models/bibliography';
import Record from '../core/models/record';
import fsPromise from 'node:fs/promises';
import fs from 'node:fs';
import readline from 'node:readline/promises';

jest.mock('../core/models/config');
jest.mock('../core/models/bibliography');
jest.mock('../core/models/record');
jest.mock('node:fs/promises');
jest.mock('node:fs');
jest.mock('node:readline/promises');

global.console = {
  ...global.console,
  log: jest.fn(),
};

describe('referenceRecord', () => {
  let mockConfig;
  let mockBibliography;
  let mockRecord;
  let rl;

  beforeEach(() => {
    mockConfig = {
      getConfigConsolMessage: jest.fn(),
      canSaveRecords: jest.fn(),
      canCiteproc: jest.fn(),
      opts: { files_origin: '/mock/path' },
    };
    Config.get = jest.fn().mockReturnValue(mockConfig);

    mockBibliography = {
      library: {
        mockReference: 'mockReference',
      },
    };
    Bibliography.getBibliographicFilesFromConfig = jest.fn().mockReturnValue({
      bib: 'mockBib',
      cslStyle: 'mockCslStyle',
      xmlLocal: 'mockXmlLocal',
    });
    Bibliography.mockImplementation(() => mockBibliography);

    mockRecord = {
      getFileName: jest.fn().mockReturnValue('mockFileName'),
      getFileContent: jest.fn().mockReturnValue('mockFileContent'),
    };
    Record.recordWithReference = jest.fn().mockReturnValue(mockRecord);

    rl = {
      question: jest.fn(),
      close: jest.fn(),
    };
    readline.createInterface = jest.fn().mockReturnValue(rl);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an error if records cannot be saved', async () => {
    mockConfig.canSaveRecords.mockReturnValue(false);

    await expect(referenceRecord()).rejects.toThrow(
      'Unable to create record: missing value for files_origin in the configuration file',
    );
  });

  it('should throw an error if citeproc is not available', async () => {
    mockConfig.canSaveRecords.mockReturnValue(true);
    mockConfig.canCiteproc.mockReturnValue(false);

    await expect(referenceRecord()).rejects.toThrow(
      'Unable to create reference record: missing config',
    );
  });

  it('should throw an error if reference is not provided', async () => {
    mockConfig.canSaveRecords.mockReturnValue(true);
    mockConfig.canCiteproc.mockReturnValue(true);
    rl.question.mockResolvedValueOnce('');

    await expect(referenceRecord()).rejects.toThrow('Reference is required');
  });

  it('should throw an error if reference does not exist in the library', async () => {
    mockConfig.canSaveRecords.mockReturnValue(true);
    mockConfig.canCiteproc.mockReturnValue(true);
    rl.question.mockResolvedValueOnce('mockReferenceUnknown');

    await expect(referenceRecord()).rejects.toThrow('Reference does not exist');
  });

  it('should make record with title, types and tags', async () => {
    mockConfig.canSaveRecords.mockReturnValue(true);
    mockConfig.canCiteproc.mockReturnValue(true);
    rl.question.mockResolvedValueOnce('mockReference');
    rl.question.mockResolvedValueOnce('mockTitle');
    rl.question.mockResolvedValueOnce('type1,type2');
    rl.question.mockResolvedValueOnce('tag1,tag2');

    fs.existsSync = jest.fn().mockReturnValue(false);

    await referenceRecord();

    expect(Record.recordWithReference).toHaveBeenCalledWith({
      id: 'mockReference',
      title: 'mockTitle',
      types: ['type1', 'type2'],
      tags: ['tag1', 'tag2'],
    });
  });

  it('should make record without title, type and tag', async () => {
    mockConfig.canSaveRecords.mockReturnValue(true);
    mockConfig.canCiteproc.mockReturnValue(true);
    rl.question.mockResolvedValueOnce('mockReference');
    rl.question.mockResolvedValueOnce('');
    rl.question.mockResolvedValueOnce('');
    rl.question.mockResolvedValueOnce('');

    fs.existsSync = jest.fn().mockReturnValue(false);

    await referenceRecord();

    expect(Record.recordWithReference).toHaveBeenCalledWith({
      id: 'mockReference',
      title: 'mockReference',
      types: [],
      tags: [],
    });
  });

  it('should create a file from record', async () => {
    mockConfig.canSaveRecords.mockReturnValue(true);
    mockConfig.canCiteproc.mockReturnValue(true);
    rl.question.mockResolvedValueOnce('mockReference');
    rl.question.mockResolvedValueOnce('mockTitle');
    rl.question.mockResolvedValueOnce('');
    rl.question.mockResolvedValueOnce('');

    fs.existsSync = jest.fn().mockReturnValue(false);

    await referenceRecord();

    expect(fsPromise.writeFile).toHaveBeenCalledWith('/mock/path/mockFileName', 'mockFileContent');
  });

  it('should create a file if can overwrite', async () => {
    mockConfig.canSaveRecords.mockReturnValue(true);
    mockConfig.canCiteproc.mockReturnValue(true);
    rl.question.mockResolvedValueOnce('mockReference');
    rl.question.mockResolvedValueOnce('mockTitle');
    rl.question.mockResolvedValueOnce('');
    rl.question.mockResolvedValueOnce('');

    fs.existsSync = jest.fn().mockReturnValue(true);
    rl.question.mockResolvedValueOnce('y');

    await referenceRecord();

    expect(fsPromise.writeFile).toHaveBeenCalledWith('/mock/path/mockFileName', 'mockFileContent');
  });

  it('should not create a file if can not overwrite', async () => {
    mockConfig.canSaveRecords.mockReturnValue(true);
    mockConfig.canCiteproc.mockReturnValue(true);
    rl.question.mockResolvedValueOnce('mockReference');
    rl.question.mockResolvedValueOnce('mockTitle');
    rl.question.mockResolvedValueOnce('');
    rl.question.mockResolvedValueOnce('');

    fs.existsSync = jest.fn().mockReturnValue(true);
    rl.question.mockResolvedValueOnce('n');

    await referenceRecord();

    expect(fsPromise.writeFile).not.toHaveBeenCalled();
  });
});
