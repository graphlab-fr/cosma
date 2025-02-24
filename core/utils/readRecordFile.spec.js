import readRecordFile from './readRecordFile';
import fsPromise from 'node:fs/promises';

jest.mock('node:fs/promises');

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

const filePath = './test.md';

describe('readRecordFile', () => {
  it('should get one record from file', async () => {
    const fileContent = `---
id: test-1
title: Test Title
---

Test @smith04`;
    fsPromise.readFile.mockResolvedValue(fileContent);

    const bibliography = undefined;

    const result = await readRecordFile(filePath, config, bibliography);

    expect(result).toEqual({
      records: [expect.objectContaining({ id: 'test-1' })],
      reportItems: [],
    });
  });

  it('should get record with YAML report', async () => {
    const fileContent = `---
id: test-1
id: test-1
---

Test @smith04`;
    fsPromise.readFile.mockResolvedValue(fileContent);

    const bibliography = undefined;

    const result = await readRecordFile(filePath, config, bibliography);

    expect(result).toEqual({
      records: [],
      reportItems: [
        {
          locator: { file: filePath, line: 2 },
          isError: true,
          message: expect.stringContaining('Map keys must be unique'),
        },
      ],
    });
  });

  it('should get record from bibliography', async () => {
    const fileContent = `---
id: test-1
title: Test Title
---

Test @smith04`;
    fsPromise.readFile.mockResolvedValue(fileContent);

    const bibliography = {
      library: {
        smith04: {
          title: 'Smith',
        },
      },
      getNotes: () => ['note'],
      existsOnLibrary: () => true,
    };

    const result = await readRecordFile(filePath, config, bibliography);

    expect(result).toEqual({
      records: [
        expect.objectContaining({ id: 'test-1' }),
        expect.objectContaining({ id: 'smith04' }),
      ],
      reportItems: [],
    });
  });
});
