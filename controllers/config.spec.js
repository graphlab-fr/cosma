import makeConfigFile from './config';

const mockFileExists = jest.fn(() => true);
const mockWriteFile = jest.fn();
jest.mock('node:fs', () => ({
  existsSync: () => mockFileExists(),
  writeFileSync: (path, data) => mockWriteFile(path, data),
}));

const opts = {
  select_origin: 'directory',
  files_origin: './docs',
  export_target: './dist',
};
const yaml = 'yaml';
const mockGetYaml = jest.fn(() => yaml);
const mockConfigGet = jest.fn(() => ({ opts, getYaml: mockGetYaml }));
jest.mock('../core/models/config.js', () => ({
  get: () => mockConfigGet(),
  getFrom: () => mockConfigGet(),
  configDirPath: 'configDirPath',
  base: {
    select_origin: 'directory',
    files_origin: undefined,
    export_target: undefined,
  },
}));

const mockReadlineQuestion = jest.fn((q, fn) => {
  fn('y');
});
const mockReadlineClose = jest.fn();
jest.mock('node:readline', () => ({
  createInterface: () => ({ question: mockReadlineQuestion, close: mockReadlineClose }),
}));

const mockCwd = jest.fn(() => 'cwd');
process.cwd = mockCwd;
console.log = jest.fn();
console.error = jest.fn();

describe('makeConfigFile', () => {
  it('should not make config file if global and directory contains config files does not exist', () => {
    mockFileExists.mockImplementationOnce(() => false);

    makeConfigFile('custom', { global: true });
    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  it('should not make config file if not global and current cwd directory contains config files does not exist', () => {
    mockCwd.mockImplementationOnce(() => 'configDirPath');

    makeConfigFile('custom', { global: false });
    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  describe('not need to overwrite', () => {
    beforeEach(() => {
      mockFileExists
        // directory contains config files exists
        .mockImplementationOnce(() => true)
        // no overwrite config file
        .mockImplementationOnce(() => false);
    });

    it('should make custom config file if not global and give title', () => {
      makeConfigFile('custom', { global: true });
      expect(mockWriteFile).toHaveBeenCalledWith('configDirPath/custom.yml', yaml);
    });
  });
});
