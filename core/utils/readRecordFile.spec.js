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
  getTypesLinks: () => new Set(['reference', 'concept']),
  canModelizeFromDirectory: () => true,
  canSupportRecordMeta: () => true,
  hasRecordType: jest.fn(() => true),
};

const bibliography = {
  library: {
    smith04: {
      title: 'Smith',
    },
  },
  getNotes: () => ['note'],
  existsOnLibrary: jest.fn(() => true),
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
      recordsCiteproc: [],
      reportItems: [],
    });
  });

  it('should get warn for unknown type', async () => {
    config.hasRecordType.mockReturnValue(false);

    const fileContent = `---
id: test-1
title: Test Title
type: personne
---

Test`;
    fsPromise.readFile.mockResolvedValue(fileContent);

    const bibliography = undefined;

    const result = await readRecordFile(filePath, config, bibliography);

    expect(result).toEqual({
      records: [expect.objectContaining({ types: ['undefined'] })],
      recordsCiteproc: [],
      reportItems: [
        {
          locator: { file: filePath },
          isError: false,
          message: 'Type "personne" is unknown.',
        },
      ],
    });
  });

  it('should set "undefined" type to record without type', async () => {
    config.hasRecordType.mockReturnValue(false);

    const fileContent = `---
id: test-1
title: Test Title
---

Test`;
    fsPromise.readFile.mockResolvedValue(fileContent);

    const bibliography = undefined;

    const result = await readRecordFile(filePath, config, bibliography);

    expect(result).toEqual({
      records: [expect.objectContaining({ types: ['undefined'] })],
      recordsCiteproc: [],
      reportItems: [],
    });
  });

  it('should get YAML report', async () => {
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
      recordsCiteproc: [],
      reportItems: [
        {
          locator: { file: filePath, line: 2 },
          isError: true,
          message: expect.stringContaining('Map keys must be unique'),
        },
      ],
    });
  });

  it('should get report for no YAML frontmatter', async () => {
    const fileContent = 'Test';
    fsPromise.readFile.mockResolvedValue(fileContent);

    const bibliography = undefined;

    const result = await readRecordFile(filePath, config, bibliography);

    expect(result).toEqual({
      records: [],
      recordsCiteproc: [],
      reportItems: [
        {
          locator: { file: filePath },
          isError: true,
          message: 'Yaml Front Matter is required.',
        },
      ],
    });
  });

  it('should get record title from bibliography', async () => {
    const fileContent = `---
id: smith04
---

About @smith04`;
    fsPromise.readFile.mockResolvedValue(fileContent);

    const result = await readRecordFile(filePath, config, bibliography);

    expect(result).toEqual({
      records: [expect.objectContaining({ id: 'smith04', title: 'Smith' })],
      recordsCiteproc: [expect.objectContaining({ id: 'smith04' })],
      reportItems: [],
    });
  });

  it('should get record from bibliography', async () => {
    const fileContent = `---
id: test-1
title: Test Title
---

Test @smith04`;
    fsPromise.readFile.mockResolvedValue(fileContent);

    const result = await readRecordFile(filePath, config, bibliography);

    expect(result).toEqual({
      records: [expect.objectContaining({ id: 'test-1' })],
      recordsCiteproc: [expect.objectContaining({ id: 'smith04' })],
      reportItems: [],
    });
  });

  it('should get report for unknown quote', async () => {
    const fileContent = `---
id: test-1
title: Test Title
---

Test @smith04`;
    fsPromise.readFile.mockResolvedValue(fileContent);

    bibliography.existsOnLibrary.mockReturnValue(false);

    const result = await readRecordFile(filePath, config, bibliography);

    expect(result).toEqual({
      records: [expect.objectContaining({ id: 'test-1' })],
      recordsCiteproc: [],
      reportItems: [
        {
          locator: { file: filePath },
          isError: false,
          message: 'Quote "smith04" has no reference from library.',
        },
      ],
    });
  });
});
