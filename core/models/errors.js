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

export class ReadCsvFileNodesError extends CoreError {
  constructor(cause) {
    const { filePath } = cause;
    super('Can not read CSV file for nodes.', `File ${filePath}`, 'read-csv-file-nodes', true);
  }
}

export class ReadCsvFileLinksError extends CoreError {
  constructor(cause) {
    const { filePath } = cause;
    super('Can not read CSV file for links.', `File ${filePath}`, 'read-csv-file-links', true);
  }
}

export class ReadCsvLinesLinksError extends CoreError {
  constructor(cause) {
    super('Can not read CSV lines for links.', JSON.stringify(cause), 'read-csv-lines-links', true);
  }
}

export class RecordMaxOutDailyIdError extends CoreError {
  constructor() {
    super('Can not generate more fake timestamp today.', '', 'record-max-out-daily-id', true);
  }
}

export class DowloadOnlineCsvFilesError extends CoreError {
  constructor(cause) {
    super(
      `Can not download csv files: ${cause.message}`,
      JSON.stringify(cause.message),
      'dowload-csv',
      false,
    );
  }
}

export class FindUserDataDirError extends CoreError {
  constructor(cause) {
    super(
      'Cosma user data directory does not exist. Use "cosma --create-user-data-dir"',
      undefined,
      'user-data-dir-not-exists',
      true,
    );
  }
}

export class ReadUserDataDirError extends CoreError {
  constructor(cause, path) {
    super(
      `Can not get files from user data directory: ${cause}`,
      { path },
      'read-user-data-dir-files',
      true,
    );
  }
}
