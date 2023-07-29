---
title: User manual (GUI)
version: GUI v2.0-beta-2
date: Last Modified
description: >-
  User manual for Cosma GUI v2 beta.
lang: en
layout: doc
tags: user
---

## Installing and updating

Cosma is available in two versions: a graphical user interface (GUI) application and a command line interface (CLI) application. Information about the CLI version is detailed [on a dedicated page](https://cosma.graphlab.fr/en/docs/cli/user-manual/).

From v2 onwards, both versions of Cosma are available for macOS, Windows and Linux (Debian). Visit [the Download page on Cosma’s website](https://cosma.graphlab.fr/en/download/) to get the latest version of the application. Please note that the application is not signed with a security certificate, so you must have administrator privileges on your session to run it.

On macOS
: Download and unzip `Cosma.app.zip`, then place it in `~/Applications`. For the first launch, right click on the application then select Open to run it.

On Windows
: Download and unzip `Cosma-win32-x64.zip`, then rename the folder `Cosma` and place it in `C:\Program Files` or `C:\Program Files (86)`.

On Linux
: Download `Cosma_amd64.deb`, then open it with your package manager to install Cosma.

Installing Cosma automatically creates a support folder at this location (where `*` stands for the username):

On macOS
: `/Users/*/Library/Application Support/cosma`

On Windows
: `C:\Utilisateurs\*\AppData\Roaming\cosma`

On Linux
: … <!-- À COMPLÉTER -->

### Updating

Cosma is not updated automatically. You can be notified of an update by subscribing to either of these sources:

- [cosma-annonces](https://groupes.renater.fr/sympa/info/cosma-annonces) (email list dedicated exclusively to Cosma update announcements);
- [RSS feed of Cosma’s website](https://cosma.graphlab.fr/feed.xml) (contains release notes published on the site).

::: important
**If Cosma does not work anymore after an update:** the structure of the [support folder](#support-folder) has probably been modified and is not compatible with the old version. Delete the user folder and restart the application. The support folder will be re-created and will work correctly.
:::

## Preferences (application settings)

Cosma's settings can be modified via the Preferences.

### Application language

You can choose between English and French as the language for Cosma's interface.

A restart of the application is required for the language change to take effect.

The language can also be set individually for each project via its Configuration.

### Development Tools

Check this box to access the development tools via the View menu. This allows you to inspect the application's code.

## Create a project

To start using Cosma, create a project:

- click on the Projects menu and then on Add a project ;
- use the drop-down menu to indicate the nature of your data: Markdown files, local CSV files or online CSV files;
- select the location of your data via the file selector;
- click OK.

To change a project's settings, open it and click on the [Configuration](#configuration) menu.

## Creating content

You can create content for Cosma in two ways: as text files written in Markdown, or as tabular data contained in CSV files. This section focuses on the first method.

::: important
Regardless of the method you choose for a given project, Cosma needs to know the location of the data. This information must be entered in the project configuration.

For text files written in Markdown, select "Markdown files" and then select the relevant directory. Cosma will interpret all Markdown files contained in this directory as well as in any subdirectories that may be present.
:::

Cosma does not require that you use any particular writing software. However, it only correctly interprets files that comply with the following rules:

- content is written in Markdown, file extension is `.md`;
- metadata is expressed in YAML, in a header at the beginning of the file;
- internal links are expressed with a wiki-like syntax (double brackets `[[ ]]`) and based on unique identifiers.

The following subsections explain these rules in detail.

::: note
This combination of writing standards combines several textual cultures: documentation (enriching and indexing content with metadata); wikis (interrelating documents); the Zettelkasten method (organising one's notes); academic writing with Pandoc (using plain text as a source for exporting in various formats).

Therefore, Cosma works particularly well when used in tandem with writing environments that also adopt this approach, such as [Zettlr](https://zettlr.com) or the [Foam](https://foambubble.github.io/foam/) extension for Visual Studio Code and VSCodium.
:::

You can create a Cosma-compliant file via the application's record creation form (click File › New record, or type `Ctrl + N`) or manually with the text editor of your choice. Some text editors can save you time with document templates, which you can use to quickly create records for Cosma.

### Metadata

In order to be correctly interpreted by Cosma, Markdown files (`.md`) must include a [YAML](http://yaml.org) header at the beginning of the file.

This header is created automatically when you create a file via Cosma. You can also create it manually, or with the help of a template in certain text editors.

Example:

```
---
title: Title of the record
id: 20201209111625
type:
- undefined
tags:
- keyword 1
- keyword 2
---
```

The YAML header is delimited by two sets of three single dashes on a line (`---`).

In accordance with the YAML specification, lists can be written in *block* mode:

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

#### Known metadata

Cosma recognises and uses the following four fields:

`title`
: Mandatory.
: Title of the record.

`id`
: Mandatory.
: Unique identifier of the record. Must be a unique string. By default, Cosma generates 14-digit identifiers in the form of a timestamp (year, month, day, hours, minutes and seconds). This is inspired by Zettelkasten note-taking applications such as [The Archive](https://zettelkasten.de/the-archive/) and [Zettlr](https://www.zettlr.com).

`type` or `types`
: Optional.
: Record type. A record can have one or more types. If the `type` field is not specified or its value does not match one of the types declared in the configuration, Cosma will interpret the type of the record as `undefined`.

`tags`
: Optional.
: Keywords assigned to the record. The value must be a list. A record can have as many keywords as you wish. You can use `keywords` instead of `tags`, for compatibility with Pandoc. If a record has a `tags` field and a `keywords` field, only the keywords declared in the `tags` field are interpreted by Cosma.

`thumbnail`
: Optional.
: File name of an image to be used as a thumbnail for this form in the cosmoscope (inside the corresponding node and at the top of the right panel when the form is open).

`begin`
: Optional.
: Time metadata used by the chronological mode.

`end`
: Optional.
: Time metadata used by the chronological mode.

<!-- REPRENDRE ICI -->

### Content

Cosma interprets files as being written in [CommonMark](https://spec.commonmark.org/0.30/), a strictly defined version of Markdown, a popular lightweight markup language.

::: tip
The [CommonMark tutorial](https://commonmark.org/help/) teaches you the basics of Markdown in 10 minutes.

If you want to learn how to use Markdown and Pandoc together, check out this online lesson: [Sustainable Authorship in Plain Text using Pandoc and Markdown](https://programminghistorian.org/en/lessons/sustainable-authorship-in-plain-text-using-pandoc-and-markdown).
:::

Cosma renders Markdown files into HTML. Therefore, Markdown files can also include HTML code, as well as SVG code. Cosma also supports [adding attributes by brackets](https://www.npmjs.com/package/markdown-it-attrs), as shown below.

```markdown
<div class="red">This paragraph will be red</div>

This paragraph will be red{.red}
```

JPG and PNG images can be included using the Markdown syntax. Example:

```markdown
![Alternative text](image.jpg)
```

Embedded images can significantly increase the weight of a cosmoscope. You may want to use images hosted on the web. Example:

```markdown
![Alternative text](http://domain.com/image.jpg)
```

#### Links

Within a record, you link to another record by writing its identifier between double brackets.

Example:

```
A link to [[20201209111625]] record B.
```

These links are rendered in HTML format with the id as clickable text:

```html
A link to <a href="#20201209111625">20201209111625</a> record B.
```

You can use the Link symbol option, located in the project configuration, to define a clickable text that applies to all these internal links. It can be a single Unicode character, such as → or ☞.

```
A link to [[20201209111625]] record B.
```

```html
A link to <a href="#20201209111625">→</a> record B.
```

You can also manually set the clickable text for each link.

```
A link to [[20201209111625|record B]].
```

```html
A link to <a href="#20201209111625">record B</a>.
```

Finally, Cosma allows you to define [link types](#link-types). Each link type is defined by a name, a colour and a stroke pattern. To apply a type to a link, add the name of the type followed by a colon before the identifier. This also works if you manually set the clickable link text.

Example:

```
Concept B is derived from [[generic:20201209111625]] concept A.

Person D wrote against [[opponent:20201209111625|person C]].
```

#### Unique identifiers

To be correctly interpreted by Cosma, each record must have a unique identifier. This identifier serves as a target for links between records.

**The identifier must be a unique string.**

By default, Cosma generates 14-digit identifiers in the form of a timestamp (year, month, day, hours, minutes and seconds). This is inspired by Zettelkasten note-taking applications such as [The Archive](https://zettelkasten.de/the-archive/) and [Zettlr](https://www.zettlr.com).

We plan to eventually allow the user to define an identifier pattern of their choice, like in Zettlr.

::: note
Many interrelated note-taking applications use file names as targets for links between files. They maintain links automatically when file names are changed. By choosing to use unique identifiers instead, we have designed Cosma with a more traditional, stricter, WWW-like approach. We believe this is the easiest way to avoid [link rot](https://en.wikipedia.org/wiki/Link_rot) in a sustainable way. Avoiding the reliance on automatic link maintenance is especially important if you wish to make your data less dependent on specific applications.
:::

### Creating records with Cosma

Click on File › New record (`Ctrl/Cmd + N`) to open the record creation form.

Only the title is mandatory. Other fields are optional.

You can assign one or more types to the new record. These types must be defined beforehand in Configuration › Record types.

You can also add keywords to the record. Keywords must be separated by commas. For example: `keyword 1, keyword 2`. A visual aid shows when the keywords are correctly entered (they become highlighted).

Click OK to create the record.

::: note
The filename will be generated from the title. For better interoperability between different operating systems, the filename contains only unaccented alphanumeric characters and dashes.

Example: a record entitled “Déjà vu” will be saved as `deja-vu.md`.
:::

## Creating content from tabular data (CSV)

Cosma can interpret tabular data contained in local or online CSV files. This data must comply with the following rules.

### Data files: nodes and links

Tabular data for Cosma must be contained in two files: one for nodes and one for links. The locations of these files must be specified in the configuration.

::: note
This is similar to the way Gephi works: nodes are listed in one table and links in another table.
:::

### Metadata (column headers)

Data files must contain column headers corresponding to the metadata used by Cosma.

#### Metadata for nodes

For nodes, only the `title` metadata is required.

name | description
----|------------
`title` | Record title (required)
`id` | Unique identifier
`type:<nom>` | Record typology. Each typology contains one or more types. Ex: one column may be called `type:primary` and contain types like `person`, `work`, `institution`; another column may be called `type:secondary`, with other types. The `<name>` is used only internally by Cosma. It can be chosen freely: columns could be titled `type:foo` and `type:bar` or whatever you prefer; it does not appear in the cosmoscope.
`tag:<nom>` | List of keywords
`meta:<nom>` | User defined metadata
`time:begin`, `time:end` | Metadata used by chronological mode
`content` | Content to be displayed in the record pane in the cosmoscope
`thumbnail` | File name of an image to be included as a thumbnail in the record. Supported formats: JPG, PNG. The location of the image files must be set in the configuration.
`reference` | List of citation keys to include in the record's bibliography.

#### Metadata for links

name | description
----|------------
`id` | Link identifier (required)
`source` | Identifier of the record from which the link originates (required)
`target` | Identifier of the record targeted by the link (required)
`label` | Link description (optional). This description is displayed in link context tooltips.

## Creating a cosmoscope

Click on New cosmoscope (`Cmd/Ctrl + R`) to generate a new cosmoscope. It will automatically appear in the main window.

Cosma automatically creates an error report that describes any problems encountered during the generation of a cosmoscope. Click on File › History (`Cmd/Ctrl + H`) and select an entry to view the associated error report.

## Citations and bibliographies

Cosma includes the option to automatically process citations and generate bibliographies. This is based on the same ecosystem as [Zettlr](https://www.zettlr.com): bibliographic data and styles use the [Citation Style Language (CSL)](https://citationstyles.org) standard, while the insertion of citations within Markdown files uses the [Pandoc citation syntax](https://pandoc.org/MANUAL.html#citation-syntax).

### Required files

To process citations, Cosma requires three files:

Bibliographic data
: File containing metadata describing bibliographic references. The required format is CSL JSON (extension `.json`).

Bibliographic style
: File containing formatting rules for citations and bibliographies. The required format is CSL (extension `.csl`). You can download style files from the [Zotero CSL styles directory](https://www.zotero.org/styles).

Bibliographic localization
: File containing localized bibliographic terms (e.g. publisher, issue…) in the language of your choice. The required format is XML (extension `.xml`). You can download localisation files from the [CSL project GitHub repository](https://github.com/citation-style-language/locales/tree/6b0cb4689127a69852f48608b6d1a879900f418b).

In the bibliographic data file, each reference must have a unique identifier (`id`) which serves as a citation key. Example:

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

### Creating a cosmoscope with citations

Click on File › New cosmoscope with citations (`Cmd/Ctrl + Shift + R`) to generate a cosmoscope with citation processing enabled. Citation processing is also available when [exporting](#sharing-a-cosmoscope). Each citation key is then replaced with formatted text, and a bibliography is generated below the body of each record containing references.

Example:

```
On writing as a technology of the intellect (Goody 1977, 46-52)…

Bibliography
------------

GOODY, Jack, 1977. The Domestication of the Savage Mind.
  Cambridge University Press. ISBN 978-0-521-21726-2.
```

The CSL JSON data matching the cited references is embedded in the cosmoscope. You can view and download this data in the cosmoscope by clicking on the “Data” button at the bottom of the left-hand side menu. You can also access it from within the cosmoscope source code, under the `<article id="citation-references">` tag.

## History

By default, Cosma automatically exports each cosmoscope to a `cosma-history` directory located in the operating system's temporary directories.

To enable or disable this, click Configuration › Automatically save cosmoscopes to history.

The active cosmoscope is always recorded in the history as the last entry. This last entry is opened when the application is launched. If the automatic recording of cosmoscopes is deactivated, this last entry will simply be overwritten with each new cosmoscope generated.

Click on File › History (`Cmd/Ctrl + H`) to view and manage the history entries using the following buttons:

Edit description
: Add or edit the text describing the history entry.

Open in Cosma
: Open the cosmoscope in the main window.

Locate file
: Reveal the cosmoscope in the operating system file explorer.

Error report
: Display the error report created during the generation of the cosmoscope.

Delete
: Delete a history entry.

Empty History…
: Delete the temporary directory `cosma-history` and all history entries it contains.

## Using the cosmoscope

### Layout

The cosmoscope is organised in three columns:

Left side panel (Menu)
: Displays exploratory features such as the index, search bar, filters, views and graph settings.

Central area (Graph)
: Displays the graph and associated controls (zoom, focus).

Right side panel (Record)
: Displays the records with a list of outgoing links (Links) and incoming links (Backlinks).

Cosmoscopes opened in Cosma or exported and opened in a Web browser are functionally identical, with only one difference: the buttons at the top of the Menu are correspond to GUI features (creating records, generating cosmoscopes, etc.) and therefore are only displayed in Cosma.

### Graph

The central area of the cosmoscope is an interactive graph of labelled nodes. Each node corresponds to a record; the label corresponds to the title of the record. The links correspond to the links established between the records via their identifiers.

Hovering over a node temporarily highlights it and its connections. Clicking on a node highlights it and its connections and opens the corresponding record.

You can zoom in and out of the graph freely with a mouse or touchpad, by double-clicking on the graph background or with the dedicated buttons at the bottom left. Press `C` to zoom in on a selected node (whose record is open). The Reset button (shortcut: `R`) resets the zoom.

Nodes are organised in space by a force simulation algorithm. A coloured bar at the top of the Menu indicates the state of the drawing process (active or finished). Click on this bar (shortcut: `Space`) to start an additional simulation cycle. This does not reset the graph but re-runs the algorithm on the existing graph, improving its layout.

::: tip
If you have a particularly tangled graph, pressing `Space` a few times will progressively untangle it.
:::

The graph is not fixed: nodes can be moved by click and drag. However, the nodes and links remain permanently subject to the simulation, so it is not possible to arrange them manually. Modifying the records may change the arrangement of the nodes in space.

The way the graph is displayed can be changed temporarily via the controls under Graph settings in the Menu. To change the display permanently, change the default values of the corresponding settings in Configuration › Graph.

::: tip
Change the strength and maximum distance between nodes to adapt the display to your screen resolution and size. Add vertical/horizontal attraction to tighten the graph and bring isolated nodes closer to the center.
:::

The graph can be displayed on all types of screens but is not optimised for mobile devices: touch does not give access to certain interactions such as hovering, and small screens greatly limit the usefulness of the graph.

### Records

Records can be opened by clicking on a node, an index entry, a search engine suggestion, or a link in the body or footer of a record. Opening a record displays its contents in the right side panel.

In Cosma, you can go forward or backward with the Previous / Next buttons located in the left side panel. In a web browser, you can do the same via the browser's Previous / Next functions. Opening a record adds the corresponding identifier at the end of the URL. This allows you to copy direct links to records.

Clicking on the “Close” button closes the right side panel and deselects the corresponding node in the graph.

The links in the records are clickable. In a browser, you can open these links in a new tab via a right click. The title of the link (displayed in a tooltip after 1-2 seconds of hovering) is the title of the corresponding card.

::: tip
To improve the readability of the records in the cosmoscope, Cosma includes an option to customise the text of the links. In Configuration › Link symbol, enter one or more Unicode characters (letters, numbers, symbols...). Example: ☞. This string replaces the identifier in square brackets in the HTML rendering of the records.
:::

At the bottom of each record is a list of outgoing and incoming links (or backlinks). The links and backlinks are contextualised: when hovering over them, a tooltip is displayed, showing the paragraph that surrounds this link in the corresponding record.

::: note
This is one the most useful features in hypertext systems. It is famously absent from the Web. Many interrelated note-taking applications treat links as “first-class citizens”, and this includes contextualised backlinks. However, when these notes are shared on the Web, this feature is not always included, or it is only inclued in a paid plan. With Cosma, contextualised backlinks are part of the package, whether you're the author of a cosmoscope working locally, or someone exploring a cosmoscope on the Web.
:::

### Focus mode

Activate Focus mode (shortcut: `F`) by ticking the “Focus” box at the bottom left of the graph. In Focus mode, only direct connections to the selected node are displayed in the interface. Focus mode only works if you have selected a record.

You can increase the maximum distance displayed in Focus mode with the slider located beneath the Focus button. The slider's maximum value can be set in Configuration › Maximum focus level. A value of 1 means only the immediate connections will be displayed when in Focus mode. A value of 2 means you can extend the focus two connections of connections, and so on.

::: tip
The focus level slider can be controlled with the arrow keys. You can combine shortcuts: `F` to activate Focus mode, then arrow keys to increase and decrease the focus level.
:::

### Chronological mode

The Chronological mode button at the bottom left of the graph displays an interactive timeline you can use to modify the display of nodes according to a specific time metadata:

- creation date (default) ;
- date of last modification ;
- date of last opening ;
- identifier, if it corresponds to a timestamp (which is the case for identifiers generated by Cosma);
- any user-defined metadata from the configuration, if it corresponds to a date in YYYY-MM-DD format.

### Search bar

The text field at the top of the Menu allows you to search record titles. It suggests a list of records whose title is closest to what you type in the search bar (using fuzzy search). Clicking on a suggestion selects the corresponding node in the graph and opens the corresponding record in the right side panel.

::: important
The available suggestions are constrained by the [filters](#filter-display-by-types) and the [focus-mode](#focus-mode): a record hidden by either of these features will not be accessible via the search engine. When you want to start from scratch for a new query, you can click on Reset display (shortcut: `Alt` + `R`).
:::

### Filtering by record type

The list of record types in the Menu allows you to filter the display. Deselecting a type hides the corresponding records in the graph, index and search engine suggestions. Deselecting a type while holding down the `Alt` key hides the records of all the other types.

For a type to appear in this list, it must be declared in Configuration › Record types and be assigned to at least one record.

### Filtering by keywords

The list of keywords in Menu allows you to filter the graph. Selecting a keyword displays the corresponding nodes in the graph and restricts the index to the corresponding records. You can activate several keywords simultaneously. To deactivate a keyword, click the corresponding button again.

For a keyword to appear, it must have been declared in the `tags` field of the YAML header of at least one record.

### Index

The alphabetical index of records in the Menu allows you to select a record from a list rather than through the graph. Clicking on a title selects the corresponding node in the graph and opens the corresponding record. The index can be sorted in ascending or descending alphabetical order.

::: important
Record type filters, keywords and Focus mode all modify the display of the index. A record hidden by either of these features will not be accessible via the search engine. You can reset all these effects by clicking on the “Reset current view” button under Views in the Menu (shortcut: `Alt` + `R`).
:::

### Views

At any time, the state of the graph (selected record, active filters, focus mode) can be saved for quick access. This works like a bookmark. Click the Save view button under Views in the Menu and enter a name. This adds an eponymous button to the Views section. Clicking this button applies all settings that were active at the time the view was saved. Clicking the button again restores the normal view.

::: important
Views currently don't work as well as we'd like, so we're working on improving the functionality.
:::

## Sharing a cosmoscope

Click on File › Share (`Cmd/Ctrl + E`) to export a comoscope to be used outside of the application.

Two options are available:

Process citations
: Process citation keys to generate bibliographies within the records and add bibliographic data to the cosmoscope.

Custom CSS
: Apply a custom CSS stylesheet to modify the appearance of the cosmoscope.

::: note
If the options are greyed out, it means that the corresponding settings in Preferences are not filled in.
:::

Cosmoscopes exported via the Share menu include metadata (title, author, description, keywords) if they are set in Configuration › Metadata. These are displayed in the “About” panel. They are also included in the cosmoscope source code in the form of `meta` tags.

The toolbar at the top of the Menu only works in Cosma. It is therefore hidden in cosmoscopes exported via the Share menu. If a title has been set in Configuration › Metadata, it will be displayed instead.

The exported `cosmoscope.html` file can be shared like any other computer file: email, file transfer, messaging, uploading to a server…

In the case of a cosmoscope published on the Web, it is possible to link directly to a record by adding its identifier preceded by a `#` pound sign at the end of the URL. Example:

`https://domain.com/cosmoscope.html#20210427185546`

## Configuration

Click Preferences (`Ctrl + o` or `Cmd + ,`) to configure the currently opened project.

::: important
Most of the configuration options will only work if a directory is set in Configuration › General › Records directory.
:::

### General

Select a display language
: Allows you to choose the language you wish to apply to the application interface and to the cosmoscopes.
: The application must be restarted for the language change to take effect. Cosma also does not automatically re-generate a cosmoscope following a change of language. It is therefore necessary to manually re-generate a cosmoscope to see the change take effect.

Records directory
: Path to the directory containing the Markdown files. New records created with Cosma are added to this directory.

Images directory
: Location of the images used in the cosmoscope. This allows you to use images stored in this location by indicating only their relative path (e.g. `image.jpg`).

Additional metadata
: YAML fields other than the predefined ones (title, type, keywords) to be included in the cosmoscope.

Automatically save cosmoscopes in the history
: By default, Cosma automatically exports each cosmoscope to a `cosma-history` directory located in the operating system's temporary directories. Uncheck this option to disable this automatic export. The active cosmoscope is always recorded in the history as the last entry. This last entry is opened when the application is launched. If the automatic recording of cosmoscopes is deactivated, this last entry will simply be overwritten with each new cosmoscope generated..

Link symbol
: Enter one or more Unicode characters (letters, numbers, symbols…). Example: ☞. This string replaces the identifier and square brackets in the HTML rendering of the records.

### Record types

This section allows you to define different types of records. For each type, enter a name and a colour.

To assign a type to a record, add `type: name` to its YAML header. A record can have one or more types. If the `type` field is not specified or its value does not match one of the types stored in the configuration, Cosma will interpret the type of the record as `undefined`.

::: note
The colour of the `undefined` type can be changed, but the type cannot be removed.
:::

### Link types

This section allows you to define different types of links. For each type, enter a name, a colour and a stroke type. The available stroke types are:

- single
- double
- dash
- dotted

To apply a type to a link, add the name of the type followed by a colon before the identifier.

::: note
The colour and stroke type of the `undefined` type can be changed, but the type cannot be removed.
:::

::: tip
The graphic settings of the links affect their readability in the graph. For example, if you set undefined links to grey dotted lines and a special link type to black solid lines, the special links will be more visible in the graph.
:::

### Graph

The graph parameters can be changed live in the cosmoscope. This allows you to test different values before transferring them to the configuration. The values set in the configuration are restored each time the cosmoscope is reloaded and each time a new one is generated.

Background colour
: The background colour of the graph.

Highlight colour
: The colour that is applied to nodes and links when hovering and selecting.

::: note
We made these two colour settings accessible via the interface as they are likely to be changed by many users. But all interface colours can be changed using a custom CSS style sheet (see Configuration › Advanced).
:::

Label text size
: Defines the size of the text of the labels of the nodes of the graph. The size is in pixels. The value must be between 2 and 15.

Maximum focus level
: Defines the maximum distance between the selected nodes and the connections showed when in Focus mode. A value of 1 means only the immediate connections will be displayed when in Focus mode. A value of 2 means you can extend the focus two connections of connections, and so on.

Show arrows on links
: This allows you to obtain a directed or undirected graph.

#### Spatialisation

Strength of attraction
: The overall strength of the simulated attraction between nodes. The lower the value, the looser the links between the nodes.

Maximum distance between nodes
: Maximum threshold of repulsion between nodes. Above a value of 1000, this parameter has no measurable effect.

Vertical/horizontal attraction
: A value of 0 means that the parameter is disabled. Applying a vertical/horizontal force tightens the graph and brings isolated nodes closer to the centre.

### Metadata

You can define global metadata for the project:

- title
- author
- keywords
- description

Cosmoscopes exported via the Share menu include this metadata when it exists. The title replaces the buttons at the top left of the menu, which are only displayed in the application. The metadata is displayed in the “About” panel. It is also included in the cosmoscope source code as `meta` tags.

### Bibliography

Indicate here the paths to the data, style and bibliographic localisation files. All three files are required for [citation processing](#citations-and-bibliographies).

Bibliographic data
: File containing metadata describing bibliographic references. The required format is CSL JSON (extension `.json`).

Bibliographic style
: File containing formatting rules for citations and bibliographies. The required format is CSL (extension `.csl`). You can download style files from the [Zotero CSL styles directory](https://www.zotero.org/styles).

Bibliographic localization
: File containing localized bibliographic terms (e.g. publisher, issue…) in the language of your choice. The required format is XML (extension `.xml`). You can download localisation files from the [CSL project GitHub repository](https://github.com/citation-style-language/locales/tree/6b0cb4689127a69852f48608b6d1a879900f418b).

### Views

This section allows you to manage the [views](#views) saved in the cosmoscope.

### Filtering records

This section allows you to create filters to exclude records when creating a cosmoscope. For each filter, specify the nature of the filter (type, keyword, or additional metadata) and the value to be filtered.

Here is an example. Consider the following record:

```
---
title: Paul Otlet
type: person
group: authors
tags: [documentation, pacifism]
---

Paul Otlet (1868-1944) was a Belgian lawyer, bibliographer
and pacifist activist who is considered the
the founder of modern documentation...
```

This record could be excluded during the generation of the cosmoscope via different filters:

- filtering by type on the value "person" ;
- filtering by keyword on the values "documentation" or "pacifism";
- filtering by the "authors" value of metadata "group" (if you have added "group" in the configuration).

### Advanced

Show development tools
: This option allows you to display development tools by clicking on View › Development Tools. Click on Show Web Inspector to inspect the HTML and CSS code of the interface.

Custom CSS
: Load a custom CSS file which will apply to the cosmoscope. Re-generating a cosmoscope is required for the custom CSS to be taken into account.

::: tip
To find out which selectors to use for which declaration, you can:

- click on View › Development Tools (if Show development tools is on);
- open the cosmoscope in a web browser and use the browser's development tools;
- look at the Cosma source code, specifically `/cosma-core/template.njk` (for the HTML structure of the cosmoscope), `/cosma-core/styles.css` and `/cosma-core/print.css` (for the print styles).

The cosmoscope stylesheets use CSS variables to define the colours and fonts used. You can redefine only these variables to change all the interface elements to which they apply. In the example below, the `custom.css` file contains declarations that change the fonts used in the cosmoscope:

```css
:root {
  --sans: "IBM Plex Sans", sans-serif;
  --serif: "IBM Plex Serif", serif;
  --mono: "IBM Plex Mono", monospace;
  --condensed: 'Avenir Next Condensed', sans-serif;
}
```
:::

## Credits

### Team

- [Arthur Perret](https://www.arthurperret.fr/) (project lead)
- [Guillaume Brioudes](https://myllaume.fr/) (developer)
- [Clément Borel](https://mica.u-bordeaux-montaigne.fr/borel-clement/) (researcher)
- [Olivier Le Deuff](http://www.guidedesegares.info/) (researcher)

Also contributed to the development of Cosma:

- [David Pucheu](https://mica.u-bordeaux-montaigne.fr/pucheu-david/) (researcher)

### Dependencies

To improve the maintainability and readability of the source code, the development team resorted to the following libraries:

- [D3.js](https://d3js.org/) v4.13.0 (BSD 3-Clause) : Generating the graph
- [Nunjucks](https://mozilla.github.io/nunjucks/) v3.2.3 (BSD 2-Clause) : Generating the cosmoscope template
- [Js-yaml](https://github.com/nodeca/js-yaml) v4.1.0 (MIT License) : Reading the configuration file and writing the YAML header
- [Js-yaml-front-matter](https://github.com/dworthen/js-yaml-front-matter) v4.1.1 (MIT License): Reading the YAML header of Markdown files
- [Markdown-it](https://github.com/markdown-it/markdown-it) v12.3.0 (MIT License): Converting Markdown to HTML
- [Markdown-it-attrs](https://www.npmjs.com/package/markdown-it-attrs) v4.0.0 (MIT License): Handling Markdown hyperlinks within records
- [Citeproc-js](https://github.com/Juris-M/citeproc-js) v2.4.62 (CPAL and AGPL): Converting citation keys
- [Fuse.js](https://fusejs.io/) v6.4.6 (Apache License 2.0): Search engine

## Changelog

### v2-beta-2

This patch fixes the following issues with Chronological mode from v2.0-beta-1:

- Interacting with the timeline had no effect. Now it works as expected.
- `begin` and `end` metadata from records were ignored. They work as expected now too.

### v2-beta-1

This is the first beta for Cosma GUI v2. It includes three major changes:

1. Cosma has been imbued with the spirit of another of our projects, the [Otletosphere](https://hyperotlet.huma-num.fr/otletosphere/): in addition to Markdown text files, cosmoscopes can now be created from tabular data, and we've added new graphical options such as having fixed-size nodes, and using images as thumbnails/portraits on nodes and records.
2. Projects! Cosma is now able to deal with multiple data sources.
3. Chronological mode is a new time-based display filter. Use the slider to make nodes appear and disappear depending on their `begin` and `end` metadata. This is a work-in-progress.

#### Additions

- Manage multiple projects
- Use alternative syntax for links
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
- The error and warning report is more informative
- Keywords at the top of cards in the cosmoscope no longer overflow the layout
- Cosma now reads directories recursively (issue [#4](https://github.com/graphlab-fr/cosma/issues/4))

#### Fixed bugs

- Link/backlink context tooltips now correctly highlight the target record (issue [#23](https://github.com/graphlab-fr/cosma/issues/23))
- Spaces in file names generated by Cosma are correctly replaced by dashes

#### Known bugs

- Backlink context tooltips may fail to render citations properly

### v1.2

This update adds the following features:

- The records directory is now read recursively. This means all records are now taken into account, whatever their location in a possible subdirectory structure.
- HTML elements used in the text of records are now recognized and interpreted.

Bugs have also been solved:

- Context tooltips for typed links are no longer empty (issue #15).
- Clicking on saved views displays them correctly (issue #16).
- Vertical and horizontal attraction settings are no longer switched (issue #18).

### v1.1

This update introduces a full English translation of the application, as well as a few bug fixes and small interface improvements.

- The application is translated into English, visit Configuration › General to switch languages.
- Creating a record without first specifying a directory no longer causes an error but returns an informative message (issue #6).
- Creating a record with a title already in use no longer silently overwrites the existing record but asks for confirmation (issue #5).
- It is now possible to use `keywords` instead of `tags` in the records' YAML header (issue #3).
- It is no longer necessary to declare a record type in the configuration before assigning it to a new record.
- The Preferences window has been reorganised into sections.
- The readability of error reports has been improved.
- The `minify` option to reduce the size of exports, which was not functional in v1.0, has been removed.
- The application is now distributed with its documentation, accessible via Help › Manual or by clicking on the Help button at the bottom left of the cosmoscope.
- The source code has been reorganised to allow the simultaneous development of a command line version ([cosma-cli](https://github.com/graphlab-fr/cosma-cli)) from the same code base ([cosma-core](https://github.com/graphlab-fr/cosma-core)).
- Upgrade from Electron v13 to v15.

