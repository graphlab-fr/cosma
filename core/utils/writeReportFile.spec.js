import writeReportFile from './writeReportFile';
import nunjucks from 'nunjucks';

jest.mock('../../static/template/report.njk', () => 'reportTemplate');

jest.mock('nunjucks');

const config = {
  opts: {
    title: 'Project Title',
    lang: 'en',
  },
};

describe('writeReportFile', () => {
  let renderStringMock;

  beforeAll(() => {
    renderStringMock = jest.fn();
    nunjucks.Environment.mockImplementation(() => ({
      renderString: renderStringMock,
    }));
  });

  it('should render only warnings', () => {
    const items = [
      {
        locator: { file: 'docs/tools-for-thought.md', line: 10 },
        isError: false,
        message: 'Warning message',
      },
    ];

    writeReportFile(items, config);

    expect(renderStringMock).toHaveBeenCalledWith(expect.any(String), {
      date: expect.stringMatching(/\d{2}\/\d{2}\/\d{4}/),
      projectTitle: config.opts.title,
      items: {
        errors: {},
        warnings: {
          'docs/tools-for-thought.md': [
            {
              locator: { file: 'docs/tools-for-thought.md', line: 10 },
              isError: false,
              message: 'Warning message',
            },
          ],
        },
      },
      nbErrors: 0,
      nbWarnings: 1,
    });
  });

  it('should render report with errors and warnings', () => {
    const items = [
      {
        locator: { file: 'docs/evergreen-notes.md' },
        isError: true,
        message: 'Error message',
      },
      {
        locator: { file: 'docs/tools-for-thought.md' },
        isError: true,
        message: 'Error message',
      },
      {
        locator: { file: 'docs/evergreen-notes.md' },
        isError: false,
        message: 'Warning message',
      },
      {
        locator: { file: 'docs/tools-for-thought.md' },
        isError: true,
        message: 'Error message',
      },
    ];

    writeReportFile(items, config);

    expect(renderStringMock).toHaveBeenCalledWith(expect.any(String), {
      date: expect.stringMatching(/\d{2}\/\d{2}\/\d{4}/),
      projectTitle: config.opts.title,
      items: {
        errors: {
          'docs/evergreen-notes.md': [
            {
              locator: { file: 'docs/evergreen-notes.md' },
              isError: true,
              message: 'Error message',
            },
          ],
          'docs/tools-for-thought.md': [
            {
              locator: { file: 'docs/tools-for-thought.md' },
              isError: true,
              message: 'Error message',
            },
            {
              locator: { file: 'docs/tools-for-thought.md' },
              isError: true,
              message: 'Error message',
            },
          ],
        },
        warnings: {
          'docs/evergreen-notes.md': [
            {
              locator: { file: 'docs/evergreen-notes.md' },
              isError: false,
              message: 'Warning message',
            },
          ],
        },
      },
      nbErrors: 3,
      nbWarnings: 1,
    });
  });

  it('should order reports by line number and put at end items without line', () => {
    const items = [
      {
        locator: { file: 'docs/tools-for-thought.md', line: 10 },
        isError: false,
        message: 'Warning message',
      },
      {
        locator: { file: 'docs/tools-for-thought.md' },
        isError: false,
        message: 'Warning message',
      },
      {
        locator: { file: 'docs/tools-for-thought.md', line: 2 },
        isError: false,
        message: 'Warning message',
      },
    ];

    writeReportFile(items, config);

    expect(renderStringMock).toHaveBeenCalledWith(expect.any(String), {
      date: expect.stringMatching(/\d{2}\/\d{2}\/\d{4}/),
      projectTitle: config.opts.title,
      items: {
        errors: {},
        warnings: {
          'docs/tools-for-thought.md': [
            {
              locator: { file: 'docs/tools-for-thought.md', line: 2 },
              isError: false,
              message: 'Warning message',
            },
            {
              locator: { file: 'docs/tools-for-thought.md', line: 10 },
              isError: false,
              message: 'Warning message',
            },
            {
              locator: { file: 'docs/tools-for-thought.md' },
              isError: false,
              message: 'Warning message',
            },
          ],
        },
      },
      nbErrors: 0,
      nbWarnings: 3,
    });
  });
});
