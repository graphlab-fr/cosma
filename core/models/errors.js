class CoreError extends Error {
  /**
   *
   * @param {string} message
   * @param {string} code
   * @param {boolean} isOperational
   * @exemple
   * ```
   * const error = new CoreError('my error', 'MyError', true);
   * ```
   */

  constructor(message, details, code, isOperational) {
    super(message);
    this.details = details;
    this.code = code;
    this.isOperational = isOperational;
  }
}

module.exports = {
  ReadCsvFileNodesError: class extends CoreError {
    constructor(cause) {
      const { filePath } = cause;
      super('Can not read CSV file for nodes.', `File ${filePath}`, 'read-csv-file-nodes', true);
    }
  },
  ReadCsvFileLinksError: class extends CoreError {
    constructor(cause) {
      const { filePath } = cause;
      super('Can not read CSV file for links.', `File ${filePath}`, 'read-csv-file-links', true);
    }
  },
  ReadCsvLinesLinksError: class extends CoreError {
    constructor(cause) {
      super(
        'Can not read CSV lines for links.',
        JSON.stringify(cause),
        'read-csv-lines-links',
        true,
      );
    }
  },
  RecordMaxOutDailyIdError: class extends CoreError {
    constructor() {
      super('Can not generate more fake timestamp today.', '', 'record-max-out-daily-id', true);
    }
  },
  DowloadOnlineCsvFilesError: class extends CoreError {
    constructor(cause) {
      super(
        `Can not download csv files: ${cause.message}`,
        JSON.stringify(cause.message),
        'dowload-csv',
        false,
      );
    }
  },
  GetConfigFilePathByProjectNameError: class extends CoreError {
    constructor(cause) {
      super(
        'Can not find config file by this project name: ',
        cause,
        'get-config-file-path-by-project-name',
        false,
      );
    }
  },
  FindUserDataDirError: class extends CoreError {
    constructor(cause) {
      super(
        'Cosma user data directory does not exist. Use "cosma --create-user-data-dir"',
        undefined,
        'user-data-dir-not-exists',
        true,
      );
    }
  },
  ReadUserDataDirError: class extends CoreError {
    constructor(cause, path) {
      super(
        `Can not get files from user data directory: ${cause}`,
        { path },
        'user-data-dir-not-exists',
        true,
      );
    }
  },
};
