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
        true
      );
    }
  },
  RecordMaxOutDailyIdError: class extends CoreError {
    constructor() {
      super('Can not generate more fake timestamp today.', '', 'record-max-out-daily-id', true);
    }
  },
};
