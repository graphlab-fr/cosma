---
title: User Manual (CLI)
version: CLI v2.0.0
date: Last Modified
description: >-
  User manual for Cosma CLI.
lang: en
layout: doc
tags: user
---

## Installing and updating

### Installing

Cosma is available in two versions: a graphical user interface (GUI) application and a command line interface (CLI) application. Information about the CLI version is detailed [on a dedicated page](https://cosma.graphlab.fr/en/docs/cli/user-manual/).

From v2 onwards, both versions of Cosma are available for macOS, Windows and Linux.

For Cosma CLI, the installation of [NodeJS](https://nodejs.org/) version 12 or higher is required.

NPM (the NodeJS package manager) is installed automatically with NodeJS. NPM can be used to manage the installation of Cosma CLI. Enter the command below in your terminal to install Cosma CLI globally. The software can then be used by running `cosma`.

```
npm install @graphlab-fr/cosma -g
```

If you want to install Cosma CLI as a dependency of a NodeJS project, use the command below. The software can then be used by running `./node_modules/.bin/cosma` from the root of the project.

```
npm install @graphlab-fr/cosma
```

### Upgrading

The following command displays the list of packages installed via NPM for which an update exists:

```
npm outdated
```

The following command updates Cosma CLI if an update exists:

```
npm update cosma
```

## Description

Cosma CLI is the command-line interface (CLI) version of Cosma, a visualization tool that can represent document graphs as interactive networks in a web interface.

Cosma CLI works with configuration files written in YAML. Each configuration file specifies a data source to be used, as well as various parameters that govern the behavior of Cosma for this data source.

Two approaches can be taken regarding configuration files:

The first approach is to run `cosma` in a directory where a configuration file is located. This is called a local configuration file. Local configuration files must always be named `config.yml`.

The other approach is to run `cosma` with the `--project <name>` option, where `<name>` is the name of a configuration file found in a special folder, the user data directory. This is called a global configuration file, or **project**. This file can be named freely (e.g. `foo.yml`). With this second approach, the `cosma` command can be run from any location.

::: tip
The local approach is useful for automation and reproducibility in a context of shared or distributed work on several machines. It allows the simultaneous transmission of data, configuration and operating instructions (commands), bundled and useable as is, without any additional parameterization required from the recipient (human or machine).

Conversely, the global approach is useful for prolonged use of the software by an individual on a single machine.
:::

## The `cosma` command

The `cosma` command can be used in three ways:

1. `cosma` displays general help ;
2. `cosma <option>` executes a general option;
2. `cosma <command> <options>` executes one of Cosma's five commands (`config`, `record`, `autorecord`, `batch` and `modelize`), with one or more specific options.

The five commands exist in long and short versions (e.g. `cosma config` or `cosma c`). Some options also have a short version (e.g. `cosma config --global` or `cosma config -g`). In both cases, the long and short versions are functionally identical; the short version is simply used to save time when used repeatedly over short periods of time.

The following subsections present the general options.

### Create the user data directory

```
cosma --create-user-data-dir
```

This command creates a user data directory named `cosma-cli` at a location that complies with the [XDG Base Directory specification](https://xdgbasedirectoryspecification.com). The exact location depends on each operating system and may vary from version to version of the same system.

If the user data directory already exists, the command simply displays its location.

### Show projects

```
cosma --list-projects
```

This command lists the configuration files in the user data directory (projects).

### Show version number

```
cosma --version
cosma -V
```

**NB:** this is the only option for which the short form uses a capital letter. This is a default setting from the library we use to define commands.

### Show help

Cosma has a general help:

```
cosma --help
cosma -h
```

Context-sensitive help is also available for the five Cosma commands. Add the `-h/--help` flag to any of these commands to display the contextual help.

Example:

```
cosma config --help
```

## Configuration

### Create a configuration file

```
cosma config
cosma c
```

This command creates a `config.yml` file in the current directory.

### Create a global configuration file (project)

```
cosma config --global <name>
cosma c -g <name>
```

The `-g/--global` option followed by a name creates a `name.yml` file in the user data directory.

### Create a default configuration file

```
cosma config --global
cosma c -g
```

When not followed by a name, the `-g/--global` option creates a `defaults.yml` file in the user data directory. This file can then be modified to set the default values for the various Cosma configuration parameters. These default values will be applied to configuration files created afterwards.

### Configuration parameters

Below is a list of the parameters used by Cosma. If a parameter is missing from a configuration file, Cosma considers it to have its default value.

::: important
The “undefined” record and link types are required for the program to work. If you delete them from a configuration file, Cosma will automatically reinsert them the next time you use the file.
:::

name | description | possible values | default value
---|---|---|---
`select_origin` | Data source type | `directory` (directory of text files), `csv` (tabular data, local files) or `online` (tabular data, online files) | `directory`
`files_origin` | Location of files for data source type `directory` | path (directory) | 
`nodes_origin` | Location of nodes for data source type `csv` | path (CSV file) |
`links_origin` | Location of links for data source type `csv` | path (CSV file) |
`nodes_online` | Location of nodes for data source type `online` | URL (CSV file) | 
`links_online` | Location of links for data source type `online` | URL (CSV file) | 
`images_origin` | Location of images used in the cosmoscope | path (directory) |
`export_target` | Location to be used for exports | path (directory) | 
`history` | Copy each cosmoscope generated via Cosma to a `history` folder | `true` or `false` | `true`
`focus_max` | Maximum distance to selected node in focus mode | integer | 2
`record_types` | List of entity types | list | 
entity type | | string |
`fill` | Node type fill color | HTML color | 
`stroke` | Node type outline color (used when the node is filled with an image) | HTML color |
`link_types` | List of link types | list | 
link type | | string | 
`stroke` | Link type stroke style | `single` (solid line), `dash` (dashed line), `dash` (dotted line), `double` (two parallel lines)
`color` | Link type color | HTML color | 
`record_filters` | List of metadata filters | | 
metadata filter | Entities for which this metadata is present will be excluded when creating a cosmoscope | type, keyword, metadata declared in `record_metas` | 
`graph_background_color` | Color used in the background of the graph | HTML color |
`graph_highlight_color` | Color used when hovering and selecting nodes | HTML color |
`graph_highlight_on_hover` | Apply highlighting when hovering and selecting nodes | `true` or `false` | `true`
`graph_text_size` | Node label size | Integer betwen 2-15 | 10
`graph_arrows` | Show directional arrows on links | `true` or `false` | `true`
`node_size_method` | Node sizing method | `degree` (size proportional to degree) or `unique` (fixed size) | `degree`
`node_size` | Node size (when using fixed size) | Integer between 2 and 20 | 10
`node_size_max` | Maximum node size (when using proportional size) | Integer from 2 to 20 | 20
`node_size_min` | Minimum node size (when using proportional size) | Integer between 2 and 20 | 2
`attraction_force` | Force of attraction | Number between 50 and 600 | 200
`attraction_distance_max` | Maximum distance between nodes | Number between 200 and 800 | 250
`attraction_vertical` | Additional attraction towards the vertical axis | Number between 0 (disabled) and 1 | 0
`attraction_horizontal` | Additional attraction towards the horizontal axis | Number between 0 (disabled) and 1 | 0
`views` | List of registered views (which can only be created with the GUI version) | list 
`chronological_record_meta` | Metadata to be used for chronological mode | `created`, `last_edit`, `last_open`, `timestamp`, metadata declared in `record_metas` | `created`
`record_metas` | List of metadata (present in the data source) to be included in the cosmoscope | list
`title` | Cosmoscope title | string |
`author` | Cosmoscope author | string | 
`description` | Cosmoscope description | string |
`keywords` | Cosmoscope keywords | list |
keyword | | string |
`link_symbol` | String to be displayed in place of identifiers as link text for rendered internal links in cosmoscope | string 
`csl` | Bibliographic style | path (XML file) |
`bibliography` | Bibliographic data | path (JSON file) | 
`csl_locale` | Bibliographic location | path (XML file) | 
`css_custom` | CSS file for cosmoscope customization | path (CSS file) |
`devtools` | Show development tools (only in GUI) | `true` or `false` | `true`
`lang` | Cosmoscope language | `en` (English) or `fr` (French) | `en`

::: tip
The background and highlight colors can be changed directly via the configuration file, but all colors and all interface elements can be changed using a custom CSS style sheet.

Applying a vertical/horizontal force tightens the graph. A value of 0.1 is enough to bring back isolated nodes closer to the center.
:::

### Configuration template

Here is the template used by Cosma to generate a configuration file:

```
select_origin: directory
files_origin: ''
nodes_origin: ''
links_origin: ''
nodes_online: ''
links_online: ''
images_origin: ''
export_target: ''
history: true
focus_max: 2
record_types:
  undefined:
    fill: '#858585'
    stroke: '#858585'
link_types:
  undefined:
    stroke: simple
    color: '#e1e1e1'
record_filters: []
graph_background_color: '#ffffff'
graph_highlight_color: '#ff6a6a'
graph_highlight_on_hover: true
graph_text_size: 10
graph_arrows: true
node_size_method: degree
node_size: 10
node_size_max: 20
node_size_min: 2
attraction_force: 200
attraction_distance_max: 250
attraction_vertical: 0
attraction_horizontal: 0
views: {}
chronological_record_meta: last_edit
record_metas: []
title: ''
author: ''
description: ''
keywords: []
link_symbol: ''
csl: ''
bibliography: ''
csl_locale: ''
css_custom: ''
devtools: false
lang: en
```

## Creating content: text files (Markdown)

When the data source is set on `directory` (Markdown file directory), the data must comply with the following rules:

- content is written in Markdown, file extension is `.md`;
- metadata is expressed in YAML, in a header at the beginning of the file;
- internal links are expressed with a wiki-like syntax (double brackets `[[ ]]`) and based on unique identifiers.

The following subsections explain these rules in detail.

::: note
This combination of writing standards combines several textual cultures: documentation (enriching and indexing content with metadata); wikis (interrelating documents); index cards, Zettelkasten (organising one's notes); academic writing with Pandoc (using plain text as a source for exporting in various formats).

Therefore, Cosma works particularly well when used in tandem with writing environments that also adopt this approach, such as [Zettlr](https://zettlr.com) or the [Foam](https://foambubble.github.io/foam/) extension for Visual Studio Code and VSCodium.
:::

### Metadata

In order to be correctly interpreted by Cosma, Markdown files (`.md`) must include a [YAML](http://yaml.org) header at the beginning of the file. This header is created automatically when you create a file via Cosma. 

Example:

```
---
title: Title of the record
id: 20201209111625
types:
- undefined
tags:
- mot-clé 1
- mot-clé 2
---
```

The YAML header is delimited by two sets of three single dashes on a line (`---`). In YAML, a field consists of a name and a value separated by a colon.

In accordance with the YAML specification, the list of keywords can be written in *block* mode:

```yaml
tags:
- keyword 1
- keyword 2
```

Or in *flow* mode:

```yaml
tags: [keyword 1, keyword 2]
```

::: note
**Why a YAML header?**

Some applications opt to recognize file metadata heuristically. For example, if the first line of the file is a level 1 heading, then it will be interpreted as the title of the file; if the second line contains words prefixed with a `#` pound sign, then they will be interpreted as keywords.

This method is not interoperable: each program has its own conventions, which limits the user's ability to change tools.

Using a YAML header allows writers to declare different metadata explicitly and separately. This has the advantage of making the detection and manipulation of this metadata trivial, both by machines and humans. The use of a common format (such as YAML) increases the number of tools that can be used seamlessly with the same set of files. And widely used computer tools such as regular expressions and shell scripts allow people to convert their data themselves in a relatively simple way if needed.
:::

#### Predefined metadata

Cosma recognises and uses the following four fields:

`title`
: Mandatory.
: Title of the record.

`id`
: Mandatory.
: Unique identifier of the record. Must be a unique number. By default, Cosma generates 14-digit identifiers in the form of a timestamp (year, month, day, hours, minutes and seconds). This is inspired by Zettelkasten note-taking applications such as [The Archive](https://zettelkasten.de/the-archive/) and [Zettlr](https://www.zettlr.com).

`type` or `types`
: Optional.
: Record types. A record can have more than one type. If the `type` field is not specified or its value does not match one of the types declared in the configuration, Cosma will interpret the type of the record as `undefined`.

`tags`
: Optional.
: Keywords assigned to the record. The value must be a list. A record can have as many keywords as you wish. You can use `keywords` instead of `tags`, for compatibility with Pandoc. If a record has a `tags` field and a `keywords` field, only the keywords declared in the `tags` field are interpreted by Cosma.

`thumbnail`
: Optional.
: File name of an image to be used as thumbnail for this record in the cosmoscope (inside the corresponding node and at the top of the record pane).

`begin`
: Optional.
: Time metadata used for chronological mode.

`end`
: Optional.
: Time metadata used for chronological mode.

#### User-defined metadata

Other metadata can be added freely in the YAML header. By default, Cosma ignores this metadata when creating a cosmoscope: it is not included in the HTML rendering of the records. In order for this metadata to be taken into account, it must be declared in the `record_metas` field of the configuration file.

Example:

```
record_metas: [author, date, lang]
```

### Content

Cosma interprets files as being written in [CommonMark](https://spec.commonmark.org/0.30/), a strictly defined version of Markdown, a popular lightweight markup language.

::: tip
The [CommonMark tutorial](https://commonmark.org/help/) teaches you the basics of Markdown in 10 minutes.

If you want to learn how to use Markdown and Pandoc together, check out this online lesson: [Sustainable Authorship in Plain Text using Pandoc and Markdown](https://programminghistorian.org/en/lessons/sustainable-authorship-in-plain-text-using-pandoc-and-markdown).
:::

Cosma renders Markdown files into HTML. Therefore, Markdown files can also include HTML code. Cosma also supports [adding attributes by brackets](https://www.npmjs.com/package/markdown-it-attrs), as shown below.

```markdown
<div class="red">This paragraph will be red</div>

This paragraph will be red{.red}
```

Bitmap images can also be rendered using the Markdown syntax. Example:

```markdown
![Alternative text](image.jpg)
```

To reduce the size of the cosmoscope, use images hosted on the web and included via a URL. Example:

```markdown
![Alternative text](http://domain.com/image.jpg)
```

### Links

Within a record, you link to another record by writing its identifier between double brackets.

Example:

```
A link to [[20201209111625]] record B.
```

From v2 onwards, you can also include link text within the brackets.

Example:

```
A link to [[20201209111625|record B]]
```

Cosma allows you to define link types. Each link type is defined by a name, a colour and a stroke pattern. To apply a type to a link, add the name of the type followed by a colon before the identifier.

Example:

```
Concept B is derived from [[generic:20201209111625]] concept A.

Person D wrote against [[opponent:20201209111625]] person C.
```

::: astuce
If you do not use the alternative syntax, you can still improve the readability of records in the cosmoscope by using the `link_symbol` parameter. It accepts as value an arbitrary Unicode string, which will replace the identifier and square brackets in the HTML rendering of the records. This visually lightens the text by replacing numeric identifiers with a shorter, personal convention. This can be, for example, a single symbol such as a manicle ☞, an arrow →, a star ⟡, etc.
:::

### Unique identifiers

To be correctly interpreted by Cosma, each record must have a unique identifier. This identifier serves as a target for links between records.

**The identifier must be a unique string.**

By default, Cosma generates 14-digit identifiers in the form of a timestamp (year, month, day, hours, minutes and seconds). This is inspired by Zettelkasten note-taking applications such as [The Archive](https://zettelkasten.de/the-archive/) and [Zettlr](https://www.zettlr.com).

We plan to eventually allow the user to define an identifier pattern of their choice, like in Zettlr.

::: note
Many interrelated note-taking applications use file names as targets for links between files. They maintain links automatically when file names are changed. By choosing to use unique identifiers instead, we have designed Cosma with a more traditional, stricter, WWW-like approach. We believe this is the easiest way to avoid [link rot](https://en.wikipedia.org/wiki/Link_rot) in a sustainable way. Avoiding the reliance on automatic link maintenance is especially important if you wish to make your data less dependent on specific applications.
:::

### Creating records with Cosma

Cosma includes several commands that allow you to quickly create records with automatically generated YAML headers.

::: important
These commands only work when `select_origin` is set to `directory` (i.e. for Markdown files).

Creating files requires a configuration file with `files_origin` set to a valid path. This can either be a `config.yml` file in the current working directory, or a project indicated by adding the `-p/--projects` option.
:::

### `record` : create a record (“form” mode)

```
cosma record
cosma r
cosma record --project <name>
```

This command allows you to create a record in the manner of a form. Once the command is launched, the software prompts you for a title, one or several types, and one or several keywords. Only the title is required.

### `autorecord` : create a record (“one-liner” mode)

```
cosma autorecord <title> <type> <keywords>
cosma a <title> <type> <keywords>
cosma autorecord <title> <type> <keywords> --project <name>
```

This command allows you to create a record with a single input. Only the title is required. If you enter multiple types or multiple keywords, separate them with commas (spaces after the comma are ignored). Example: `type A, type B`, `keyword1, keyword2`.

### `batch` : create a batch of records

```
cosma batch <path>
cosma b <path>
cosma batch <path> --project <name>
```

This command allows you to create several records at once. `<path>` corresponds to the location of a file in JSON or CSV format describing the records to be created. As with all other record creation modes, the title is mandatory and the other fields are optional.

Example of a JSON file containing two records:

```json
[
  {
    "title": "Title of the record"
  },
  {
    "title": "Paul Otlet",
    "type": ["Person", "History"],
    "metas": {
        "first name" : "Paul",
        "family name": "Otlet"
    },
    "tags": ["documentation"],
    "begin" : "1868",
    "end" : "1944",
    "content": "Lorem...",
    "thumbnail" : "image.jpg",
    "references" : ["otlet1934"]
  }
]
```

Example of a CSV file containing these same records:

```csv
title,content,type:nature,type:field,meta:firstname,meta:lastname,tag:gender,time:begin,time:end,thumbnail,references
Title of the file,,,,,,,,,,,
Paul Otlet,Lorem...,Person,History,Paul,Otlet,man,1868,1944,image.png,otlet1934
```

::: note
**Batch record creation and identifiers**

Cosma generates 14-digit identifiers in the form of a timestamp (year, month, day, hours, minutes and seconds). This means you can manually create one record per second, or 86,400 records per day. Another way to phrase it is to say there is a range of 86,400 identifiers reserved for manual record creation each day. For example, on 15 January 2022, these identifiers range from 20220115000000 to 20220115235959.

To prevent generating duplicate identifiers, the batch creation mode generates identifiers by pseudo-timestamp. The first 8 digits, corresponding to the date (year, month, day), are real. Example: 20220115 (15 January 2022). On the other hand, those corresponding to the hours, minutes and seconds are false, generated outside of real time ranges. Example: 256495. As it is impossible to create a record manually at 25h 64min and 95s, there is no risk of generating duplicate identifiers by using both methods simultaneously. 

Because of this operation, it is possible to create up to 913,599 records per day and per directory in batch mode before running out of identifiers.
:::

## Creating content: tabular data (CSV)

Cosma can interpret tabular data contained in local or online CSV files. This is an alternative to using Markdown files.

Tabular data for Cosma must be contained in two files: one for nodes and one for links. The locations of these files must be specified in the configuration file.

::: note
You can generate CSV files with a spreadsheet program. In fact, it is precisely because online collaborative spreadsheet programs such as Google Sheets exist that we have added CSV support to Cosma: they provide a cheap and efficient way to set up collective knowledge work.

We offer [a Google Sheets template](https://docs.google.com/spreadsheets/d/1Wxm3lxgSnHaqsIVQVyuMR4TmiJwjDSr-KJWaKqNjz_o/) for you to use as a guide. One sheet should be dedicated to nodes and another to links. Click on File › Share › Publish to Web. Select the sheet containing the nodes, then change the format from "Web Page" to "Comma Separated Values (.csv)". Click "Publish" and copy the share link. Repeat the operation for the sheet containing the links (in our template, this is the "Extraction" sheet and not the "Links" sheet). Paste each link in the corresponding field of the project configuration.
:::

The column headers of the CSV files must comply with the following rules.

### Metadata for nodes

For nodes, only the `title` metadata is required.

name | description
----|------------
`title` | Title (required)
`id` | Unique identifier
`type:<name>` | Record typology. Each typology contains one or more types. For example, one column may be called `type:primary` and contain types like `person`, `work`, `institution`; another column may be called `type:secondary`, with other types.
`tag:<name>` | Keyword list
`meta:<name>` | User-defined metadata
`time:begin`, `time:end` | Metadata used by the chronological mode
`content` | Textual content of the record
`thumbnail` | File name of an image to include as a thumbnail in the record. Supported formats: JPG, PNG. The location of the image files must be specified via the `images_origin` parameter in the configuration file.
`reference` | List of citation keys to include in the bibliography of the record.

### Metadata for links

name | description
----|------------
`id` | Link identifier (required)
`source` | Identifier of the record from which the link originates (required)
`target` | Identifier of the record that the link targets (required)
`label` | Description of the link (optional). This description is displayed in the context tooltips of the links.

## `modelize`: creating a cosmoscope

```
cosma modelize
cosma m
cosma modelize --citeproc --custom-css
```

### Generating a sample cosmoscope

```
cosma modelize --sample
```

This command generates a sample cosmoscope. This does not require a configuration file. The cosmoscope contains an excerpt from the Cosma user manual in hypertextual form.

### Processing citations

```
cosma modelize --citeproc
```

Cosma includes automatic citation processing. This functionality is based on the same techniques as [Zettlr](https://www.zettlr.com): bibliographic data and styles use the [Citation Style Language (CSL)](https://citationstyles.org) standard, while the insertion of citations in the text is done with the [Pandoc citation syntax](https://pandoc.org/MANUAL.html#citation-syntax).

#### Required files

To automatically process citations, Cosma requires three files:

Bibliographic data
: File containing metadata describing bibliographic references. The required format is CSL JSON (extension `.json`).

Bibliographic style
: File containing the formatting rules for citations and bibliographies. The required format is CSL (extension `.csl`). You can download style files from the [Zotero CSL styles directory](https://www.zotero.org/styles).

Bibliographic localization
: File containing localized terms used in bibliographies (e.g. “publisher”, “issue”…). The required format is XML (extension `.xml`). You can download localization files from the [CSL project GitHub repository](https://github.com/citation-style-language/locales/tree/6b0cb4689127a69852f48608b6d1a879900f418b).

In the data file, each reference must have a unique identifier (`id`) that serves as a citation key. Example:

```json
[
  {
    "id":"goody1977",
    "author":[{"family":"Goody","given":"Jack"}],
    "citation-key":"goody1977",
    "event-place":"Cambridge",
    "ISBN":"978-0-521-21726-2",
    "issued":{"date-parts":[[1977]]},
    "language":"en",
    "number-of-pages":"179",
    "publisher":"Cambridge University Press",
    "publisher-place":"Cambridge",
    "title":"The Domestication of the Savage Mind",
    "type":"book"
  },
]
```

::: tip
You can use the bibliographic reference manager [Zotero](https://www.zotero.org/) with the [Better BibTeX](https://retorque.re/zotero-better-bibtex/) extension to create unique citation keys for each reference and have an automatically updated export of your library that Cosma can use.
:::

### Citation syntax

To cite a reference in a record, include the citation key for that reference using the [Pandoc citation syntax](https://pandoc.org/MANUAL.html#citation-syntax).

Example:

```
On writing as a technology of the intellect [@goody1977, 46-52]...
```

#### Rendering citations and bibliographies

When processing citations, each citation key is replaced with formatted text and a bibliography is generated below the body of each record containing references.

Example:

```
On writing as a technology of the intellect (Goody 1977, 46-52)…

Bibliography
------------

GOODY, Jack, 1977. The Domestication of the Savage Mind.
  Cambridge University Press. ISBN 978-0-521-21726-2.
```

The CSL JSON data matching the cited references is embedded in the cosmoscope. You can view and download this data in the cosmoscope by clicking on the “Data” button at the bottom of the left-hand side menu. You can also access it from within the cosmoscope source code, under the `<article id="citation-references">` tag.

### Applying custom CSS

```
cosma modelize --custom-css
```

It is possible to customize the appearance of a cosmoscope via CSS. To do this, set the `css_custom` parameter from the configuration file to the path of a CSS stylesheet, then add the `--custom-css` flag when generating the cosmoscope.

In order to know which selectors to use for which CSS declaration, open the cosmoscope in a web browser and use the browser's development tools to inspect the code, or consult Cosma's source code, specifically `/cosma-core/template.njk` (for the cosmoscope's HTML structure), `/cosma-core/styles.css` and `/cosma-core/print.css` (for the print styles enabled when printing a form).

The cosmoscope stylesheets use CSS variables to define the colors and fonts used. You can redefine these variables to change all the interface elements to which they apply. In the example below, the `custom.css` file contains declarations that change the fonts used in the cosmoscope:

```css
:root {
  --sans: "IBM Plex Sans", sans-serif;
  --serif: "IBM Plex Serif", serif;
  --mono: "IBM Plex Mono", monospace;
  --condensed: 'Avenir Next Condensed', sans-serif;
}
```

### Using a global configuration file

```
cosma modelize --project <name>
cosma m -p <name>
```

The `-p/--project` option applies the parameters of the `name` project.

### Excluding records from the cosmoscope

It is possible to exclude certain records from being included in the cosmoscope based on the `record_filters` parameter. The value of this parameter must be a list whose elements can be types, keywords or specific values of user-defined metadata (declared in `record_metas`). Records whose header contains at least one element of the list are excluded when generating the cosmoscope.

```
record_filters:
  - meta: <type/tag/name of a user-defined metadata>
    value: <value of type/tag/metadata>
```

For each filter, the `meta` parameter takes as its value either `type` (record type), `tag` (keyword), or the name of a used-defined metadata (declared in `record_metas`). The `value` parameter takes as value the type, keyword or metadata value for which to exclude records.

Here is an example. Consider the following record:

```
---
title: Paul Otlet
type: person
group: authors
tags: [documentation, pacifism]
---

Paul Otlet (1868-1944) was a Belgian lawyer, bibliographer
and pacifist who is considered the founder of
modern documentation...
```

The `group` metadata can be declared via `record_metas` in the configuration file:

```
record_metas: [group]
```

This allows you to use the `group` metadata (in addition to the title and keywords) as a criterion for excluding certain records via `record_filters`. In the example below, all records containing `group: authors` and/or the keyword `pacifism` are excluded:

```
record_filters:
  - meta: group
    value: authors
  - meta: tag
    value: pacifism
```

### History

By default, Cosma automatically copies each generated cosmoscope to a `history` directory. This can be disabled by setting `history: false` in the configuration file.

### Errors and warnings

If Cosma encounters problems during the generation of a cosmoscope, it creates an error report in a `reports` subdirectory of the user data directory. If the latter does not exist, `reports` is placed in the Cosma installation directory.

## Using the cosmoscope

### Layout

The cosmoscope is organised in three columns:

Left side panel (Menu)
: Displays exploratory features such as the index, search bar, filters, views and graph settings.

Central area (Graph)
: Displays the graph and associated controls (zoom, focus).

Right side panel (Record)
: Displays the records with a list of outgoing links (Links) and incoming links (Backlinks).

### Graph

The central area of the cosmoscope is an interactive graph of labelled nodes. Each node corresponds to a record; the label corresponds to the title of the record. The links correspond to the links established between the records via their identifiers.

Hovering over a node temporarily highlights it and its connections. Clicking on a node highlights it and its connections and opens the corresponding record.

You can zoom in and out of the graph freely with a mouse or touchpad, by double-clicking on the graph background or with the dedicated buttons at the bottom left. Press `C` to zoom in on a selected node (whose record is open). The Reset button (shortcut: `R`) resets the zoom.

Nodes are organised in space by a force simulation algorithm. A coloured bar at the top of the Menu indicates the state of the drawing process (active or finished). Click on this bar (shortcut: `Space`) to start an additional simulation cycle. This does not reset the graph but re-runs the algorithm on the existing graph, improving its layout.

::: tip
If you have a particularly tangled graph, pressing `Space` a few times will progressively untangle it.
:::

The graph is not fixed: nodes can be moved by click and drag. However, the nodes and links remain permanently subject to the simulation, so it is not possible to arrange them manually. Modifying the records may change the arrangement of the nodes in space.

The way the graph is displayed can be changed temporarily via the controls under Graph settings in the Menu. To change the display permanently, change the default values of the corresponding settings in the configuration file.

::: tip
Change the strength and maximum distance between nodes to adapt the display to your screen resolution and size. Add vertical/horizontal attraction to tighten the graph and bring isolated nodes closer to the center.
:::

The graph can be displayed on all types of screens but is not optimised for mobile devices: touch does not give access to certain interactions such as hovering, and small screens greatly limit the usefulness of the graph.

### Records

Records can be opened by clicking on a node, an index entry, a search engine suggestion, or a link in the body or footer of a record. Opening a record displays its contents in the right side panel.

In Cosma, you can go forward or backward with the Previous / Next buttons located in the left side panel. In a web browser, you can do the same via the browser's Previous / Next functions. Opening a record adds the corresponding identifier at the end of the URL. This allows you to copy direct links to records.

Clicking on the “Close” button closes the right side panel and deselects the corresponding node in the graph.

The links in the records are clickable. In a browser, you can open these links in a new tab via a right click. The title of the link (displayed in a tooltip after 1-2 seconds of hovering) is the title of the corresponding card.

At the bottom of each record is a list of outgoing and incoming links (or backlinks). The links and backlinks are contextualised: when hovering over them, a tooltip is displayed, showing the paragraph that surrounds this link in the corresponding record.

::: note
This is one the most useful features in hypertext systems. It is famously absent from the Web. Many interrelated note-taking applications treat links as “first-class citizens”, and this includes contextualised backlinks. However, when these notes are shared on the Web, this feature is not always included, or it is only inclued in a paid plan. With Cosma, contextualised backlinks are part of the package, whether you're the author of a cosmoscope working locally, or someone exploring a cosmoscope on the Web.
:::

### Focus mode

Activate Focus mode (shortcut: `F`) by ticking the “Focus” box at the bottom left of the graph. In Focus mode, only direct connections to the selected node are displayed in the interface. Focus mode only works if you have selected a record.

You can increase the maximum distance displayed in Focus mode with the slider located beneath the Focus button. The slider's maximum value can be set through the `focus_max` parameter in the configuration file. A value of 1 means only the immediate connections will be displayed when in Focus mode. A value of 2 means you can extend the focus two connections of connections, and so on.

::: tip
The focus level slider can be controlled with the arrow keys. You can combine shortcuts: `F` to activate Focus mode, then arrow keys to increase and decrease the focus level.
:::

### Search bar

The text field at the top of the Menu allows you to search record titles. It suggests a list of records whose title is closest to what you type in the search bar (using fuzzy search). Clicking on a suggestion selects the corresponding node in the graph and opens the corresponding record in the right side panel.

::: important
The available suggestions are constrained by the filters and focus mode: a record hidden by either of these features will not be accessible via the search engine. When you want to start from scratch for a new query, you can click on Reset display (shortcut: `Alt` + `R`).
:::

### Filtering by record type

The list of record types in the Menu allows you to filter the display. Deselecting a type hides the corresponding records in the graph, index and search engine suggestions. Deselecting a type while holding down the `Alt` key hides the records of all the other types.

For a type to appear in this list, it must be declared in the configuration file and be assigned to at least one record.

### Filtering by keywords

The list of keywords located in the left side panel allows you to filter the graph. Selecting a keyword filters the graph and the index to display only the records that contain this keyword. You can activate several keywords simultaneously. To deactivate a keyword, click again on the corresponding button.

For a keyword to appear, it must have been declared in the `tags` (or `keywords`) field of the YAML header of at least one record.

### Index

The alphabetical index of records in the Menu allows you to select a record from a list rather than through the graph. Clicking on a title selects the corresponding node in the graph and opens the corresponding record. The index can be sorted in ascending or descending alphabetical order.

::: important
Record type filters, keywords and Focus mode all modify the display of the index. A record hidden by either of these features will not be accessible via the search engine. You can reset all these effects by clicking on the “Reset current view” button under Views in the Menu (shortcut: `Alt` + `R`).
:::

### Views

Views are a feature of the GUI version of Cosma, which consists in saving the state of the graph (selected form, active filters, focus mode) for later access, by adding a button in the Views section of the left side panel. Clicking on this button applies all the settings that were active at the time the view was saved. Clicking the button again restores the normal view. It is not possible to create a view from a cosmoscope outside the GUI version.

## Sharing and publishing a cosmoscope

Cosmoscopes exported via the Share menu include metadata (title, author, description, keywords) if they are set in the configuration file. These are displayed in the “About” panel. They are also included in the cosmoscope source code in the form of `meta` tags.

The exported `cosmoscope.html` file can be shared like any other computer file: email, file transfer, messaging, uploading to a server…

In the case of a cosmoscope published on the Web, it is possible to link directly to a record by adding its identifier preceded by a `#` pound sign at the end of the URL. Example:

`https://domain.com/cosmoscope.html#20210427185546`

## Credits

### Team

- [Arthur Perret](https://www.arthurperret.fr/) (project lead)
- [Guillaume Brioudes](https://myllaume.fr/) (developer)
- [Clément Borel](https://mica.u-bordeaux-montaigne.fr/borel-clement/) (researcher)
- [Olivier Le Deuff](http://www.guidedesegares.info/) (researcher)

### Dependencies

To improve the maintainability and readability of the source code, the development team uses the following libraries:

- Zettlr/citr : 1.2.2
- Axios : 0.27.2
- Citeproc : 2.4.62
- Csv-parse : 5.3.0
- D3 : 4.13.0
- D3-array : 2.12.1
- D3-scale : 3.3.0
- Fuse.js : 6.6.2
- Glob : 7.2.0
- Graphology : 0.25.1
- Graphology-traversal : 0.3.1
- Hotkeys-js : 3.10.0
- Markdown-it : 13.0.1
- Markdown-it-attrs : 4.1.4
- Nunjucks : 3.2.3
- Slugify : 1.6.5
- Yaml : 2.2.1
- Babel/core : 7.20.5
- Babel/preset-env : 7.20.2
- Faker-js/faker : 7.5.0
- Babel-loader : 9.1.0
- Chai : 4.3.6
- Chai-fs : 2.0.0
- Cypress : 10.9.0
- Mocha : 10.0.0
- Prettier : 2.8.0
- Webpack : 5.74.0
- Webpack-cli : 4.10.0
- Webpack-dev-server : 4.11.1

## Changelog

### v2.0.0

- Manage multiple configurations (global and local)
- Use alternative syntax for links
- Include user-defined metadata in batch creation
- Display user-defined metadata in records in the cosmoscope
- Exclude certain records when generating the cosmoscope, based on types, keywords and user-defined metadata
- Display nodes in chronological mode
- Embed images in the cosmoscope (in base64). Supported formats: JPG, PNG
- Use an image as default thumbnail for a record type
- Use an image as thumbnail for a record
- Define an outline color for node types
- Choose between fixed size nodes and nodes proportional to their degree

#### Improvements

- Links in bibliography are now clickable
- Messages displayed at command execution are more informative
- The error and warning report is more informative
- Keywords at the top of cards in the cosmoscope no longer overflow the layout
- Cosma now reads directories recursively (issue [#4](https://github.com/graphlab-fr/cosma/issues/4))
- When `history: true`, cosmoscopes are saved in a `history` subdirectory, either in the user data directory for global configurations, or in the same directory as the local configuration.

#### Fixed bugs

- Link/backlink context tooltips now correctly highlight the target record (issue [#23](https://github.com/graphlab-fr/cosma/issues/23))

#### Known bugs

- Citations are processed in link context tooltips but not in backlink context tooltips
- Windows style carriage return and line feeds hidden characters (CR LF) are not parsed correctly
- When the data comes from online CSV files, the `modelize` command does not terminate after generating the cosmoscope
- If a record's identifier is not a string of numbers, links to that record do not work
- Links to records with spaces in their identifier are not rendered correctly in the record's body