import makeConfigFile from './config';

const mockFileExists = jest.fn(() => true);
const mockWriteFile = jest.fn();
jest.mock('node:fs', () => ({
  existsSync: (path) => mockFileExists(path),
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
const mockDefaultConfigExists = jest.fn(() => false);

jest.mock('../core/models/config.js', () => ({
  get: (_path) => mockConfigGet(_path),
  getFrom: (_opts) => mockConfigGet(_opts),
  defaultConfigExists: () => mockDefaultConfigExists(),
  configDirPath: 'configDirPath',
  executionConfigPath: 'executionConfigPath.yml',
  defaultConfigPath: 'defaultConfigPath.yml',
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not make config file if global and config directory does not exist', () => {
    mockFileExists.mockImplementation((path) => {
      if (path === 'configDirPath') {
        return false;
      }
      return true;
    });

    makeConfigFile('custom', { global: true });
    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  it('should not make config file if trying to create local config in global config directory', () => {
    mockCwd.mockImplementationOnce(() => 'configDirPath');
    mockFileExists.mockReturnValue(true);

    makeConfigFile('custom', { global: false });
    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  describe('when default config does NOT exist', () => {
    beforeEach(() => {
      mockDefaultConfigExists.mockReturnValue(false);
      mockFileExists.mockImplementation((path) => {
        if (path === 'configDirPath') {
          return true;
        }
        return false;
      });
    });

    it('should create local config from Config.base when isGlobal=false, hasTitle=false', () => {
      makeConfigFile(undefined, { global: false });

      expect(mockConfigGet).toHaveBeenCalledWith({
        select_origin: 'directory',
        files_origin: undefined,
        export_target: undefined,
      });
      expect(mockWriteFile).toHaveBeenCalledWith('executionConfigPath.yml', yaml);
      expect(console.log).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('local'),
        expect.stringContaining('base'),
      );
    });

    it('should create local config from Config.base when isGlobal=false, hasTitle=true', () => {
      makeConfigFile('myconfig', { global: false });

      expect(mockConfigGet).toHaveBeenCalledWith({
        select_origin: 'directory',
        files_origin: undefined,
        export_target: undefined,
      });
      expect(mockWriteFile).toHaveBeenCalledWith('executionConfigPath.yml', yaml);
      expect(console.log).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('local'),
        expect.stringContaining('base'),
      );
    });

    it('should create global default config from Config.base when isGlobal=true, hasTitle=false', () => {
      makeConfigFile(undefined, { global: true });

      expect(mockConfigGet).toHaveBeenCalledWith({
        select_origin: 'directory',
        files_origin: undefined,
        export_target: undefined,
      });
      expect(mockWriteFile).toHaveBeenCalledWith('defaultConfigPath.yml', yaml);
      expect(console.log).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('global default'),
        expect.stringContaining('base'),
      );
    });

    it('should create named global config from Config.base when isGlobal=true, hasTitle=true', () => {
      makeConfigFile('custom', { global: true });

      expect(mockConfigGet).toHaveBeenCalledWith({
        select_origin: 'directory',
        files_origin: undefined,
        export_target: undefined,
      });
      expect(mockWriteFile).toHaveBeenCalledWith('configDirPath/custom.yml', yaml);
      expect(console.log).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('global'),
        expect.stringContaining('base'),
      );
    });
  });

  describe('when default config EXISTS', () => {
    beforeEach(() => {
      mockDefaultConfigExists.mockReturnValue(true);
      mockFileExists.mockImplementation((path) => {
        if (path === 'configDirPath') {
          return true;
        }
        if (path === 'defaultConfigPath.yml') {
          return true;
        }
        return false;
      });
    });

    it('should create local config from default config when isGlobal=false, hasTitle=false', () => {
      makeConfigFile(undefined, { global: false });

      expect(mockConfigGet).toHaveBeenCalledWith('defaultConfigPath.yml');
      expect(mockWriteFile).toHaveBeenCalledWith('executionConfigPath.yml', yaml);
      expect(console.log).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('local'),
        expect.stringContaining('default'),
      );
    });

    it('should create local config from default config when isGlobal=false, hasTitle=true', () => {
      makeConfigFile('ignore-this-title', { global: false });

      expect(mockConfigGet).toHaveBeenCalledWith('defaultConfigPath.yml');
      expect(mockWriteFile).toHaveBeenCalledWith('executionConfigPath.yml', yaml);
      expect(console.log).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('local'),
        expect.stringContaining('default'),
      );
    });

    it('should create/overwrite global default config from Config.base when isGlobal=true, hasTitle=false', () => {
      makeConfigFile(undefined, { global: true });

      expect(mockConfigGet).toHaveBeenCalledWith({
        select_origin: 'directory',
        files_origin: undefined,
        export_target: undefined,
      });
      expect(mockWriteFile).toHaveBeenCalledWith('defaultConfigPath.yml', yaml);
      expect(console.log).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('global default'),
        expect.stringContaining('base'),
      );
    });

    it('should create named global config from default config when isGlobal=true, hasTitle=true', () => {
      makeConfigFile('custom', { global: true });

      expect(mockConfigGet).toHaveBeenCalledWith('defaultConfigPath.yml');
      expect(mockWriteFile).toHaveBeenCalledWith('configDirPath/custom.yml', yaml);
      expect(console.log).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('global'),
        expect.stringContaining('default'),
      );
    });
  });

  describe('when config file already exists', () => {
    beforeEach(() => {
      mockDefaultConfigExists.mockReturnValue(false);
      mockFileExists.mockImplementation((_path) => {
        return true;
      });
    });

    it('should ask for confirmation before overwriting', () => {
      makeConfigFile('custom', { global: true });

      expect(mockReadlineQuestion).toHaveBeenCalledWith(
        expect.stringContaining('overwrite'),
        expect.any(Function),
      );
    });

    it('should write file when user confirms overwrite', () => {
      mockReadlineQuestion.mockImplementationOnce((q, fn) => {
        fn('y');
      });

      makeConfigFile('custom', { global: true });

      expect(mockWriteFile).toHaveBeenCalledWith('configDirPath/custom.yml', yaml);
      expect(mockReadlineClose).toHaveBeenCalled();
    });

    it('should not write file when user rejects overwrite', () => {
      mockReadlineQuestion.mockImplementationOnce((q, fn) => {
        fn('n');
      });

      makeConfigFile('custom', { global: true });

      expect(mockWriteFile).not.toHaveBeenCalled();
      expect(mockReadlineClose).toHaveBeenCalled();
    });
  });
});
