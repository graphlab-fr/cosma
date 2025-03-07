import Config from './config.js';

const minimalConfigContent = `
select_origin: directory
files_origin: ./docs
export_target: ./
title: null
`;

const mockFileExists = jest.fn(() => true);
const mockReadConfigFile = jest.fn(() => minimalConfigContent);
jest.mock('node:fs', () => ({
  existsSync: () => mockFileExists(),
  readFileSync: () => mockReadConfigFile(),
}));

describe('config', () => {
  it('should get config from minial config file', () => {
    const config = Config.get('../config.yml');
    expect(config.opts).toEqual({
      select_origin: 'directory',
      files_origin: './docs',
      export_target: './',
      history: true,
      focus_max: 2,
      record_types: { undefined: { fill: '#858585', stroke: '#858585' } },
      link_types: { undefined: { stroke: 'simple', color: '#e1e1e1' } },
      references_as_nodes: false,
      references_type_label: 'references',
      record_filters: [],
      graph_background_color: '#ffffff',
      graph_highlight_color: '#ff6a6a',
      graph_highlight_on_hover: true,
      graph_text_size: 10,
      graph_arrows: true,
      node_size_method: 'degree',
      node_size: 10,
      node_size_max: 20,
      node_size_min: 2,
      attraction_force: 200,
      attraction_distance_max: 250,
      attraction_vertical: 0,
      attraction_horizontal: 0,
      views: {},
      record_metas: [],
      generate_id: 'always',
      link_context: 'tooltip',
      hide_id_from_record_header: false,
      keywords: [],
      devtools: false,
      lang: 'en',
    });
  });

  it('should throw an error when get config from empty file', () => {
    const configContent = ``;

    mockReadConfigFile.mockImplementationOnce(() => configContent);

    expect(() => {
      Config.get('../config.yml');
    }).toThrow();
  });

  describe('"select_origin" option', () => {
    it('should throw an error when get config with unknown value', () => {
      const configContent = `
select_origin: toto
        `;

      mockReadConfigFile.mockImplementationOnce(() => configContent);

      expect(() => {
        Config.get('../config.yml');
      }).toThrow();
    });

    it('should throw an error when get config with "directory" value, without "files_origin"', () => {
      const configContent = `
select_origin: directory
files_origin: null
        `;

      mockReadConfigFile.mockImplementationOnce(() => configContent);

      expect(() => {
        Config.get('../config.yml');
      }).toThrow();
    });

    it('should throw an error when get config with "csv" value, without "nodes_origin" or "links_origin"', () => {
      let configContent = `
select_origin: csv
nodes_origin: ./nodes.csv
        `;

      mockReadConfigFile.mockImplementationOnce(() => configContent);

      expect(() => {
        Config.get('../config.yml');
      }).toThrow();

      configContent = `
select_origin: csv
links_origin: ./links.csv
        `;

      mockReadConfigFile.mockImplementationOnce(() => configContent);

      expect(() => {
        Config.get('../config.yml');
      }).toThrow();
    });

    it('should throw an error when get config with "online" value, without "nodes_online" or "links_online"', () => {
      let configContent = `
    select_origin: online
    nodes_online: https://domain.com/node.csv
        `;

      mockReadConfigFile.mockImplementationOnce(() => configContent);

      expect(() => {
        Config.get('../config.yml');
      }).toThrow();

      configContent = `
select_origin: online
links_online: https://domain.com/link.csv
        `;

      mockReadConfigFile.mockImplementationOnce(() => configContent);

      expect(() => {
        Config.get('../config.yml');
      }).toThrow();
    });
  });

  it('should throw error if file paths options does not exists', () => {
    mockFileExists
      // read config file
      .mockImplementationOnce(() => true)
      // read files_origin option file
      .mockImplementationOnce(() => false);

    expect(() => {
      Config.get('../config.yml');
    }).toThrow();
  });

  it('should not citeproc if no "csl" "bibliography" and "csl_locale" options', () => {
    const configContent = `
${minimalConfigContent}
        `;

    mockReadConfigFile.mockImplementationOnce(() => configContent);
    const config = Config.get('../config.yml');
    expect(config.canCiteproc()).toBe(false);
  });

  it('should citeproc if "csl" "bibliography" and "csl_locale" options', () => {
    const configContent = `
${minimalConfigContent}
csl: iso.csl
bibliography: library.json
csl_locale: fr-FR.xml
        `;

    mockReadConfigFile.mockImplementationOnce(() => configContent);
    const config = Config.get('../config.yml');
    expect(config.canCiteproc()).toBe(true);
  });

  it('should not save records if no "files_origin" option', () => {
    const configContent = `
select_origin: csv
files_origin: null
nodes_origin: nodes.csv
links_origin: links.csv
export_target: ./
        `;

    mockReadConfigFile.mockImplementationOnce(() => configContent);
    const config = Config.get('../config.yml');
    expect(config.canSaveRecords()).toBe(false);
  });

  it('should save records if "files_origin" option', () => {
    const configContent = `
${minimalConfigContent}
        `;

    mockReadConfigFile.mockImplementationOnce(() => configContent);
    const config = Config.get('../config.yml');
    expect(config.canSaveRecords()).toBe(true);
  });

  it('should not use custom CSS if no "css_custom" option', () => {
    const configContent = `
${minimalConfigContent}
        `;

    mockReadConfigFile.mockImplementationOnce(() => configContent);
    const config = Config.get('../config.yml');
    expect(config.canCssCustom()).toBe(false);
  });

  it('should use custom CSS if "css_custom" option', () => {
    const configContent = `
${minimalConfigContent}
css_custom: styles.css
        `;

    mockReadConfigFile.mockImplementationOnce(() => configContent);
    const config = Config.get('../config.yml');
    expect(config.canCssCustom()).toBe(true);
  });

  it('should ignore unknown options', () => {
    const configContent = `
${minimalConfigContent}
unknown: true
        `;

    mockReadConfigFile.mockImplementationOnce(() => configContent);
    const config = Config.get('../config.yml');
    expect(config.opts).not.toEqual(
      expect.objectContaining({
        unknown: true,
      }),
    );
  });

  it('should return true if type exists', () => {
    const configContent = `
${minimalConfigContent}
record_types:
  undefined:
    stroke: "#eeeeee"
    fill: "#eeeeee"
  reference:
    stroke: "#6C6C6C"
    fill: "#6C6C6C"
`;

    mockReadConfigFile.mockImplementationOnce(() => configContent);
    const config = Config.get('../config.yml');

    expect(config.hasRecordType('reference')).toBe(true);
    expect(config.hasRecordType('concept')).toBe(false);
  });

  it('should return true if meta is supported', () => {
    const configContent = `
${minimalConfigContent}
record_metas:
  - author
`;

    mockReadConfigFile.mockImplementationOnce(() => configContent);
    const config = Config.get('../config.yml');

    expect(config.canSupportRecordMeta('author')).toBe(true);
    expect(config.canSupportRecordMeta('phone number')).toBe(false);
  });
});
